ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS crp_status TEXT,
ADD COLUMN IF NOT EXISTS education_level TEXT,
ADD COLUMN IF NOT EXISTS theoretical_approach TEXT,
ADD COLUMN IF NOT EXISTS experience_level TEXT,
ADD COLUMN IF NOT EXISTS network_availability TEXT,
ADD COLUMN IF NOT EXISTS accepts_social_value BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS agrees_to_ethics BOOLEAN DEFAULT false;

