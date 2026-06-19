
CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC, anon, authenticated;
GRANT USAGE ON SCHEMA private TO authenticated, service_role;

CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role) $$;

CREATE OR REPLACE FUNCTION private.is_admin()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT private.has_role(auth.uid(), 'admin'::public.app_role) $$;

CREATE OR REPLACE FUNCTION private.current_user_school()
RETURNS public.school_code LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT school FROM public.user_roles WHERE user_id = auth.uid() LIMIT 1 $$;

CREATE OR REPLACE FUNCTION private.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE s public.school_code;
BEGIN
  s := NULLIF(NEW.raw_user_meta_data->>'school','')::public.school_code;
  INSERT INTO public.user_roles (user_id, role, school)
  VALUES (NEW.id, 'admin', s) ON CONFLICT DO NOTHING;
  RETURN NEW;
END; $$;

REVOKE ALL ON FUNCTION private.has_role(uuid, public.app_role) FROM PUBLIC;
REVOKE ALL ON FUNCTION private.is_admin() FROM PUBLIC;
REVOKE ALL ON FUNCTION private.current_user_school() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION private.current_user_school() TO authenticated;
GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO authenticated;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION private.handle_new_user();

DROP POLICY IF EXISTS "admins same school marks" ON public.academic_marks;
CREATE POLICY "admins same school marks" ON public.academic_marks FOR ALL
USING (private.is_admin() AND school = private.current_user_school())
WITH CHECK (private.is_admin() AND school = private.current_user_school());

DROP POLICY IF EXISTS "admins all settings" ON public.app_settings;
CREATE POLICY "admins all settings" ON public.app_settings FOR ALL
USING (private.is_admin()) WITH CHECK (private.is_admin());

DROP POLICY IF EXISTS "admins same school attendance" ON public.attendance_summary;
CREATE POLICY "admins same school attendance" ON public.attendance_summary FOR ALL
USING (private.is_admin() AND school = private.current_user_school())
WITH CHECK (private.is_admin() AND school = private.current_user_school());

DROP POLICY IF EXISTS "admins same school calendar" ON public.calendar_events;
CREATE POLICY "admins same school calendar" ON public.calendar_events FOR ALL
USING (private.is_admin() AND school = private.current_user_school())
WITH CHECK (private.is_admin() AND school = private.current_user_school());

DROP POLICY IF EXISTS "admins same school other_fees" ON public.other_fees;
CREATE POLICY "admins same school other_fees" ON public.other_fees FOR ALL
USING (private.is_admin() AND school = private.current_user_school())
WITH CHECK (private.is_admin() AND school = private.current_user_school());

DROP POLICY IF EXISTS "admins same school students" ON public.students;
CREATE POLICY "admins same school students" ON public.students FOR ALL
USING (private.is_admin() AND school = private.current_user_school())
WITH CHECK (private.is_admin() AND school = private.current_user_school());

DROP POLICY IF EXISTS "admins all subjects" ON public.subjects;
CREATE POLICY "admins all subjects" ON public.subjects FOR ALL
USING (private.is_admin()) WITH CHECK (private.is_admin());

DROP POLICY IF EXISTS "admins same school tuition" ON public.tuition_fees;
CREATE POLICY "admins same school tuition" ON public.tuition_fees FOR ALL
USING (private.is_admin() AND school = private.current_user_school())
WITH CHECK (private.is_admin() AND school = private.current_user_school());

DROP FUNCTION IF EXISTS public.is_admin();
DROP FUNCTION IF EXISTS public.current_user_school();
DROP FUNCTION IF EXISTS public.has_role(uuid, public.app_role);
DROP FUNCTION IF EXISTS public.handle_new_user();
