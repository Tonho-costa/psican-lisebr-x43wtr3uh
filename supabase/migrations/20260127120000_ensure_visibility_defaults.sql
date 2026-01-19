-- Migration to set default visibility for profiles
-- This ensures that new profiles (or those without explicit visibility setting) 
-- are visible by default, as requested in the user story.

-- 1. Set default value for is_visible to true
ALTER TABLE public.profiles ALTER COLUMN is_visible SET DEFAULT true;

-- 2. Set default value for is_featured to false (good practice)
ALTER TABLE public.profiles ALTER COLUMN is_featured SET DEFAULT false;

-- 3. Ensure any null is_visible values are set to true
UPDATE public.profiles SET is_visible = true WHERE is_visible IS NULL;

-- 4. Ensure any null is_featured values are set to false
UPDATE public.profiles SET is_featured = false WHERE is_featured IS NULL;
