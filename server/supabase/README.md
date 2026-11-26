# Supabase schema for Club Ranelagh

This folder contains the database schema, security policies, RPCs and triggers to
migrate the Club Manager backend from MongoDB to Supabase (Postgres).

## How to apply

1. Create a new Supabase project (free tier is enough for the club).
2. Open **SQL Editor** in the Supabase dashboard.
3. Run the files **in this order**:
   - `01_schema.sql` — tables, types, constraints, `is_admin()` helper
   - `02_rls.sql` — Row Level Security policies
   - `03_rpc.sql` — RPC functions used by the frontend
   - `04_triggers.sql` — `auth.users → profiles` and `updated_at`
   - `05_seed.sql` — initial courts
4. Register the first administrator and confirm the email using the project's Auth settings.
5. As a database owner, assign the role to that confirmed account in **SQL Editor**.
   ```sql
   select public.promote_to_admin('tu-admin@ranelagh.club');
   ```

For an existing schema, verify the definitions and grants on the target, then
apply `02_rls.sql`, `03_rpc.sql` and `04_triggers.sql` in order in a single
transaction. Apply `01_schema.sql` to an empty database. Review the existing
administrator roster against the authorized roster before updating a live
environment. See `AGENTS.md` for approval requirements for external changes.

## Local verification

From the repository root, `npm --prefix server test` exercises the real Express
routes with synthetic accounts through a loopback HTTP fixture. The suite uses
the built-in Node 22 fetch and binds an ephemeral port.

The SQL checks use PostgreSQL with the extensions declared in `01_schema.sql`.
Create a fresh local cluster dedicated to the tests and run this sequence in
PowerShell with the port and owner of that cluster. The fixture supplies the
database roles and the minimum Auth schema required to exercise RLS.

```powershell
$clubTestPort = Read-Host 'Puerto del cluster descartable'
$clubTestArgs = @('-X', '-h', '127.0.0.1', '-p', $clubTestPort, '-U', 'postgres', '-v', 'ON_ERROR_STOP=1')
psql @clubTestArgs -d postgres -c 'create database clubmanager_test'
psql @clubTestArgs -d clubmanager_test -f server/test/sql/supabaseFixture.sql
psql @clubTestArgs -d clubmanager_test -1 -f server/supabase/01_schema.sql -f server/supabase/02_rls.sql -f server/supabase/03_rpc.sql -f server/supabase/04_triggers.sql -f server/supabase/05_seed.sql
psql @clubTestArgs -d clubmanager_test -f server/test/sql/permissions.test.sql
```

The last command checks role assignment, legacy ACL cleanup, repair and RLS in
a transaction that rolls back the fixtures. Verify Auth and PostgREST together
in an isolated Supabase stack before releasing the change.

## Migrating the single-club schema

Review and rehearse the cutover with the plan in `docs/superpowers/plans/`.
Verify the existing schema, pause writes, reconcile missing profiles, and
confirm which existing users should administer Ranelagh. Set the confirmed
UUID array as the transaction-local setting `clubmanager.ranelagh_admin_ids`.
Use `{}` for a confirmed empty roster. The migration stops if an administrator
roster still requires confirmation or an approved UUID has no profile.

Apply the three migration files in timestamp order in the same transaction.
The first assigns legacy rows to Ranelagh. The second replaces global
authorization with membership policies. The third seeds the existing court
hours and enables scoped booking operations. The apps and API use the migrated
schema together. Test the updated API before reopening writes. Review any
job that used the former global `delete_old_reservations()` function and move
it to explicitly scoped cleanup before the cutover.

## What changed vs the current MongoDB model

| MongoDB (today) | Supabase |
|---|---|
| `users.reserves: [Object]` | `reservations` table with FK to `profiles` |
| `courts.unavailableDates.lunes/martes/...` | single `reservations` table with `weekday` column |
| `activities.category: [Object]` | `activity_categories` table with FK to `activities` |
| `events.calendarData: [Object]` | `events.calendar_data jsonb` (kept as JSONB for flexibility) |
| `admin: Boolean` in user doc | `profiles.role: user_role` |
| `mongoose.Schema` validation | SQL `CHECK` constraints + `citext` for emails |
| Hand-rolled JWT auth | `auth.users` + `auth.uid()` + RLS |
| `bcrypt.hash` | handled by Supabase Auth |
| `requireAdmin` middleware | `is_admin(uid)` SECURITY DEFINER fn + RLS |
| Manual sanitisation of `String(value)` | EXCLUDE constraint prevents double-booking |
| Cron job in Node to clean old reservations | `delete_old_reservations()` RPC + pg_cron |

## The key invariant: no double-bookings

In MongoDB, the current code does **two writes** (push to `users.reserves` and push
to `courts.unavailableDates.${weekday}`) and trusts the application to keep them
in sync. If anything fails between the two writes you end up with an inconsistent
state — a court is "free" but the user thinks they have it, or vice versa.

In Supabase, reservations are a single row. A Postgres `EXCLUDE` constraint
prevents the application from ever creating overlapping reservations on the
same court:

```sql
constraint reservations_no_overlap exclude using gist (
  court_id with =,
  tstzrange(start_time, end_time, '[)') with &&
)
```

The `create_reservation` RPC translates the constraint violation into a clean
Spanish error message: `"Ese horario ya está reservado"`.

## Application access

The apps use Supabase Auth for browser sessions and send the JWT to Express.
Express verifies the user's session and requires the administrator role on
management routes. The legacy login and registration endpoints use a separate
client per Auth request with the project's anon key. Profile reads and writes
and a member's reservation data use the JWT and RLS.

The available HTTP routes are documented in `AGENTS.md`. The direct
`get_court_reservations` RPC yields rows allowed by RLS. Reservation cleanup
and global role assignment use privileged operations.

## Migration from existing data

The MongoDB → Postgres migration is a one-off ETL. The mapping is:

```
Mongo: db.users.findOne({ username })
  → SQL: select * from profiles where username = $1

Mongo: db.courts.findOne({ name })
  → SQL: select * from courts where name = $1

Mongo: court.unavailableDates.lunes
  → SQL: insert into reservations (court_id, ..., weekday=1, ...)

Mongo: user.reserves[]
  → SQL: insert into reservations (user_id, ...)
```

A 50-line Node script with `mongodb` + `pg` drivers can do this in a single
transaction. The data is small (50–500 users, 4 courts, ~hundreds of
reservations), so a downtime of a few minutes is acceptable.

## Files in this folder

| File | What it does |
|---|---|
| `01_schema.sql` | Tables, types, constraints, EXCLUDE for double-booking |
| `02_rls.sql` | Row Level Security policies (admin vs socio) |
| `03_rpc.sql` | RPC functions: `create_reservation`, `get_court_reservations`, `delete_old_reservations`, `search_profiles`, `promote_to_admin` |
| `04_triggers.sql` | `auth.users → profiles` sync and `updated_at` |
| `05_seed.sql` | 4 starter courts + bootstrap instructions |
| `README.md` | This file |
