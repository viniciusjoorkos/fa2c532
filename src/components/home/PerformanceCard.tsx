import { useMemo } from "react";
import { TrendingUp, TrendingDown, Flame, Target } from "lucide-react";
import { formatBRL } from "@/lib/calculations";
import type { Sessao } from "@/types";

export function PerformanceCard({ sessoes }: { sessoes: Sessao[] }) {
  const stats = useMemo(() => {
    if (sessoes.length === 0)
      return { winRate: 0, avgSessao: 0, melhor: 0, streak: 0, streakType: "win" as const };

    const wins = sessoes.filter((s) => s.resultado >= 0).length;
    const winRate = Math.round((wins / sessoes.length) * 100);
    const total = sessoes.reduce((a, s) => a + s.resultado, 0);
    const avgSessao = total / sessoes.length;
    const melhor = Math.max(...sessoes.map((s) => s.resultado));

    // Streak (based on most recent sessions, sorted desc)
    let streak = 0;
    const sorted = [...sessoes].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    const firstPositive = sorted[0]?.resultado >= 0;
    for (const s of sorted) {
      if ((s.resultado >= 0) === firstPositive) streak++;
      else break;
    }

    return { winRate, avgSessao, melhor, streak, streakType: firstPositive ? ("win" as const) : ("loss" as const) };
  }, [sessoes]);

  if (sessoes.length === 0) return null;

  const items = [
    {
      label: "Win Rate",
      value: `${stats.winRate}%`,
      icon: Target,
      color: stats.winRate >= 50 ? "text-primary" : "text-destructive",
    },
    {
      label: "Média/sessão",
      value: formatBRL(stats.avgSessao),
      icon: stats.avgSessao >= 0 ? TrendingUp : TrendingDown,
      color: stats.avgSessao >= 0 ? "text-primary" : "text-destructive",
    },
    {
      label: "Melhor sessão",
      value: formatBRL(stats.melhor),
      icon: TrendingUp,
      color: "text-primary",
    },
    {
      label: "Streak atual",
      value: `${stats.streak} ${stats.streakType === "win" ? "win" : "loss"}`,
      icon: Flame,
      color: stats.streakType === "win" ? "text-amber-400" : "text-destructive",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
      {items.map((item) => (
        <div
          key={item.label}
          className="glass-card flex flex-col gap-1 rounded-xl p-3 sm:p-4"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              {item.label}
            </span>
            <item.icon className={`h-3.5 w-3.5 ${item.color}`} />
          </div>
          <span className={`text-base font-bold tracking-tight sm:text-lg ${item.color}`}>
            {item.value}
          </span>
        </div>
      ))}
    </div>
  );
}
