
-- 1. School enum
CREATE TYPE public.school_code AS ENUM ('apple_tree', 'apple_play');

-- 2. Add school to user_roles
ALTER TABLE public.user_roles ADD COLUMN school public.school_code;

-- 3. Add school column to data tables
ALTER TABLE public.students ADD COLUMN school public.school_code;
ALTER TABLE public.tuition_fees ADD COLUMN school public.school_code;
ALTER TABLE public.other_fees ADD COLUMN school public.school_code;
ALTER TABLE public.academic_marks ADD COLUMN school public.school_code;
ALTER TABLE public.attendance_summary ADD COLUMN school public.school_code;
ALTER TABLE public.calendar_events ADD COLUMN school public.school_code;

-- 4. Security definer to get current user's school
CREATE OR REPLACE FUNCTION public.current_user_school()
RETURNS public.school_code
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT school FROM public.user_roles WHERE user_id = auth.uid() LIMIT 1
$$;

-- 5. Replace handle_new_user to read school from raw_user_meta_data
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  s public.school_code;
BEGIN
  s := NULLIF(NEW.raw_user_meta_data->>'school','')::public.school_code;
  INSERT INTO public.user_roles (user_id, role, school)
  VALUES (NEW.id, 'admin', s)
  ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$$;

-- Ensure trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6. Update RLS policies to scope by school
DROP POLICY IF EXISTS "admins all students" ON public.students;
CREATE POLICY "admins same school students" ON public.students FOR ALL TO authenticated
  USING (is_admin() AND school = current_user_school())
  WITH CHECK (is_admin() AND school = current_user_school());

DROP POLICY IF EXISTS "admins all tuition" ON public.tuition_fees;
CREATE POLICY "admins same school tuition" ON public.tuition_fees FOR ALL TO authenticated
  USING (is_admin() AND school = current_user_school())
  WITH CHECK (is_admin() AND school = current_user_school());

DROP POLICY IF EXISTS "admins all other_fees" ON public.other_fees;
CREATE POLICY "admins same school other_fees" ON public.other_fees FOR ALL TO authenticated
  USING (is_admin() AND school = current_user_school())
  WITH CHECK (is_admin() AND school = current_user_school());

DROP POLICY IF EXISTS "admins all marks" ON public.academic_marks;
CREATE POLICY "admins same school marks" ON public.academic_marks FOR ALL TO authenticated
  USING (is_admin() AND school = current_user_school())
  WITH CHECK (is_admin() AND school = current_user_school());

DROP POLICY IF EXISTS "admins all attendance" ON public.attendance_summary;
CREATE POLICY "admins same school attendance" ON public.attendance_summary FOR ALL TO authenticated
  USING (is_admin() AND school = current_user_school())
  WITH CHECK (is_admin() AND school = current_user_school());

DROP POLICY IF EXISTS "admins all calendar" ON public.calendar_events;
CREATE POLICY "admins same school calendar" ON public.calendar_events FOR ALL TO authenticated
  USING (is_admin() AND school = current_user_school())
  WITH CHECK (is_admin() AND school = current_user_school());

-- subjects and app_settings remain shared across both schools (admin-only)
