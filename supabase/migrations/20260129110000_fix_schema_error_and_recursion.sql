-- Fix for "Database error querying schema" caused by RLS infinite recursion
-- and ensures robust permissions for authentication and profile access.

-- 1. Drop existing policies to ensure a clean slate and remove recursive definitions
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can see all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can delete profiles" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can see their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.profiles;
DROP POLICY IF EXISTS "Read visible profiles" ON public.profiles;
DROP POLICY IF EXISTS "Read own profile" ON public.profiles;
DROP POLICY IF EXISTS "Read all profiles as admin" ON public.profiles;
DROP POLICY IF EXISTS "Insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Update all profiles as admin" ON public.profiles;
DROP POLICY IF EXISTS "Delete profiles as admin" ON public.profiles;

-- 2. Redefine is_admin with robust settings to prevent recursion
-- SECURITY DEFINER: Runs with privileges of the creator (postgres/admin), bypassing RLS on public.profiles
-- search_path: Explicitly set to include public, auth, and extensions to find necessary functions/tables
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
