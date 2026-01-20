-- Migration to secure profiles table and fix RLS recursion
-- This migration ensures that the is_admin function is defined with SECURITY DEFINER
-- and that RLS policies are correctly applied to prevent infinite recursion.

-- 1. Create or Replace the is_admin function
-- SECURITY DEFINER allows the function to run with the privileges of the creator (postgres/superuser)
-- bypassing RLS on the profiles table during the check.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, extensions
AS $$
DECLARE
  v_role text;
BEGIN
  -- Check if user is authenticated
  IF auth.uid() IS NULL THEN
    RETURN FALSE;
  END IF;

  -- Query the role directly. Since this is SECURITY DEFINER, it bypasses RLS.
  SELECT role INTO v_role
  FROM public.profiles
  WHERE id = auth.uid();
  
  -- Return true only if role is 'admin'
  RETURN COALESCE(v_role = 'admin', FALSE);
EXCEPTION
  WHEN OTHERS THEN
    RETURN FALSE;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO service_role;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon;

-- 2. Drop existing policies to start fresh and avoid conflicts
DROP POLICY IF EXISTS "profiles_select_visible" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_all_admin" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles are visible to everyone." ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;

-- 3. Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 4. Create new robust policies

-- Policy: Public can view visible profiles
-- This is used for the search page and public profile views
CREATE POLICY "profiles_select_visible"
ON public.profiles FOR SELECT
TO public
USING ( is_visible = true );

-- Policy: Authenticated users can view their own profile
-- This is crucial for the dashboard and initial role checks
CREATE POLICY "profiles_select_own"
ON public.profiles FOR SELECT
TO authenticated
USING ( id = auth.uid() );

-- Policy: Authenticated users can insert their own profile
-- Used during registration
CREATE POLICY "profiles_insert_own"
ON public.profiles FOR INSERT
TO authenticated
WITH CHECK ( id = auth.uid() );

-- Policy: Authenticated users can update their own profile
-- Used in the dashboard
CREATE POLICY "profiles_update_own"
ON public.profiles FOR UPDATE
TO authenticated
USING ( id = auth.uid() );

-- Policy: Admins can do EVERYTHING on ALL profiles
-- This uses the recursive-proof is_admin() function
CREATE POLICY "profiles_all_admin"
ON public.profiles FOR ALL
TO authenticated
USING ( public.is_admin() );
