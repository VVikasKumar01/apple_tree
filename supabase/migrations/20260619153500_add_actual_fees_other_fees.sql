ALTER TABLE public.other_fees ADD COLUMN IF NOT EXISTS books_actual_fee numeric DEFAULT 0;
ALTER TABLE public.other_fees ADD COLUMN IF NOT EXISTS uniform_actual_fee numeric DEFAULT 0;
