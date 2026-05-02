import type { Nivel } from "@/types";

export function calcularNivel(sessoesCount: number, lucroTotal: number): Nivel {
  if (sessoesCount >= 200 && lucroTotal >= 25000) return "Lenda";
  if (sessoesCount >= 100 && lucroTotal >= 10000) return "Elite";
  if (sessoesCount >= 50 && lucroTotal >= 5000) return "Expert";
  if (sessoesCount >= 25 && lucroTotal >= 2000) return "Consistente";
  if (sessoesCount >= 10 && lucroTotal >= 500) return "Trader";
  if (sessoesCount >= 3) return "Aprendiz";
  return "Novato";
}

export function nivelColor(nivel: Nivel): string {
  switch (nivel) {
    case "Lenda": return "text-amber-300 border-amber-300/50 bg-gradient-to-r from-amber-500/20 to-yellow-300/20";
    case "Elite": return "text-amber-500 border-amber-500/40 bg-amber-500/10";
    case "Expert": return "text-purple-400 border-purple-400/40 bg-purple-400/10";
    case "Consistente": return "text-teal-400 border-teal-400/40 bg-teal-400/10";
    case "Trader": return "text-emerald-400 border-emerald-400/40 bg-emerald-400/10";
    case "Aprendiz": return "text-blue-400 border-blue-400/40 bg-blue-400/10";
    default: return "text-muted-foreground border-border bg-muted/50";
  }
}

export function nivelProgress(sessoesCount: number, lucroTotal: number): number {
  const nivel = calcularNivel(sessoesCount, lucroTotal);
  if (nivel === "Lenda") return 100;
  
  let targetSessoes = 3;
  let targetLucro = 0;
  let currentSessoes = sessoesCount;
  let currentLucro = Math.max(0, lucroTotal);

  switch (nivel) {
    case "Novato": targetSessoes = 3; targetLucro = 0; break;
    case "Aprendiz": targetSessoes = 10; targetLucro = 500; break;
    case "Trader": targetSessoes = 25; targetLucro = 2000; break;
    case "Consistente": targetSessoes = 50; targetLucro = 5000; break;
    case "Expert": targetSessoes = 100; targetLucro = 10000; break;
    case "Elite": targetSessoes = 200; targetLucro = 25000; break;
  }

  const progressSessoes = Math.min(100, (currentSessoes / targetSessoes) * 100);
  const progressLucro = targetLucro > 0 ? Math.min(100, (currentLucro / targetLucro) * 100) : 100;
  
  return (progressSessoes + progressLucro) / 2;
}

export function formatBRL(v: number): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export function formatShortDate(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}
