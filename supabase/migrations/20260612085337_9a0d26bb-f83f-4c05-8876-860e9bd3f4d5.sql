
-- Add photo_url to students
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS photo_url text;

-- Storage policies: authenticated school admins can manage their school's photos
CREATE POLICY "Admins read student photos"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'student-photos' AND private.is_admin());

CREATE POLICY "Admins upload student photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'student-photos' AND private.is_admin());

CREATE POLICY "Admins update student photos"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'student-photos' AND private.is_admin());

CREATE POLICY "Admins delete student photos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'student-photos' AND private.is_admin());
