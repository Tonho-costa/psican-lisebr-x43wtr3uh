-- Enable pgcrypto for password hashing if not already enabled
CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
DECLARE
  v_user_id UUID;
  v_email TEXT := 'admin@admin.com';
  v_password TEXT := '369632';
BEGIN
  -- Check if user exists in auth.users
  SELECT id INTO v_user_id FROM auth.users WHERE email = v_email;

  IF v_user_id IS NULL THEN
    v_user_id := gen_random_uuid();

    -- Insert into auth.users with hashed password
    INSERT INTO auth.users (
      id,
      instance_id,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      role,
      aud,
      confirmation_token
    )
    VALUES (
      v_user_id,
      '00000000-0000-0000-0000-000000000000',
      v_email,
      crypt(v_password, gen_salt('bf', 10)),
      now(),
      '{"provider":"email","providers":["email"]}',
      '{"full_name":"Admin System"}',
      now(),
      now(),
      'authenticated',
      'authenticated',
      ''
    );
  ELSE
    -- If user exists, update password to ensure credentials work
    UPDATE auth.users
    SET encrypted_password = crypt(v_password, gen_salt('bf', 10)),
        updated_at = now()
    WHERE id = v_user_id;
  END IF;

  -- Ensure profile exists with admin role
  INSERT INTO public.profiles (id, email, full_name, role, status)
  VALUES (v_user_id, v_email, 'Admin System', 'admin', 'verified')
  ON CONFLICT (id) DO UPDATE
  SET role = 'admin',
      status = 'verified',
      email = EXCLUDED.email;

END $$;
