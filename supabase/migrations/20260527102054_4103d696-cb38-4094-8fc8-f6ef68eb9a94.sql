
-- Roles
CREATE TYPE public.app_role AS ENUM ('admin');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'admin',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users see own role" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.has_role(auth.uid(), 'admin'::app_role)
$$;

-- Auto-assign admin role on first signup (single-admin model; safe since only admin uses the app)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin')
  ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Generic updated_at trigger
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- STUDENTS (personal details only)
CREATE TABLE public.students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admission_number TEXT UNIQUE NOT NULL,
  student_name TEXT NOT NULL,
  gender TEXT CHECK (gender IN ('Male','Female')),
  date_of_birth DATE,
  blood_group TEXT,
  nationality TEXT,
  religion TEXT,
  caste TEXT,
  height_cm NUMERIC,
  weight_kg NUMERIC,
  class_grade TEXT,
  section TEXT,
  academic_year TEXT,
  father_name TEXT,
  father_aadhaar TEXT,
  father_mobile TEXT,
  father_occupation TEXT,
  mother_name TEXT,
  mother_aadhaar TEXT,
  mother_mobile TEXT,
  mother_occupation TEXT,
  primary_mobile TEXT,
  emergency_contact TEXT,
  email TEXT,
  permanent_address TEXT,
  correspondence_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TRIGGER students_updated BEFORE UPDATE ON public.students FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
GRANT SELECT, INSERT, UPDATE, DELETE ON public.students TO authenticated;
GRANT ALL ON public.students TO service_role;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admins all students" ON public.students FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- TUITION FEES
CREATE TABLE public.tuition_fees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  academic_year TEXT NOT NULL,
  total_annual_fee NUMERIC DEFAULT 0,
  finalized_fee NUMERIC DEFAULT 0,
  term1_fee NUMERIC DEFAULT 0,
  term1_status TEXT DEFAULT 'Unpaid' CHECK (term1_status IN ('Paid','Unpaid')),
  term1_payment_mode TEXT,
  term1_payment_date DATE,
  term1_txn_id TEXT,
  term2_fee NUMERIC DEFAULT 0,
  term2_status TEXT DEFAULT 'Unpaid' CHECK (term2_status IN ('Paid','Unpaid')),
  term2_payment_mode TEXT,
  term2_payment_date DATE,
  term2_txn_id TEXT,
  term3_fee NUMERIC DEFAULT 0,
  term3_status TEXT DEFAULT 'Unpaid' CHECK (term3_status IN ('Paid','Unpaid')),
  term3_payment_mode TEXT,
  term3_payment_date DATE,
  term3_txn_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(student_id, academic_year)
);
CREATE TRIGGER tuition_updated BEFORE UPDATE ON public.tuition_fees FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tuition_fees TO authenticated;
GRANT ALL ON public.tuition_fees TO service_role;
ALTER TABLE public.tuition_fees ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admins all tuition" ON public.tuition_fees FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- OTHER FEES (books + uniform)
CREATE TABLE public.other_fees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  academic_year TEXT NOT NULL,
  books_allotted TEXT,
  books_status TEXT DEFAULT 'Not Issued' CHECK (books_status IN ('Issued','Not Issued')),
  uniform_size TEXT,
  uniform_status TEXT DEFAULT 'Not Issued' CHECK (uniform_status IN ('Issued','Not Issued')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(student_id, academic_year)
);
CREATE TRIGGER other_fees_updated BEFORE UPDATE ON public.other_fees FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
GRANT SELECT, INSERT, UPDATE, DELETE ON public.other_fees TO authenticated;
GRANT ALL ON public.other_fees TO service_role;
ALTER TABLE public.other_fees ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admins all other_fees" ON public.other_fees FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- SUBJECTS (admin configurable)
CREATE TABLE public.subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.subjects TO authenticated;
GRANT ALL ON public.subjects TO service_role;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admins all subjects" ON public.subjects FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

INSERT INTO public.subjects (name) VALUES ('English'),('Math'),('EVS'),('Rhymes'),('Drawing');

-- ACADEMICS: subject marks per term
CREATE TABLE public.academic_marks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  academic_year TEXT NOT NULL,
  subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  term1_marks NUMERIC,
  term2_marks NUMERIC,
  term3_marks NUMERIC,
  max_marks NUMERIC DEFAULT 100,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(student_id, academic_year, subject_id)
);
CREATE TRIGGER academics_updated BEFORE UPDATE ON public.academic_marks FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
GRANT SELECT, INSERT, UPDATE, DELETE ON public.academic_marks TO authenticated;
GRANT ALL ON public.academic_marks TO service_role;
ALTER TABLE public.academic_marks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admins all marks" ON public.academic_marks FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ATTENDANCE summary per student per year
CREATE TABLE public.attendance_summary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  academic_year TEXT NOT NULL,
  total_working_days INT DEFAULT 0,
  days_present INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(student_id, academic_year)
);
CREATE TRIGGER attendance_updated BEFORE UPDATE ON public.attendance_summary FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
GRANT SELECT, INSERT, UPDATE, DELETE ON public.attendance_summary TO authenticated;
GRANT ALL ON public.attendance_summary TO service_role;
ALTER TABLE public.attendance_summary ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admins all attendance" ON public.attendance_summary FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- CALENDAR EVENTS
CREATE TABLE public.calendar_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  event_date DATE NOT NULL,
  event_type TEXT NOT NULL DEFAULT 'event' CHECK (event_type IN ('holiday','working','event')),
  color TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.calendar_events TO authenticated;
GRANT ALL ON public.calendar_events TO service_role;
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admins all calendar" ON public.calendar_events FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- APP SETTINGS (color customization etc.)
CREATE TABLE public.app_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.app_settings TO authenticated;
GRANT ALL ON public.app_settings TO service_role;
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admins all settings" ON public.app_settings FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

INSERT INTO public.app_settings (key, value) VALUES
  ('fee_colors', '{"paid":"#10b981","unpaid":"#ef4444"}'::jsonb),
  ('calendar_colors', '{"holiday":"#ef4444","working":"#10b981","event":"#6366f1"}'::jsonb);
