-- Fix RLS recursion for profiles table and secure admin access
-- This migration drops potentially conflicting policies and recreates them
-- with a recursion-proof is_admin() function.

-- 1. Drop existing policies to prevent conflicts and clean the slate
DO $$
DECLARE
    pol record;
BEGIN
    FOR pol IN select policyname from pg_policies where tablename = 'profiles'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.profiles', pol.policyname);
    END LOOP;
END $$;

-- 2. Define is_admin function with SECURITY DEFINER
-- This ensures the function runs with elevated privileges (Creator/Postgres), 
-- bypassing RLS on the profiles table to avoid infinite recursion.
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

  -- Query the role directly (bypassing RLS due to SECURITY DEFINER)
  SELECT role INTO v_role
  FROM public.profiles
  WHERE id = auth.uid();
  
  -- Return true only if role is exactly 'admin'
  RETURN COALESCE(v_role = 'admin', FALSE);
EXCEPTION
  WHEN OTHERS THEN
    -- Fail safely in case of any error
    RETURN FALSE;
END;
$$;

-- Grant execution permissions for the function
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO service_role;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon;

-- 3. Create RLS Policies

-- Public visibility: anyone can see profiles marked as visible
CREATE POLICY "profiles_select_visible"
ON public.profiles FOR SELECT
TO public
USING ( is_visible = true );

-- Self access: authenticated users can see their own profile (regardless of visibility)
CREATE POLICY "profiles_select_own"
ON public.profiles FOR SELECT
TO authenticated
USING ( id = auth.uid() );

-- Self insert: authenticated users can insert their own profile
CREATE POLICY "profiles_insert_own"
ON public.profiles FOR INSERT
TO authenticated
WITH CHECK ( id = auth.uid() );

-- Self update: authenticated users can update their own profile
CREATE POLICY "profiles_update_own"
ON public.profiles FOR UPDATE
TO authenticated
USING ( id = auth.uid() );

-- Admin access: admins can perform ALL operations on ALL profiles
-- This uses the secure is_admin() function which does not trigger recursion
CREATE POLICY "profiles_all_admin"
ON public.profiles FOR ALL
TO authenticated
USING ( public.is_admin() );

-- 4. Final Security Settings
-- Enable RLS on the table (redundant if already enabled, but safe)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Grant standard table permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON TABLE public.profiles TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.profiles TO anon, authenticated;
