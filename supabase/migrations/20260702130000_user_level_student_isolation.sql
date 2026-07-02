-- Recreate helper functions in case they are missing or have search path lookup issues
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'::public.app_role
  )
$$;

CREATE OR REPLACE FUNCTION public.current_user_school()
RETURNS public.school_code
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT school FROM public.user_roles WHERE user_id = auth.uid() LIMIT 1
$$;

-- Add created_by column to students table referencing auth.users(id)
ALTER TABLE public.students 
ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid();

-- Assign existing students to the specific user emails so they are not hidden
UPDATE public.students
SET created_by = (SELECT id FROM auth.users WHERE email = 'appletreenizamabad@gmail.com')
WHERE school = 'apple_tree' AND created_by IS NULL;

UPDATE public.students
SET created_by = (SELECT id FROM auth.users WHERE email = 'appleplayschoolnizamabad@gmail.com')
WHERE school = 'apple_play' AND created_by IS NULL;

-- 1. Update RLS Policy for public.students
DROP POLICY IF EXISTS "admins same school students" ON public.students;
DROP POLICY IF EXISTS "admins own school students" ON public.students;
CREATE POLICY "admins own school students" ON public.students FOR ALL TO authenticated
  USING (public.is_admin() AND school = public.current_user_school() AND created_by = auth.uid())
  WITH CHECK (public.is_admin() AND school = public.current_user_school() AND created_by = auth.uid());

-- 2. Update RLS Policy for public.tuition_fees
DROP POLICY IF EXISTS "admins same school tuition" ON public.tuition_fees;
DROP POLICY IF EXISTS "admins own school tuition" ON public.tuition_fees;
CREATE POLICY "admins own school tuition" ON public.tuition_fees FOR ALL TO authenticated
  USING (public.is_admin() AND school = public.current_user_school() AND EXISTS (
    SELECT 1 FROM public.students WHERE id = tuition_fees.student_id AND created_by = auth.uid()
  ))
  WITH CHECK (public.is_admin() AND school = public.current_user_school() AND EXISTS (
    SELECT 1 FROM public.students WHERE id = tuition_fees.student_id AND created_by = auth.uid()
  ));

-- 3. Update RLS Policy for public.other_fees
DROP POLICY IF EXISTS "admins same school other_fees" ON public.other_fees;
DROP POLICY IF EXISTS "admins own school other_fees" ON public.other_fees;
CREATE POLICY "admins own school other_fees" ON public.other_fees FOR ALL TO authenticated
  USING (public.is_admin() AND school = public.current_user_school() AND EXISTS (
    SELECT 1 FROM public.students WHERE id = other_fees.student_id AND created_by = auth.uid()
  ))
  WITH CHECK (public.is_admin() AND school = public.current_user_school() AND EXISTS (
    SELECT 1 FROM public.students WHERE id = other_fees.student_id AND created_by = auth.uid()
  ));

-- 4. Update RLS Policy for public.academic_marks
DROP POLICY IF EXISTS "admins same school marks" ON public.academic_marks;
DROP POLICY IF EXISTS "admins own school marks" ON public.academic_marks;
CREATE POLICY "admins own school marks" ON public.academic_marks FOR ALL TO authenticated
  USING (public.is_admin() AND school = public.current_user_school() AND EXISTS (
    SELECT 1 FROM public.students WHERE id = academic_marks.student_id AND created_by = auth.uid()
  ))
  WITH CHECK (public.is_admin() AND school = public.current_user_school() AND EXISTS (
    SELECT 1 FROM public.students WHERE id = academic_marks.student_id AND created_by = auth.uid()
  ));

-- 5. Update RLS Policy for public.attendance_summary
DROP POLICY IF EXISTS "admins same school attendance" ON public.attendance_summary;
DROP POLICY IF EXISTS "admins own school attendance" ON public.attendance_summary;
CREATE POLICY "admins own school attendance" ON public.attendance_summary FOR ALL TO authenticated
  USING (public.is_admin() AND school = public.current_user_school() AND EXISTS (
    SELECT 1 FROM public.students WHERE id = attendance_summary.student_id AND created_by = auth.uid()
  ))
  WITH CHECK (public.is_admin() AND school = public.current_user_school() AND EXISTS (
    SELECT 1 FROM public.students WHERE id = attendance_summary.student_id AND created_by = auth.uid()
  ));
