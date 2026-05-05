import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowLeft, MailCheck } from "lucide-react";
import Logo from "@/components/Logo";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { resetPassword } = useAuth();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const res = await resetPassword(email);
      if (res.ok) {
        setSuccess(true);
      } else {
        // Trata erro ou deixa o componente tratar se jogar exceção
      }
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
                  <MailCheck className="h-6 w-6" />
                </div>
                <h1 className="mt-4 text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
                  Verifique seu e-mail
                </h1>
                <p className="mt-2 text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
                  Enviamos um link de recuperação para <strong>{email}</strong>. Clique nele para redefinir sua senha.
                </p>
                <Button asChild variant="outline" className="mt-6 w-full">
                  <Link to="/login">Voltar ao login</Link>
                </Button>
              </div>
            ) : (
              <>
                <div className="mb-8 text-center">
                  <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
                    Recuperar senha
                  </h1>
                  <p className="mt-1.5 text-sm text-neutral-500 dark:text-neutral-400">
                    Insira seu e-mail para receber um link de recuperação.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-xs font-semibold uppercase text-neutral-500">
                      E-mail
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-neutral-50 dark:bg-neutral-900"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading || !email}
                    className="w-full bg-amber-400 text-neutral-900 hover:bg-amber-500 dark:bg-primary dark:text-primary-foreground dark:hover:opacity-90"
                  >
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Enviar link
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <Link
                    to="/login"
                    className="inline-flex items-center text-xs font-medium text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                  >
                    <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
                    Voltar ao login
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
