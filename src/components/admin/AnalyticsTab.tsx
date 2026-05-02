import { useEffect, useState } from "react";
import { adminApi, sessoesApi } from "@/services/api";
import { StatCard } from "@/components/ui/stat-card";
import { Users, Activity, Crown, TrendingUp } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export default function AnalyticsTab() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [premiumCount, setPremiumCount] = useState(0);
  const [chartData, setChartData] = useState<{ date: string; count: number }[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const users = await adminApi.listUsers();
        setTotalUsers(users.length);
        setPremiumCount(users.filter((u) => u.plan === "premium").length);

        // Cadastros por dia (últimos 30 dias)
        const now = Date.now();
        const days: Record<string, number> = {};
        for (let i = 29; i >= 0; i--) {
          const d = new Date(now - i * 86400000);
          const key = d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
          days[key] = 0;
        }
        for (const u of users) {
          const key = new Date(u.created_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
          if (key in days) days[key]++;
        }
        setChartData(Object.entries(days).map(([date, count]) => ({ date, count })));
      } catch {}
    })();
  }, []);

  const premiumPct = totalUsers > 0 ? Math.round((premiumCount / totalUsers) * 100) : 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Total Usuários" value={totalUsers} icon={<Users className="h-4 w-4" />} />
        <StatCard label="Premium" value={premiumCount} icon={<Crown className="h-4 w-4 text-primary" />}
          trend={{ value: `${premiumPct}% do total`, positive: true }} />
        <StatCard label="Free" value={totalUsers - premiumCount} icon={<Activity className="h-4 w-4" />} />
        <StatCard label="Conversão" value={`${premiumPct}%`} icon={<TrendingUp className="h-4 w-4 text-primary" />} accent="primary" />
      </div>

      <div className="glass-card rounded-xl p-5">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Novos cadastros (30 dias)
        </h3>
        <div className="h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 14%)" />
              <XAxis dataKey="date" tick={{ fontSize: 9, fill: "hsl(0 0% 60%)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "hsl(0 0% 60%)" }} axisLine={false} tickLine={false} width={30} />
              <Tooltip contentStyle={{ background: "hsl(0 0% 7%)", border: "1px solid hsl(0 0% 14%)", borderRadius: "8px", fontSize: "12px" }} />
              <Bar dataKey="count" fill="hsl(43 74% 52%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
