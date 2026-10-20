-- Run with scripts/test-db.sh. Every check raises an exception when it fails.
\set ON_ERROR_STOP on
-- Only the notices from the checks are worth reading.
\o /dev/null

insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-00000000000a', 'admin@example.com'),
  ('00000000-0000-0000-0000-00000000000b', 'guest@example.com');
insert into public.admins (user_id) values ('00000000-0000-0000-0000-00000000000a');

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

-- Guests (anon) -------------------------------------------------------------
set role anon;

select pg_temp.assert(
  public.register_gift(
    array['  Tia Rosa ', 'Tio Beto', ''],
    'pix',
    '[{"gift_id":"bath-towels","gift_name":"Toalhas","amount_cents":25670},
      {"gift_id":"dishwasher","gift_name":"Lava-louças","amount_cents":10000}]',
    '  Felicidades!  '
  ) is not null,
  'anon registers a pix with several names'
);

select pg_temp.assert(
  public.register_gift(array['Família Souza'], 'purchase',
    '[{"gift_id":"dishwasher","gift_name":"Lava-louças","amount_cents":354900}]') is not null,
  'anon registers a purchase'
);

select pg_temp.raises($$select public.register_gift(array['', ' '], 'pix', '[{"gift_id":"a","gift_name":"A","amount_cents":1}]')$$,
  'rejects missing names');
select pg_temp.raises($$select public.register_gift(array[repeat('a', 81)], 'pix', '[{"gift_id":"a","gift_name":"A","amount_cents":1}]')$$,
  'rejects names longer than 80 letters');
select pg_temp.raises($$select public.register_gift(array['Ana'], 'pix', '[]')$$,
  'rejects an empty gift list');
select pg_temp.raises($$select public.register_gift(array['Ana'], 'pix', '[{"gift_id":"Bad Id","gift_name":"A","amount_cents":1}]')$$,
  'rejects invalid gift ids');
select pg_temp.raises($$select public.register_gift(array['Ana'], 'pix', '[{"gift_id":"a","gift_name":"A","amount_cents":-5}]')$$,
  'rejects negative amounts');
select pg_temp.raises($$select public.register_gift(array['Ana'], 'pix', '[{"gift_id":"a","gift_name":"A","amount_cents":10.5}]')$$,
  'rejects fractional cents');
select pg_temp.raises($$select public.register_gift(array['Ana'], 'pix', '[{"gift_id":"a","gift_name":"A","amount_cents":1}]', repeat('x', 2001))$$,
  'rejects letters longer than 2000 letters');

select pg_temp.raises($$select * from public.gift_records$$, 'anon cannot read records');
select pg_temp.raises($$insert into public.gift_records (giver_names, method, total_cents) values (array['x'], 'pix', 1)$$,
  'anon cannot insert records directly');

select pg_temp.assert(
  (select pix_cents from public.gift_public_status() where gift_id = 'dishwasher') = 10000
  and (select purchase_count from public.gift_public_status() where gift_id = 'dishwasher') = 1,
  'public status sums pix amounts and counts purchases'
);

reset role;

-- A signed-in user who is not an admin --------------------------------------
set role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-00000000000b', false);

select pg_temp.assert((select count(*) from public.gift_records) = 0, 'non-admins see no records');
select pg_temp.assert(not public.is_admin(), 'non-admins are not admins');
update public.gift_records set status = 'confirmed';
reset role;
select pg_temp.assert(
  (select count(*) from public.gift_records where status = 'confirmed') = 0,
  'non-admins cannot update records'
);

-- The admin -----------------------------------------------------------------
set role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-00000000000a', false);

select pg_temp.assert(public.is_admin(), 'admin is recognised');
select pg_temp.assert((select count(*) from public.gift_records) = 2, 'admin reads every record');
select pg_temp.assert((select count(*) from public.gift_record_items) = 3, 'admin reads every item');
select pg_temp.assert(
  (select giver_names from public.gift_records where method = 'pix') = array['Tia Rosa', 'Tio Beto']
  and (select message from public.gift_records where method = 'pix') = 'Felicidades!'
  and (select total_cents from public.gift_records where method = 'pix') = 35670,
  'names and message are trimmed and the total is computed'
);

update public.gift_records set status = 'cancelled', admin_note = 'teste' where method = 'purchase';
select pg_temp.assert(
  (select status from public.gift_records where method = 'purchase') = 'cancelled'
  and (select updated_at > created_at from public.gift_records where method = 'purchase'),
  'admin updates the status and updated_at moves'
);
reset role;

set role anon;
select pg_temp.assert(
  (select purchase_count from public.gift_public_status() where gift_id = 'dishwasher') = 0,
  'cancelled records leave the public status'
);
reset role;

\o
\echo 'All database checks passed.'
