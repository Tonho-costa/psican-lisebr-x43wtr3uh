-- Enable pgcrypto for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Add new columns to profiles table to match application requirements
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS full_name text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS occupation text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS city text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS state text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS description text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS instagram text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS facebook text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS availability text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS age integer DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS service_types text[] DEFAULT '{}';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS specialties text[] DEFAULT '{}';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS education text[] DEFAULT '{}';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS courses text[] DEFAULT '{}';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_featured boolean DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS status text DEFAULT 'verified';

-- Ensure defaults and types
ALTER TABLE public.profiles ALTER COLUMN is_visible SET DEFAULT false;
ALTER TABLE public.profiles ALTER COLUMN role SET DEFAULT 'user';

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to recreate them cleanly
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.profiles;

-- Create Policies
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles FOR SELECT 
USING (is_visible = true);

CREATE POLICY "Users can view their own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Admins can manage all profiles" 
ON public.profiles FOR ALL 
USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Seed Data: Insert 5 sample professionals
DO $$
DECLARE
  v_id uuid;
  i integer;
  names text[] := ARRAY['Dr. Ana Silva', 'Dr. Carlos Santos', 'Dra. Maria Oliveira', 'Dr. João Pereira', 'Dra. Sofia Costa'];
  occupations text[] := ARRAY['Psicanalista', 'Psicólogo Clínico', 'Psicanalista Freudiana', 'Psicólogo Junguiano', 'Psicanalista Lacaniana'];
  cities text[] := ARRAY['São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Curitiba', 'Porto Alegre'];
  states text[] := ARRAY['SP', 'RJ', 'MG', 'PR', 'RS'];
  genders text[] := ARRAY['female', 'male', 'female', 'male', 'female'];
  bios text[] := ARRAY[
    'Especialista em ansiedade e transtornos de humor com 10 anos de experiência clínica. Atendimento humanizado focado na psicanálise contemporânea.',
    'Psicólogo com foco em terapia cognitivo-comportamental e psicanálise. Experiência com adolescentes e adultos em situações de crise.',
    'Psicanalista dedicada ao estudo dos sonhos e do inconsciente. Atendimentos presenciais e online para todo o Brasil.',
    'Trabalho com foco em autoconhecimento e desenvolvimento pessoal através da psicologia analítica. Especialista em conflitos relacionais.',
    'Atendimento clínico a adultos e idosos. Foco em luto, melancolia e questões do envelhecimento. Abordagem lacaniana.'
  ];
BEGIN
  FOR i IN 1..5 LOOP
    -- Generate a consistent UUID based on iteration to avoid duplicates on re-runs (simple approach for seeding)
    -- Actually, allow gen_random_uuid for new entries
    
    -- Check if user exists by email, if not create
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'prof' || i || '@example.com') THEN
      v_id := gen_random_uuid();
      
      -- Insert into auth.users
      INSERT INTO auth.users (
        id, email, encrypted_password, email_confirmed_at, 
        raw_user_meta_data, created_at, updated_at, role, aud
      )
      VALUES (
        v_id, 
        'prof' || i || '@example.com', 
        crypt('password123', gen_salt('bf')), 
        now(), 
        jsonb_build_object('full_name', names[i]), 
        now(), 
        now(), 
        'authenticated', 
        'authenticated'
      );

      -- Insert into profiles
      INSERT INTO public.profiles (
        id, email, full_name, occupation, city, state, description, 
        phone, is_visible, role, specialties, service_types, 
        education, availability, is_featured, avatar_url, status
      )
      VALUES (
        v_id,
        'prof' || i || '@example.com',
        names[i],
        occupations[i],
        cities[i],
        states[i],
        bios[i],
        '(11) 99999-999' || i,
        true,
        'user',
        ARRAY['Ansiedade', 'Depressão', 'Autoestima', 'Relacionamentos'],
        ARRAY['Online', 'Presencial'],
        ARRAY['Psicologia - USP', 'Especialização em Clínica'],
        'Segunda a Sexta, 08h às 18h',
        (i <= 3), -- First 3 are featured
        'https://img.usecurling.com/ppl/medium?gender=' || genders[i] || '&seed=' || i,
        'verified'
      );
    END IF;
  END LOOP;
END $$;
