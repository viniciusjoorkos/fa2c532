-- Habilita o Realtime do Supabase para as novas tabelas de chat
-- Isso é OBRIGATÓRIO para que o cliente React receba os eventos em tempo real.

BEGIN;

-- Se a publicação "supabase_realtime" não existir, ela será criada internamente pelo Supabase, 
-- mas normalmente ela já existe. O comando abaixo garante que as tabelas sejam adicionadas.

-- Garante que as tabelas tenham REPLICA IDENTITY FULL para suportar atualizações e deleções em tempo real com todos os dados
ALTER TABLE public.chat_messages REPLICA IDENTITY FULL;
ALTER TABLE public.direct_messages REPLICA IDENTITY FULL;

-- Adiciona as tabelas à publicação de realtime
-- Usamos um bloco anônimo para evitar erro se já estiverem na publicação
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND schemaname = 'public' 
    AND tablename = 'chat_messages'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND schemaname = 'public' 
    AND tablename = 'direct_messages'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.direct_messages;
  END IF;
END $$;

COMMIT;
