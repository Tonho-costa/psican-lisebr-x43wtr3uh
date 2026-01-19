-- Migration to clean up example profiles and ensure real profiles are visible

-- 1. Delete example/mock profiles from public.profiles
-- Identifies and removes entries that are clearly marked as test or example data
DELETE FROM public.profiles
WHERE 
  -- Generic and test email domains
  email ILIKE '%@example.com'
  OR email ILIKE '%@test.com'
  -- Generic and placeholder names
  OR full_name ILIKE '%Exemplo%'
  OR full_name ILIKE '%Example%'
  OR full_name ILIKE '%Teste%'
  OR full_name = 'João Silva'
  -- Placeholder descriptions
  OR description ILIKE '%Lorem ipsum%'
  OR description ILIKE '%placeholder%';

-- 2. Update all remaining profiles to be visible
-- Sets the is_visible column to true for all "real" profiles so they appear in search results
UPDATE public.profiles
SET is_visible = true;
