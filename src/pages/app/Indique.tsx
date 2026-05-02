import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { convitesApi } from "@/services/api";
import { Gift, Copy, Check, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import type { Convite } from "@/types";

const niveis = [
  { qtd: 1, label: "Surpresa", color: "text-info border-info/30 bg-info/10" },
  { qtd: 5, label: "Bronze", color: "text-amber-500 border-amber-500/30 bg-amber-500/10" },
  { qtd: 10, label: "Diamante", color: "text-cyan-300 border-cyan-300/30 bg-cyan-300/10" },
];

export default function Indique() {
  const { user } = useAuth();
  const [convite, setConvite] = useState<Convite>({ user_id: "", quantidade: 0 });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (user) convitesApi.byUser(user.id).then(setConvite);
  }, [user]);

  if (!user) return null;
  const link = `${window.location.origin}/signup?ref=${user.id}`;

  function copy() {
    navigator.clipboard.writeText(link);
    setCopied(true);
    toast.success("Link copiado!");
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Indique e ganhe</h2>
        <p className="mt-1 text-sm text-muted-foreground">Compartilhe seu link e suba de nível com cada indicação.</p>
      </div>

      <div className="glass-card flex flex-col items-center gap-4 rounded-xl bg-gradient-to-br from-primary/15 to-transparent p-8 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary shadow-glow">
          <Gift className="h-7 w-7 text-primary-foreground" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Suas indicações</p>
          <p className="text-5xl font-extrabold tracking-tight">{convite.quantidade}</p>
        </div>
        <div className="flex w-full max-w-lg items-center gap-2">
          <Input value={link} readOnly className="font-mono text-xs" />
          <Button onClick={copy} className="shrink-0 bg-primary text-primary-foreground hover:opacity-90">
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Níveis de recompensa</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          {niveis.map((n) => {
            const reached = convite.quantidade >= n.qtd;
            return (
              <div key={n.qtd} className={`glass-card relative rounded-xl p-5 ${reached ? "ring-1 ring-primary/40" : "opacity-80"}`}>
                <div className="flex items-start justify-between">
                  <Trophy className={`h-6 w-6 ${reached ? "text-primary" : "text-muted-foreground"}`} />
                  <Badge className={n.color} variant="outline">{n.label}</Badge>
                </div>
                <p className="mt-4 text-3xl font-bold">{n.qtd}</p>
                <p className="text-xs text-muted-foreground">{n.qtd === 1 ? "indicação" : "indicações"}</p>
                {reached && <p className="mt-3 text-xs font-semibold text-primary">✓ Conquistado</p>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
