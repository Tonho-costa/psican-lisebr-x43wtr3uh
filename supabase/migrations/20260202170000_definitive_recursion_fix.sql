-- Migration to fix RLS recursion definitively
-- This migration ensures the is_admin function is recursion-safe and resets all profile policies

-- 1. Secure is_admin function to prevent recursion
-- Defined with SECURITY DEFINER to run with elevated privileges (bypassing RLS on profiles)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_role text;
BEGIN
  -- Check if user is authenticated
  IF auth.uid() IS NULL THEN
    RETURN FALSE;
  END IF;

  -- Select role directly. Since it's SECURITY DEFINER, it bypasses RLS on profiles table.
  SELECT role INTO v_role
  FROM public.profiles
  WHERE id = auth.uid();
  
  -- Return true only if role is explicitly 'admin'
  RETURN COALESCE(v_role = 'admin', FALSE);
EXCEPTION
  WHEN OTHERS THEN
    -- Fail safe
    RETURN FALSE;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO service_role;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon;

-- 2. Clean Slate: Drop ALL existing policies to ensure no legacy recursive policies remain
DROP POLICY IF EXISTS "profiles_select_visible" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_all_admin" ON public.profiles;
DROP POLICY IF EXISTS "policy_profiles_select_public" ON public.profiles;
DROP POLICY IF EXISTS "policy_profiles_select_own" ON public.profiles;
DROP POLICY IF EXISTS "policy_profiles_select_admin" ON public.profiles;
DROP POLICY IF EXISTS "policy_profiles_insert_own" ON public.profiles;
DROP POLICY IF EXISTS "policy_profiles_update_own" ON public.profiles;
DROP POLICY IF EXISTS "policy_profiles_update_admin" ON public.profiles;
DROP POLICY IF EXISTS "policy_profiles_delete_admin" ON public.profiles;
DROP POLICY IF EXISTS "policy_profiles_delete_own" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles are visible to everyone." ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can delete all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.profiles;
DROP POLICY IF EXISTS "Enable update for users based on email" ON public.profiles;
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON public.profiles;

-- Ensure RLS is enabled
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. Create Optimized Policies

-- SELECT: Public can see visible profiles
CREATE POLICY "profiles_select_public"
ON public.profiles FOR SELECT
TO public
USING ( is_visible = true );

-- SELECT: Users can see their own profile
CREATE POLICY "profiles_select_own"
ON public.profiles FOR SELECT
TO authenticated
USING ( id = auth.uid() );

-- SELECT: Admins can see ALL profiles (Uses recursion-safe function)
CREATE POLICY "profiles_select_admin"
ON public.profiles FOR SELECT
TO authenticated
USING ( public.is_admin() );

-- INSERT: Users can create their own profile
CREATE POLICY "profiles_insert_own"
ON public.profiles FOR INSERT
TO authenticated
WITH CHECK ( id = auth.uid() );

-- UPDATE: Users can update their own profile
CREATE POLICY "profiles_update_own"
ON public.profiles FOR UPDATE
TO authenticated
USING ( id = auth.uid() );

-- UPDATE: Admins can update ALL profiles
CREATE POLICY "profiles_update_admin"
ON public.profiles FOR UPDATE
TO authenticated
USING ( public.is_admin() );

-- DELETE: Users can delete their own profile
CREATE POLICY "profiles_delete_own"
ON public.profiles FOR DELETE
TO authenticated
USING ( id = auth.uid() );

-- DELETE: Admins can delete ALL profiles
CREATE POLICY "profiles_delete_admin"
ON public.profiles FOR DELETE
TO authenticated
USING ( public.is_admin() );
