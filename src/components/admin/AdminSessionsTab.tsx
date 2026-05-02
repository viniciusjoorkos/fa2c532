import { useEffect, useState } from "react";
import { sessoesApi } from "@/services/api";
import { formatBRL, formatDate } from "@/lib/calculations";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Check, X } from "lucide-react";
import { toast } from "sonner";
import type { Sessao } from "@/types";

export function AdminSessionsTab() {
  const [sessoes, setSessoes] = useState<(Sessao & { user_name: string; user_email: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [actioning, setActioning] = useState<string | null>(null);

  async function loadPending() {
    setLoading(true);
    try {
      setSessoes(await sessoesApi.pending());
    } catch (e: any) {
      toast.error(e.message ?? "Erro ao carregar sessões");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPending();
  }, []);

  async function handleApprove(id: string) {
    setActioning(id);
    try {
      await sessoesApi.approve(id);
      toast.success("Sessão aprovada!");
      setSessoes(sessoes.filter(s => s.id !== id));
    } catch (e: any) {
      toast.error(e.message ?? "Erro ao aprovar");
    } finally {
      setActioning(null);
    }
  }

  async function handleReject(id: string) {
    if (!confirm("Reprovar esta sessão? Ela não contará para o lucro e nível do usuário.")) return;
    setActioning(id);
    try {
      await sessoesApi.reject(id);
      toast.success("Sessão reprovada.");
      setSessoes(sessoes.filter(s => s.id !== id));
    } catch (e: any) {
      toast.error(e.message ?? "Erro ao reprovar");
    } finally {
      setActioning(null);
    }
  }

  if (loading) return <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;

  return (
    <div className="flex flex-col gap-4">
      <div className="glass-card overflow-hidden rounded-xl">
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <h3 className="text-sm font-semibold">Sessões Pendentes de Aprovação</h3>
          <Badge variant="outline" className="text-xs">{sessoes.length}</Badge>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-background/40 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-5 py-3 text-left">Usuário</th>
                <th className="px-5 py-3 text-left">Data</th>
                <th className="px-5 py-3 text-right">Entradas</th>
                <th className="px-5 py-3 text-right">Ganhos</th>
                <th className="px-5 py-3 text-right">Perdas</th>
                <th className="px-5 py-3 text-right">Resultado</th>
                <th className="px-5 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {sessoes.map((s) => (
                <tr key={s.id} className="hover:bg-background/30">
                  <td className="px-5 py-3">
                    <p className="font-medium">{s.user_name}</p>
                    <p className="text-[10px] text-muted-foreground">{s.user_email}</p>
                  </td>
                  <td className="px-5 py-3">{formatDate(s.created_at)}</td>
                  <td className="px-5 py-3 text-right">{s.entradas}</td>
                  <td className="px-5 py-3 text-right text-primary">{formatBRL(s.ganhos)}</td>
                  <td className="px-5 py-3 text-right text-destructive">{formatBRL(s.perdas)}</td>
                  <td className={`px-5 py-3 text-right font-bold ${s.resultado >= 0 ? "text-primary" : "text-destructive"}`}>
                    {s.resultado >= 0 ? "+" : ""}{formatBRL(s.resultado)}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-8 w-8 text-primary hover:bg-primary/10"
                        onClick={() => handleApprove(s.id)}
                        disabled={actioning === s.id}
                        title="Aprovar"
                      >
                        {actioning === s.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-8 w-8 text-destructive hover:bg-destructive/10"
                        onClick={() => handleReject(s.id)}
                        disabled={actioning === s.id}
                        title="Reprovar"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {sessoes.length === 0 && (
                <tr><td colSpan={7} className="px-5 py-10 text-center text-muted-foreground">Nenhuma sessão pendente de aprovação</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
