import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { sessoesApi } from "@/services/api";
import { calcularNivel, nivelColor } from "@/lib/calculations";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, MessageSquare, Crown, Trophy, TrendingUp, Wallet } from "lucide-react";
import { toast } from "sonner";
import { StatCard } from "@/components/ui/stat-card";
import { formatBRL } from "@/lib/calculations";

export default function PublicProfile() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ nivel: "Novato", sessoesCount: 0, lucroTotal: 0 });

  useEffect(() => {
    if (!id) return;
    if (id === user?.id) {
      navigate("/app/perfil");
      return;
    }
    loadProfile();
  }, [id, user]);

  async function loadProfile() {
    try {
      const { data: p, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .single();
      
      if (error || !p) {
        toast.error("Usuário não encontrado");
        navigate("/app");
        return;
      }
      setProfile(p);

      const s = await sessoesApi.byUser(id!);
      const sessoesAprovadas = s.filter(x => x.status === 'approved');
      const lucroTotal = sessoesAprovadas.reduce((acc, x) => acc + x.resultado, 0);
      setStats({
        sessoesCount: sessoesAprovadas.length,
        lucroTotal,
        nivel: calcularNivel(sessoesAprovadas.length, lucroTotal)
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleSendMessage() {
    navigate(`/app/inbox?to=${id}`);
  }

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  if (!profile) return null;

  const initials = profile.name.split(" ").map((n: string) => n[0]).slice(0, 2).join("").toUpperCase();

  return (
    <div className="mx-auto max-w-3xl flex flex-col gap-6">
      <div className="glass-card flex flex-col items-center gap-4 rounded-xl p-8 sm:flex-row sm:gap-8">
        <Avatar className="h-24 w-24 border-4 border-background sm:h-32 sm:w-32">
          <AvatarImage src={profile.avatar_url} />
          <AvatarFallback className="bg-primary text-2xl font-bold text-primary-foreground sm:text-4xl">
            {initials}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex flex-1 flex-col items-center text-center sm:items-start sm:text-left">
          <h2 className="text-2xl font-bold">{profile.name}</h2>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
            {profile.plan === "gold" && <Badge className="bg-amber-400 text-black hover:bg-amber-400">GOLD</Badge>}
            {profile.plan === "pro" && <Badge variant="secondary">PRO</Badge>}
            {profile.plan === "premium" && <Badge variant="outline" className="border-primary text-primary"><Crown className="mr-1 h-3 w-3" />Premium</Badge>}
            <Badge className={nivelColor(stats.nivel as any)} variant="outline">{stats.nivel}</Badge>
          </div>
          
          <Button onClick={handleSendMessage} className="mt-4 bg-primary text-primary-foreground hover:opacity-90">
            <MessageSquare className="mr-2 h-4 w-4" />
            Enviar Mensagem
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard
          label="Nível Atual"
          value={<span className="flex items-center gap-2"><Trophy className="h-5 w-5 text-primary" /> {stats.nivel}</span>}
          icon={<Badge className={nivelColor(stats.nivel as any)} variant="outline">{stats.nivel}</Badge>}
        />
        <StatCard
          label="Sessões Aprovadas"
          value={stats.sessoesCount.toString()}
          icon={<Wallet className="h-4 w-4 text-muted-foreground" />}
        />
      </div>
    </div>
  );
}
