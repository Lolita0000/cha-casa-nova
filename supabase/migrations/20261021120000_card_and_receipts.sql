-- Card payments and receipts.
--
-- Guests can now pay by card (InfinitePay checkout) and attach the receipt of a
-- Pix. Card and Pix contributions both move the progress bar of shared gifts.

alter type public.gift_method add value if not exists 'card';

-- A Pix receipt uploaded to the private "receipts" bucket, or the receipt page
-- InfinitePay sends back after a card payment.
alter table public.gift_records
  add column receipt_path text
    check (receipt_path ~ '^[0-9a-f-]{36}\.(jpg|jpeg|png|webp|heic|heif|pdf)$'),
  add column receipt_url text
    check (receipt_url ~ '^https://\S+$' and char_length(receipt_url) <= 500);

drop function public.register_gift(text[], public.gift_method, jsonb, text);

create function public.register_gift(
  p_giver_names text[],
  p_method public.gift_method,
  p_items jsonb,
  p_message text default null,
  p_receipt_path text default null,
  p_receipt_url text default null
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
    raise exception 'Informe se foi Pix, cartão ou compra.' using errcode = '22023';
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

  insert into public.gift_records (giver_names, message, method, total_cents, receipt_path, receipt_url)
  values (
    v_names,
    v_message,
    p_method,
    v_total,
    nullif(btrim(coalesce(p_receipt_path, '')), ''),
    nullif(btrim(coalesce(p_receipt_url, '')), '')
  )
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

-- Money given (Pix or card) now counts the same towards a gift.
drop function public.gift_public_status();

create function public.gift_public_status()
returns table (gift_id text, contributed_cents bigint, purchase_count bigint)
language sql
stable
security definer
set search_path = ''
as $$
  select item.gift_id,
         coalesce(sum(item.amount_cents) filter (where record.method <> 'purchase'), 0)::bigint,
         count(*) filter (where record.method = 'purchase')
  from public.gift_record_items as item
  join public.gift_records as record on record.id = item.record_id
  where record.status <> 'cancelled'
  group by item.gift_id
$$;

revoke all on function public.register_gift(text[], public.gift_method, jsonb, text, text, text) from public;
revoke all on function public.gift_public_status() from public;
grant execute on function public.register_gift(text[], public.gift_method, jsonb, text, text, text) to anon, authenticated;
grant execute on function public.gift_public_status() to anon, authenticated;

-- Receipts bucket: private, small files, images and PDF only.
-- Guests can upload but never list or read; only admins read.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'receipts',
  'receipts',
  false,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif', 'application/pdf']
)
on conflict (id) do nothing;

create policy "Guests upload receipts" on storage.objects
  for insert to anon, authenticated
  with check (
    bucket_id = 'receipts'
    and name ~ '^[0-9a-f-]{36}\.(jpg|jpeg|png|webp|heic|heif|pdf)$'
  );

create policy "Admins read receipts" on storage.objects
  for select to authenticated
  using (bucket_id = 'receipts' and public.is_admin());

create policy "Admins delete receipts" on storage.objects
  for delete to authenticated
  using (bucket_id = 'receipts' and public.is_admin());
