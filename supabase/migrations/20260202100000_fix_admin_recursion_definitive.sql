-- Migration to definitively fix RLS recursion and secure admin access
-- This migration drops potentially conflicting policies and recreates them
-- using a SECURITY DEFINER function to bypass infinite recursion loops.

-- 1. Secure is_admin function to prevent recursion
-- Defined with SECURITY DEFINER to run with elevated privileges (bypassing RLS on profiles)
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

  -- Select role directly. Since it's SECURITY DEFINER, it bypasses RLS on profiles table.
  SELECT role INTO v_role
  FROM public.profiles
  WHERE id = auth.uid();
  
  -- Return true only if role is explicitly 'admin'
  RETURN COALESCE(v_role = 'admin', FALSE);
EXCEPTION
  WHEN OTHERS THEN
    RETURN FALSE;
END;
$$;

-- Grant execute permissions to all relevant roles
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO service_role;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon;

-- 2. Reset RLS Policies on profiles table to 'Clean Slate'
-- Drop ALL existing policies to ensure no legacy recursive policies remain
DROP POLICY IF EXISTS "profiles_select_visible" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_all_admin" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles are visible to everyone." ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can delete all profiles" ON public.profiles;

-- Ensure RLS is enabled
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. Create optimized, recursion-free policies

-- Public Read Access: Only visible profiles
-- Used for the search page and public profile views
CREATE POLICY "profiles_select_visible"
ON public.profiles FOR SELECT
TO public
USING ( is_visible = true );

-- Owner Read Access: Users can always see their own profile
-- Crucial for dashboard access and self-verification
CREATE POLICY "profiles_select_own"
ON public.profiles FOR SELECT
TO authenticated
USING ( id = auth.uid() );

-- Owner Insert Access: Users can create their own profile
-- Used during registration
CREATE POLICY "profiles_insert_own"
ON public.profiles FOR INSERT
TO authenticated
WITH CHECK ( id = auth.uid() );

-- Owner Update Access: Users can update their own profile
-- Used in the dashboard
CREATE POLICY "profiles_update_own"
ON public.profiles FOR UPDATE
TO authenticated
USING ( id = auth.uid() );

-- Admin Full Access: Admins can do EVERYTHING on ALL profiles
-- Uses the recursive-proof is_admin() function
CREATE POLICY "profiles_all_admin"
ON public.profiles FOR ALL
TO authenticated
USING ( public.is_admin() );
