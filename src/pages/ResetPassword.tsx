import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight, Loader2, CheckCircle2, Lock } from "lucide-react";
import { toast } from "sonner";
import Logo from "@/components/Logo";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [validSession, setValidSession] = useState<boolean | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Supabase automatically exchanges the recovery token in the URL hash for a session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setValidSession(!!session);
    });

    // Also listen for the PASSWORD_RECOVERY event
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setValidSession(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("As senhas não coincidem.");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setSuccess(true);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err: any) {
      toast.error(err.message ?? "Erro ao atualizar senha.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white antialiased">
      {/* Ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(255,255,255,0.055) 0%, transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 100% 50% at 50% 110%, rgba(0,0,0,0.7) 0%, transparent 60%)",
        }}
      />

      {/* Top bar */}
      <header className="relative z-10">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-center px-5 sm:h-16">
          <Link to="/" aria-label="RZ Trader Studio" className="opacity-80 transition hover:opacity-100">
            <Logo className="h-6 sm:h-7" />
          </Link>
        </div>
      </header>

      <main className="relative z-10 flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-5 pb-16 pt-6">
        <div className="w-full max-w-[380px]">

          {success ? (
            /* ── Success ── */
            <div className="text-center">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-emerald-500/25 bg-emerald-500/10">
                <CheckCircle2 className="h-7 w-7 text-emerald-400" />
              </div>
              <h1 className="font-serif text-[26px] font-light leading-[1.1] tracking-tight text-white sm:text-3xl">
                Senha atualizada!
              </h1>
              <p className="mt-3 text-[13px] leading-relaxed text-white/40">
                Sua senha foi redefinida com sucesso.
                <br />Redirecionando para o login…
              </p>
              <Link
                to="/login"
                className="mt-7 flex h-11 items-center justify-center gap-2 rounded-xl bg-white text-[13px] font-medium text-neutral-900 transition hover:bg-neutral-100"
              >
                Ir para o login
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ) : validSession === false ? (
            /* ── Invalid / expired link ── */
            <div className="text-center">
              <p className="font-mono text-[9px] uppercase tracking-[0.5em] text-white/25">Erro</p>
              <h1 className="mt-4 font-serif text-[26px] font-light tracking-tight text-white">
                Link inválido ou expirado
              </h1>
              <p className="mt-3 text-[13px] leading-relaxed text-white/40">
                O link de recuperação não é válido ou já expirou.
                Solicite um novo link abaixo.
              </p>
              <Link
                to="/recuperar-senha"
                className="mt-7 flex h-11 items-center justify-center gap-2 rounded-xl bg-white text-[13px] font-medium text-neutral-900 transition hover:bg-neutral-100"
              >
                Solicitar novo link
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ) : (
            /* ── Form ── */
            <>
              <p className="font-mono text-[9px] uppercase tracking-[0.5em] text-white/25">
                Nova senha
              </p>
              <h1 className="mt-4 font-serif text-[28px] font-light leading-[1.1] tracking-tight text-white sm:text-[34px]">
                Redefina sua senha
              </h1>
              <p className="mt-2 text-[12.5px] leading-relaxed text-white/35">
                Crie uma senha segura com pelo menos 6 caracteres.
              </p>

              <form
                onSubmit={handleSubmit}
                className="mt-8 overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 shadow-[0_32px_80px_-24px_rgba(0,0,0,0.8)] backdrop-blur-2xl sm:p-7"
              >
                <div className="flex flex-col gap-3.5">
                  {/* New password */}
                  <div>
                    <label
                      htmlFor="rp-pwd"
                      className="flex items-center gap-1.5 pb-1.5 font-mono text-[10px] uppercase tracking-[0.28em] text-white/35"
                    >
                      <Lock className="h-3 w-3" />
                      Nova senha
                    </label>
                    <input
                      id="rp-pwd"
                      type="password"
                      autoComplete="new-password"
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Mínimo 6 caracteres"
                      className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-3.5 py-3 text-[15px] text-white placeholder:text-white/20 outline-none transition-all focus:border-white/20 focus:bg-white/[0.07]"
                    />
                  </div>

                  {/* Confirm password */}
                  <div>
                    <label
                      htmlFor="rp-confirm"
                      className="flex items-center gap-1.5 pb-1.5 font-mono text-[10px] uppercase tracking-[0.28em] text-white/35"
                    >
                      <Lock className="h-3 w-3" />
                      Confirmar senha
                    </label>
                    <input
                      id="rp-confirm"
                      type="password"
                      autoComplete="new-password"
                      required
                      minLength={6}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repita a senha"
                      className={`w-full rounded-xl border px-3.5 py-3 text-[15px] text-white placeholder:text-white/20 outline-none transition-all focus:bg-white/[0.07] ${
                        confirmPassword && password !== confirmPassword
                          ? "border-red-500/40 bg-red-500/[0.04]"
                          : "border-white/[0.08] bg-white/[0.04] focus:border-white/20"
                      }`}
                    />
                    {confirmPassword && password !== confirmPassword && (
                      <p className="mt-1 text-[11px] text-red-400/80">As senhas não coincidem.</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !password || !confirmPassword || password !== confirmPassword}
                    className="group mt-1 flex h-12 items-center justify-center gap-2 rounded-xl bg-white text-[14px] font-medium text-neutral-900 shadow-[0_8px_32px_-8px_rgba(255,255,255,0.25)] transition hover:bg-neutral-50 active:scale-[0.98] disabled:opacity-55"
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin text-neutral-500" />
                    ) : (
                      <>
                        Atualizar senha
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      </>
                    )}
                  </button>
                </div>
              </form>

              <p className="mt-6 text-center font-mono text-[9px] uppercase tracking-[0.35em] text-white/15">
                RZ Trader Studio
              </p>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
