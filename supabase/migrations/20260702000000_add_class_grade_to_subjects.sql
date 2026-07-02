-- Migration: Make subjects grade-specific
-- Each class (Nursery, LKG, UKG) gets its own independent subject list.

-- 1. Add class_grade column (nullable initially for migration)
ALTER TABLE public.subjects ADD COLUMN IF NOT EXISTS class_grade TEXT;

-- 2. Drop the old unique constraint on name alone
ALTER TABLE public.subjects DROP CONSTRAINT IF EXISTS subjects_name_key;

-- 3. Expand existing NULL-grade subjects into one row per grade,
--    then delete the originals (NULL-grade rows).
DO $$
DECLARE
  grades TEXT[] := ARRAY['Nursery', 'LKG', 'UKG'];
  g TEXT;
BEGIN
  -- Insert a copy of every existing subject for each grade
  FOREACH g IN ARRAY grades LOOP
    INSERT INTO public.subjects (name, class_grade, created_at)
    SELECT name, g, now()
    FROM public.subjects
    WHERE class_grade IS NULL
    ON CONFLICT DO NOTHING;
  END LOOP;

  -- Remove the original NULL-grade rows
  DELETE FROM public.subjects WHERE class_grade IS NULL;
END $$;

-- 4. Make class_grade NOT NULL now that all rows have a value
ALTER TABLE public.subjects ALTER COLUMN class_grade SET NOT NULL;

-- 5. Add the new composite unique constraint
ALTER TABLE public.subjects
  ADD CONSTRAINT subjects_name_class_grade_key UNIQUE (name, class_grade);
