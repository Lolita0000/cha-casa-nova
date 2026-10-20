-- Run with scripts/test-db.sh, after gift_records.test.sql created the users.
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

set role anon;
select pg_temp.assert(
  public.register_rsvp(array[' Rosa Lima ', 'Beto Lima'], true, ' Até lá! ') is not null,
  'anon confirms presence for a couple'
);
select pg_temp.assert(
  public.register_rsvp(array['Carla'], false) is not null,
  'anon says they cannot come'
);
select pg_temp.raises($$select public.register_rsvp(array[''], true)$$, 'rsvp needs a name');
select pg_temp.raises($$select public.register_rsvp(array['Ana'], null)$$, 'rsvp needs an answer');
select pg_temp.raises($$select * from public.rsvps$$, 'anon cannot read the guest list');
reset role;

set role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-00000000000b', false);
select pg_temp.assert((select count(*) from public.rsvps) = 0, 'non-admins cannot read the guest list');

select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-00000000000a', false);
select pg_temp.assert(
  (select guest_names from public.rsvps where attending) = array['Rosa Lima', 'Beto Lima']
  and (select message from public.rsvps where attending) = 'Até lá!',
  'admin reads trimmed names and messages'
);
reset role;

\o
\echo 'All rsvp checks passed.'
