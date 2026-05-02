import type { Nivel } from "@/types";

export function calcularNivel(bancaInicial: number, saldoAtual: number): Nivel {
  if (!bancaInicial || bancaInicial <= 0) return "Iniciante";
  const variacao = ((saldoAtual - bancaInicial) / bancaInicial) * 100;
  if (variacao >= 50) return "Ouro";
  if (variacao >= 25) return "Prata";
  if (variacao >= 10) return "Bronze";
  return "Iniciante";
}

export function nivelColor(nivel: Nivel): string {
  switch (nivel) {
    case "Ouro": return "text-yellow-400 border-yellow-400/40 bg-yellow-400/10";
    case "Prata": return "text-slate-300 border-slate-300/40 bg-slate-300/10";
    case "Bronze": return "text-amber-600 border-amber-600/40 bg-amber-600/10";
    default: return "text-muted-foreground border-border bg-muted";
  }
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
