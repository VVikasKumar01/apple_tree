-- Drop insecure policies that lacked school isolation
DROP POLICY IF EXISTS "Admins read student photos" ON storage.objects;
DROP POLICY IF EXISTS "Admins upload student photos" ON storage.objects;
DROP POLICY IF EXISTS "Admins update student photos" ON storage.objects;
DROP POLICY IF EXISTS "Admins delete student photos" ON storage.objects;

-- Create properly isolated storage policies
CREATE POLICY "Admins read student photos"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'student-photos' 
  AND private.is_admin() 
  AND (storage.foldername(name))[1] = private.current_user_school()::text
);

CREATE POLICY "Admins upload student photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'student-photos' 
  AND private.is_admin() 
  AND (storage.foldername(name))[1] = private.current_user_school()::text
);

CREATE POLICY "Admins update student photos"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'student-photos' 
  AND private.is_admin() 
  AND (storage.foldername(name))[1] = private.current_user_school()::text
);

CREATE POLICY "Admins delete student photos"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'student-photos' 
  AND private.is_admin() 
  AND (storage.foldername(name))[1] = private.current_user_school()::text
);
