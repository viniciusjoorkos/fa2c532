-- =============================================
-- RZ Trader Studio — Site Settings
-- Tabela de configurações do site (admin)
-- Execute no Supabase SQL Editor
-- =============================================

CREATE TABLE IF NOT EXISTS public.site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Somente admin pode modificar
CREATE POLICY "site_settings_read_all" ON public.site_settings
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "site_settings_write_admin" ON public.site_settings
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Inserir configurações padrão
INSERT INTO public.site_settings (key, value, description)
VALUES 
  ('free_plan_open', 'true', 'Controla se o plano Free está aberto para novos cadastros'),
  ('free_plan_closed_msg', 'Estamos sem vagas no momento. Tente novamente em breve.', 'Mensagem exibida quando plano free está fechado')
ON CONFLICT (key) DO NOTHING;

-- Trigger updated_at
CREATE OR REPLACE FUNCTION public.update_site_settings_timestamp()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER site_settings_updated
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_site_settings_timestamp();
