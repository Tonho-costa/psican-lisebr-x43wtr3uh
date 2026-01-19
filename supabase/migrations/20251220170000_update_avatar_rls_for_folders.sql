-- Ensure the avatars bucket exists and is public
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO UPDATE
SET public = true;

-- Drop existing policies to ensure a clean state and avoid conflicts
DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatars" ON storage.objects;
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Public View" ON storage.objects;
DROP POLICY IF EXISTS "User Upload" ON storage.objects;
DROP POLICY IF EXISTS "User Update" ON storage.objects;
DROP POLICY IF EXISTS "User Delete" ON storage.objects;

-- Policy 1: Public View
-- Anyone can view images in the avatars bucket
CREATE POLICY "Public View"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

-- Policy 2: Authenticated User Upload (Insert)
-- Users can only upload a file named "profile.png" inside a folder matching their user ID
-- Example path: {userId}/profile.png
CREATE POLICY "User Upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars' AND
  name = (auth.uid()::text || '/profile.png')
);

-- Policy 3: Authenticated User Update
-- Users can only update their own file named "profile.png" inside their folder
CREATE POLICY "User Update"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'avatars' AND name = (auth.uid()::text || '/profile.png'))
WITH CHECK (bucket_id = 'avatars' AND name = (auth.uid()::text || '/profile.png'));

-- Policy 4: Authenticated User Delete
-- Users can only delete their own file named "profile.png" inside their folder
CREATE POLICY "User Delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'avatars' AND name = (auth.uid()::text || '/profile.png'));
