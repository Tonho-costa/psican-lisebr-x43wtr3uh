-- Fix for "Database error querying schema" caused by RLS infinite recursion
-- This migration drops and recreates policies and the is_admin function with SECURITY DEFINER
-- to ensuring a robust fix for the 500 error during authentication.

-- 1. Drop existing policies to ensure a clean slate
-- Using a DO block to verify and drop all policies on public.profiles dynamically
DO $$
DECLARE
    pol record;
BEGIN
    FOR pol IN select policyname from pg_policies where tablename = 'profiles'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.profiles', pol.policyname);
    END LOOP;
END $$;

-- 2. Redefine is_admin with robust settings to prevent recursion
-- SECURITY DEFINER: Runs with privileges of the creator (postgres/admin), bypassing RLS on public.profiles
-- search_path: Explicitly set to include public, auth, and extensions to find necessary functions/tables securely
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, extensions
AS $$
BEGIN
  -- Check if the user has the 'admin' role in the profiles table
  -- Since this runs as postgres (SECURITY DEFINER), it bypasses RLS on public.profiles
  -- preventing infinite recursion when used in policies.
  RETURN EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$;

-- 3. Grant execution permissions for the helper function
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon;
GRANT EXECUTE ON FUNCTION public.is_admin() TO service_role;

-- 4. Create optimized non-recursive policies

-- SELECT Policies
CREATE POLICY "profiles_select_public"
ON public.profiles FOR SELECT
TO public
USING ( is_visible = true );

CREATE POLICY "profiles_select_own"
ON public.profiles FOR SELECT
TO authenticated
USING ( auth.uid() = id );

CREATE POLICY "profiles_select_admin"
ON public.profiles FOR SELECT
TO authenticated
USING ( public.is_admin() );

-- INSERT Policies
CREATE POLICY "profiles_insert_own"
ON public.profiles FOR INSERT
TO authenticated
WITH CHECK ( auth.uid() = id );

-- UPDATE Policies
CREATE POLICY "profiles_update_own"
ON public.profiles FOR UPDATE
TO authenticated
USING ( auth.uid() = id );

CREATE POLICY "profiles_update_admin"
ON public.profiles FOR UPDATE
TO authenticated
USING ( public.is_admin() );

-- DELETE Policies
CREATE POLICY "profiles_delete_admin"
ON public.profiles FOR DELETE
TO authenticated
USING ( public.is_admin() );

-- 5. Explicitly grant table permissions to ensure schema access during auth/queries
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON TABLE public.profiles TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.profiles TO anon, authenticated;

-- 6. Ensure the profiles table has RLS enabled
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
