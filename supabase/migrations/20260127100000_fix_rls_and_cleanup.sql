-- Migration to fix RLS recursion, implement secure admin check, and clean up profile data

-- 1. Create secure is_admin function to avoid recursion
-- This function runs with the privileges of the creator (SECURITY DEFINER)
-- bypassing the RLS on the profiles table itself when checking the role.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- 2. Drop existing policies that might cause recursion or need update
-- Dropping potential conflicting policies to ensure a clean slate
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert for users based on user_id" ON public.profiles;
DROP POLICY IF EXISTS "Enable update for users based on email" ON public.profiles;
DROP POLICY IF EXISTS "Admins can see all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can see their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can delete profiles" ON public.profiles;

-- Ensure RLS is enabled
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. Create new optimized policies

-- Policy: Public Read Access (only visible profiles)
CREATE POLICY "Public profiles are viewable by everyone"
ON public.profiles FOR SELECT
USING ( is_visible = true );

-- Policy: Self Read Access (users can see their own profile even if hidden)
CREATE POLICY "Users can see their own profile"
ON public.profiles FOR SELECT
USING ( auth.uid() = id );

-- Policy: Admin Read Access (admins see everything)
CREATE POLICY "Admins can see all profiles"
ON public.profiles FOR SELECT
USING ( public.is_admin() );

-- Policy: Insert (Self)
CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK ( auth.uid() = id );

-- Policy: Update (Self)
CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
USING ( auth.uid() = id );

-- Policy: Update (Admin)
CREATE POLICY "Admins can update any profile"
ON public.profiles FOR UPDATE
USING ( public.is_admin() );

-- Policy: Delete (Admin)
CREATE POLICY "Admins can delete profiles"
ON public.profiles FOR DELETE
USING ( public.is_admin() );

-- 4. Cleanup: Remove example and test data
DELETE FROM public.profiles
WHERE
  email ILIKE '%@example.com'
  OR email ILIKE '%@test.com'
  OR full_name ILIKE '%Exemplo%'
  OR full_name ILIKE '%Example%'
  OR full_name ILIKE '%Teste%'
  OR full_name = 'João Silva'
  OR description ILIKE '%Lorem ipsum%'
  OR description ILIKE '%placeholder%';

-- 5. Visibility: Set is_visible = true for all remaining profiles
UPDATE public.profiles
SET is_visible = true;
