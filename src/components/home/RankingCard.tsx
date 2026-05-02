import { useEffect, useState } from "react";
import { rankingApi } from "@/services/api";
import { formatBRL } from "@/lib/calculations";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Crown } from "lucide-react";
import type { RankingEntry } from "@/types";

export function RankingCard() {
  const [ranking, setRanking] = useState<RankingEntry[]>([]);

  useEffect(() => {
    rankingApi.topLucro(5).then(setRanking).catch(() => {});
  }, []);

  if (ranking.length === 0) {
    return (
      <div className="glass-card flex flex-col gap-3 rounded-xl p-5">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          🏆 Ranking de Lucro
        </h3>
        <p className="py-4 text-center text-xs text-muted-foreground">
          Ainda sem dados suficientes
        </p>
      </div>
    );
  }

  const positionStyles = [
    "bg-gradient-to-r from-amber-500/20 to-transparent border-amber-500/30",
    "bg-gradient-to-r from-slate-400/15 to-transparent border-slate-400/25",
    "bg-gradient-to-r from-amber-700/15 to-transparent border-amber-700/25",
  ];

  return (
    <div className="glass-card flex flex-col gap-3 rounded-xl p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          🏆 Ranking de Lucro
        </h3>
        <span className="text-[9px] uppercase tracking-wider text-muted-foreground">Quinzenal</span>
      </div>

      <div className="flex flex-col gap-1.5">
        {ranking.map((r, i) => {
          const initials = r.name
            .split(" ")
            .map((n) => n[0])
            .slice(0, 2)
            .join("")
            .toUpperCase();
          const displayName =
            r.name.split(" ").length > 1
              ? `${r.name.split(" ")[0]} ${r.name.split(" ").slice(-1)[0][0]}.`
              : r.name;

          return (
            <div
              key={r.user_id}
              className={`flex items-center gap-3 rounded-lg border px-3 py-2 transition ${
                i < 3 ? positionStyles[i] : "border-border bg-background/20"
              }`}
            >
              <span className="w-5 text-center text-xs font-bold text-muted-foreground">
                {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}`}
              </span>
              <Avatar className="h-7 w-7">
                <AvatarImage src={r.avatar_url ?? undefined} />
                <AvatarFallback className="bg-primary/20 text-[9px] font-bold text-primary">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="truncate text-xs font-medium">{displayName}</span>
                  {r.is_gold && (
                    <span className="text-[10px] text-amber-400" title="Gold Member">✦</span>
                  )}
                  {r.plan === "premium" && (
                    <Crown className="h-3 w-3 text-primary/60" />
                  )}
                </div>
              </div>
              <span
                className={`text-xs font-bold ${
                  r.total_lucro >= 0 ? "text-primary" : "text-destructive"
                }`}
              >
                {r.total_lucro >= 0 ? "+" : ""}
                {formatBRL(r.total_lucro)}
              </span>
            </div>
          );
        })}
      </div>

      {/* Gold explanation */}
      <p className="mt-1 text-[10px] leading-relaxed text-muted-foreground">
        Top 2 da quinzena ganham acesso <span className="text-amber-400 font-medium">✦ Gold</span> — sessões exclusivas com o expert.
      </p>
    </div>
  );
}
