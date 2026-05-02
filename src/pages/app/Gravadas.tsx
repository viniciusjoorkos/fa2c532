import { useEffect, useState } from "react";
import { livesApi } from "@/services/api";
import { formatBRL, formatDate } from "@/lib/calculations";
import { Badge } from "@/components/ui/badge";
import { Video } from "lucide-react";
import type { Live } from "@/types";

export default function Gravadas() {
  const [lives, setLives] = useState<Live[]>([]);

  useEffect(() => { livesApi.finalizadas().then(setLives); }, []);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Lives gravadas</h2>
        <p className="mt-1 text-sm text-muted-foreground">Histórico das salas finalizadas com resultados.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {lives.map((l) => {
          const resultado = (l.ganhos ?? 0) - (l.perdas ?? 0);
          return (
            <div key={l.id} className="glass-card rounded-xl p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="rounded-lg bg-primary/10 p-2 text-primary"><Video className="h-5 w-5" /></div>
                <Badge variant="outline" className="text-xs">Finalizada</Badge>
              </div>
              <h3 className="mt-3 text-base font-semibold leading-tight">{l.titulo}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{formatDate(l.data)}</p>

              <div className="mt-4 grid grid-cols-3 gap-2 rounded-lg border border-border bg-background/40 p-3 text-center text-xs">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Ganhos</p>
                  <p className="mt-0.5 font-bold text-primary">{formatBRL(l.ganhos ?? 0)}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Perdas</p>
                  <p className="mt-0.5 font-bold text-destructive">{formatBRL(l.perdas ?? 0)}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Resultado</p>
                  <p className={`mt-0.5 font-bold ${resultado >= 0 ? "text-primary" : "text-destructive"}`}>
                    {resultado >= 0 ? "+" : ""}{formatBRL(resultado)}
                  </p>
                </div>
              </div>

              <p className="mt-3 text-xs text-muted-foreground">
                Caixa final: <span className="font-semibold text-foreground">{formatBRL(l.caixa_final ?? 0)}</span>
              </p>
            </div>
          );
        })}
        {lives.length === 0 && (
          <div className="glass-card col-span-full rounded-xl p-10 text-center text-muted-foreground">
            Nenhuma live finalizada ainda
          </div>
        )}
      </div>
    </div>
  );
}
