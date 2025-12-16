-- Drop existing policies to ensure clean state and enforce the new strict rules
-- This ensures no conflicting policies exist from previous migrations
DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatars" ON storage.objects;
DROP POLICY IF EXISTS "Public Access" ON storage.objects;

-- Policy: Anyone can view avatars (Public Access)
-- Allows public read access to all files in the 'avatars' bucket
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

-- Policy: Authenticated users can upload their own avatar
-- Strictly enforces that the file name must be {uid}.png and the user must be authenticated
CREATE POLICY "Authenticated users can upload avatars"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars' AND
  name = (auth.uid()::text || '.png')
);

-- Policy: Users can update their own avatar
-- Allows users to replace (upsert) their own avatar file
CREATE POLICY "Users can update their own avatars"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'avatars' AND name = (auth.uid()::text || '.png'))
WITH CHECK (bucket_id = 'avatars' AND name = (auth.uid()::text || '.png'));

-- Policy: Users can delete their own avatar
-- Allows users to delete their own avatar file
CREATE POLICY "Users can delete their own avatars"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'avatars' AND name = (auth.uid()::text || '.png'));
