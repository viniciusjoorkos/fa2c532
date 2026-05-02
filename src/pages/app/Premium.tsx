import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { livesApi } from "@/services/api";
import { formatDate } from "@/lib/calculations";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, ExternalLink, Crown, Clock, PlayCircle } from "lucide-react";
import { Navigate } from "react-router-dom";
import type { Live } from "@/types";

export default function Premium() {
  const { isPremium, loading } = useAuth();
  const [lives, setLives] = useState<Live[]>([]);

  useEffect(() => {
    if (isPremium) livesApi.premiumUpcoming().then(setLives);
  }, [isPremium]);

  const aoVivo = useMemo(() => lives.filter((l) => l.status === "ao_vivo"), [lives]);
  const agendadas = useMemo(() => lives.filter((l) => l.status === "agendada"), [lives]);

  if (loading) return null;
  if (!isPremium) return <Navigate to="/app" replace />;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15">
          <Crown className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Lives Premium</h2>
          <p className="text-sm text-muted-foreground">Salas exclusivas com o expert ao vivo.</p>
        </div>
      </div>

      {aoVivo.length > 0 && (
        <section>
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            <PlayCircle className="h-4 w-4 text-primary" /> Acontecendo agora
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {aoVivo.map((l) => (
              <LiveCard key={l.id} live={l} highlighted />
            ))}
          </div>
        </section>
      )}

      <section>
        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          <Clock className="h-4 w-4" /> Próximas
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          {agendadas.map((l) => (
            <LiveCard key={l.id} live={l} />
          ))}
          {agendadas.length === 0 && aoVivo.length === 0 && (
            <div className="glass-card col-span-full rounded-xl p-10 text-center text-muted-foreground">
              Nenhuma live premium agendada no momento
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function LiveCard({ live, highlighted }: { live: Live; highlighted?: boolean }) {
  const isLive = live.status === "ao_vivo";
  return (
    <div className={`glass-card flex flex-col gap-3 rounded-xl p-5 ${highlighted ? "ring-1 ring-primary/40" : ""}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold leading-tight">{live.titulo}</h3>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" /> {formatDate(live.data)}
          </p>
          {live.descricao && <p className="mt-2 text-sm text-muted-foreground">{live.descricao}</p>}
        </div>
        <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary">
          <Crown className="mr-1 h-3 w-3" /> Premium
        </Badge>
      </div>

      <a href={live.link} target="_blank" rel="noreferrer" className="mt-auto">
        <Button
          className={`w-full ${isLive ? "bg-primary text-primary-foreground animate-pulse-glow" : "bg-primary text-primary-foreground hover:opacity-90"}`}
        >
          {isLive ? (
            <><span className="dot-online mr-2" /> Entrar agora</>
          ) : (
            <>Acessar sala <ExternalLink className="ml-2 h-4 w-4" /></>
          )}
        </Button>
      </a>
    </div>
  );
}
