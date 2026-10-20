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

create temp table letter_ids (kind text, id uuid);
grant select, insert on letter_ids to anon;

set role anon;
insert into letter_ids
select 'without', public.register_gift(array['Lia'], 'pix',
  '[{"gift_id":"towels","gift_name":"Toalhas","amount_cents":100}]');
insert into letter_ids
select 'long', public.register_gift(array['Lia'], 'pix',
  '[{"gift_id":"towels","gift_name":"Toalhas","amount_cents":100}]', repeat('a', 1500));

select pg_temp.assert((select id from letter_ids where kind = 'long') is not null,
  'letters up to 2000 letters are accepted');

select public.add_gift_letter((select id from letter_ids where kind = 'without'), '  Querida Aninha...  ');
select pg_temp.assert(true, 'guest adds a letter after registering');

select pg_temp.raises(
  format($$select public.add_gift_letter(%L, 'outra')$$, (select id from letter_ids where kind = 'without')),
  'a letter cannot be replaced');
select pg_temp.raises(
  $$select public.add_gift_letter(gen_random_uuid(), 'oi')$$,
  'unknown records are rejected');
select pg_temp.raises(
  format($$select public.add_gift_letter(%L, '   ')$$, (select id from letter_ids where kind = 'long')),
  'empty letters are rejected');
reset role;

select pg_temp.assert(
  (select message from public.gift_records where id = (select id from letter_ids where kind = 'without'))
    = 'Querida Aninha...',
  'the letter is stored trimmed'
);

\o
\echo 'All letter checks passed.'
