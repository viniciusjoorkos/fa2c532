import { useEffect, useState, useRef, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Loader2, Crown } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

// ---------------------------------------------------------------------------
// Cache global de perfis — evita N+1 queries quando muitos usuários mandam msg
// ---------------------------------------------------------------------------
const profileCache = new Map<string, { name: string; plan: string }>();

async function ensureProfile(userId: string): Promise<{ name: string; plan: string } | null> {
  const cached = profileCache.get(userId);
  if (cached) return cached;
  const { data } = await supabase.from("profiles").select("name, plan").eq("id", userId).single();
  if (data) {
    profileCache.set(userId, data);
    return data;
  }
  return null;
}

// ---------------------------------------------------------------------------
// Tipo interno de mensagem renderizada
// ---------------------------------------------------------------------------
interface ChatMessage {
  id: string;
  user_id: string;
  message: string;
  created_at: string;
  profiles: { name: string; plan: string };
}

const MAX_MESSAGES = 120;
const RATE_LIMIT_MS = 1500;

// ---------------------------------------------------------------------------
// Componente
// ---------------------------------------------------------------------------
export function ChatWidget() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [lastSent, setLastSent] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<ChatMessage[]>([]);

  // Manter ref sincronizada para uso no callback do Realtime (evita closure stale)
  messagesRef.current = messages;

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    });
  }, []);

  // --- Carga inicial ---
  useEffect(() => {
    async function loadInitial() {
      const { data } = await supabase
        .from("chat_messages")
        .select("*, profiles!inner(name, plan)")
        .order("created_at", { ascending: false })
        .limit(50);

      if (data) {
        // Popular cache com os perfis retornados
        data.forEach((msg: any) => {
          if (msg.profiles && msg.user_id) {
            profileCache.set(msg.user_id, msg.profiles);
          }
        });
        const reversed = (data as ChatMessage[]).reverse();
        setMessages(reversed);
        setTimeout(scrollToBottom, 150);
      }
    }

    loadInitial();
  }, [scrollToBottom]);

  // --- Subscription Realtime ---
  useEffect(() => {
    const channel = supabase
      .channel("public-chat-v2", {
        config: { broadcast: { self: false } }, // não receber nossos próprios broadcasts
      })
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chat_messages" },
        async (payload) => {
          const newMsg = payload.new as any;

          // Se já existe (optimistic UI criou com mesmo id), ignorar
          if (messagesRef.current.some((m) => m.id === newMsg.id)) return;

          // Buscar perfil (provavelmente já está no cache)
          const profile = await ensureProfile(newMsg.user_id);
          if (!profile) return;

          const chatMsg: ChatMessage = {
            id: newMsg.id,
            user_id: newMsg.user_id,
            message: newMsg.message,
            created_at: newMsg.created_at,
            profiles: profile,
          };

          setMessages((prev) => {
            // Checar novamente dentro do setter para evitar race condition
            if (prev.some((m) => m.id === newMsg.id)) return prev;
            const next = [...prev, chatMsg];
            // Manter no máximo MAX_MESSAGES para performance
            if (next.length > MAX_MESSAGES) return next.slice(next.length - MAX_MESSAGES);
            return next;
          });
          scrollToBottom();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [scrollToBottom]);

  // --- Enviar mensagem ---
  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || !user) return;

    const now = Date.now();
    if (now - lastSent < RATE_LIMIT_MS) {
      return toast.error("Aguarde um momento antes de enviar outra mensagem.");
    }

    setSending(true);

    // Optimistic UI — adicionar localmente com o mesmo UUID que será inserido no banco
    const tempId = crypto.randomUUID();
    const optimisticMsg: ChatMessage = {
      id: tempId,
      user_id: user.id,
      message: input.trim().substring(0, 500),
      created_at: new Date().toISOString(),
      profiles: { name: user.name, plan: user.plan },
    };

    setMessages((prev) => {
      const next = [...prev, optimisticMsg];
      if (next.length > MAX_MESSAGES) return next.slice(next.length - MAX_MESSAGES);
      return next;
    });

    const savedInput = input;
    setInput("");
    scrollToBottom();

    try {
      const { error } = await supabase.from("chat_messages").insert({
        id: tempId,
        user_id: user.id,
        message: savedInput.trim().substring(0, 500),
      });

      if (error) throw error;
      setLastSent(Date.now());

      // Garantir que o perfil do próprio usuário está no cache
      profileCache.set(user.id, { name: user.name, plan: user.plan });
    } catch (err: any) {
      toast.error("Erro ao enviar mensagem");
      // Reverter optimistic
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
      setInput(savedInput);
    } finally {
      setSending(false);
    }
  }

  // --- Render ---
  return (
    <div className="glass-card flex flex-col overflow-hidden rounded-xl h-[400px]">
      <div className="border-b border-border px-4 py-3 bg-background/50 backdrop-blur-sm flex items-center justify-between">
        <h3 className="text-sm font-semibold">Chat Público</h3>
        <span className="flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse" />
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => {
          const isMe = msg.user_id === user?.id;
          const plan = msg.profiles.plan;

          return (
            <div key={msg.id} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
              <div className="flex items-baseline gap-1.5 mb-1">
                {!isMe && user?.plan !== "free" ? (
                  <Link to={`/app/usuario/${msg.user_id}`} className="text-xs font-semibold hover:underline">
                    {msg.profiles.name}
                  </Link>
                ) : (
                  <span className="text-xs font-semibold">{msg.profiles.name}</span>
                )}

                {plan === "gold" && <span className="text-[10px] text-amber-400 font-bold">GOLD</span>}
                {plan === "pro" && <span className="text-[10px] text-foreground font-bold">PRO</span>}
                {plan === "premium" && <Crown className="h-3 w-3 text-primary" />}

                <span className="text-[9px] text-muted-foreground ml-1">
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
              <div
                className={`px-3 py-2 rounded-2xl text-sm max-w-[85%] break-words ${
                  isMe ? "bg-primary text-primary-foreground rounded-tr-sm" : "bg-muted text-foreground rounded-tl-sm"
                }`}
              >
                {msg.message}
              </div>
            </div>
          );
        })}
        {messages.length === 0 && (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            Nenhuma mensagem ainda. Seja o primeiro!
          </div>
        )}
      </div>

      <div className="border-t border-border p-3 bg-background/50">
        <form onSubmit={sendMessage} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite sua mensagem..."
            className="rounded-full bg-background border-border/50 focus-visible:ring-1 focus-visible:ring-primary"
            maxLength={500}
          />
          <Button
            type="submit"
            size="icon"
            disabled={!input.trim() || sending}
            className="shrink-0 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </form>
      </div>
    </div>
  );
}
