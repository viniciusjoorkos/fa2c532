import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft, ArrowRight, Loader2, Mail, InboxIcon } from "lucide-react";
import Logo from "@/components/Logo";
import { toast } from "sonner";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { resetPassword } = useAuth();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      const res = await resetPassword(email.trim());
      if (res.ok) {
        setSuccess(true);
      } else {
        toast.error(res.error ?? "Não foi possível enviar o link. Verifique o e-mail informado.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white antialiased">
      {/* Ambient glow — top */}
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
            /* ── Success state ── */
            <div className="text-center">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-emerald-500/25 bg-emerald-500/10">
                <Mail className="h-7 w-7 text-emerald-400" />
              </div>
              <h1 className="font-serif text-[26px] font-light leading-[1.1] tracking-tight text-white sm:text-3xl">
                Verifique seu e-mail
              </h1>
              <p className="mt-3 text-[13px] leading-relaxed text-white/40">
                Enviamos um link de recuperação para{" "}
                <span className="font-medium text-white/70">{email}</span>.
                <br />Clique no link para criar uma nova senha.
              </p>
              <p className="mt-2 text-[12px] text-white/25">
                Não encontrou? Verifique a pasta de spam.
              </p>

              <div className="mt-7 flex flex-col gap-3">
              <a
                href={`mailto:${email}`}
                className="flex h-11 items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] text-[13px] text-white/60 transition hover:border-white/15 hover:bg-white/[0.07] hover:text-white"
              >
                <InboxIcon className="h-3.5 w-3.5" />
                Abrir meu e-mail
              </a>
                <Link
                  to="/login"
                  className="flex h-11 items-center justify-center gap-2 rounded-xl bg-white text-[13px] font-medium text-neutral-900 transition hover:bg-neutral-100"
                >
                  Voltar ao login
                </Link>
              </div>
            </div>
          ) : (
            /* ── Form state ── */
            <>
              {/* Back link */}
              <Link
                to="/login"
                className="mb-8 inline-flex items-center gap-1.5 text-[12px] text-white/35 transition hover:text-white/65"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Voltar ao login
              </Link>

              <p className="font-mono text-[9px] uppercase tracking-[0.5em] text-white/25">
                Recuperação de senha
              </p>
              <h1 className="mt-4 font-serif text-[28px] font-light leading-[1.1] tracking-tight text-white sm:text-[34px]">
                Esqueceu sua senha?
              </h1>
              <p className="mt-2 text-[12.5px] leading-relaxed text-white/35">
                Digite seu e-mail e enviaremos um link para você criar uma nova senha.
              </p>

              <form
                onSubmit={handleSubmit}
                className="mt-8 overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 shadow-[0_32px_80px_-24px_rgba(0,0,0,0.8)] backdrop-blur-2xl sm:p-7"
              >
                <div className="flex flex-col gap-4">
                  <div>
                    <label
                      htmlFor="fp-email"
                      className="block pb-1.5 font-mono text-[10px] uppercase tracking-[0.28em] text-white/35"
                    >
                      E-mail
                    </label>
                    <input
                      id="fp-email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nome@email.com"
                      className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-3.5 py-3 text-[15px] text-white placeholder:text-white/20 outline-none transition-all focus:border-white/20 focus:bg-white/[0.07]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !email.trim()}
                    className="group flex h-12 items-center justify-center gap-2 rounded-xl bg-white text-[14px] font-medium text-neutral-900 shadow-[0_8px_32px_-8px_rgba(255,255,255,0.25)] transition hover:bg-neutral-50 active:scale-[0.98] disabled:opacity-55"
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin text-neutral-500" />
                    ) : (
                      <>
                        Enviar link de recuperação
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
