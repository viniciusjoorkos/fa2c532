import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { depoimentosApi } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Play, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/calculations";
import { z } from "zod";
import type { Depoimento } from "@/types";

const stories = [
  { name: "Marcos", color: "from-emerald-500 to-cyan-500", quote: "+ R$ 4.200 no mês" },
  { name: "Beatriz", color: "from-amber-500 to-pink-500", quote: "Subi para Ouro" },
  { name: "Igor", color: "from-violet-500 to-blue-500", quote: "Banca dobrou" },
  { name: "Lara", color: "from-rose-500 to-orange-500", quote: "Mais disciplina" },
];

const depoSchema = z.object({
  conteudo: z.string().trim().min(5, "Mensagem muito curta").max(500, "Máximo 500 caracteres"),
});

export default function Depoimentos() {
  const { user } = useAuth();
  const [conteudo, setConteudo] = useState("");
  const [list, setList] = useState<Depoimento[]>([]);
  const [saving, setSaving] = useState(false);

  async function refresh() {
    setList(await depoimentosApi.list());
  }
  useEffect(() => { refresh(); }, []);

  if (!user) return null;

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    const parsed = depoSchema.safeParse({ conteudo });
    if (!parsed.success) return toast.error(parsed.error.errors[0].message);
    setSaving(true);
    try {
      await depoimentosApi.add(user!.id, parsed.data.conteudo);
      setConteudo("");
      await refresh();
      toast.success("Depoimento enviado!");
    } catch (e: any) {
      toast.error(e.message ?? "Erro ao enviar");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Depoimentos</h2>
        <p className="mt-1 text-sm text-muted-foreground">Sua história inspira outros traders. Compartilhe!</p>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Histórias em destaque</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stories.map((s) => (
            <div key={s.name} className={`relative aspect-[9/14] overflow-hidden rounded-xl bg-gradient-to-br ${s.color} p-3 ring-2 ring-primary/40 cursor-pointer transition hover:scale-[1.02]`}>
              <div className="absolute inset-0 bg-black/30" />
              <div className="relative flex h-full flex-col justify-between text-white">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 backdrop-blur">
                  <Play className="h-4 w-4 fill-white" />
                </div>
                <div>
                  <p className="text-xs font-bold">{s.name}</p>
                  <p className="text-[10px] opacity-90">{s.quote}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={enviar} className="glass-card flex flex-col gap-3 rounded-xl p-5">
        <h3 className="text-sm font-semibold">Enviar depoimento</h3>
        <Textarea
          value={conteudo} onChange={(e) => setConteudo(e.target.value)}
          placeholder="Conte como a plataforma impactou sua jornada..."
          rows={4} maxLength={500}
        />
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">{conteudo.length}/500</p>
          <Button disabled={saving} type="submit" className="bg-primary text-primary-foreground hover:opacity-90">
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Publicar
          </Button>
        </div>
      </form>

      <div className="flex flex-col gap-3">
        {list.map((d) => {
          const nm = d.user_name ?? "Usuário";
          const initials = nm.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase();
          return (
            <div key={d.id} className="glass-card flex gap-3 rounded-xl p-4">
              <Avatar className="h-10 w-10 shrink-0">
                <AvatarFallback className="bg-primary text-xs font-bold text-primary-foreground">{initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold">{nm}</p>
                  <Badge variant="outline" className="text-[10px]">{d.tipo}</Badge>
                  <span className="text-xs text-muted-foreground">· {formatDate(d.created_at)}</span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{d.conteudo}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
