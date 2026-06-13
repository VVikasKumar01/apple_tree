-- Drop the existing unique constraint on admission_number
ALTER TABLE public.students DROP CONSTRAINT IF EXISTS students_admission_number_key;

-- Add a new unique constraint on (school, academic_year, admission_number)
ALTER TABLE public.students ADD CONSTRAINT students_school_year_admission_number_key UNIQUE (school, academic_year, admission_number);
