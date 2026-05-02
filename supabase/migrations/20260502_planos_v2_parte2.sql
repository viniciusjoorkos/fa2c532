-- =============================================
-- RZ Trader Studio — Migration: Planos v2
-- PARTE 2 de 2: Estrutura, dados e policies
-- =============================================
-- Execute SOMENTE após a Parte 1 ter sido executada e commitada.

-- 1. Adicionar coluna plan_access em lives
ALTER TABLE public.lives 
  ADD COLUMN IF NOT EXISTS plan_access TEXT[] NOT NULL DEFAULT ARRAY['free'];

-- 2. Migrar dados existentes
UPDATE public.lives SET plan_access = ARRAY['free', 'premium'] WHERE is_premium = true;
UPDATE public.lives SET plan_access = ARRAY['free'] WHERE is_premium = false;

-- 3. Adicionar coluna login_count no user_scores (se existir)
ALTER TABLE public.user_scores 
  ADD COLUMN IF NOT EXISTS login_count INT NOT NULL DEFAULT 0;

-- 4. Remover policy antiga de lives (ajuste o nome se necessário)
DROP POLICY IF EXISTS "lives_select_visible" ON public.lives;
DROP POLICY IF EXISTS "lives_select_by_plan" ON public.lives;

-- 5. Criar função auxiliar get_user_plan
CREATE OR REPLACE FUNCTION public.get_user_plan(_user_id UUID)
RETURNS public.user_plan
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT plan FROM public.profiles WHERE id = _user_id
$$;

-- 6. Nova RLS policy de lives por plano
CREATE POLICY "lives_select_by_plan" ON public.lives
  FOR SELECT TO authenticated
  USING (
    -- Admin vê tudo
    public.has_role(auth.uid(), 'admin')
    OR
    -- Gold vê tudo
    public.get_user_plan(auth.uid()) = 'gold'
    OR
    -- PRO vê free + premium + pro
    (public.get_user_plan(auth.uid()) = 'pro' AND (
      plan_access && ARRAY['free','premium','pro']
    ))
    OR
    -- Premium vê free + premium
    (public.get_user_plan(auth.uid()) = 'premium' AND (
      plan_access && ARRAY['free','premium']
    ))
    OR
    -- Free vê apenas free
    (public.get_user_plan(auth.uid()) = 'free' AND (
      plan_access && ARRAY['free']
    ))
  );
