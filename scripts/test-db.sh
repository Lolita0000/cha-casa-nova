#!/usr/bin/env bash
# Runs the migrations and their checks against a throwaway database.
# Needs a local Postgres. Connection comes from the standard PGHOST, PGPORT
# and PGUSER variables; the user must be allowed to create databases.
set -euo pipefail

db="gift_records_test_$$"
run() { psql -X -q -v ON_ERROR_STOP=1 "$@"; }

run -d postgres -c "create database $db"
trap 'run -d postgres -c "drop database if exists $db with (force)"' EXIT

run -d "$db" -f supabase/tests/supabase-stub.sql
for migration in supabase/migrations/*.sql; do
  run -d "$db" -f "$migration"
done
run -d "$db" -f supabase/tests/gift_records.test.sql
