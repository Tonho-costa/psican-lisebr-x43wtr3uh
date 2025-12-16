-- Migration to update storage policies for the 'avatars' bucket to allow flat file structure (uid.png)

-- Remove the ALTER TABLE statement that causes permission errors.
-- RLS is enabled by default on storage.objects in Supabase.
-- ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can upload their own avatar file" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatar file" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatar file" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view avatars" ON storage.objects;

-- Policy to allow users to upload/insert their own avatar file named [uid].png
CREATE POLICY "Users can upload their own avatar file"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars' AND
  name = (auth.uid()::text || '.png')
);

-- Policy to allow users to update their own avatar file named [uid].png
CREATE POLICY "Users can update their own avatar file"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars' AND
  name = (auth.uid()::text || '.png')
)
WITH CHECK (
  bucket_id = 'avatars' AND
  name = (auth.uid()::text || '.png')
);

-- Policy to allow users to delete their own avatar file named [uid].png
CREATE POLICY "Users can delete their own avatar file"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars' AND
  name = (auth.uid()::text || '.png')
);

-- Policy to allow anyone to view avatars
CREATE POLICY "Anyone can view avatars"
ON storage.objects FOR SELECT
TO public
USING ( bucket_id = 'avatars' );
