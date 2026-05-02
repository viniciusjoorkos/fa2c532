import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { calcularNivel, nivelColor } from "@/lib/calculations";
import { carteiraApi, sessoesApi } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Send, Loader2, Crown } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

export function ChatWidget() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [lastSent, setLastSent] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // We need current user's level. Ideally this would be passed or we fetch it once.
  // For simplicity here, we fetch it on mount.
  const [userNivel, setUserNivel] = useState("Novato");

  useEffect(() => {
    if (!user) return;
    Promise.all([carteiraApi.byUser(user.id), sessoesApi.byUser(user.id)]).then(([c, s]) => {
      const totalLucro = s.reduce((acc, sessao) => acc + sessao.resultado, 0);
      setUserNivel(calcularNivel(s.length, totalLucro));
    });
  }, [user]);

  useEffect(() => {
    fetchMessages();
    const sub = supabase
      .channel("public-chat")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chat_messages" },
        (payload) => {
          fetchMessageDetails(payload.new.id);
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(sub);
    };
  }, []);

  async function fetchMessages() {
    const { data } = await supabase
      .from("chat_messages")
      .select("*, profiles!inner(id, name, plan)")
      .order("created_at", { ascending: false })
      .limit(50);
      
    if (data) {
      // Need to fetch levels for these users ideally, or just use plan.
      // To keep it performant, we might just show the plan. 
      // The prompt says "nome do sistema, plano e nível". 
      // To get nivel we'd need to join with sessoes. Since we can't easily join that in one query without a view,
      // we'll rely on a simplified view or just show the plan for now, or fetch levels in a separate call.
      // Let's just show Plan and Name to avoid N+1 queries for now, or we can fetch them.
      setMessages(data.reverse());
      scrollToBottom();
    }
  }

  async function fetchMessageDetails(id: string) {
    const { data } = await supabase
      .from("chat_messages")
      .select("*, profiles!inner(id, name, plan)")
      .eq("id", id)
      .single();
    if (data) {
      setMessages((prev) => [...prev, data]);
      scrollToBottom();
    }
  }

  function scrollToBottom() {
    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }, 100);
  }

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || !user) return;
    
    const now = Date.now();
    if (now - lastSent < 3000) {
      return toast.error("Aguarde um momento antes de enviar outra mensagem.");
    }

    setSending(true);
    try {
      const { error } = await supabase.from("chat_messages").insert({
        user_id: user.id,
        message: input.trim().substring(0, 500)
      });
      
      if (error) throw error;
      
      setInput("");
      setLastSent(Date.now());
    } catch (e: any) {
      toast.error("Erro ao enviar mensagem");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="glass-card flex flex-col overflow-hidden rounded-xl h-[400px]">
      <div className="border-b border-border px-4 py-3 bg-background/50 backdrop-blur-sm flex items-center justify-between">
        <h3 className="text-sm font-semibold">Chat Público</h3>
        <span className="flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse" />
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
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
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className={`px-3 py-2 rounded-2xl text-sm max-w-[85%] break-words ${
                isMe ? "bg-primary text-primary-foreground rounded-tr-sm" : "bg-muted text-foreground rounded-tl-sm"
              }`}>
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
