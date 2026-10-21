-- Admin panel without a login: the couple opens a private link that carries a
-- secret key. Only a hash of the key is stored, and every admin function checks
-- it, so the anon key alone still reads nothing.
--
-- Create the key with supabase/make-admin-link.sql.

create table public.admin_link_keys (
  key_hash text primary key check (key_hash ~ '^[0-9a-f]{64}$'),
  created_at timestamptz not null default now()
);

alter table public.admin_link_keys enable row level security;
revoke all on public.admin_link_keys from anon, authenticated;

create function public.is_admin_key(p_key text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(char_length(p_key) between 24 and 200, false)
    and exists (
      select 1
      from public.admin_link_keys
      where key_hash = encode(sha256(convert_to(p_key, 'UTF8')), 'hex')
    )
$$;

create function public.require_admin_key(p_key text)
returns void
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if not public.is_admin_key(p_key) then
    raise exception 'Link de admin inválido.' using errcode = '42501';
  end if;
end
$$;

create function public.admin_check(p_key text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select public.is_admin_key(p_key)
$$;

-- Same shape the panel used to read straight from the tables.
create function public.admin_records(p_key text)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  perform public.require_admin_key(p_key);
  return coalesce((
    select jsonb_agg(
      jsonb_build_object(
        'id', record.id,
        'created_at', record.created_at,
        'giver_names', to_jsonb(record.giver_names),
        'message', record.message,
        'method', record.method,
        'total_cents', record.total_cents,
        'status', record.status,
        'receipt_path', record.receipt_path,
        'receipt_url', record.receipt_url,
        'gift_record_items', coalesce((
          select jsonb_agg(
            jsonb_build_object(
              'id', item.id,
              'gift_id', item.gift_id,
              'gift_name', item.gift_name,
              'amount_cents', item.amount_cents
            )
            order by item.id
          )
          from public.gift_record_items as item
          where item.record_id = record.id
        ), '[]'::jsonb)
      )
      order by record.created_at desc
    )
    from public.gift_records as record
  ), '[]'::jsonb);
end
$$;

create function public.admin_set_record_status(
  p_key text,
  p_id uuid,
  p_status public.gift_record_status
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform public.require_admin_key(p_key);
  update public.gift_records set status = p_status where id = p_id;
end
$$;

create function public.admin_delete_record(p_key text, p_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform public.require_admin_key(p_key);
  delete from public.gift_records where id = p_id;
end
$$;

create function public.admin_rsvps(p_key text)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  perform public.require_admin_key(p_key);
  return coalesce((
    select jsonb_agg(
      jsonb_build_object(
        'id', rsvp.id,
        'created_at', rsvp.created_at,
        'guest_names', to_jsonb(rsvp.guest_names),
        'attending', rsvp.attending,
        'message', rsvp.message
      )
      order by rsvp.created_at desc
    )
    from public.rsvps as rsvp
  ), '[]'::jsonb);
end
$$;

create function public.admin_delete_rsvp(p_key text, p_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform public.require_admin_key(p_key);
  delete from public.rsvps where id = p_id;
end
$$;

revoke all on function public.is_admin_key(text) from public;
revoke all on function public.require_admin_key(text) from public;
revoke all on function public.admin_check(text) from public;
revoke all on function public.admin_records(text) from public;
revoke all on function public.admin_set_record_status(text, uuid, public.gift_record_status) from public;
revoke all on function public.admin_delete_record(text, uuid) from public;
revoke all on function public.admin_rsvps(text) from public;
revoke all on function public.admin_delete_rsvp(text, uuid) from public;

grant execute on function public.admin_check(text) to anon, authenticated;
grant execute on function public.admin_records(text) to anon, authenticated;
grant execute on function public.admin_set_record_status(text, uuid, public.gift_record_status) to anon, authenticated;
grant execute on function public.admin_delete_record(text, uuid) to anon, authenticated;
grant execute on function public.admin_rsvps(text) to anon, authenticated;
grant execute on function public.admin_delete_rsvp(text, uuid) to anon, authenticated;

-- Receipts open straight from the panel. Their names are random UUIDs that only
-- the admin functions reveal, and nobody can list the bucket.
update storage.buckets set public = true where id = 'receipts';
