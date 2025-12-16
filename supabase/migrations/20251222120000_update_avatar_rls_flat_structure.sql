-- Migration to update storage policies for the 'avatars' bucket to allow flat file structure (uid.png)

-- Enable RLS on storage.objects if not already enabled (it usually is)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to upload/insert their own avatar file named [uid].png
CREATE POLICY "Users can upload their own avatar file"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars' AND
  name = (auth.uid() || '.png')
);

-- Policy to allow users to update their own avatar file named [uid].png
CREATE POLICY "Users can update their own avatar file"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars' AND
  name = (auth.uid() || '.png')
);

-- Policy to allow users to delete their own avatar file named [uid].png
CREATE POLICY "Users can delete their own avatar file"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars' AND
  name = (auth.uid() || '.png')
);

-- Ensure public access to avatars is allowed (usually handled by a public bucket or specific select policy)
-- Adding an explicit select policy for everyone to read avatars just in case
CREATE POLICY "Anyone can view avatars"
ON storage.objects FOR SELECT
TO public
USING ( bucket_id = 'avatars' );
