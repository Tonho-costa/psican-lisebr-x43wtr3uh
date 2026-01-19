-- Migration to fix Supabase Storage RLS policies for user avatars
-- Retry without ALTER TABLE statement which caused permission errors on 'storage.objects'

BEGIN;

-- 1. Ensure the 'avatars' bucket exists and is set to public
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO UPDATE
SET public = true;

-- 2. Clean up existing policies to prevent conflicts
DROP POLICY IF EXISTS "Public View" ON storage.objects;
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Public Read Access" ON storage.objects;
DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "User Upload" ON storage.objects;
DROP POLICY IF EXISTS "User Update" ON storage.objects;
DROP POLICY IF EXISTS "User Delete" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatars" ON storage.objects;
DROP POLICY IF EXISTS "User Manage Own Folder" ON storage.objects;

-- 3. Create Policy: Public Read Access
-- Allows anyone (authenticated or anonymous) to view/download files in the 'avatars' bucket
CREATE POLICY "Public Read Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

-- 4. Create Policy: Authenticated User Management
-- Allows authenticated users to INSERT, UPDATE, DELETE, and SELECT files
-- ONLY if the file path starts with their user ID (e.g., '{uid}/avatar.png')
-- This prevents users from overwriting others' avatars
CREATE POLICY "User Manage Own Folder"
ON storage.objects FOR ALL
TO authenticated
USING (
    bucket_id = 'avatars' 
    AND name LIKE (auth.uid()::text || '/%')
)
WITH CHECK (
    bucket_id = 'avatars' 
    AND name LIKE (auth.uid()::text || '/%')
);

COMMIT;
