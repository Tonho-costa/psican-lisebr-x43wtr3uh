-- Update triage_submissions to link with auth users
ALTER TABLE public.triage_submissions ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE public.triage_submissions ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.triage_submissions ADD COLUMN IF NOT EXISTS admin_notes TEXT;
ALTER TABLE public.triage_submissions ADD COLUMN IF NOT EXISTS processed_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.triage_submissions ADD COLUMN IF NOT EXISTS processed_by UUID REFERENCES auth.users(id);

-- Ensure profiles have correct status enum values (soft check, since it's text)
-- We'll just rely on text for now as changing types can be complex with existing data

-- Add policy for admins to view all triage submissions
CREATE POLICY "Admins can view all triage submissions" ON public.triage_submissions
    FOR SELECT
    TO authenticated
    USING (EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    ));

-- Add policy for admins to update triage submissions
CREATE POLICY "Admins can update triage submissions" ON public.triage_submissions
    FOR UPDATE
    TO authenticated
    USING (EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    ));
