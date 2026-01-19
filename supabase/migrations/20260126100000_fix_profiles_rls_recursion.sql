-- Fix infinite recursion in profiles RLS policies

-- 1. Ensure is_admin function exists and is SECURITY DEFINER
-- This allows the function to bypass RLS when checking the profiles table, preventing the recursion loop
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

-- 2. Drop the recursive policy from the profiles table
-- The previous policy used an inline subquery which triggered RLS recursively
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.profiles;

-- 3. Re-create the policy using the security definer function
-- This prevents the recursion because is_admin() runs with elevated privileges (bypassing RLS)
CREATE POLICY "Admins can manage all profiles"
ON public.profiles
FOR ALL
USING (
  public.is_admin()
);
