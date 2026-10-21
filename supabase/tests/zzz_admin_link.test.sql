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

insert into public.admin_link_keys (key_hash)
values (encode(sha256(convert_to('chave-secreta-de-teste-123456', 'UTF8')), 'hex'));

create temp table counts as
  select (select count(*) from public.gift_records) as records, (select count(*) from public.rsvps) as rsvps;
grant select on counts to anon;

set role anon;

select pg_temp.assert(not public.admin_check('errada-errada-errada-errada'), 'a wrong key is rejected');
select pg_temp.assert(not public.admin_check(null), 'no key is rejected');
select pg_temp.assert(public.admin_check('chave-secreta-de-teste-123456'), 'the right key is accepted');

select pg_temp.raises($$select public.admin_records('errada-errada-errada-errada')$$,
  'records need the key');
select pg_temp.raises($$select public.admin_rsvps(null)$$, 'rsvps need the key');
select pg_temp.raises($$select * from public.admin_link_keys$$, 'keys cannot be read');

select pg_temp.assert(
  jsonb_array_length(public.admin_records('chave-secreta-de-teste-123456'))
    = (select records from counts)
  and (public.admin_records('chave-secreta-de-teste-123456') -> 0 -> 'gift_record_items') is not null,
  'the key reads every record with its items'
);
select pg_temp.assert(
  jsonb_array_length(public.admin_rsvps('chave-secreta-de-teste-123456'))
    = (select rsvps from counts),
  'the key reads every rsvp'
);
reset role;

create temp table some_record as select id from public.gift_records limit 1;
grant select on some_record to anon;
set role anon;
select public.admin_set_record_status('chave-secreta-de-teste-123456', (select id from some_record), 'confirmed');
select pg_temp.raises(
  format($$select public.admin_delete_record('errada-errada-errada-errada', %L)$$, (select id from some_record)),
  'deleting needs the key');
select public.admin_delete_record('chave-secreta-de-teste-123456', (select id from some_record));
reset role;

select pg_temp.assert(
  not exists (select 1 from public.gift_records where id = (select id from some_record)),
  'the key deletes records'
);
select pg_temp.assert(
  (select public from storage.buckets where id = 'receipts'),
  'receipts open from their random links'
);

\o
\echo 'All admin link checks passed.'
