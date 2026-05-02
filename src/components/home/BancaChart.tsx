import { useMemo, useState } from "react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  Tooltip, ReferenceLine, CartesianGrid,
} from "recharts";
import type { Sessao } from "@/types";
import { formatBRL } from "@/lib/calculations";
import { cn } from "@/lib/utils";

const periods = [
  { key: "7d", label: "7d", days: 7 },
  { key: "30d", label: "30d", days: 30 },
  { key: "90d", label: "90d", days: 90 },
  { key: "all", label: "Tudo", days: Infinity },
] as const;

export function BancaChart({
  sessoes,
  bancaInicial,
}: {
  sessoes: Sessao[];
  bancaInicial: number;
}) {
  const [period, setPeriod] = useState<string>("30d");

  const data = useMemo(() => {
    const p = periods.find((p) => p.key === period) ?? periods[3];
    const cutoff = p.days === Infinity ? 0 : Date.now() - p.days * 86400000;

    // Sort ascending by date
    const sorted = [...sessoes]
      .filter((s) => new Date(s.created_at).getTime() >= cutoff)
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

    let saldo = bancaInicial;
    const points = [{ date: "Início", saldo: bancaInicial, resultado: 0 }];

    for (const s of sorted) {
      saldo += s.resultado;
      points.push({
        date: new Date(s.created_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
        saldo,
        resultado: s.resultado,
      });
    }
    return points;
  }, [sessoes, bancaInicial, period]);

  if (sessoes.length === 0) {
    return (
      <div className="flex h-[180px] items-center justify-center rounded-xl border border-border bg-background/30 text-sm text-muted-foreground sm:h-[260px]">
        Registre sessões para ver o gráfico
      </div>
    );
  }

  return (
    <div className="glass-card rounded-xl p-4 sm:p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Evolução da banca
        </h3>
        <div className="flex gap-1">
          {periods.map((p) => (
            <button
              key={p.key}
              onClick={() => setPeriod(p.key)}
              className={cn(
                "rounded-md px-2 py-1 text-[10px] font-medium transition",
                period === p.key
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-3 h-[180px] sm:h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(43 74% 52%)" stopOpacity={0.25} />
                <stop offset="95%" stopColor="hsl(43 74% 52%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 14%)" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10, fill: "hsl(0 0% 60%)" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "hsl(0 0% 60%)" }}
              axisLine={false}
              tickLine={false}
              width={55}
              tickFormatter={(v) => `R$${(v / 1000).toFixed(1)}k`}
            />
            <Tooltip
              contentStyle={{
                background: "hsl(0 0% 7%)",
                border: "1px solid hsl(0 0% 14%)",
                borderRadius: "8px",
                fontSize: "12px",
              }}
              formatter={(value: number, name: string) => {
                if (name === "saldo") return [formatBRL(value), "Saldo"];
                return [formatBRL(value), "Resultado"];
              }}
              labelStyle={{ color: "hsl(0 0% 60%)", fontSize: "11px" }}
            />
            <ReferenceLine
              y={bancaInicial}
              stroke="hsl(0 0% 30%)"
              strokeDasharray="4 4"
              label={{
                value: "Inicial",
                position: "insideTopRight",
                fill: "hsl(0 0% 40%)",
                fontSize: 10,
              }}
            />
            <Area
              type="monotone"
              dataKey="saldo"
              stroke="hsl(43 74% 52%)"
              strokeWidth={2}
              fill="url(#goldGradient)"
              dot={false}
              activeDot={{ r: 4, fill: "hsl(43 74% 52%)" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
