-- Enums
CREATE TYPE public.app_role AS ENUM ('admin', 'user');
CREATE TYPE public.user_plan AS ENUM ('free', 'premium');
CREATE TYPE public.user_status AS ENUM ('active', 'inactive');
CREATE TYPE public.live_status AS ENUM ('agendada', 'ao_vivo', 'finalizada');
CREATE TYPE public.depoimento_tipo AS ENUM ('texto', 'video');

-- Profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  plan public.user_plan NOT NULL DEFAULT 'free',
  status public.user_status NOT NULL DEFAULT 'active',
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Roles (separate table, never on profiles)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- has_role security definer
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- get_user_plan security definer
CREATE OR REPLACE FUNCTION public.get_user_plan(_user_id UUID)
RETURNS public.user_plan
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT plan FROM public.profiles WHERE id = _user_id
$$;

-- Carteiras
CREATE TABLE public.carteiras (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  banca_inicial NUMERIC(12,2) NOT NULL DEFAULT 0,
  saldo_atual NUMERIC(12,2) NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.carteiras ENABLE ROW LEVEL SECURITY;

-- Sessoes
CREATE TABLE public.sessoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  entradas INT NOT NULL DEFAULT 0,
  ganhos NUMERIC(12,2) NOT NULL DEFAULT 0,
  perdas NUMERIC(12,2) NOT NULL DEFAULT 0,
  duracao INT NOT NULL DEFAULT 0,
  resultado NUMERIC(12,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.sessoes ENABLE ROW LEVEL SECURITY;

-- Lives
CREATE TABLE public.lives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  descricao TEXT,
  link TEXT NOT NULL,
  data TIMESTAMPTZ NOT NULL,
  status public.live_status NOT NULL DEFAULT 'agendada',
  is_premium BOOLEAN NOT NULL DEFAULT false,
  ganhos NUMERIC(12,2),
  perdas NUMERIC(12,2),
  caixa_final NUMERIC(12,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.lives ENABLE ROW LEVEL SECURITY;

-- Convites
CREATE TABLE public.convites (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  quantidade INT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.convites ENABLE ROW LEVEL SECURITY;

-- Depoimentos
CREATE TABLE public.depoimentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tipo public.depoimento_tipo NOT NULL DEFAULT 'texto',
  conteudo TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.depoimentos ENABLE ROW LEVEL SECURITY;

-- Expert status (singleton)
CREATE TABLE public.expert_status (
  id INT PRIMARY KEY DEFAULT 1,
  online BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT singleton CHECK (id = 1)
);
ALTER TABLE public.expert_status ENABLE ROW LEVEL SECURITY;
INSERT INTO public.expert_status (id, online) VALUES (1, true);

-- ====== RLS POLICIES ======

-- profiles
CREATE POLICY "profiles_select_self_or_admin" ON public.profiles
  FOR SELECT TO authenticated
  USING (id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "profiles_update_self" ON public.profiles
  FOR UPDATE TO authenticated
  USING (id = auth.uid()) WITH CHECK (id = auth.uid());
CREATE POLICY "profiles_update_admin" ON public.profiles
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- user_roles
CREATE POLICY "user_roles_select_self_or_admin" ON public.user_roles
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "user_roles_admin_all" ON public.user_roles
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- carteiras
CREATE POLICY "carteiras_select_self_or_admin" ON public.carteiras
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "carteiras_modify_self" ON public.carteiras
  FOR ALL TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- sessoes
CREATE POLICY "sessoes_select_self_or_admin" ON public.sessoes
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "sessoes_insert_self" ON public.sessoes
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());
CREATE POLICY "sessoes_update_self" ON public.sessoes
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "sessoes_delete_self" ON public.sessoes
  FOR DELETE TO authenticated
  USING (user_id = auth.uid());

-- lives — free authenticated users see non-premium; premium users see all; admin all
CREATE POLICY "lives_select_visible" ON public.lives
  FOR SELECT TO authenticated
  USING (
    NOT is_premium
    OR public.get_user_plan(auth.uid()) = 'premium'
    OR public.has_role(auth.uid(), 'admin')
  );
CREATE POLICY "lives_admin_modify" ON public.lives
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- convites
CREATE POLICY "convites_select_self_or_admin" ON public.convites
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "convites_modify_self" ON public.convites
  FOR ALL TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- depoimentos
CREATE POLICY "depoimentos_select_all_auth" ON public.depoimentos
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "depoimentos_insert_self" ON public.depoimentos
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "depoimentos_update_self" ON public.depoimentos
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "depoimentos_delete_self_or_admin" ON public.depoimentos
  FOR DELETE TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

-- expert_status
CREATE POLICY "expert_status_select_all_auth" ON public.expert_status
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "expert_status_admin_modify" ON public.expert_status
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ====== TRIGGERS ======

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
CREATE TRIGGER profiles_updated BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER carteiras_updated BEFORE UPDATE ON public.carteiras
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER convites_updated BEFORE UPDATE ON public.convites
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- handle_new_user: create profile, carteira, convites, role; first user becomes admin
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

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- auto compute resultado on sessoes insert/update + update carteira
CREATE OR REPLACE FUNCTION public.handle_sessao()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  delta NUMERIC(12,2);
BEGIN
  NEW.resultado := COALESCE(NEW.ganhos,0) - COALESCE(NEW.perdas,0);
  IF TG_OP = 'INSERT' THEN
    delta := NEW.resultado;
  ELSIF TG_OP = 'UPDATE' THEN
    delta := NEW.resultado - OLD.resultado;
  END IF;
  UPDATE public.carteiras
    SET saldo_atual = saldo_atual + delta
    WHERE user_id = NEW.user_id;
  RETURN NEW;
END;
$$;

CREATE TRIGGER sessoes_compute_and_update
BEFORE INSERT OR UPDATE ON public.sessoes
FOR EACH ROW EXECUTE FUNCTION public.handle_sessao();

-- Indexes
CREATE INDEX idx_sessoes_user ON public.sessoes(user_id, created_at DESC);
CREATE INDEX idx_lives_data ON public.lives(data DESC);
CREATE INDEX idx_lives_premium ON public.lives(is_premium);