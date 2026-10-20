-- Gift records: who gave what, how, and whether the couple confirmed it.
--
-- Guests never touch the tables directly. They call `register_gift`, which
-- validates the payload and inserts the record and its items in one go.
-- Only users listed in `admins` can read or update records.

create extension if not exists pgcrypto;

create type public.gift_method as enum ('pix', 'purchase');
create type public.gift_record_status as enum ('pending', 'confirmed', 'cancelled');

-- Names come from a free text form, so they are trimmed and bounded.
create function public.is_valid_giver_names(names text[])
returns boolean
language sql
immutable
as $$
  select coalesce(array_length(names, 1), 0) between 1 and 12
    and not exists (
      select 1
      from unnest(names) as name
      where name is null or name <> btrim(name) or char_length(name) not between 1 and 80
    )
$$;

create table public.gift_records (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  giver_names text[] not null check (public.is_valid_giver_names(giver_names)),
  message text check (char_length(message) <= 500),
  method public.gift_method not null,
  total_cents integer not null check (total_cents >= 0),
  status public.gift_record_status not null default 'pending',
  admin_note text check (char_length(admin_note) <= 500)
);

create table public.gift_record_items (
  id bigint generated always as identity primary key,
  record_id uuid not null references public.gift_records (id) on delete cascade,
  gift_id text not null check (gift_id ~ '^[a-z0-9-]{1,64}$'),
  -- Snapshot of the name, so records stay readable if the gift list changes.
  gift_name text not null check (char_length(gift_name) between 1 and 120),
  amount_cents integer not null check (amount_cents >= 0)
);

create index gift_records_created_at_idx on public.gift_records (created_at desc);
create index gift_record_items_record_id_idx on public.gift_record_items (record_id);
create index gift_record_items_gift_id_idx on public.gift_record_items (gift_id);

create table public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end
$$;

create trigger gift_records_touch_updated_at
before update on public.gift_records
for each row execute function public.touch_updated_at();

create function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.admins where user_id = auth.uid())
$$;

-- Row level security: nobody reads anything unless they are an admin.
alter table public.gift_records enable row level security;
alter table public.gift_record_items enable row level security;
alter table public.admins enable row level security;

revoke all on public.gift_records, public.gift_record_items, public.admins from anon, authenticated;
grant select, update, delete on public.gift_records to authenticated;
grant select, delete on public.gift_record_items to authenticated;
grant select on public.admins to authenticated;

create policy "Admins read records" on public.gift_records
  for select to authenticated using (public.is_admin());
create policy "Admins update records" on public.gift_records
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "Admins delete records" on public.gift_records
  for delete to authenticated using (public.is_admin());

create policy "Admins read items" on public.gift_record_items
  for select to authenticated using (public.is_admin());
create policy "Admins delete items" on public.gift_record_items
  for delete to authenticated using (public.is_admin());

create policy "Users see their own admin row" on public.admins
  for select to authenticated using (user_id = auth.uid());

-- Guests register a gift through this function.
--   p_items: [{ "gift_id": "towels", "gift_name": "Toalhas", "amount_cents": 25670 }, ...]
create function public.register_gift(
  p_giver_names text[],
  p_method public.gift_method,
  p_items jsonb,
  p_message text default null
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_names text[];
  v_message text;
  v_record_id uuid;
  v_total bigint;
begin
  select coalesce(array_agg(btrim(name)), '{}')
    into v_names
  from unnest(p_giver_names) as name
  where btrim(coalesce(name, '')) <> '';

  if not public.is_valid_giver_names(v_names) then
    raise exception 'Informe de 1 a 12 nomes, com até 80 letras cada.'
      using errcode = '22023';
  end if;

  if p_method is null then
    raise exception 'Informe se foi Pix ou compra.' using errcode = '22023';
  end if;

  if jsonb_typeof(p_items) is distinct from 'array'
    or jsonb_array_length(p_items) not between 1 and 80 then
    raise exception 'Informe de 1 a 80 presentes.' using errcode = '22023';
  end if;

  if exists (
    select 1
    from jsonb_array_elements(p_items) as item
    where jsonb_typeof(item -> 'gift_id') is distinct from 'string'
      or jsonb_typeof(item -> 'gift_name') is distinct from 'string'
      or jsonb_typeof(item -> 'amount_cents') is distinct from 'number'
      or (item ->> 'amount_cents')::numeric <> trunc((item ->> 'amount_cents')::numeric)
      or (item ->> 'amount_cents')::numeric not between 0 and 100000000
  ) then
    raise exception 'Presente com formato inválido.' using errcode = '22023';
  end if;

  select sum((item ->> 'amount_cents')::bigint)
    into v_total
  from jsonb_array_elements(p_items) as item;

  if v_total > 2147483647 then
    raise exception 'Valor total muito alto.' using errcode = '22023';
  end if;

  v_message := nullif(btrim(coalesce(p_message, '')), '');

  insert into public.gift_records (giver_names, message, method, total_cents)
  values (v_names, v_message, p_method, v_total)
  returning id into v_record_id;

  insert into public.gift_record_items (record_id, gift_id, gift_name, amount_cents)
  select v_record_id,
         item ->> 'gift_id',
         btrim(item ->> 'gift_name'),
         (item ->> 'amount_cents')::integer
  from jsonb_array_elements(p_items) as item;

  return v_record_id;
end
$$;

-- What guests can see: totals per gift, never names. Cancelled records are ignored.
create function public.gift_public_status()
returns table (gift_id text, pix_cents bigint, purchase_count bigint)
language sql
stable
security definer
set search_path = ''
as $$
  select item.gift_id,
         coalesce(sum(item.amount_cents) filter (where record.method = 'pix'), 0)::bigint,
         count(*) filter (where record.method = 'purchase')
  from public.gift_record_items as item
  join public.gift_records as record on record.id = item.record_id
  where record.status <> 'cancelled'
  group by item.gift_id
$$;

revoke all on function public.register_gift(text[], public.gift_method, jsonb, text) from public;
revoke all on function public.gift_public_status() from public;
revoke all on function public.is_admin() from public;
grant execute on function public.register_gift(text[], public.gift_method, jsonb, text) to anon, authenticated;
grant execute on function public.gift_public_status() to anon, authenticated;
grant execute on function public.is_admin() to authenticated;
