-- Promote specific user to admin role
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'tomhocosta@gmail.com';
