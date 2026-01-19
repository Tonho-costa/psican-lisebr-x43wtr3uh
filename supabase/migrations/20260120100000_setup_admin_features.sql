-- Add role column to profiles if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'role') THEN
        ALTER TABLE public.profiles ADD COLUMN role TEXT NOT NULL DEFAULT 'user';
    END IF;
END $$;

-- Create admin_logs table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.admin_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  target_id UUID,
  details JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create triage_submissions table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.triage_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT NOT NULL,
  crp_status TEXT NOT NULL,
  education TEXT NOT NULL,
  experience_level TEXT NOT NULL,
  theoretical_approach TEXT NOT NULL,
  service_mode TEXT NOT NULL,
  weekly_availability TEXT NOT NULL,
  accepts_social_value BOOLEAN NOT NULL DEFAULT false,
  agrees_to_ethics BOOLEAN NOT NULL DEFAULT false,
  agrees_to_terms BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, approved, rejected
  admin_notes TEXT,
  processed_by UUID REFERENCES auth.users(id),
  processed_at TIMESTAMPTZ,
  profile_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.admin_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.triage_submissions ENABLE ROW LEVEL SECURITY;

-- Policies for admin_logs
DROP POLICY IF EXISTS "Admins can view logs" ON public.admin_logs;
CREATE POLICY "Admins can view logs" ON public.admin_logs
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "Admins can insert logs" ON public.admin_logs;
CREATE POLICY "Admins can insert logs" ON public.admin_logs
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Policies for triage_submissions
DROP POLICY IF EXISTS "Users can insert triage submissions" ON public.triage_submissions;
CREATE POLICY "Users can insert triage submissions" ON public.triage_submissions
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

DROP POLICY IF EXISTS "Users can view own submissions" ON public.triage_submissions;
CREATE POLICY "Users can view own submissions" ON public.triage_submissions
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all submissions" ON public.triage_submissions;
CREATE POLICY "Admins can view all submissions" ON public.triage_submissions
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "Admins can update submissions" ON public.triage_submissions;
CREATE POLICY "Admins can update submissions" ON public.triage_submissions
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Manual Promotion Migration (Uncomment and replace email to use)
-- UPDATE public.profiles SET role = 'admin' WHERE email = 'admin@escutapsi.com';
