import { useEffect, useState } from "react";
import { siteSettingsApi } from "@/services/siteSettingsApi";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Globe, ToggleLeft, Save } from "lucide-react";
import { toast } from "sonner";

export default function SiteAssetsTab() {
  const [freePlanOpen, setFreePlanOpen] = useState(true);
  const [closedMsg, setClosedMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const all = await siteSettingsApi.getAll();
        const fp = all.find((s) => s.key === "free_plan_open");
        const msg = all.find((s) => s.key === "free_plan_closed_msg");
        setFreePlanOpen(fp?.value !== "false");
        setClosedMsg(msg?.value ?? "Estamos sem vagas no momento. Tente novamente em breve.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function save() {
    setSaving(true);
    try {
      await Promise.all([
        siteSettingsApi.set("free_plan_open", freePlanOpen ? "true" : "false"),
        siteSettingsApi.set("free_plan_closed_msg", closedMsg),
      ]);
      toast.success("Configurações salvas");
    } catch (e: any) {
      toast.error(e.message ?? "Erro ao salvar");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;

  return (
    <div className="flex flex-col gap-6">
      {/* Free Plan Toggle */}
      <div className="glass-card rounded-xl p-5">
        <div className="flex items-center gap-3 mb-4">
          <Globe className="h-5 w-5 text-primary" />
          <h3 className="text-sm font-semibold">Controle do Plano Free</h3>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between rounded-lg border border-border bg-background/30 p-4">
            <div>
              <Label className="text-sm font-medium">Vagas Free abertas</Label>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Quando desativado, o cadastro free exibirá mensagem de vagas esgotadas na landing page.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-xs font-semibold ${freePlanOpen ? "text-primary" : "text-destructive"}`}>
                {freePlanOpen ? "ABERTO" : "FECHADO"}
              </span>
              <Switch checked={freePlanOpen} onCheckedChange={setFreePlanOpen} />
            </div>
          </div>

          {!freePlanOpen && (
            <div>
              <Label>Mensagem exibida quando fechado</Label>
              <Input
                value={closedMsg}
                onChange={(e) => setClosedMsg(e.target.value)}
                className="mt-1.5"
                placeholder="Estamos sem vagas no momento..."
              />
            </div>
          )}

          {/* Visual preview */}
          <div className={`rounded-lg border p-4 text-center text-sm transition-all ${
            freePlanOpen
              ? "border-primary/20 bg-primary/5 text-primary"
              : "border-destructive/20 bg-destructive/5 text-destructive"
          }`}>
            {freePlanOpen
              ? "✅ Cadastro free está VISÍVEL e ATIVO na landing page"
              : `🚫 Cadastro free está FECHADO — "${closedMsg}"`
            }
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={save} disabled={saving} className="bg-primary text-primary-foreground hover:opacity-90">
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Salvar configurações
        </Button>
      </div>
    </div>
  );
}
