\set ON_ERROR_STOP on

insert into auth.users (id, email, email_confirmed_at, raw_user_meta_data) values
  ('10000000-0000-4000-8000-000000000001', 'clubadmin@example.test', now(), '{}'),
  ('10000000-0000-4000-8000-000000000002', 'clubmember@example.test', now(), '{}');
select public.promote_to_admin('clubadmin@example.test');

insert into public.reservations (id, court_id, user_id, weekday, reservation_date, start_time, end_time, created_by)
select '20000000-0000-4000-8000-000000000001', id, '10000000-0000-4000-8000-000000000002',
  3, '2099-06-10', '2099-06-11 02:30:00+00', '2099-06-11 03:00:00+00', '10000000-0000-4000-8000-000000000002'
from public.courts where name = 'futbol';

insert into public.activities (id, name, description, data_target)
values ('30000000-0000-4000-8000-000000000001', 'Actividad de prueba', 'Fixture', 'test-activity');

insert into public.activity_categories (id, activity_id, name, age_range, days, schedule)
values ('40000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000001', 'Fixture', 'Adultos', 'Lunes', '10:00');
