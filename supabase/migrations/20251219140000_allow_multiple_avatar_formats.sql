-- Remove existing restrictive policies to avoid conflicts
DROP POLICY IF EXISTS "Authenticated users can upload avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatars" ON storage.objects;

-- Policy: Authenticated users can upload avatars
-- Allow uploads specifically to avatars/{user_id}.* (any extension)
CREATE POLICY "Authenticated users can upload avatars"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars' AND
  name LIKE 'avatars/' || auth.uid() || '.%'
);

-- Policy: Users can update their own avatars
-- Allow updates specifically to avatars/{user_id}.*
CREATE POLICY "Users can update their own avatars"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'avatars' AND name LIKE 'avatars/' || auth.uid() || '.%')
WITH CHECK (bucket_id = 'avatars' AND name LIKE 'avatars/' || auth.uid() || '.%');

-- Policy: Users can delete their own avatars
-- Allow deletion specifically of avatars/{user_id}.*
CREATE POLICY "Users can delete their own avatars"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'avatars' AND name LIKE 'avatars/' || auth.uid() || '.%');
