-- Letters: guests write to the couple inside the site instead of over WhatsApp.
-- A letter is the gift record's message, so it is longer than a quick note.

alter table public.gift_records drop constraint gift_records_message_check;
alter table public.gift_records
  add constraint gift_records_message_check check (char_length(message) <= 2000);

alter table public.rsvps drop constraint rsvps_message_check;
alter table public.rsvps
  add constraint rsvps_message_check check (char_length(message) <= 2000);

-- Lets the guest add a letter right after registering a gift, if they skipped it.
-- Only works once per record, and only with the record id the guest received.
create function public.add_gift_letter(p_record_id uuid, p_message text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_message text := nullif(btrim(coalesce(p_message, '')), '');
begin
  if v_message is null then
    raise exception 'Escreva a cartinha antes de enviar.' using errcode = '22023';
  end if;

  update public.gift_records
     set message = v_message
   where id = p_record_id
     and message is null;

  if not found then
    raise exception 'Não encontramos esse presente, ou ele já tem uma cartinha.'
      using errcode = 'P0002';
  end if;
end
$$;

revoke all on function public.add_gift_letter(uuid, text) from public;
grant execute on function public.add_gift_letter(uuid, text) to anon, authenticated;
