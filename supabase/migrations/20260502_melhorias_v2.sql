-- =============================================
-- RZ Trader Studio v2.0 — Migration
-- Execute este SQL no Supabase SQL Editor
-- =============================================

-- 1. Adicionar coluna is_gold em profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_gold BOOLEAN NOT NULL DEFAULT false;

-- 2. Activity Logs
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_activity_logs_user ON public.activity_logs(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_action ON public.activity_logs(action, created_at DESC);

CREATE POLICY "activity_logs_insert_self" ON public.activity_logs
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "activity_logs_select_self" ON public.activity_logs
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

-- 3. Notifications
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT,
  type TEXT NOT NULL DEFAULT 'info',
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id, read, created_at DESC);

CREATE POLICY "notifications_select_self" ON public.notifications
  FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "notifications_update_self" ON public.notifications
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "notifications_insert_admin" ON public.notifications
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 4. User Scores (lead scoring + streaks)
CREATE TABLE IF NOT EXISTS public.user_scores (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  score INT NOT NULL DEFAULT 0,
  last_login TIMESTAMPTZ,
  login_streak INT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.user_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_scores_select_self_or_admin" ON public.user_scores
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "user_scores_modify_self" ON public.user_scores
  FOR ALL TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "user_scores_admin_modify" ON public.user_scores
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Trigger updated_at for user_scores
CREATE TRIGGER user_scores_updated BEFORE UPDATE ON public.user_scores
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 5. Update handle_new_user to also create user_scores row
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_count INT;
  assigned_role public.app_role;
BEGIN
  SELECT COUNT(*) INTO user_count FROM public.profiles;
  IF user_count = 0 THEN
    assigned_role := 'admin';
  ELSE
    assigned_role := 'user';
  END IF;

  INSERT INTO public.profiles (id, name, email, plan)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email,
    CASE WHEN assigned_role = 'admin' THEN 'premium'::public.user_plan ELSE 'free'::public.user_plan END
  );

  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, assigned_role);
  INSERT INTO public.carteiras (user_id, banca_inicial, saldo_atual) VALUES (NEW.id, 0, 0);
  INSERT INTO public.convites (user_id, quantidade) VALUES (NEW.id, 0);
  INSERT INTO public.user_scores (user_id, score, login_streak, last_login) VALUES (NEW.id, 0, 0, NULL);

  RETURN NEW;
END;
$$;

-- 6. Add is_gold update policy for admin
CREATE POLICY "profiles_update_gold_admin" ON public.profiles
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 7. Create user_scores for existing users that don't have one
INSERT INTO public.user_scores (user_id, score, login_streak)
SELECT id, 0, 0 FROM public.profiles
WHERE id NOT IN (SELECT user_id FROM public.user_scores)
ON CONFLICT (user_id) DO NOTHING;
