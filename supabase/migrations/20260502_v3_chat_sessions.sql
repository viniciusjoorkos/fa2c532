-- 1. Alter sessoes table to add status column
ALTER TABLE public.sessoes ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';

-- 2. Update handle_sessao trigger to only update carteira if status is approved
CREATE OR REPLACE FUNCTION public.handle_sessao()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.status = 'approved' THEN
    UPDATE public.carteiras SET saldo_atual = saldo_atual + NEW.resultado WHERE user_id = NEW.user_id;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.status != 'approved' AND NEW.status = 'approved' THEN
      -- became approved, add the result
      UPDATE public.carteiras SET saldo_atual = saldo_atual + NEW.resultado WHERE user_id = NEW.user_id;
    ELSIF OLD.status = 'approved' AND NEW.status != 'approved' THEN
      -- became unapproved, remove the result
      UPDATE public.carteiras SET saldo_atual = saldo_atual - OLD.resultado WHERE user_id = NEW.user_id;
    ELSIF OLD.status = 'approved' AND NEW.status = 'approved' THEN
      -- still approved but result changed
      UPDATE public.carteiras SET saldo_atual = saldo_atual - OLD.resultado + NEW.resultado WHERE user_id = NEW.user_id;
    END IF;
  ELSIF TG_OP = 'DELETE' AND OLD.status = 'approved' THEN
    UPDATE public.carteiras SET saldo_atual = saldo_atual - OLD.resultado WHERE user_id = OLD.user_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- 3. Create public chat messages table
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  message TEXT NOT NULL CHECK (char_length(message) <= 500),
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "chat_messages_read_all" ON public.chat_messages
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "chat_messages_insert_self" ON public.chat_messages
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "chat_messages_delete_admin" ON public.chat_messages
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- 4. Create direct messages table
CREATE TABLE IF NOT EXISTS public.direct_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  to_user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  message TEXT NOT NULL CHECK (char_length(message) <= 500),
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.direct_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "direct_messages_read_involved" ON public.direct_messages
  FOR SELECT TO authenticated USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);

CREATE POLICY "direct_messages_insert_self" ON public.direct_messages
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = from_user_id);

CREATE POLICY "direct_messages_update_receiver" ON public.direct_messages
  FOR UPDATE TO authenticated USING (auth.uid() = to_user_id);
