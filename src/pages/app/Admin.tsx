import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { adminApi, convitesApi, livesApi } from "@/services/api";
import { formatBRL, formatDate } from "@/lib/calculations";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, CheckCircle2, Crown, Loader2, UserPlus, Copy, BarChart3, Trophy, Bell, Search, Globe } from "lucide-react";
import { toast } from "sonner";
import type { Live, Profile } from "@/types";
import AnalyticsTab from "@/components/admin/AnalyticsTab";
import RankingTab from "@/components/admin/RankingTab";
import NotificationsTab from "@/components/admin/NotificationsTab";
import SiteAssetsTab from "@/components/admin/SiteAssetsTab";
import { AdminSessionsTab } from "@/components/admin/AdminSessionsTab";

export default function Admin() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Painel administrativo</h2>
        <p className="mt-1 text-sm text-muted-foreground">Gerencie usuários, lives, ranking e notificações.</p>
      </div>

      <Tabs defaultValue="analytics" className="flex flex-col gap-4">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="analytics"><BarChart3 className="mr-1.5 h-3.5 w-3.5" />Analytics</TabsTrigger>
          <TabsTrigger value="users">Usuários</TabsTrigger>
          <TabsTrigger value="ranking"><Trophy className="mr-1.5 h-3.5 w-3.5" />Ranking</TabsTrigger>
          <TabsTrigger value="lives">Lives</TabsTrigger>
          <TabsTrigger value="sessions">Sessões</TabsTrigger>
          <TabsTrigger value="notifications"><Bell className="mr-1.5 h-3.5 w-3.5" />Notificações</TabsTrigger>
          <TabsTrigger value="invites">Convites</TabsTrigger>
          <TabsTrigger value="site"><Globe className="mr-1.5 h-3.5 w-3.5" />Ativos do Site</TabsTrigger>
        </TabsList>

        <TabsContent value="analytics"><AnalyticsTab /></TabsContent>
        <TabsContent value="users"><UsersTab /></TabsContent>
        <TabsContent value="ranking"><RankingTab /></TabsContent>
        <TabsContent value="lives"><LivesTab /></TabsContent>
        <TabsContent value="sessions"><AdminSessionsTab /></TabsContent>
        <TabsContent value="notifications"><NotificationsTab /></TabsContent>
        <TabsContent value="invites"><InvitesTab /></TabsContent>
        <TabsContent value="site"><SiteAssetsTab /></TabsContent>
      </Tabs>
    </div>
  );
}

// ----------- Users -----------
function UsersTab() {
  const [users, setUsers] = useState<(Profile & { role: "admin" | "user" })[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterPlan, setFilterPlan] = useState("all");
  const [openNew, setOpenNew] = useState(false);
  const [nEmail, setNEmail] = useState("");
  const [nName, setNName] = useState("");
  const [nPlan, setNPlan] = useState<"free" | "premium" | "pro" | "gold">("free");
  const [nPassword, setNPassword] = useState("");
  const [creating, setCreating] = useState(false);
  const [generated, setGenerated] = useState<string | null>(null);

  async function refresh() {
    setLoading(true);
    try { setUsers(await adminApi.listUsers()); }
    finally { setLoading(false); }
  }
  useEffect(() => { refresh(); }, []);

  async function changePlan(id: string, plan: "free" | "premium" | "pro" | "gold") {
    await adminApi.updatePlan(id, plan);
    await refresh();
    toast.success("Plano atualizado");
  }
  async function changeStatus(id: string, status: "active" | "inactive") {
    await adminApi.updateStatus(id, status);
    await refresh();
    toast.success("Status atualizado");
  }
  async function removeUser(id: string, email: string) {
    if (!confirm(`Excluir o usuário ${email}? Esta ação é permanente.`)) return;
    try {
      await adminApi.deleteUser(id);
      toast.success("Usuário excluído");
      await refresh();
    } catch (e: any) {
      toast.error(e.message ?? "Erro ao excluir");
    }
  }
  async function createUser(e: React.FormEvent) {
    e.preventDefault();
    if (!nEmail) return toast.error("Informe o email");
    setCreating(true);
    try {
      const res = await adminApi.createUser({
        email: nEmail.trim(),
        name: nName.trim() || undefined,
        plan: nPlan,
        password: nPassword.trim() || undefined,
      });
      toast.success("Usuário criado");
      setGenerated(res.password ?? nPassword ?? null);
      setNEmail(""); setNName(""); setNPassword(""); setNPlan("free");
      await refresh();
    } catch (e: any) {
      toast.error(e.message ?? "Erro ao criar");
    } finally {
      setCreating(false);
    }
  }

  if (loading) return <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Buscar por nome ou email..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={filterPlan} onValueChange={setFilterPlan}>
          <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="free">Free</SelectItem>
            <SelectItem value="premium">Premium</SelectItem>
            <SelectItem value="pro">PRO</SelectItem>
            <SelectItem value="gold">GOLD</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex justify-end">
        <Dialog open={openNew} onOpenChange={(v) => { setOpenNew(v); if (!v) setGenerated(null); }}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground hover:opacity-90">
              <UserPlus className="mr-2 h-4 w-4" /> Adicionar usuário
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Novo usuário</DialogTitle></DialogHeader>
            {generated ? (
              <div className="grid gap-3 py-2">
                <p className="text-sm text-muted-foreground">
                  Usuário criado. Compartilhe a senha de acesso (ela não será exibida novamente):
                </p>
                <div className="flex items-center gap-2 rounded-md border border-primary/30 bg-primary/5 px-3 py-2">
                  <code className="flex-1 break-all text-sm">{generated}</code>
                  <Button size="sm" variant="ghost" onClick={() => { navigator.clipboard.writeText(generated); toast.success("Copiado"); }}>
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <DialogFooter>
                  <Button onClick={() => { setGenerated(null); setOpenNew(false); }}>Fechar</Button>
                </DialogFooter>
              </div>
            ) : (
              <form onSubmit={createUser} className="grid gap-3 py-2">
                <div><Label>Email *</Label><Input type="email" value={nEmail} onChange={(e) => setNEmail(e.target.value)} className="mt-1.5" required /></div>
                <div><Label>Nome</Label><Input value={nName} onChange={(e) => setNName(e.target.value)} className="mt-1.5" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Plano</Label>
                    <Select value={nPlan} onValueChange={(v) => setNPlan(v as any)}>
                      <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="free">Free</SelectItem>
                        <SelectItem value="premium">Premium</SelectItem>
                        <SelectItem value="pro">PRO</SelectItem>
                        <SelectItem value="gold">GOLD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div><Label>Senha (opcional)</Label><Input value={nPassword} onChange={(e) => setNPassword(e.target.value)} placeholder="Gerada automaticamente" className="mt-1.5" /></div>
                </div>
                <DialogFooter>
                  <Button disabled={creating} type="submit" className="bg-primary text-primary-foreground hover:opacity-90">
                    {creating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Criar
                  </Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <div className="glass-card overflow-hidden rounded-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-background/40 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-5 py-3 text-left">Email</th>
                <th className="px-5 py-3 text-left">Nome</th>
                <th className="px-5 py-3 text-center">Gold</th>
                <th className="px-5 py-3 text-left">Cadastro</th>
                <th className="px-5 py-3 text-left">Role</th>
                <th className="px-5 py-3 text-left">Plano</th>
                <th className="px-5 py-3 text-left">Status</th>
                <th className="px-5 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.filter((u) => {
                const q = search.toLowerCase();
                const matchSearch = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
                const matchPlan = filterPlan === "all" || u.plan === filterPlan;
                return matchSearch && matchPlan;
              }).map((u) => (
                <tr key={u.id}>
                  <td className="px-5 py-3 font-medium">{u.email}</td>
                  <td className="px-5 py-3">{u.name}</td>
                  <td className="px-5 py-3 text-center">{(u as any).is_gold ? <span className="text-amber-400">✦</span> : "—"}</td>
                  <td className="px-5 py-3 text-muted-foreground">{formatDate(u.created_at)}</td>
                  <td className="px-5 py-3">
                    <Badge variant="outline" className={u.role === "admin" ? "border-primary/40 text-primary" : ""}>
                      {u.role}
                    </Badge>
                  </td>
                  <td className="px-5 py-3">
                    <Select value={u.plan} onValueChange={(v) => changePlan(u.id, v as any)}>
                      <SelectTrigger className="h-8 w-28"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="free">Free</SelectItem>
                        <SelectItem value="premium">Premium</SelectItem>
                        <SelectItem value="pro">PRO</SelectItem>
                        <SelectItem value="gold">GOLD</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="px-5 py-3">
                    <Select value={u.status} onValueChange={(v) => changeStatus(u.id, v as any)}>
                      <SelectTrigger className="h-8 w-28"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Ativo</SelectItem>
                        <SelectItem value="inactive">Inativo</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Button size="sm" variant="ghost" onClick={() => removeUser(u.id, u.email)} title="Excluir usuário">
                      <Trash2 className="h-3.5 w-3.5 text-destructive" />
                    </Button>
                  </td>
                </tr>
              ))}
              {users.filter(() => true).length === 0 && (
                <tr><td colSpan={7} className="px-5 py-8 text-center text-muted-foreground">Nenhum usuário</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ----------- Lives -----------
const PLAN_OPTIONS = [
  { value: "free", label: "Free", color: "text-muted-foreground" },
  { value: "premium", label: "Premium", color: "text-primary" },
  { value: "pro", label: "PRO", color: "text-blue-400" },
  { value: "gold", label: "GOLD", color: "text-amber-400" },
] as const;

function PlanBadges({ access }: { access?: string[] }) {
  const plans = access ?? ["free"];
  return (
    <div className="flex flex-wrap gap-1">
      {PLAN_OPTIONS.filter((p) => plans.includes(p.value)).map((p) => (
        <span key={p.value} className={`text-[10px] font-semibold uppercase ${p.color}`}>{p.label}</span>
      )).reduce((acc: React.ReactNode[], el, i, arr) => [...acc, el, i < arr.length - 1 ? <span key={`sep-${i}`} className="text-muted-foreground/40">·</span> : null], [])}
    </div>
  );
}

function LivesTab() {
  const [lives, setLives] = useState<Live[]>([]);
  const [open, setOpen] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [link, setLink] = useState("");
  const [data, setData] = useState("");
  const [planAccess, setPlanAccess] = useState<string[]>(["free"]);
  const [statusNew, setStatusNew] = useState<"agendada" | "ao_vivo">("agendada");
  const [finalizar, setFinalizar] = useState<string | null>(null);
  const [g, setG] = useState(""); const [p, setP] = useState(""); const [cf, setCf] = useState("");
  const [saving, setSaving] = useState(false);
  const [duplicateId, setDuplicateId] = useState<string | null>(null);
  const [dupDate, setDupDate] = useState("");

  async function refresh() { setLives(await livesApi.list()); }
  useEffect(() => { refresh(); }, []);

  function togglePlan(val: string) {
    setPlanAccess((prev) =>
      prev.includes(val) ? prev.filter((p) => p !== val) : [...prev, val]
    );
  }

  async function criar(e: React.FormEvent) {
    e.preventDefault();
    if (!titulo || !link || !data) return toast.error("Preencha todos os campos obrigatórios");
    if (planAccess.length === 0) return toast.error("Selecione ao menos um plano");
    setSaving(true);
    try {
      const isPremium = planAccess.some((p) => p !== "free");
      await livesApi.create({
        titulo, descricao, link, data: new Date(data).toISOString(),
        status: statusNew, is_premium: isPremium,
        plan_access: planAccess,
      } as any);
      setTitulo(""); setDescricao(""); setLink(""); setData(""); setPlanAccess(["free"]); setStatusNew("agendada");
      setOpen(false); await refresh();
      toast.success("Live criada");
    } catch (e: any) { toast.error(e.message ?? "Erro ao criar"); }
    finally { setSaving(false); }
  }

  async function duplicar(live: Live) {
    setDuplicateId(live.id);
    // Pre-fill date as tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setDupDate(tomorrow.toISOString().slice(0, 16));
  }

  async function confirmDuplicate(e: React.FormEvent) {
    e.preventDefault();
    const src = lives.find((l) => l.id === duplicateId);
    if (!src || !dupDate) return;
    setSaving(true);
    try {
      await livesApi.create({
        titulo: src.titulo,
        descricao: src.descricao,
        link: src.link,
        data: new Date(dupDate).toISOString(),
        status: "agendada",
        is_premium: src.is_premium,
        plan_access: src.plan_access ?? ["free"],
      } as any);
      setDuplicateId(null); setDupDate("");
      await refresh();
      toast.success("Live duplicada");
    } catch (e: any) { toast.error(e.message ?? "Erro"); }
    finally { setSaving(false); }
  }

  async function confirmFinal(e: React.FormEvent) {
    e.preventDefault();
    if (!finalizar) return;
    setSaving(true);
    try {
      await livesApi.update(finalizar, {
        status: "finalizada",
        ganhos: Number(g) || 0, perdas: Number(p) || 0, caixa_final: Number(cf) || 0,
      });
      setFinalizar(null); setG(""); setP(""); setCf("");
      await refresh();
      toast.success("Live finalizada");
    } finally { setSaving(false); }
  }

  async function setStatusOf(id: string, status: Live["status"]) {
    await livesApi.update(id, { status });
    await refresh();
  }

  async function remove(id: string) {
    if (!confirm("Remover esta live?")) return;
    await livesApi.remove(id);
    await refresh();
    toast.success("Removida");
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground hover:opacity-90">
              <Plus className="mr-2 h-4 w-4" /> Nova live
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Criar live</DialogTitle></DialogHeader>
            <form onSubmit={criar} className="grid gap-3 py-2">
              <div><Label>Título *</Label><Input value={titulo} onChange={(e) => setTitulo(e.target.value)} className="mt-1.5" required /></div>
              <div><Label>Descrição</Label><Input value={descricao} onChange={(e) => setDescricao(e.target.value)} className="mt-1.5" /></div>
              <div><Label>Link *</Label><Input value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://..." className="mt-1.5" required /></div>
              <div><Label>Data e hora *</Label><Input type="datetime-local" value={data} onChange={(e) => setData(e.target.value)} className="mt-1.5" required /></div>
              <div>
                <Label>Acesso por plano</Label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {PLAN_OPTIONS.map((opt) => (
                    <button type="button" key={opt.value}
                      onClick={() => togglePlan(opt.value)}
                      className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${planAccess.includes(opt.value) ? `${opt.color} border-current bg-current/10` : "border-border text-muted-foreground"}`}>
                      {opt.label}
                    </button>
                  ))}
                </div>
                <p className="mt-1.5 text-[10px] text-muted-foreground">Free = visível a todos. Cada plano vê suas lives + todas abaixo.</p>
              </div>
              <div>
                <Label>Status inicial</Label>
                <Select value={statusNew} onValueChange={(v) => setStatusNew(v as any)}>
                  <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="agendada">Agendada</SelectItem>
                    <SelectItem value="ao_vivo">Ao vivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button disabled={saving} type="submit" className="bg-primary text-primary-foreground hover:opacity-90">
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Criar
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Duplicate date dialog */}
      <Dialog open={!!duplicateId} onOpenChange={(v) => !v && setDuplicateId(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Duplicar live</DialogTitle></DialogHeader>
          <form onSubmit={confirmDuplicate} className="grid gap-3 py-2">
            <p className="text-sm text-muted-foreground">Escolha a nova data. Todos os outros dados serão copiados.</p>
            <div><Label>Nova data e hora *</Label><Input type="datetime-local" value={dupDate} onChange={(e) => setDupDate(e.target.value)} className="mt-1.5" required /></div>
            <DialogFooter>
              <Button disabled={saving} type="submit" className="bg-primary text-primary-foreground hover:opacity-90">
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Duplicar
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <div className="glass-card overflow-hidden rounded-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-background/40 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-5 py-3 text-left">Título</th>
                <th className="px-5 py-3 text-left">Data</th>
                <th className="px-5 py-3 text-left">Planos</th>
                <th className="px-5 py-3 text-left">Status</th>
                <th className="px-5 py-3 text-right">Resultado</th>
                <th className="px-5 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {lives.map((l) => {
                const r = (l.ganhos ?? 0) - (l.perdas ?? 0);
                return (
                  <tr key={l.id}>
                    <td className="px-5 py-3 font-medium">{l.titulo}</td>
                    <td className="px-5 py-3 text-muted-foreground">{formatDate(l.data)}</td>
                    <td className="px-5 py-3"><PlanBadges access={l.plan_access} /></td>
                    <td className="px-5 py-3">
                      <Select value={l.status} onValueChange={(v) => setStatusOf(l.id, v as any)} disabled={l.status === "finalizada"}>
                        <SelectTrigger className="h-8 w-32"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="agendada">Agendada</SelectItem>
                          <SelectItem value="ao_vivo">Ao vivo</SelectItem>
                          <SelectItem value="finalizada" disabled>Finalizada</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className={`px-5 py-3 text-right font-semibold ${l.status === "finalizada" ? (r >= 0 ? "text-primary" : "text-destructive") : "text-muted-foreground"}`}>
                      {l.status === "finalizada" ? `${r >= 0 ? "+" : ""}${formatBRL(r)}` : "—"}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <Button size="sm" variant="ghost" onClick={() => duplicar(l)} title="Duplicar live">
                          <Copy className="h-3.5 w-3.5" />
                        </Button>
                        {l.status !== "finalizada" && (
                          <Button size="sm" variant="outline" onClick={() => setFinalizar(l.id)}>
                            <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" /> Finalizar
                          </Button>
                        )}
                        <Button size="sm" variant="ghost" onClick={() => remove(l.id)}>
                          <Trash2 className="h-3.5 w-3.5 text-destructive" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {lives.length === 0 && (
                <tr><td colSpan={6} className="px-5 py-8 text-center text-muted-foreground">Nenhuma live</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={!!finalizar} onOpenChange={(v) => !v && setFinalizar(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Finalizar live</DialogTitle></DialogHeader>
          <form onSubmit={confirmFinal} className="grid gap-3 py-2">
            <div><Label className="text-primary">Ganhos (R$)</Label><Input type="number" min={0} step="0.01" value={g} onChange={(e) => setG(e.target.value)} className="mt-1.5 border-primary/30" /></div>
            <div><Label className="text-destructive">Perdas (R$)</Label><Input type="number" min={0} step="0.01" value={p} onChange={(e) => setP(e.target.value)} className="mt-1.5 border-destructive/30" /></div>
            <div><Label>Caixa final (R$)</Label><Input type="number" min={0} step="0.01" value={cf} onChange={(e) => setCf(e.target.value)} className="mt-1.5" /></div>
            <DialogFooter>
              <Button disabled={saving} type="submit" className="bg-primary text-primary-foreground hover:opacity-90">
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Confirmar
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ----------- Convites -----------
function InvitesTab() {
  const [users, setUsers] = useState<(Profile & { role: "admin" | "user" })[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [search, setSearch] = useState("");

  async function refresh() {
    const [u, list] = await Promise.all([adminApi.listUsers(), convitesApi.listAll()]);
    setUsers(u.filter((x) => x.role === "user"));
    setCounts(Object.fromEntries(list.map((c) => [c.user_id, c.quantidade])));
  }
  useEffect(() => { refresh(); }, []);

  async function set(uid: string, qty: number) {
    await convitesApi.setQuantidade(uid, Math.max(0, qty));
    await refresh();
    toast.success("Convites atualizados");
  }

  const filtered = users.filter((u) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q);
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="glass-card rounded-xl p-4">
        <p className="text-sm text-muted-foreground">
          Gerencie quantos convites cada usuário pode enviar. Use os botões para adicionar convites ou zerar o saldo.
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Buscar por nome ou email..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      <div className="glass-card overflow-hidden rounded-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-background/40 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-5 py-3 text-left">Usuário</th>
                <th className="px-5 py-3 text-left">Email</th>
                <th className="px-5 py-3 text-right">Convites</th>
                <th className="px-5 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((u) => {
                const q = counts[u.id] ?? 0;
                return (
                  <tr key={u.id}>
                    <td className="px-5 py-3">{u.name}</td>
                    <td className="px-5 py-3 text-muted-foreground">{u.email}</td>
                    <td className="px-5 py-3 text-right font-bold">{q}</td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline" onClick={() => set(u.id, q + 1)} title="Adicionar 1 convite">+1 convite</Button>
                        <Button size="sm" variant="outline" onClick={() => set(u.id, q + 5)} title="Adicionar 5 convites">+5 convites</Button>
                        <Button size="sm" variant="ghost" onClick={() => set(u.id, 0)} title="Zerar convites">Zerar</Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={4} className="px-5 py-8 text-center text-muted-foreground">Nenhum usuário</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
