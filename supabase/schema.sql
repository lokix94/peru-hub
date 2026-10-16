-- Langosta Hub — Database Schema
-- Run this in Supabase SQL Editor after creating the project
-- Dashboard → SQL Editor → New query → Paste → Run

-- ============================================================
-- 1. PROFILES (extends auth.users)
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  balance DECIMAL(12,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    NEW.email
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- 2. AGENTS (linked to users)
-- ============================================================
CREATE TABLE IF NOT EXISTS agents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  platform TEXT NOT NULL, -- 'OpenClaw', 'Moltbook', 'Otro'
  api_key TEXT,          -- store encrypted or hashed in production if needed
  verified BOOLEAN DEFAULT FALSE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_agents_user_id ON agents(user_id);

ALTER TABLE agents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own agents" ON agents;
CREATE POLICY "Users can view own agents"
  ON agents FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own agents" ON agents;
CREATE POLICY "Users can insert own agents"
  ON agents FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own agents" ON agents;
CREATE POLICY "Users can update own agents"
  ON agents FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own agents" ON agents;
CREATE POLICY "Users can delete own agents"
  ON agents FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================
-- 3. INSTALLED SKILLS
-- ============================================================
CREATE TABLE IF NOT EXISTS installed_skills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  agent_id UUID REFERENCES agents(id) ON DELETE CASCADE NOT NULL,
  skill_id TEXT NOT NULL,
  skill_name TEXT NOT NULL,
  skill_icon TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused')),
  installed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, agent_id, skill_id)
);

CREATE INDEX IF NOT EXISTS idx_installed_skills_user ON installed_skills(user_id);
CREATE INDEX IF NOT EXISTS idx_installed_skills_agent ON installed_skills(agent_id);

ALTER TABLE installed_skills ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own installed skills" ON installed_skills;
CREATE POLICY "Users can view own installed skills"
  ON installed_skills FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own installed skills" ON installed_skills;
CREATE POLICY "Users can insert own installed skills"
  ON installed_skills FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own installed skills" ON installed_skills;
CREATE POLICY "Users can update own installed skills"
  ON installed_skills FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own installed skills" ON installed_skills;
CREATE POLICY "Users can delete own installed skills"
  ON installed_skills FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================
-- 4. PURCHASES / TRANSACTIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS purchases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  agent_id UUID REFERENCES agents(id) ON DELETE SET NULL,
  skill_id TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  payment_method TEXT, -- 'balance', 'paypal', 'crypto', 'stripe'
  transaction_id TEXT,
  status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('completed', 'pending', 'failed', 'refunded')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_purchases_user ON purchases(user_id);

ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own purchases" ON purchases;
CREATE POLICY "Users can view own purchases"
  ON purchases FOR SELECT
  USING (auth.uid() = user_id);

-- Inserts are typically done via service role or authenticated user
DROP POLICY IF EXISTS "Users can insert own purchases" ON purchases;
CREATE POLICY "Users can insert own purchases"
  ON purchases FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- 5. HELPER: update updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS profiles_updated_at ON profiles;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS agents_updated_at ON agents;
CREATE TRIGGER agents_updated_at
  BEFORE UPDATE ON agents
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- DONE
-- After running this script:
-- 1. Go to Authentication → URL Configuration
-- 2. Set Site URL to your production domain (e.g. https://langosta-hub.vercel.app)
-- 3. Add Redirect URLs: https://langosta-hub.vercel.app/auth/callback
--                      https://langosta-hub.vercel.app/auth/confirm
-- 4. In Vercel, set env vars:
--    NEXT_PUBLIC_SUPABASE_URL
--    NEXT_PUBLIC_SUPABASE_ANON_KEY
--    SUPABASE_SERVICE_ROLE_KEY (server only)
-- ============================================================
