-- Definitive fix for RLS infinite recursion and admin access issues
-- This migration ensures a clean slate for profiles policies and secure admin function definition

-- 1. Drop ALL existing policies on profiles to prevent conflicts or recursive logic
DO $$
DECLARE
    pol record;
BEGIN
    FOR pol IN select policyname from pg_policies where tablename = 'profiles'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.profiles', pol.policyname);
    END LOOP;
END $$;

-- 2. Redefine is_admin function as SECURITY DEFINER
-- This is critical: SECURITY DEFINER functions run with the privileges of the creator (postgres/admin)
-- This allows the function to bypass RLS when it queries the profiles table, preventing recursion loops.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, extensions
AS $$
BEGIN
  -- Check if the user has the 'admin' role in the profiles table
  -- Since this runs as SECURITY DEFINER, it ignores RLS on profiles table
  RETURN EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$;

-- 3. Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon;
GRANT EXECUTE ON FUNCTION public.is_admin() TO service_role;

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON TABLE public.profiles TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.profiles TO anon, authenticated;

-- 4. Create robust, non-recursive RLS Policies

-- Public View Policy: Anyone can see visible profiles
CREATE POLICY "profiles_select_public"
ON public.profiles FOR SELECT
TO public
USING ( is_visible = true );

-- Self Access Policy: Users can see/edit their own profile
CREATE POLICY "profiles_select_own"
ON public.profiles FOR SELECT
TO authenticated
USING ( auth.uid() = id );

CREATE POLICY "profiles_insert_own"
ON public.profiles FOR INSERT
TO authenticated
WITH CHECK ( auth.uid() = id );

CREATE POLICY "profiles_update_own"
ON public.profiles FOR UPDATE
TO authenticated
USING ( auth.uid() = id );

-- Admin Access Policy: Admins can do everything
-- Using public.is_admin() here is safe because is_admin() itself bypasses RLS
CREATE POLICY "profiles_all_admin"
ON public.profiles FOR ALL
TO authenticated
USING ( public.is_admin() );

-- 5. Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
