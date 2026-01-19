-- Helper function to check if the current user is an admin
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

-- PROFILES policies for Admin
CREATE POLICY "Admins can view all profiles (including hidden)"
  ON public.profiles
  FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admins can update all profiles"
  ON public.profiles
  FOR UPDATE
  USING (public.is_admin());

-- TRIAGE_SUBMISSIONS policies for Admin
-- Enable RLS just in case it wasn't enabled
ALTER TABLE public.triage_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all triage submissions"
  ON public.triage_submissions
  FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admins can update triage submissions"
  ON public.triage_submissions
  FOR UPDATE
  USING (public.is_admin());

-- ADMIN_LOGS policies for Admin
ALTER TABLE public.admin_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can insert logs"
  ON public.admin_logs
  FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can view logs"
  ON public.admin_logs
  FOR SELECT
  USING (public.is_admin());

