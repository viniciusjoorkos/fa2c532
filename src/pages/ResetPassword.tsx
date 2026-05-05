import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import Logo from "@/components/Logo";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we actually have a session or recovery token
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        // If there's no session, they probably didn't come from a valid link
        // Note: Supabase automatically exchanges the recovery token for a session in the URL hash
      }
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!password || password.length < 6) {
      return toast.error("A senha deve ter pelo menos 6 caracteres.");
    }
    if (password !== confirmPassword) {
      return toast.error("As senhas não coincidem.");
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      
      setSuccess(true);
      setTimeout(() => {
        navigate("/app");
      }, 3000);
    } catch (error: any) {
      toast.error(error.message ?? "Erro ao atualizar senha");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-neutral-50 selection:bg-amber-200/70 dark:bg-[#080808]">
      <header className="absolute inset-x-0 top-0 z-10 flex h-16 items-center px-6">
        <Link to="/" className="flex items-center gap-2">
          <Logo className="h-6 dark:invert-0" />
        </Link>
      </header>

      <main className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/50">
            {success ? (
              <div className="flex flex-col items-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h1 className="mt-4 text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
                  Senha atualizada!
                </h1>
                <p className="mt-2 text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
                  Sua senha foi redefinida com sucesso. Redirecionando para o sistema...
                </p>
                <Button asChild className="mt-6 w-full">
                  <Link to="/app">Ir para Dashboard</Link>
                </Button>
              </div>
            ) : (
              <>
                <div className="mb-8 text-center">
                  <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
                    Nova senha
                  </h1>
                  <p className="mt-1.5 text-sm text-neutral-500 dark:text-neutral-400">
                    Crie uma nova senha para acessar sua conta.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="password" className="text-xs font-semibold uppercase text-neutral-500">
                      Nova Senha
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-neutral-50 dark:bg-neutral-900"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="confirmPassword" className="text-xs font-semibold uppercase text-neutral-500">
                      Confirme a Nova Senha
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="bg-neutral-50 dark:bg-neutral-900"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading || !password || !confirmPassword}
                    className="w-full mt-2 bg-amber-400 text-neutral-900 hover:bg-amber-500 dark:bg-primary dark:text-primary-foreground dark:hover:opacity-90"
                  >
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Atualizar senha
                  </Button>
                </form>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
