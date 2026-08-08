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
   - `04_triggers.sql` — `auth.users → profiles`, `updated_at`, delete guard
   - `05_seed.sql` — initial courts
4. In **Authentication → Providers**, enable Email/Password and disable email
   confirmation for the bootstrap admin (re-enable it for production).
5. Sign up your first admin user from the public app (or via the dashboard).
6. In **SQL Editor**, run:
   ```sql
   select public.promote_to_admin('tu-admin@ranelagh.club');
   ```
7. Re-enable email confirmation in **Auth → Providers**.

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

## How the frontend talks to Supabase

Two options:

**Option A — keep axios, hit the RPCs via PostgREST**
- Minimal frontend changes.
- RLS still works because Supabase adds the JWT automatically.
- Recommended for the initial migration.

**Option B — switch to `@supabase/supabase-js`**
- Better DX for realtime (`supabase.channel().on('postgres_changes', ...)`).
- Cleaner auth (drop the `userStore` Zustand).
- Required if you want the live-updating board in the admin.

For the first cut, go with A. The admin can still do polling for now; switch
to B later when you want realtime.

## What still lives in Express

If you keep Express (recommended during the transition):

- `auth/users` + `auth/login` — replaced by Supabase Auth UI or `signInWithPassword()`
- `users/reserves/:username` — replaced by direct INSERT to `reservations`
- `courts/reserve` — replaced by `public.create_reservation()` RPC
- `courts/reserve/clean` — replaced by `public.delete_old_reservations()` (call from a
  scheduled Edge Function or `pg_cron`)

What stays in Express for now (optional migration later):
- Email notifications (`UserNotifications.emailNewUserNotification`) — can move
  to a Supabase Edge Function triggered on `INSERT INTO profiles`
- Cron for permanent reservation cloning — can be a `pg_cron` job

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
| `04_triggers.sql` | `auth.users → profiles` sync, `updated_at`, delete guard |
| `05_seed.sql` | 4 starter courts + bootstrap instructions |
| `README.md` | This file |
