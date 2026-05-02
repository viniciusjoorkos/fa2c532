import { useEffect, useState, useMemo } from "react";
import { adminApi } from "@/services/api";
import { notificationsApi, NOTIFICATION_TEMPLATES } from "@/services/notificationsApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Send, Search } from "lucide-react";
import { toast } from "sonner";
import type { Profile } from "@/types";

export default function NotificationsTab() {
  const [users, setUsers] = useState<(Profile & { role: string })[]>([]);
  const [template, setTemplate] = useState(NOTIFICATION_TEMPLATES[0].key);
  const [title, setTitle] = useState(NOTIFICATION_TEMPLATES[0].title);
  const [body, setBody] = useState(NOTIFICATION_TEMPLATES[0].body);
  const [target, setTarget] = useState("broadcast");
  const [sending, setSending] = useState(false);
  const [userSearch, setUserSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => { adminApi.listUsers().then(setUsers).catch(() => {}); }, []);

  function onTemplateChange(key: string) {
    setTemplate(key);
    const tpl = NOTIFICATION_TEMPLATES.find((t) => t.key === key);
    if (tpl) {
      setTitle(tpl.title);
      setBody(tpl.body);
    }
  }

  // Filtered users for combobox
  const filteredUsers = useMemo(() => {
    const nonAdmin = users.filter((u) => u.role !== "admin");
    if (!userSearch.trim()) return nonAdmin.slice(0, 20);
    const q = userSearch.toLowerCase();
    return nonAdmin.filter(
      (u) => u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q)
    ).slice(0, 20);
  }, [users, userSearch]);

  function selectUser(id: string) {
    setTarget(id);
    const u = users.find((u) => u.id === id);
    setUserSearch(u ? `${u.name} (${u.email})` : "");
    setShowDropdown(false);
  }

  function selectBroadcast() {
    setTarget("broadcast");
    setUserSearch("");
    setShowDropdown(false);
  }

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return toast.error("Título obrigatório");
    setSending(true);
    try {
      const tpl = NOTIFICATION_TEMPLATES.find((t) => t.key === template);
      const type = tpl?.type ?? "info";
      if (target === "broadcast") {
        await notificationsApi.adminBroadcast(title, body, type);
        toast.success("Notificação enviada para todos");
      } else {
        await notificationsApi.adminSend(target, title, body, type);
        const user = users.find((u) => u.id === target);
        toast.success(`Enviado para ${user?.name ?? "usuário"}`);
      }
    } catch (err: any) {
      toast.error(err.message ?? "Erro ao enviar");
    } finally { setSending(false); }
  }

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={send} className="glass-card rounded-xl p-5">
        <h3 className="text-sm font-semibold mb-4">Enviar notificação</h3>
        <div className="grid gap-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <Label>Template</Label>
              <Select value={template} onValueChange={onTemplateChange}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {NOTIFICATION_TEMPLATES.map((t) => (
                    <SelectItem key={t.key} value={t.key}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Destinatário</Label>
              <div className="relative mt-1.5">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder={target === "broadcast" ? "📢 Todos os usuários" : "Buscar por nome ou email..."}
                    value={target === "broadcast" && !showDropdown ? "📢 Todos os usuários" : userSearch}
                    onChange={(e) => {
                      setUserSearch(e.target.value);
                      setShowDropdown(true);
                      if (!e.target.value.trim()) setTarget("broadcast");
                    }}
                    onFocus={() => setShowDropdown(true)}
                    className="pl-9"
                  />
                </div>
                {showDropdown && (
                  <div className="absolute z-50 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border border-border bg-popover shadow-lg">
                    <button
                      type="button"
                      onClick={selectBroadcast}
                      className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition hover:bg-accent ${target === "broadcast" ? "bg-accent font-medium" : ""}`}
                    >
                      📢 Todos os usuários
                    </button>
                    {filteredUsers.map((u) => (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => selectUser(u.id)}
                        className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition hover:bg-accent ${target === u.id ? "bg-accent font-medium" : ""}`}
                      >
                        <span className="truncate font-medium">{u.name}</span>
                        <span className="truncate text-xs text-muted-foreground">{u.email}</span>
                      </button>
                    ))}
                    {filteredUsers.length === 0 && (
                      <p className="px-3 py-2 text-xs text-muted-foreground">Nenhum usuário encontrado</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div>
            <Label>Título</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1.5" required />
          </div>
          <div>
            <Label>Mensagem</Label>
            <Textarea value={body} onChange={(e) => setBody(e.target.value)} className="mt-1.5" rows={3} />
          </div>
          <div className="flex justify-end">
            <Button disabled={sending} type="submit" className="bg-primary text-primary-foreground hover:opacity-90">
              {sending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Send className="mr-2 h-4 w-4" /> Enviar
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
