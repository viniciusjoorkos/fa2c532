import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { livesApi } from "@/services/api";
import { formatDate } from "@/lib/calculations";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, ExternalLink, Crown, Lock, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import type { Live } from "@/types";
import { useLiveCountdown } from "@/hooks/useLiveCountdown";

function LiveCountdownCard({ live }: { live: Live }) {
  const { countdown, canEnter, isLive, isFinished, waitingLink } = useLiveCountdown(live.data, live.status, live.link);

  return (
    <div className="glass-card flex flex-col gap-3 rounded-xl p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold leading-tight">{live.titulo}</h3>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" /> {formatDate(live.data)}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          {live.is_premium && (
            <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary">
              <Crown className="mr-1 h-3 w-3" /> Premium
            </Badge>
          )}
          {isLive ? (
            <Badge className="border-primary/30 bg-primary/15 text-primary animate-pulse-glow" variant="outline">
              <span className="dot-online mr-1.5" /> AO VIVO
            </Badge>
          ) : isFinished ? (
            <Badge variant="outline" className="text-muted-foreground">Finalizada</Badge>
          ) : (
            <Badge variant="outline" className="text-muted-foreground">Agendada</Badge>
          )}
        </div>
      </div>

      {/* Countdown or button */}
      <div className="mt-auto">
        {isLive && live.link ? (
          <a href={live.link} target="_blank" rel="noreferrer">
            <Button className="w-full bg-primary text-primary-foreground hover:opacity-90 animate-pulse-glow">
              <span className="dot-online mr-2" /> Entrar na Live
            </Button>
          </a>
        ) : canEnter && live.link ? (
          <a href={live.link} target="_blank" rel="noreferrer">
            <Button className="w-full bg-primary text-primary-foreground hover:opacity-90">
              Entrar na Live <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </a>
        ) : waitingLink ? (
          <div className="rounded-lg border border-border bg-card p-3 text-center text-xs text-muted-foreground">
            Link será disponibilizado em breve
          </div>
        ) : countdown ? (
          <div className="flex items-center justify-center gap-2 rounded-lg border border-border bg-card p-3">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Começa em</span>
            <span className="font-mono text-sm font-bold tracking-wider">{countdown}</span>
          </div>
        ) : isFinished ? (
          <Button className="w-full" variant="outline" disabled>Finalizada</Button>
        ) : (
          <Button className="w-full" variant="outline" disabled>Aguardando</Button>
        )}
      </div>
    </div>
  );
}

export default function Agenda() {
  const { isPremium } = useAuth();
  const [lives, setLives] = useState<Live[]>([]);

  useEffect(() => {
    livesApi.upcoming(isPremium).then(setLives);
  }, [isPremium]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Agenda de Lives</h2>
          <p className="mt-1 text-sm text-muted-foreground">Próximas salas ao vivo do expert.</p>
        </div>
        {isPremium && (
          <Link to="/app/premium">
            <Button variant="outline" className="border-primary/40 text-primary hover:bg-primary/10">
              <Crown className="mr-2 h-4 w-4" /> Lives Premium
            </Button>
          </Link>
        )}
      </div>

      {!isPremium && (
        <div className="flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4">
          <Lock className="h-4 w-4 text-primary" />
          <p className="text-xs text-muted-foreground">
            Você está vendo apenas lives do seu plano. <span className="font-semibold text-foreground">Faça upgrade</span> para ter acesso a lives de nível superior.
          </p>
        </div>
      )}

      {/* Info banner */}
      <div className="rounded-xl border border-border bg-card/50 p-3 text-xs text-muted-foreground">
        <p>⏱ O botão para entrar na live é liberado <strong className="text-foreground">10 minutos antes</strong> do horário agendado. Enquanto isso, um cronômetro mostra o tempo restante.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {lives.map((l) => (
          <LiveCountdownCard key={l.id} live={l} />
        ))}
        {lives.length === 0 && (
          <div className="glass-card col-span-full rounded-xl p-10 text-center text-muted-foreground">
            Nenhuma live agendada no momento
          </div>
        )}
      </div>
    </div>
  );
}
