-- Ensure the avatars bucket exists and is public
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Remove existing policies to avoid conflicts and ensure clean state
DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatars" ON storage.objects;
DROP POLICY IF EXISTS "Public Access" ON storage.objects;

-- Policy: Anyone can view avatars (Public Access)
CREATE POLICY "Avatar images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

-- Policy: Authenticated users can upload avatars
-- Allow uploads specifically to avatars/{user_id}.png
CREATE POLICY "Authenticated users can upload avatars"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars' AND
  name = 'avatars/' || auth.uid() || '.png'
);

-- Policy: Users can update their own avatars
-- Allow updates specifically to avatars/{user_id}.png
CREATE POLICY "Users can update their own avatars"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'avatars' AND name = 'avatars/' || auth.uid() || '.png')
WITH CHECK (bucket_id = 'avatars' AND name = 'avatars/' || auth.uid() || '.png');

-- Policy: Users can delete their own avatars
-- Allow deletion specifically of avatars/{user_id}.png
CREATE POLICY "Users can delete their own avatars"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'avatars' AND name = 'avatars/' || auth.uid() || '.png');
