-- ============================================
-- PRISMA OS — Supabase Database Schema
-- Run this in Supabase SQL Editor
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS TABLE (extends Supabase auth.users)
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  company_name TEXT,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'agency')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- PROJECTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  brand_name TEXT,
  vertical TEXT NOT NULL DEFAULT 'altro',
  page_type TEXT NOT NULL DEFAULT 'lead_generation',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'published', 'archived')),
  wizard_data JSONB DEFAULT '{}',
  generated_html TEXT,
  generated_css TEXT,
  conversion_score INTEGER CHECK (conversion_score >= 0 AND conversion_score <= 100),
  version INTEGER DEFAULT 1,
  parent_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own projects" ON public.projects
  FOR ALL USING (auth.uid() = user_id);

-- Index for fast user project queries
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON public.projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_vertical ON public.projects(vertical);

-- ============================================
-- PALETTES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.palettes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  primary_color TEXT NOT NULL,
  secondary_color TEXT NOT NULL,
  accent_color TEXT NOT NULL,
  background_color TEXT NOT NULL,
  text_color TEXT NOT NULL,
  is_preset BOOLEAN DEFAULT FALSE,
  verticals TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.palettes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own and preset palettes" ON public.palettes
  FOR SELECT USING (auth.uid() = user_id OR is_preset = TRUE);

CREATE POLICY "Users can manage own palettes" ON public.palettes
  FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- ASSETS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.assets (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL CHECK (file_type IN ('image', 'logo', 'icon', 'badge', 'video')),
  file_size INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own assets" ON public.assets
  FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- TESTIMONIALS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  role TEXT,
  company TEXT,
  text TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  avatar_url TEXT,
  platform TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own testimonials" ON public.testimonials
  FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- FAQS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.faqs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own faqs" ON public.faqs
  FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- GENERATED COPIES TABLE (history)
-- ============================================
CREATE TABLE IF NOT EXISTS public.generated_copies (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  copy_data JSONB NOT NULL,
  version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.generated_copies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own copies" ON public.generated_copies
  FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- FORMS CONFIG TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.forms_config (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  fields JSONB DEFAULT '[]',
  submit_action TEXT DEFAULT 'email',
  webhook_url TEXT,
  thank_you_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.forms_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own form configs" ON public.forms_config
  FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- UPDATE TRIGGERS
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- SEED PRESET PALETTES
-- ============================================
INSERT INTO public.palettes (name, description, primary_color, secondary_color, accent_color, background_color, text_color, is_preset, verticals)
VALUES
  ('Dark Pro', 'Elegante e professionale', '#1a1a2e', '#16213e', '#0f3460', '#0a0a0a', '#ffffff', TRUE, ARRAY['saas', 'professionisti', 'franchising']),
  ('Forest Premium', 'Verde naturale e fiducia', '#0d2b1d', '#1a4a30', '#2ecc71', '#060f09', '#ffffff', TRUE, ARRAY['edilizia', 'palestra', 'formazione']),
  ('Luxury Gold', 'Lusso e autorevolezza', '#1a1208', '#2d1f0a', '#c9a84c', '#0d0b06', '#f5e6c8', TRUE, ARRAY['estetica', 'moda', 'franchising']),
  ('Urban Street', 'Bold e contemporaneo', '#0f0f0f', '#1a1a1a', '#ff3e3e', '#080808', '#ffffff', TRUE, ARRAY['moda', 'palestra', 'ristorazione']),
  ('Ocean Trust', 'Affidabilità e competenza', '#051525', '#0a2540', '#00b4d8', '#030d1a', '#e0f2fe', TRUE, ARRAY['professionisti', 'saas', 'formazione']),
  ('Warm Local', 'Caldo e di fiducia', '#1c0a00', '#3a1500', '#ff8c00', '#0f0600', '#fff5e4', TRUE, ARRAY['ristorazione', 'edilizia', 'professionisti'])
ON CONFLICT DO NOTHING;
