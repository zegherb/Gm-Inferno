-- Drop existing policies
DROP POLICY IF EXISTS "Users can upload their own report photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can view all report photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own report photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own report photos" ON storage.objects;

-- Create simplified storage policies that work with our file naming convention
CREATE POLICY "Authenticated users can upload report photos" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'report-photos' AND 
    auth.role() = 'authenticated'
  );

CREATE POLICY "Anyone can view report photos" ON storage.objects
  FOR SELECT USING (bucket_id = 'report-photos');

CREATE POLICY "Users can update their own report photos" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'report-photos' AND 
    auth.role() = 'authenticated' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete their own report photos" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'report-photos' AND 
    auth.role() = 'authenticated' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );
