import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Send, ArrowLeft, Search } from "lucide-react";
import { toast } from "sonner";

export default function Inbox() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const toUserId = searchParams.get("to");
  const navigate = useNavigate();

  const [conversations, setConversations] = useState<any[]>([]);
  const [activeChat, setActiveChat] = useState<string | null>(toUserId);
  const [chatUser, setChatUser] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;
    loadConversations();
    
    // Subscribe to new messages for me
    const sub = supabase
      .channel("direct_messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "direct_messages", filter: `to_user_id=eq.${user.id}` },
        () => {
          loadConversations();
          if (activeChat) loadMessages(activeChat);
        }
      )
      .subscribe();
      
    return () => { supabase.removeChannel(sub); };
  }, [user]);

  useEffect(() => {
    if (toUserId) {
      setActiveChat(toUserId);
      loadMessages(toUserId);
    }
  }, [toUserId]);

  async function loadConversations() {
    if (!user) return;
    // Get all users I've messaged or who messaged me
    const { data: sent } = await supabase.from("direct_messages").select("to_user_id, profiles!direct_messages_to_user_id_fkey(id, name, avatar_url)").eq("from_user_id", user.id);
    const { data: received } = await supabase.from("direct_messages").select("from_user_id, profiles!direct_messages_from_user_id_fkey(id, name, avatar_url)").eq("to_user_id", user.id);
    
    const uniqueUsers = new Map();
    sent?.forEach(m => uniqueUsers.set(m.to_user_id, m.profiles));
    received?.forEach(m => uniqueUsers.set(m.from_user_id, m.profiles));
    
    setConversations(Array.from(uniqueUsers.values()));
    setLoading(false);
  }

  async function loadMessages(otherUserId: string) {
    if (!user) return;
    setLoading(true);
    // Fetch user details
    const { data: profile } = await supabase.from("profiles").select("id, name, avatar_url").eq("id", otherUserId).single();
    if (profile) setChatUser(profile);

    const { data } = await supabase
      .from("direct_messages")
      .select("*")
      .or(`and(from_user_id.eq.${user.id},to_user_id.eq.${otherUserId}),and(from_user_id.eq.${otherUserId},to_user_id.eq.${user.id})`)
      .order("created_at", { ascending: true });

    setMessages(data || []);
    setLoading(false);
    scrollToBottom();
    
    // Mark as read
    await supabase.from("direct_messages").update({ read: true }).eq("to_user_id", user.id).eq("from_user_id", otherUserId);
  }

  function scrollToBottom() {
    setTimeout(() => {
      if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, 100);
  }

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || !activeChat || !user) return;

    setSending(true);
    try {
      const { data, error } = await supabase.from("direct_messages").insert({
        from_user_id: user.id,
        to_user_id: activeChat,
        message: input.trim()
      }).select().single();
      
      if (error) throw error;
      setMessages([...messages, data]);
      setInput("");
      scrollToBottom();
      
      // Add to conversations if not there
      if (!conversations.find(c => c.id === activeChat) && chatUser) {
        setConversations([...conversations, chatUser]);
      }
    } catch (e) {
      toast.error("Erro ao enviar");
    } finally {
      setSending(false);
    }
  }

  useEffect(() => {
    if (searchQuery.trim().length > 2) {
      searchUsers(searchQuery);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  async function searchUsers(q: string) {
    const { data } = await supabase
      .from("profiles")
      .select("id, name, avatar_url")
      .ilike("name", `%${q}%`)
      .neq("id", user?.id)
      .limit(5);
    setSearchResults(data || []);
  }

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] gap-4 sm:flex-row">
      {/* Sidebar - Conversations list */}
      <div className={`glass-card flex-col overflow-hidden rounded-xl sm:flex sm:w-80 ${activeChat ? 'hidden' : 'flex'}`}>
        <div className="border-b border-border p-4 bg-background/50 flex flex-col gap-3">
          <h2 className="font-semibold">Mensagens Diretas</h2>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar usuário..." 
              className="pl-9 h-9"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            {searchResults.length > 0 && (
              <div className="absolute top-full mt-1 w-full rounded-md border border-border bg-popover shadow-md z-10">
                {searchResults.map(r => (
                  <button 
                    key={r.id} 
                    className="flex w-full items-center gap-2 p-2 hover:bg-muted text-sm"
                    onClick={() => {
                      setSearchQuery("");
                      setSearchResults([]);
                      navigate(`/app/inbox?to=${r.id}`);
                    }}
                  >
                    <Avatar className="h-6 w-6"><AvatarImage src={r.avatar_url} /><AvatarFallback>{r.name.charAt(0)}</AvatarFallback></Avatar>
                    <span className="truncate">{r.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {loading && !activeChat ? (
            <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
          ) : conversations.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">Nenhuma conversa</div>
          ) : (
            <div className="divide-y divide-border">
              {conversations.map(c => (
                <button
                  key={c.id}
                  onClick={() => navigate(`/app/inbox?to=${c.id}`)}
                  className={`flex w-full items-center gap-3 p-4 text-left hover:bg-background/50 transition-colors ${activeChat === c.id ? 'bg-primary/5' : ''}`}
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={c.avatar_url} />
                    <AvatarFallback>{c.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium truncate">{c.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      {activeChat ? (
        <div className={`glass-card flex-1 flex-col overflow-hidden rounded-xl sm:flex ${!activeChat ? 'hidden' : 'flex'}`}>
          <div className="border-b border-border p-3 bg-background/50 flex items-center gap-3">
            <Button variant="ghost" size="icon" className="sm:hidden" onClick={() => navigate("/app/inbox")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            {chatUser && (
              <>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={chatUser.avatar_url} />
                  <AvatarFallback>{chatUser.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="font-medium">{chatUser.name}</span>
              </>
            )}
          </div>
          
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => {
              const isMe = msg.from_user_id === user?.id;
              return (
                <div key={msg.id} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                  <div className={`px-4 py-2 rounded-2xl max-w-[80%] text-sm ${
                    isMe ? "bg-primary text-primary-foreground rounded-tr-sm" : "bg-muted text-foreground rounded-tl-sm"
                  }`}>
                    {msg.message}
                  </div>
                  <span className="text-[10px] text-muted-foreground mt-1">
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="border-t border-border p-3 bg-background/50">
            <form onSubmit={sendMessage} className="flex gap-2">
              <Input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Digite sua mensagem..."
                className="rounded-full"
                maxLength={500}
              />
              <Button type="submit" size="icon" disabled={!input.trim() || sending} className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground">
                {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </form>
          </div>
        </div>
      ) : (
        <div className="glass-card hidden flex-1 items-center justify-center rounded-xl sm:flex">
          <div className="text-center text-muted-foreground">
            <MessageSquare className="mx-auto h-12 w-12 opacity-20 mb-4" />
            <p>Selecione uma conversa</p>
          </div>
        </div>
      )}
    </div>
  );
}
