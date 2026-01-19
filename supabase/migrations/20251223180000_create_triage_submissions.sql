CREATE TABLE IF NOT EXISTS public.triage_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    profile_url TEXT,
    service_mode TEXT NOT NULL,
    education TEXT NOT NULL,
    crp_status TEXT NOT NULL,
    theoretical_approach TEXT NOT NULL,
    experience_level TEXT NOT NULL,
    weekly_availability TEXT NOT NULL,
    accepts_social_value BOOLEAN NOT NULL,
    agrees_to_ethics BOOLEAN NOT NULL,
    agrees_to_terms BOOLEAN NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending'
);

ALTER TABLE public.triage_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable insert for all users" ON public.triage_submissions
    FOR INSERT WITH CHECK (true);
