-- Fix for RLS infinite recursion and schema error
-- ensuring robust is_admin function and clean policies

-- 1. Drop ALL existing policies on profiles to start fresh
DO $$
DECLARE
    pol record;
BEGIN
    FOR pol IN select policyname from pg_policies where tablename = 'profiles'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.profiles', pol.policyname);
    END LOOP;
END $$;

-- 2. Define is_admin with SECURITY DEFINER and explicit search_path
-- This ensures the function runs with creator privileges (bypassing RLS)
-- and uses a secure search path.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, extensions
AS $$
DECLARE
  v_role text;
BEGIN
  -- Check if user is authenticated first to avoid unnecessary queries
  IF auth.uid() IS NULL THEN
    RETURN FALSE;
  END IF;

  -- Query profiles table directly (bypassing RLS due to SECURITY DEFINER)
  SELECT role INTO v_role
  FROM public.profiles
  WHERE id = auth.uid();
  
  -- Return true only if role is exactly 'admin'
  RETURN COALESCE(v_role = 'admin', FALSE);
EXCEPTION
  WHEN OTHERS THEN
    -- Fail safe
    RETURN FALSE;
END;
$$;

-- 3. Grant execute permissions
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO service_role;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon;

-- 4. Create Policies

-- Public visibility
CREATE POLICY "profiles_select_visible"
ON public.profiles FOR SELECT
TO public
USING ( is_visible = true );

-- Self access (Select)
CREATE POLICY "profiles_select_own"
ON public.profiles FOR SELECT
TO authenticated
USING ( id = auth.uid() );

-- Self access (Insert)
CREATE POLICY "profiles_insert_own"
ON public.profiles FOR INSERT
TO authenticated
WITH CHECK ( id = auth.uid() );

-- Self access (Update)
CREATE POLICY "profiles_update_own"
ON public.profiles FOR UPDATE
TO authenticated
USING ( id = auth.uid() );

-- Admin access (All operations)
-- Uses public.is_admin() which bypasses RLS
CREATE POLICY "profiles_all_admin"
ON public.profiles FOR ALL
TO authenticated
USING ( public.is_admin() );

-- 5. Enable RLS and Grant Table Permissions
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON TABLE public.profiles TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.profiles TO anon, authenticated;
