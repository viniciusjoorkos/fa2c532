import { useEffect, useState } from "react";
import { adminApi } from "@/services/api";
import { notificationsApi, NOTIFICATION_TEMPLATES } from "@/services/notificationsApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import type { Profile } from "@/types";

export default function NotificationsTab() {
  const [users, setUsers] = useState<(Profile & { role: string })[]>([]);
  const [template, setTemplate] = useState(NOTIFICATION_TEMPLATES[0].key);
  const [title, setTitle] = useState(NOTIFICATION_TEMPLATES[0].title);
  const [body, setBody] = useState(NOTIFICATION_TEMPLATES[0].body);
  const [target, setTarget] = useState("broadcast");
  const [sending, setSending] = useState(false);

  useEffect(() => { adminApi.listUsers().then(setUsers).catch(() => {}); }, []);

  function onTemplateChange(key: string) {
    setTemplate(key);
    const tpl = NOTIFICATION_TEMPLATES.find((t) => t.key === key);
    if (tpl) { setTitle(tpl.title); setBody(tpl.body); }
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
              <Select value={target} onValueChange={setTarget}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="broadcast">📢 Todos os usuários</SelectItem>
                  {users.filter((u) => u.role !== "admin").map((u) => (
                    <SelectItem key={u.id} value={u.id}>{u.name} ({u.email})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
