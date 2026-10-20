-- Guest list: who confirmed they are coming, so the names can go to the doorman.
-- Same approach as gift records: guests only call `register_rsvp`, admins read.

create table public.rsvps (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  guest_names text[] not null check (public.is_valid_giver_names(guest_names)),
  attending boolean not null,
  message text check (char_length(message) <= 500)
);

create index rsvps_created_at_idx on public.rsvps (created_at desc);

alter table public.rsvps enable row level security;
revoke all on public.rsvps from anon, authenticated;
grant select, delete on public.rsvps to authenticated;

create policy "Admins read rsvps" on public.rsvps
  for select to authenticated using (public.is_admin());
create policy "Admins delete rsvps" on public.rsvps
  for delete to authenticated using (public.is_admin());

create function public.register_rsvp(
  p_guest_names text[],
  p_attending boolean,
  p_message text default null
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_names text[];
  v_id uuid;
begin
  select coalesce(array_agg(btrim(name)), '{}')
    into v_names
  from unnest(p_guest_names) as name
  where btrim(coalesce(name, '')) <> '';

  if not public.is_valid_giver_names(v_names) then
    raise exception 'Informe de 1 a 12 nomes, com até 80 letras cada.'
      using errcode = '22023';
  end if;

  if p_attending is null then
    raise exception 'Informe se vai ou não.' using errcode = '22023';
  end if;

  insert into public.rsvps (guest_names, attending, message)
  values (v_names, p_attending, nullif(btrim(coalesce(p_message, '')), ''))
  returning id into v_id;

  return v_id;
end
$$;

revoke all on function public.register_rsvp(text[], boolean, text) from public;
grant execute on function public.register_rsvp(text[], boolean, text) to anon, authenticated;
