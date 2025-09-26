-- Create storage bucket for report photos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('report-photos', 'report-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for report photos
CREATE POLICY "Users can upload their own report photos" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'report-photos' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view all report photos" ON storage.objects
  FOR SELECT USING (bucket_id = 'report-photos');

CREATE POLICY "Users can update their own report photos" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'report-photos' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own report photos" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'report-photos' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );
