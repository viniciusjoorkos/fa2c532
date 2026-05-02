import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { carteiraApi, sessoesApi } from "@/services/api";
import { formatBRL, formatDate } from "@/lib/calculations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import { StatCard } from "@/components/ui/stat-card";
import { Wallet, TrendingUp, TrendingDown, Plus, Lock, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import type { Carteira, Sessao } from "@/types";

const FREE_LIMIT = 5;

export default function Carteira() {
  const { user } = useAuth();
  const [carteira, setCarteira] = useState<Carteira | null>(null);
  const [sessoes, setSessoes] = useState<Sessao[]>([]);
  const [loading, setLoading] = useState(true);

  const [bancaInicial, setBancaInicial] = useState("");
  const [openSession, setOpenSession] = useState(false);
  const [saving, setSaving] = useState(false);

  const [entradas, setEntradas] = useState("");
  const [ganhos, setGanhos] = useState("");
  const [perdas, setPerdas] = useState("");
  const [duracao, setDuracao] = useState("");

  async function refresh() {
    if (!user) return;
    setLoading(true);
    try {
      const [c, s] = await Promise.all([carteiraApi.byUser(user.id), sessoesApi.byUser(user.id)]);
      setCarteira(c);
      setSessoes(s);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { refresh(); }, [user]);

  if (!user) return null;

  const totalLucro = sessoes.reduce((acc, s) => acc + s.resultado, 0);
  const limiteAtingido = user.plan === "free" && sessoes.length >= FREE_LIMIT;

  async function salvarBanca(e: React.FormEvent) {
    e.preventDefault();
    const v = Number(bancaInicial);
    if (!v || v <= 0) return toast.error("Informe um valor válido");
    setSaving(true);
    try {
      await carteiraApi.setBancaInicial(user!.id, v);
      await refresh();
      toast.success("Banca inicial registrada!");
    } catch (e: any) {
      toast.error(e.message ?? "Erro ao salvar");
    } finally {
      setSaving(false);
    }
  }

  async function salvarSessao(e: React.FormEvent) {
    e.preventDefault();
    if (limiteAtingido) return toast.error("Limite do plano Free atingido");
    const e_ = Number(entradas), g = Number(ganhos), p = Number(perdas), d = Number(duracao);
    if (!e_ || e_ < 1) return toast.error("Número de entradas inválido");
    if (g < 0 || p < 0) return toast.error("Valores não podem ser negativos");
    if (!d || d < 1) return toast.error("Duração inválida");
    setSaving(true);
    try {
      await sessoesApi.add(user!.id, { entradas: e_, ganhos: g, perdas: p, duracao: d });
      await refresh();
      setEntradas(""); setGanhos(""); setPerdas(""); setDuracao("");
      setOpenSession(false);
      toast.success("Sessão registrada!");
    } catch (e: any) {
      toast.error(e.message ?? "Erro ao salvar");
    } finally {
      setSaving(false);
    }
  }

  if (loading && !carteira) {
    return <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  }

  if (!carteira || carteira.banca_inicial === 0) {
    return (
      <div className="mx-auto flex max-w-md flex-col gap-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Configure sua carteira</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Antes de começar, defina o valor da sua banca inicial.
          </p>
        </div>
        <form onSubmit={salvarBanca} className="glass-card flex flex-col gap-4 rounded-xl p-6">
          <div>
            <Label htmlFor="banca">Banca inicial (R$)</Label>
            <Input
              id="banca" type="number" min={1} step="0.01" required
              value={bancaInicial} onChange={(e) => setBancaInicial(e.target.value)}
              placeholder="1000.00" className="mt-1.5"
            />
          </div>
          <Button disabled={saving} type="submit" className="bg-primary text-primary-foreground hover:opacity-90">
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Salvar e começar
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Minha carteira</h2>
          <p className="text-sm text-muted-foreground">
            Banca inicial: {formatBRL(carteira.banca_inicial)}
          </p>
        </div>

        <Dialog open={openSession} onOpenChange={setOpenSession}>
          <DialogTrigger asChild>
            <Button disabled={limiteAtingido} className="bg-primary text-primary-foreground hover:opacity-90">
              {limiteAtingido ? <Lock className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
              Nova sessão
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Registrar sessão</DialogTitle></DialogHeader>
            <form onSubmit={salvarSessao} className="grid gap-4 py-2">
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Entradas</Label><Input type="number" min={1} value={entradas} onChange={(e) => setEntradas(e.target.value)} className="mt-1.5" /></div>
                <div><Label>Duração (min)</Label><Input type="number" min={1} value={duracao} onChange={(e) => setDuracao(e.target.value)} className="mt-1.5" /></div>
                <div><Label className="text-primary">Ganhos (R$)</Label><Input type="number" min={0} step="0.01" value={ganhos} onChange={(e) => setGanhos(e.target.value)} className="mt-1.5 border-primary/30 focus-visible:ring-primary" /></div>
                <div><Label className="text-destructive">Perdas (R$)</Label><Input type="number" min={0} step="0.01" value={perdas} onChange={(e) => setPerdas(e.target.value)} className="mt-1.5 border-destructive/30 focus-visible:ring-destructive" /></div>
              </div>
              <DialogFooter>
                <Button disabled={saving} type="submit" className="bg-primary text-primary-foreground hover:opacity-90">
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Salvar sessão
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {limiteAtingido && (
        <div className="rounded-xl border border-warning/30 bg-warning/10 p-4 text-sm text-warning">
          Você atingiu o limite de {FREE_LIMIT} sessões do plano Free. Faça upgrade para Premium para continuar.
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard accent="primary" label="Saldo atual" value={formatBRL(carteira.saldo_atual)} icon={<Wallet className="h-4 w-4" />} />
        <StatCard
          label="Lucro / Prejuízo total"
          value={<span className={totalLucro >= 0 ? "text-primary" : "text-destructive"}>{totalLucro >= 0 ? "+" : ""}{formatBRL(totalLucro)}</span>}
          icon={totalLucro >= 0 ? <TrendingUp className="h-4 w-4 text-primary" /> : <TrendingDown className="h-4 w-4 text-destructive" />}
        />
        <StatCard label="Total de sessões" value={`${sessoes.length}`} icon={<Wallet className="h-4 w-4" />} />
      </div>

      <div className="glass-card overflow-hidden rounded-xl">
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <h3 className="text-sm font-semibold">Histórico de sessões</h3>
          <Badge variant="outline" className="text-xs">{sessoes.length}</Badge>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-background/40 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-5 py-3 text-left">Data</th>
                <th className="px-5 py-3 text-right">Entradas</th>
                <th className="px-5 py-3 text-right">Ganhos</th>
                <th className="px-5 py-3 text-right">Perdas</th>
                <th className="px-5 py-3 text-right">Duração</th>
                <th className="px-5 py-3 text-right">Resultado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {sessoes.map((s) => (
                <tr key={s.id} className="hover:bg-background/30">
                  <td className="px-5 py-3">{formatDate(s.created_at)}</td>
                  <td className="px-5 py-3 text-right">{s.entradas}</td>
                  <td className="px-5 py-3 text-right text-primary">{formatBRL(s.ganhos)}</td>
                  <td className="px-5 py-3 text-right text-destructive">{formatBRL(s.perdas)}</td>
                  <td className="px-5 py-3 text-right">{s.duracao}min</td>
                  <td className={`px-5 py-3 text-right font-bold ${s.resultado >= 0 ? "text-primary" : "text-destructive"}`}>
                    {s.resultado >= 0 ? "+" : ""}{formatBRL(s.resultado)}
                  </td>
                </tr>
              ))}
              {sessoes.length === 0 && (
                <tr><td colSpan={6} className="px-5 py-10 text-center text-muted-foreground">Nenhuma sessão registrada ainda</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
