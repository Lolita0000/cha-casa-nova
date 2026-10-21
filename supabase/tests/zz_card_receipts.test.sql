-- Run with scripts/test-db.sh, after the other checks.
\set ON_ERROR_STOP on
\o /dev/null

create function pg_temp.assert(condition boolean, label text) returns void
language plpgsql as $$
begin
  if condition is not true then
    raise exception 'FAILED: %', label;
  end if;
  raise notice 'ok - %', label;
end
$$;
grant execute on function pg_temp.assert(boolean, text) to anon, authenticated;

create function pg_temp.raises(statement text, label text) returns void
language plpgsql as $$
begin
  begin
    execute statement;
  exception when others then
    raise notice 'ok - % (%)', label, sqlerrm;
    return;
  end;
  raise exception 'FAILED: % did not raise', label;
end
$$;
grant execute on function pg_temp.raises(text, text) to anon, authenticated;

create temp table card_gift (id text);
grant select, insert on card_gift to anon;

set role anon;

-- Card contributions carry InfinitePay's receipt page and move the progress bar.
select public.register_gift(array['Duda'], 'card',
  '[{"gift_id":"robot-vacuum","gift_name":"Robô aspirador","amount_cents":5000}]',
  null, null, 'https://checkout.infinitepay.io/recibo/abc123');
select public.register_gift(array['Caio'], 'pix',
  '[{"gift_id":"robot-vacuum","gift_name":"Robô aspirador","amount_cents":2500}]',
  'Pro robozinho!', '3f1c2a9e-7d4b-4c1e-9a55-0c6e2b8d1f00.jpg');

select pg_temp.assert(
  (select contributed_cents from public.gift_public_status() where gift_id = 'robot-vacuum') = 7500,
  'pix and card both count towards a shared gift'
);

select pg_temp.raises(
  $$select public.register_gift(array['Ana'], 'pix', '[{"gift_id":"a","gift_name":"A","amount_cents":1}]', null, '../outro-arquivo.jpg')$$,
  'receipt paths must be a plain uuid file name');
select pg_temp.raises(
  $$select public.register_gift(array['Ana'], 'card', '[{"gift_id":"a","gift_name":"A","amount_cents":1}]', null, null, 'javascript:alert(1)')$$,
  'receipt urls must be https');

-- Storage: guests may upload a receipt, never read one.
select pg_temp.raises(
  $$insert into storage.objects (bucket_id, name) values ('receipts', 'nome-qualquer.exe')$$,
  'only uuid file names can be uploaded');
insert into storage.objects (bucket_id, name)
values ('receipts', '3f1c2a9e-7d4b-4c1e-9a55-0c6e2b8d1f00.jpg');
select pg_temp.assert((select count(*) from storage.objects) = 0, 'guests cannot list receipts');
reset role;

select pg_temp.assert(
  (select receipt_url from public.gift_records where 'Duda' = any (giver_names))
    = 'https://checkout.infinitepay.io/recibo/abc123'
  and (select method::text from public.gift_records where 'Duda' = any (giver_names)) = 'card'
  and (select receipt_path from public.gift_records where 'Caio' = any (giver_names))
    = '3f1c2a9e-7d4b-4c1e-9a55-0c6e2b8d1f00.jpg',
  'receipts are stored with the record'
);

-- The admin reads receipts.
set role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-00000000000a', false);
select pg_temp.assert((select count(*) from storage.objects) = 1, 'admins read receipts');
reset role;

\o
\echo 'All card and receipt checks passed.'
