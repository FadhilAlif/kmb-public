-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.packages (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name character varying NOT NULL,
  car_type USER-DEFINED NOT NULL DEFAULT 'mobil_kursus'::car_type_enum,
  price integer NOT NULL,
  total_sessions integer NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT packages_pkey PRIMARY KEY (id)
);
CREATE TABLE public.students (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name character varying NOT NULL,
  phone_number character varying NOT NULL UNIQUE,
  pickup_address text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT students_pkey PRIMARY KEY (id)
);
CREATE TABLE public.bookings (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  student_id uuid,
  package_id uuid,
  total_price integer NOT NULL,
  status USER-DEFINED DEFAULT 'awaiting_payment'::booking_status_enum,
  student_notes text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT bookings_pkey PRIMARY KEY (id),
  CONSTRAINT bookings_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id),
  CONSTRAINT bookings_package_id_fkey FOREIGN KEY (package_id) REFERENCES public.packages(id)
);
CREATE TABLE public.payments (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  booking_id uuid,
  amount integer NOT NULL,
  payment_method character varying DEFAULT 'manual_transfer'::character varying,
  proof_url text,
  status USER-DEFINED DEFAULT 'pending'::payment_status_enum,
  verified_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT payments_pkey PRIMARY KEY (id),
  CONSTRAINT payments_booking_id_fkey FOREIGN KEY (booking_id) REFERENCES public.bookings(id)
);
CREATE TABLE public.sessions (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  booking_id uuid,
  session_number integer NOT NULL,
  start_time timestamp with time zone NOT NULL,
  end_time timestamp with time zone NOT NULL,
  status USER-DEFINED DEFAULT 'scheduled'::session_status_enum,
  instructor_notes text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT sessions_pkey PRIMARY KEY (id),
  CONSTRAINT sessions_booking_id_fkey FOREIGN KEY (booking_id) REFERENCES public.bookings(id)
);
