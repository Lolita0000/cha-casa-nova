-- Gives admin access to an existing Supabase user.
-- 1. Create the user in Authentication > Users > Add user (email and password).
-- 2. Replace the email below and run this in the SQL Editor.
insert into public.admins (user_id)
select id from auth.users where email = 'seu-email@exemplo.com'
on conflict (user_id) do nothing;
