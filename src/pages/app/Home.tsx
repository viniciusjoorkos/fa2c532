import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Calendar, Wallet, Gift, TrendingUp, TrendingDown, AlertTriangle, X, Trophy, Crown, Flame,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { carteiraApi, convitesApi, expertApi, livesApi, sessoesApi } from "@/services/api";
import { calcularNivel, formatBRL, formatDate, nivelColor } from "@/lib/calculations";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BancaChart } from "@/components/home/BancaChart";
import { PerformanceCard } from "@/components/home/PerformanceCard";
import { RankingCard } from "@/components/home/RankingCard";
import type { Carteira, Convite, Live, Sessao } from "@/types";

export default function Home() {
  const { user, isPremium } = useAuth();
  const [dismissAlert, setDismissAlert] = useState(false);
  const [carteira, setCarteira] = useState<Carteira | null>(null);
  const [sessoes, setSessoes] = useState<Sessao[]>([]);
  const [convite, setConvite] = useState<Convite>({ user_id: "", quantidade: 0 });
  const [proximaLive, setProximaLive] = useState<Live | null>(null);
  const [expertOnline, setExpertOnline] = useState(false);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [c, s, cv, ups, on] = await Promise.all([
        carteiraApi.byUser(user.id),
        sessoesApi.byUser(user.id),
        convitesApi.byUser(user.id),
        livesApi.upcoming(isPremium),
        expertApi.isOnline(),
      ]);
      setCarteira(c);
      setSessoes(s);
      setConvite(cv);
      setProximaLive(ups[0] ?? null);
      setExpertOnline(on);
    })();
  }, [user, isPremium]);

  const ultimoResultado = sessoes[0]?.resultado ?? 0;
  const tresPerdas = sessoes.length >= 3 && sessoes.slice(0, 3).every((s) => s.resultado < 0);
  const nivel = calcularNivel(carteira?.banca_inicial ?? 0, carteira?.saldo_atual ?? 0);

  // Calculate streak for display
  let loginStreak = 0;
  if (sessoes.length > 0) {
    const sorted = [...sessoes].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    const dates = new Set(sorted.map((s) => new Date(s.created_at).toDateString()));
    loginStreak = dates.size;
  }

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-muted-foreground sm:text-sm">Bem-vindo de volta,</p>
          <h2 className="flex items-center gap-2 text-xl font-bold tracking-tight sm:text-2xl lg:text-3xl">
            {user?.name} <span className="text-muted-foreground">👋</span>
            {user?.is_gold && (
              <span className="text-amber-400 text-lg" title="Gold Member">✦</span>
            )}
          </h2>
        </div>
        {loginStreak > 2 && (
          <div className="flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1">
            <Flame className="h-3.5 w-3.5 text-amber-400" />
            <span className="text-xs font-bold text-amber-400">{loginStreak}d</span>
          </div>
        )}
      </div>

      {/* Alert: 3 consecutive losses */}
      {tresPerdas && !dismissAlert && (
        <div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-3 sm:p-4">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
          <div className="flex-1">
            <p className="text-xs font-semibold text-destructive sm:text-sm">Atenção: 3 sessões negativas seguidas</p>
            <p className="mt-0.5 text-[11px] text-destructive/80">
              Recomendamos uma pausa para revisar seu plano antes de operar novamente.
            </p>
          </div>
          <Button size="icon" variant="ghost" onClick={() => setDismissAlert(true)} className="h-7 w-7">
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Premium upsell */}
      {!isPremium && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-primary/30 bg-gradient-to-r from-primary/10 to-transparent p-3 sm:p-4">
          <div className="flex items-center gap-3">
            <Crown className="h-5 w-5 text-primary" />
            <div>
              <p className="text-xs font-semibold sm:text-sm">Desbloqueie as Lives Premium</p>
              <p className="text-[11px] text-muted-foreground">Acesso às salas exclusivas com o expert ao vivo.</p>
            </div>
          </div>
          <Button size="sm" className="bg-primary text-primary-foreground hover:opacity-90">
            Fazer upgrade
          </Button>
        </div>
      )}

      {/* Stat Cards — 2 cols mobile, 4 cols desktop */}
      <div className="grid grid-cols-2 gap-2 sm:gap-4 lg:grid-cols-4">
        <StatCard
          label="Saldo atual"
          value={formatBRL(carteira?.saldo_atual ?? 0)}
          accent="primary"
          icon={<Wallet className="h-4 w-4" />}
          trend={ultimoResultado !== 0 ? {
            value: `${ultimoResultado >= 0 ? "+" : ""}${formatBRL(ultimoResultado)} (último)`,
            positive: ultimoResultado >= 0,
          } : undefined}
        />
        <StatCard
          label="Status expert"
          value={
            <span className="flex items-center gap-2 text-sm sm:text-base">
              <span className={expertOnline ? "dot-online" : "dot-offline"} />
              {expertOnline ? "Online" : "Offline"}
            </span>
          }
          icon={expertOnline ? <TrendingUp className="h-4 w-4 text-primary" /> : <TrendingDown className="h-4 w-4" />}
        />
        <StatCard
          label="Indicações"
          value={`${convite.quantidade}`}
          icon={<Gift className="h-4 w-4" />}
          trend={{ value: `Nível ${convite.quantidade >= 10 ? "Diamante" : convite.quantidade >= 5 ? "Bronze" : "Inicial"}`, positive: true }}
        />
        <StatCard
          label="Seu nível"
          value={
            <span className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-primary sm:h-5 sm:w-5" /> {nivel}
            </span>
          }
          icon={<Badge className={nivelColor(nivel)} variant="outline">{nivel}</Badge>}
        />
      </div>

      {/* Performance metrics */}
      <PerformanceCard sessoes={sessoes} />

      {/* Chart + Next Live */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <BancaChart sessoes={sessoes} bancaInicial={carteira?.banca_inicial ?? 0} />
        </div>

        <div className="glass-card flex flex-col gap-4 rounded-xl p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Próxima live</h3>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </div>

          {proximaLive ? (
            <div className="flex flex-1 flex-col">
              <p className="text-base font-bold leading-tight sm:text-lg">{proximaLive.titulo}</p>
              <p className="mt-1 text-xs text-muted-foreground">{formatDate(proximaLive.data)}</p>
              {proximaLive.is_premium && (
                <Badge className="mt-2 w-fit border-primary/40 bg-primary/10 text-primary" variant="outline">
                  <Crown className="mr-1 h-3 w-3" /> Premium
                </Badge>
              )}
              <a href={proximaLive.link} target="_blank" rel="noreferrer" className="mt-auto pt-3">
                <Button className="w-full bg-primary text-primary-foreground hover:opacity-90">
                  Entrar na sala
                </Button>
              </a>
            </div>
          ) : (
            <div className="flex flex-1 items-center justify-center text-center text-sm text-muted-foreground">
              Nenhuma live agendada
            </div>
          )}

          <Link to="/app/agenda" className="text-center text-xs font-medium text-primary hover:underline">
            Ver agenda completa →
          </Link>
        </div>
      </div>

      {/* Ranking + Recent Sessions */}
      <div className="grid gap-4 lg:grid-cols-2">
        <RankingCard />

        <div className="glass-card rounded-xl p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Últimas sessões</h3>
            <Link to="/app/carteira" className="text-xs font-medium text-primary hover:underline">Ver tudo →</Link>
          </div>
          <div className="mt-3 flex flex-col divide-y divide-border">
            {sessoes.slice(0, 4).map((s) => (
              <div key={s.id} className="flex items-center justify-between py-2.5 sm:py-3">
                <div>
                  <p className="text-xs font-medium sm:text-sm">{s.entradas} entradas · {s.duracao}min</p>
                  <p className="text-[11px] text-muted-foreground">{formatDate(s.created_at)}</p>
                </div>
                <span className={`text-xs font-bold sm:text-sm ${s.resultado >= 0 ? "text-primary" : "text-destructive"}`}>
                  {s.resultado >= 0 ? "+" : ""}{formatBRL(s.resultado)}
                </span>
              </div>
            ))}
            {sessoes.length === 0 && (
              <p className="py-6 text-center text-xs text-muted-foreground">Nenhuma sessão ainda. Vá para a Carteira para começar.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
