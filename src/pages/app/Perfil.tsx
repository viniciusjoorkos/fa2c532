import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { carteiraApi } from "@/services/api";
import { calcularNivel, formatDate, nivelColor } from "@/lib/calculations";
import { toast } from "sonner";
import { Camera, Lock, Loader2, Crown } from "lucide-react";
import type { Carteira } from "@/types";

export default function Perfil() {
  const { user, updateProfile, updatePassword } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);
  const [pwd, setPwd] = useState("");
  const [carteira, setCarteira] = useState<Carteira | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) carteiraApi.byUser(user.id).then(setCarteira);
  }, [user]);

  if (!user) return null;
  const nivel = calcularNivel(carteira?.banca_inicial ?? 0, carteira?.saldo_atual ?? 0);
  const initials = user.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) return toast.error("Máximo 2MB");
    const reader = new FileReader();
    reader.onload = async () => {
      const res = await updateProfile({ avatar_url: reader.result as string });
      if (res.ok) toast.success("Avatar atualizado!");
      else toast.error(res.error ?? "Erro");
    };
    reader.readAsDataURL(file);
  }

  async function trocarSenha(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await updatePassword(pwd);
      if (!res.ok) return toast.error(res.error ?? "Erro");
      setPwd("");
      toast.success("Senha atualizada!");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Perfil</h2>
        <p className="mt-1 text-sm text-muted-foreground">Gerencie suas informações.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="glass-card flex flex-col items-center gap-4 rounded-xl p-6 text-center lg:col-span-1">
          <div className="relative">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user.avatar_url ?? undefined} />
              <AvatarFallback className="bg-primary text-2xl font-bold text-primary-foreground">{initials}</AvatarFallback>
            </Avatar>
            <button
              onClick={() => fileRef.current?.click()}
              className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-glow transition hover:scale-110"
            >
              <Camera className="h-4 w-4" />
            </button>
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={onUpload} />
          </div>
          <div>
            <h3 className="text-lg font-bold">{user.name}</h3>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            <Badge className={nivelColor(nivel)} variant="outline">Nível {nivel}</Badge>
            <Badge variant="outline" className={user.plan === "premium" ? "border-primary/40 text-primary" : ""}>
              {user.plan === "premium" && <Crown className="mr-1 h-3 w-3" />}
              {user.plan === "premium" ? "Premium" : "Free"}
            </Badge>
            <Badge variant="outline">
              <span className={user.status === "active" ? "dot-online mr-1.5" : "dot-offline mr-1.5"} />
              {user.status === "active" ? "Ativo" : "Inativo"}
            </Badge>
          </div>
        </div>

        <div className="flex flex-col gap-4 lg:col-span-2">
          <div className="glass-card rounded-xl p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Informações</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div>
                <Label className="text-xs text-muted-foreground">Email</Label>
                <Input value={user.email} disabled className="mt-1.5 cursor-not-allowed" />
                <p className="mt-1 text-[11px] text-muted-foreground">O email não pode ser alterado.</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Cadastrado em</Label>
                <Input value={formatDate(user.created_at)} disabled className="mt-1.5 cursor-not-allowed" />
              </div>
            </div>
          </div>

          <form onSubmit={trocarSenha} className="glass-card rounded-xl p-6">
            <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              <Lock className="h-4 w-4" /> Alterar senha
            </h3>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
              <div className="flex-1">
                <Label>Nova senha</Label>
                <Input type="password" minLength={6} value={pwd} onChange={(e) => setPwd(e.target.value)} placeholder="Mínimo 6 caracteres" className="mt-1.5" />
              </div>
              <Button disabled={saving || pwd.length < 6} type="submit" className="bg-primary text-primary-foreground hover:opacity-90">
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Atualizar
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
