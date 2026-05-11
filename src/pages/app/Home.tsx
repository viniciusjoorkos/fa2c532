import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Calendar, Wallet, TrendingUp, TrendingDown, AlertTriangle, X,
  Trophy, Crown, Flame, Clock, Sparkles, Users, BarChart2,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { carteiraApi, convitesApi, expertApi, livesApi, sessoesApi } from "@/services/api";
import { calcularNivel, formatBRL, formatDate, nivelColor, nivelProgress, canAccessLive } from "@/lib/calculations";
import { Badge } from "@/components/ui/badge";
import { BancaChart } from "@/components/home/BancaChart";
import { PerformanceCard } from "@/components/home/PerformanceCard";
import { RankingCard } from "@/components/home/RankingCard";
import { ChatWidget } from "@/components/ChatWidget";
import type { Carteira, Convite, Live, Sessao } from "@/types";
import { useLiveCountdown } from "@/hooks/useLiveCountdown";

function LivePlanBadge({ live }: { live: Live }) {
  const plans = live.plan_access ?? [];
  if (plans.includes("gold")) return <span className="rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider bg-amber-400/10 text-amber-400 border border-amber-400/20">Gold</span>;
  if (plans.includes("pro")) return <span className="rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider bg-white/10 text-white/60 border border-white/10">PRO</span>;
  if (live.is_premium || plans.includes("premium")) return <span className="rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">Premium</span>;
  return <span className="rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Free</span>;
}

function UserPlanBadgeHeader({ plan, isGold }: { plan: string | undefined; isGold: boolean | undefined }) {
  if (isGold || plan === "gold") return <span className="rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-amber-400 text-black shadow-[0_0_10px_rgba(251,191,36,0.3)]">Gold ✦</span>;
  if (plan === "pro") return <span className="rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-cyan-400 text-black shadow-[0_0_10px_rgba(34,211,238,0.3)]">PRO ⚡</span>;
  if (plan === "premium") return <span className="rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-primary text-white shadow-[0_0_10px_var(--primary-glow)]">Premium 👑</span>;
  return <span className="rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-emerald-500 text-black shadow-[0_0_10px_rgba(16,185,129,0.3)]">Free</span>;
}

function LiveRow({ live, userPlan }: { live: Live; userPlan: string }) {
  const { countdown, canEnter, isLive, waitingLink } = useLiveCountdown(live.data, live.status, live.link);
  const hasLink = !!live.link && live.link.trim() !== "";
  const hasAccess = canAccessLive(userPlan, live.plan_access);

  return (
    <div className="flex items-center gap-2 py-2.5 border-b border-border/50 last:border-b-0">
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium leading-tight truncate text-foreground/90">{live.titulo}</p>
        <div className="mt-0.5 flex items-center gap-1.5">
          <span className="text-[10px] text-muted-foreground">{formatDate(live.data)}</span>
          <LivePlanBadge live={live} />
        </div>
      </div>
      <div className="shrink-0">
        {!hasAccess ? (
          <Link to="/signup?plan=premium">
            <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-[10px] font-medium text-primary">Upgrade</span>
          </Link>
        ) : isLive && hasLink ? (
          <a href={live.link} target="_blank" rel="noreferrer">
            <span className="flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-[10px] font-semibold text-white animate-pulse">
              <span className="h-1.5 w-1.5 rounded-full bg-white" /> Ao Vivo
            </span>
          </a>
        ) : canEnter && hasLink ? (
          <a href={live.link} target="_blank" rel="noreferrer">
            <span className="rounded-full bg-primary px-2.5 py-1 text-[10px] font-medium text-white">Entrar</span>
          </a>
        ) : countdown ? (
          <span className="flex items-center gap-1 rounded-lg border border-border bg-card px-2 py-1">
            <Clock className="h-2.5 w-2.5 text-muted-foreground" />
            <span className="font-mono text-[10px] font-bold">{countdown}</span>
          </span>
        ) : (
          <span className="rounded-full border border-border px-2.5 py-1 text-[10px] text-muted-foreground">
            {waitingLink ? "Em breve" : "Encerrada"}
          </span>
        )}
      </div>
    </div>
  );
}

export default function Home() {
  const { user, isPremium } = useAuth();
  const [dismissAlert, setDismissAlert] = useState(false);
  const [carteira, setCarteira] = useState<Carteira | null>(null);
  const [sessoes, setSessoes] = useState<Sessao[]>([]);
  const [convite, setConvite] = useState<Convite>({ user_id: "", quantidade: 0 });
  const [proximasLives, setProximasLives] = useState<Live[]>([]);
  const [expertOnline, setExpertOnline] = useState(false);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [c, s, cv, ups, on] = await Promise.all([
        carteiraApi.byUser(user.id),
        sessoesApi.byUser(user.id),
        convitesApi.byUser(user.id),
        livesApi.upcoming(),
        expertApi.isOnline(),
      ]);
      setCarteira(c);
      setSessoes(s);
      setConvite(cv);
      setProximasLives(ups.slice(0, 5));
      setExpertOnline(on);
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const ultimoResultado = sessoes[0]?.resultado ?? 0;
  const tresPerdas = sessoes.length >= 3 && sessoes.slice(0, 3).every((s) => s.resultado < 0);
  const totalLucro = sessoes.reduce((acc, s) => acc + s.resultado, 0);
  const nivel = calcularNivel(sessoes.length, totalLucro);
  const progresso = nivelProgress(sessoes.length, totalLucro);

  let loginStreak = 0;
  if (sessoes.length > 0) {
    const sorted = [...sessoes].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    const dates = new Set(sorted.map((s) => new Date(s.created_at).toDateString()));
    loginStreak = dates.size;
  }

  return (
    <div className="flex flex-col gap-3 sm:gap-5">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div className="min-w-0">
          <p className="text-[10px] text-muted-foreground">Bem-vindo de volta</p>
          <h2 className="flex items-center gap-2 text-base font-bold tracking-tight sm:text-lg truncate">
            {user?.name}
            <UserPlanBadgeHeader plan={user?.plan} isGold={user?.is_gold} />
          </h2>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {loginStreak > 2 && (
            <span className="flex items-center gap-1 rounded-full border border-orange-500/20 bg-orange-500/10 px-2 py-0.5 text-[10px] font-semibold text-orange-400">
              <Flame className="h-3 w-3" />{loginStreak}d
            </span>
          )}
          <Link
            to="/app/ia"
            className="flex items-center gap-1 rounded-full border border-primary/25 bg-primary/10 px-2.5 py-1 text-[10px] font-semibold text-primary transition hover:bg-primary/20"
          >
            <Sparkles className="h-3 w-3" />RZ IA
          </Link>
        </div>
      </div>

      {/* ── Alert: 3 consecutive losses ── */}
      {tresPerdas && !dismissAlert && (
        <div className="flex items-start gap-2.5 rounded-xl border border-destructive/25 bg-destructive/8 px-3 py-2.5">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-semibold text-destructive">3 sessões negativas seguidas</p>
            <p className="mt-0.5 text-[10px] text-destructive/70">Recomendamos uma pausa para revisar seu plano.</p>
          </div>
          <button onClick={() => setDismissAlert(true)} className="text-muted-foreground hover:text-foreground">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* ── Premium upsell ── */}
      {!isPremium && (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-primary/20 bg-primary/6 px-3 py-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <Crown className="h-4 w-4 shrink-0 text-primary" />
            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-foreground/90 leading-tight">Lives Premium desbloqueadas</p>
              <p className="text-[10px] text-muted-foreground">Acesso total com o expert ao vivo</p>
            </div>
          </div>
          <Link
            to="/signup?plan=premium"
            className="shrink-0 rounded-full bg-primary px-3 py-1.5 text-[10px] font-semibold text-white transition hover:opacity-90"
          >
            Upgrade
          </Link>
        </div>
      )}

      {/* ── Stat Cards — 3 compact cols ── */}
      <div className="grid grid-cols-3 gap-2">
        {/* Saldo */}
        <div className="glass-card rounded-xl p-3 sm:p-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">Saldo</span>
            <Wallet className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
          <p className="text-sm font-bold text-foreground sm:text-base">{formatBRL(carteira?.saldo_atual ?? 0)}</p>
          {ultimoResultado !== 0 && (
            <p className={`mt-0.5 text-[9px] font-medium ${ultimoResultado >= 0 ? "text-emerald-400" : "text-destructive"}`}>
              {ultimoResultado >= 0 ? "+" : ""}{formatBRL(ultimoResultado)} último
            </p>
          )}
        </div>

        {/* Expert */}
        <div className="glass-card rounded-xl p-3 sm:p-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">Expert</span>
            {expertOnline ? <TrendingUp className="h-3.5 w-3.5 text-primary" /> : <TrendingDown className="h-3.5 w-3.5 text-muted-foreground" />}
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`h-2 w-2 rounded-full ${expertOnline ? "bg-emerald-400 shadow-[0_0_0_3px_rgba(52,211,153,0.2)]" : "bg-muted-foreground"}`} />
            <p className="text-sm font-bold">{expertOnline ? "Online" : "Offline"}</p>
          </div>
        </div>

        {/* Nível */}
        <div className="glass-card rounded-xl p-3 sm:p-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">Nível</span>
            <Trophy className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
          <p className="text-sm font-bold text-foreground">{nivel}</p>
          <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-muted">
            <div className="h-full bg-primary transition-all duration-500 rounded-full" style={{ width: `${progresso}%` }} />
          </div>
        </div>
      </div>

      {/* ── Performance ── */}
      <PerformanceCard sessoes={sessoes} />

      {/* ── Chart + Lives ── */}
      <div className="grid gap-3 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <BancaChart sessoes={sessoes} bancaInicial={carteira?.banca_inicial ?? 0} />
        </div>

        <div className="glass-card rounded-xl p-3 sm:p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Próximas Lives</span>
            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
          {proximasLives.length > 0 ? (
            <div className="flex flex-col">
              {proximasLives.map((live) => (
                <LiveRow key={live.id} live={live} userPlan={user?.plan ?? "free"} />
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center py-6 text-[11px] text-muted-foreground">
              Nenhuma live agendada
            </div>
          )}
          <Link to="/app/agenda" className="mt-2 block text-center text-[10px] font-medium text-primary hover:underline">
            Ver agenda completa →
          </Link>
        </div>
      </div>

      {/* ── Ranking + Sessions ── */}
      <div className="grid gap-3 lg:grid-cols-2">
        <RankingCard />

        <div className="glass-card rounded-xl p-3 sm:p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Últimas Sessões</span>
            <Link to="/app/carteira" className="text-[10px] font-medium text-primary hover:underline">Ver tudo →</Link>
          </div>
          <div className="flex flex-col divide-y divide-border/50">
            {sessoes.slice(0, 4).map((s) => (
              <div key={s.id} className="flex items-center justify-between py-2">
                <div>
                  <p className="text-[11px] font-medium text-foreground/90">{s.entradas} entradas · {s.duracao}min</p>
                  <p className="text-[10px] text-muted-foreground">{formatDate(s.created_at)}</p>
                </div>
                <span className={`text-xs font-bold ${s.resultado >= 0 ? "text-emerald-400" : "text-destructive"}`}>
                  {s.resultado >= 0 ? "+" : ""}{formatBRL(s.resultado)}
                </span>
              </div>
            ))}
            {sessoes.length === 0 && (
              <p className="py-5 text-center text-[10px] text-muted-foreground">
                Nenhuma sessão. Vá para a Carteira para começar.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── Chat ── */}
      <ChatWidget />
    </div>
  );
}
