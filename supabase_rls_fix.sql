-- ============================================
-- FIX RLS BANTUL DRIVING SCHOOL - V2
-- ============================================
-- Goal: Hapus SEMUA policy lama, buat ulang dengan WITH CHECK (true)
-- Jalankan ini di Supabase Dashboard → SQL Editor → New Query

-- ============================================
-- STEP 1: DROP SEMUA POLICY EXISTING
-- ============================================

-- Students table policies
DROP POLICY IF EXISTS "Allow anonymous insert on students" ON public.students;
DROP POLICY IF EXISTS "Allow anonymous select on students" ON public.students;
DROP POLICY IF EXISTS "Allow anonymous update on students" ON public.students;
DROP POLICY IF EXISTS "Authenticated full access to students" ON public.students;
DROP POLICY IF EXISTS "Public can insert students" ON public.students;
DROP POLICY IF EXISTS "anon_all_students" ON public.students;
DROP POLICY IF EXISTS "Enable all for anon on students" ON public.students;

-- Bookings table policies
DROP POLICY IF EXISTS "Allow anonymous insert on bookings" ON public.bookings;
DROP POLICY IF EXISTS "Authenticated full access to bookings" ON public.bookings;
DROP POLICY IF EXISTS "Public can insert bookings" ON public.bookings;
DROP POLICY IF EXISTS "anon_all_bookings" ON public.bookings;
DROP POLICY IF EXISTS "Enable all for anon on bookings" ON public.bookings;

-- Payments table policies
DROP POLICY IF EXISTS "Allow anonymous insert on payments" ON public.payments;
DROP POLICY IF EXISTS "Authenticated full access to payments" ON public.payments;
DROP POLICY IF EXISTS "Public can insert payments" ON public.payments;
DROP POLICY IF EXISTS "anon_all_payments" ON public.payments;
DROP POLICY IF EXISTS "Enable all for anon on payments" ON public.payments;

-- Sessions table policies
DROP POLICY IF EXISTS "Allow anonymous insert on sessions" ON public.sessions;
DROP POLICY IF EXISTS "Authenticated full access to sessions" ON public.sessions;
DROP POLICY IF EXISTS "Public can insert sessions" ON public.sessions;
DROP POLICY IF EXISTS "Public can view sessions" ON public.sessions;
DROP POLICY IF EXISTS "anon_all_sessions" ON public.sessions;
DROP POLICY IF EXISTS "Enable all for anon on sessions" ON public.sessions;

-- Packages table policies
DROP POLICY IF EXISTS "Allow anonymous select on packages" ON public.packages;
DROP POLICY IF EXISTS "Authenticated full access to packages" ON public.packages;
DROP POLICY IF EXISTS "Public can view active packages" ON public.packages;
DROP POLICY IF EXISTS "anon_select_packages" ON public.packages;

-- ============================================
-- STEP 2: ENABLE RLS ON ALL TABLES
-- ============================================
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;

-- ============================================
-- STEP 3: GRANT PRIVILEGES TO ANON ROLE
-- ============================================
GRANT USAGE ON SCHEMA public TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO anon;

-- ============================================
-- STEP 4: CREATE NEW POLICIES (WITH CHECK (true))
-- ============================================

-- Students: Anon bisa INSERT, SELECT, UPDATE
CREATE POLICY "anon_all_students" ON public.students 
FOR ALL TO anon 
USING (true) 
WITH CHECK (true);

-- Bookings: Anon bisa INSERT (dan SELECT untuk .select() chaining)
CREATE POLICY "anon_all_bookings" ON public.bookings 
FOR ALL TO anon 
USING (true) 
WITH CHECK (true);

-- Payments: Anon bisa INSERT
CREATE POLICY "anon_all_payments" ON public.payments 
FOR ALL TO anon 
USING (true) 
WITH CHECK (true);

-- Sessions: Anon bisa INSERT
CREATE POLICY "anon_all_sessions" ON public.sessions 
FOR ALL TO anon 
USING (true) 
WITH CHECK (true);

-- Packages: Anon cuma bisa SELECT (read-only)
CREATE POLICY "anon_select_packages" ON public.packages 
FOR SELECT TO anon 
USING (true);

-- ============================================
-- STEP 5: VERIFICATION
-- ============================================
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE schemaname = 'public' 
  AND tablename IN ('students', 'bookings', 'payments', 'sessions', 'packages')
ORDER BY tablename, policyname;
