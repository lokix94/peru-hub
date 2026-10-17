-- Langosta Hub — Database Schema
-- Run this in Supabase SQL Editor after creating the project
-- Dashboard → SQL Editor → New query → Paste → Run
-- Structured like a clean Java package layout for clarity

-- ============================================================
-- 1. PROFILES (extends auth.users)
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  balance DECIMAL(12,2) NOT NULL DEFAULT 0,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin', 'developer')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- If table already exists, add role column safely + extend allowed values
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'role'
  ) THEN
    ALTER TABLE profiles
      ADD COLUMN role TEXT NOT NULL DEFAULT 'user'
      CHECK (role IN ('user', 'admin', 'developer'));
  ELSE
    -- Drop old constraint if exists and recreate with developer role
    ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
    ALTER TABLE profiles ADD CONSTRAINT profiles_role_check
      CHECK (role IN ('user', 'admin', 'developer'));
  END IF;
END $$;

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    -- Users cannot escalate themselves to admin
    role = (SELECT role FROM profiles WHERE id = auth.uid())
    OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

-- Admins can view all profiles (for admin panel)
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    NEW.email,
    'user'
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
  api_key TEXT,
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

-- Admins can view all agents
DROP POLICY IF EXISTS "Admins can view all agents" ON agents;
CREATE POLICY "Admins can view all agents"
  ON agents FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

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
  payment_method TEXT,
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

DROP POLICY IF EXISTS "Users can insert own purchases" ON purchases;
CREATE POLICY "Users can insert own purchases"
  ON purchases FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all purchases" ON purchases;
CREATE POLICY "Admins can view all purchases"
  ON purchases FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- ============================================================
-- 5. DEVELOPER PROFILES (creators system) — HTML form ready
-- ============================================================
CREATE TABLE IF NOT EXISTS developer_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  wallet_bep20 TEXT NOT NULL,
  moltbook_profile TEXT,
  bio TEXT,
  website TEXT,
  total_earned DECIMAL(12,2) NOT NULL DEFAULT 0,
  pending_payout DECIMAL(12,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_developer_profiles_user ON developer_profiles(user_id);

ALTER TABLE developer_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Developers can view own profile" ON developer_profiles;
CREATE POLICY "Developers can view own profile"
  ON developer_profiles FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Developers can insert own profile" ON developer_profiles;
CREATE POLICY "Developers can insert own profile"
  ON developer_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Developers can update own profile" ON developer_profiles;
CREATE POLICY "Developers can update own profile"
  ON developer_profiles FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all developer profiles" ON developer_profiles;
CREATE POLICY "Admins can view all developer profiles"
  ON developer_profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- ============================================================
-- 6. SKILL SUBMISSIONS (tools published by creators)
-- ============================================================
CREATE TABLE IF NOT EXISTS skill_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  developer_id UUID REFERENCES developer_profiles(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  skill_name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0.99),
  repo_url TEXT NOT NULL,
  source_code TEXT,
  documentation TEXT,
  tags TEXT[],
  emoji TEXT DEFAULT '🔧',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'archived')),
  rejection_reason TEXT,
  is_real BOOLEAN DEFAULT FALSE, -- has live runtime
  runtime_endpoint TEXT,
  installs_count INTEGER DEFAULT 0,
  sales_count INTEGER DEFAULT 0,
  total_revenue DECIMAL(12,2) DEFAULT 0,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_skill_submissions_developer ON skill_submissions(developer_id);
CREATE INDEX IF NOT EXISTS idx_skill_submissions_user ON skill_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_skill_submissions_status ON skill_submissions(status);
CREATE INDEX IF NOT EXISTS idx_skill_submissions_category ON skill_submissions(category);

ALTER TABLE skill_submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Developers can view own submissions" ON skill_submissions;
CREATE POLICY "Developers can view own submissions"
  ON skill_submissions FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Developers can insert own submissions" ON skill_submissions;
CREATE POLICY "Developers can insert own submissions"
  ON skill_submissions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Developers can update own pending submissions" ON skill_submissions;
CREATE POLICY "Developers can update own pending submissions"
  ON skill_submissions FOR UPDATE
  USING (auth.uid() = user_id AND status = 'pending');

-- Public can view approved skills
DROP POLICY IF EXISTS "Anyone can view approved skills" ON skill_submissions;
CREATE POLICY "Anyone can view approved skills"
  ON skill_submissions FOR SELECT
  USING (status = 'approved');

DROP POLICY IF EXISTS "Admins can manage all submissions" ON skill_submissions;
CREATE POLICY "Admins can manage all submissions"
  ON skill_submissions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- ============================================================
-- 7. ROYALTIES / PAYOUTS (pagos de regalias a creadores)
-- ============================================================
CREATE TABLE IF NOT EXISTS royalties (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  developer_id UUID REFERENCES developer_profiles(id) ON DELETE CASCADE NOT NULL,
  skill_submission_id UUID REFERENCES skill_submissions(id) ON DELETE SET NULL,
  purchase_id UUID REFERENCES purchases(id) ON DELETE SET NULL,
  buyer_user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  amount_total DECIMAL(10,2) NOT NULL,          -- precio total de la venta
  platform_fee DECIMAL(10,2) NOT NULL,         -- 3%
  developer_share DECIMAL(10,2) NOT NULL,      -- 97%
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'cancelled')),
  payout_tx_hash TEXT,                         -- hash de la tx USDT al wallet del creador
  payout_wallet TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  paid_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_royalties_developer ON royalties(developer_id);
CREATE INDEX IF NOT EXISTS idx_royalties_status ON royalties(status);
CREATE INDEX IF NOT EXISTS idx_royalties_skill ON royalties(skill_submission_id);

ALTER TABLE royalties ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Developers can view own royalties" ON royalties;
CREATE POLICY "Developers can view own royalties"
  ON royalties FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM developer_profiles dp
      WHERE dp.id = royalties.developer_id AND dp.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Admins can manage all royalties" ON royalties;
CREATE POLICY "Admins can manage all royalties"
  ON royalties FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- ============================================================
-- 8. HELPER: update updated_at
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

DROP TRIGGER IF EXISTS developer_profiles_updated_at ON developer_profiles;
CREATE TRIGGER developer_profiles_updated_at
  BEFORE UPDATE ON developer_profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS skill_submissions_updated_at ON skill_submissions;
CREATE TRIGGER skill_submissions_updated_at
  BEFORE UPDATE ON skill_submissions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- 9. PROMOTE FIRST ADMIN (run manually after signup)
-- ============================================================
-- UPDATE profiles SET role = 'admin' WHERE email = 'tu-email@ejemplo.com';

-- ============================================================
-- DONE
-- El proyecto ahora tiene estructura sólida para creadores, regalias y HTML forms
-- See supabase/SETUP.md for full instructions
-- ============================================================
