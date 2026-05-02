import { useEffect, useState } from "react";
import { rankingApi, adminApi } from "@/services/api";
import { formatBRL } from "@/lib/calculations";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { RankingEntry } from "@/types";

export default function RankingTab() {
  const [ranking, setRanking] = useState<RankingEntry[]>([]);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    setLoading(true);
    try { setRanking(await rankingApi.topLucro(10)); }
    finally { setLoading(false); }
  }
  useEffect(() => { refresh(); }, []);

  async function toggleGold(userId: string, current: boolean) {
    await adminApi.updateGold(userId, !current);
    await refresh();
    toast.success(current ? "Gold removido" : "Gold concedido");
  }

  if (loading) return <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs text-muted-foreground">
        Top 2 da quinzena (dia 15 e 29) ganham acesso <span className="text-amber-400 font-medium">✦ Gold</span>.
        Se o 1º ou 2º já possuem Gold, o benefício passa para o 3º ou 4º.
      </p>
      <div className="glass-card overflow-hidden rounded-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-background/40 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-5 py-3 text-left">#</th>
                <th className="px-5 py-3 text-left">Trader</th>
                <th className="px-5 py-3 text-left">Plano</th>
                <th className="px-5 py-3 text-right">Sessões</th>
                <th className="px-5 py-3 text-right">Lucro Total</th>
                <th className="px-5 py-3 text-center">Gold</th>
                <th className="px-5 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {ranking.map((r, i) => {
                const initials = r.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
                return (
                  <tr key={r.user_id}>
                    <td className="px-5 py-3 font-bold text-muted-foreground">
                      {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-7 w-7">
                          <AvatarImage src={r.avatar_url ?? undefined} />
                          <AvatarFallback className="bg-primary/20 text-[9px] font-bold text-primary">{initials}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{r.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <Badge variant="outline" className={r.plan === "premium" ? "border-primary/40 text-primary" : ""}>
                        {r.plan === "premium" && <Crown className="mr-1 h-3 w-3" />}{r.plan}
                      </Badge>
                    </td>
                    <td className="px-5 py-3 text-right">{r.total_sessoes}</td>
                    <td className={`px-5 py-3 text-right font-bold ${r.total_lucro >= 0 ? "text-primary" : "text-destructive"}`}>
                      {r.total_lucro >= 0 ? "+" : ""}{formatBRL(r.total_lucro)}
                    </td>
                    <td className="px-5 py-3 text-center">
                      {r.is_gold ? <span className="text-amber-400 text-lg">✦</span> : <span className="text-muted-foreground">—</span>}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <Button size="sm" variant={r.is_gold ? "ghost" : "outline"} onClick={() => toggleGold(r.user_id, r.is_gold)}
                        className={r.is_gold ? "text-destructive" : "border-amber-500/30 text-amber-400 hover:bg-amber-500/10"}>
                        {r.is_gold ? "Remover" : "Conceder Gold"}
                      </Button>
                    </td>
                  </tr>
                );
              })}
              {ranking.length === 0 && (
                <tr><td colSpan={7} className="px-5 py-8 text-center text-muted-foreground">Nenhum dado</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
