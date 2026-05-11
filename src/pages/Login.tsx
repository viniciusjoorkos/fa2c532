import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Logo from "@/components/Logo";

export default function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname ?? "/app";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const didLoginRef = useRef(false);

  useEffect(() => {
    if (didLoginRef.current && user) {
      didLoginRef.current = false;
      navigate(from, { replace: true });
    }
  }, [user, from, navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await login(email.trim(), password);
    setLoading(false);
    if (!res.ok) {
      toast.error(res.error ?? "Falha ao entrar");
      return;
    }
    toast.success("Acesso liberado.");
    didLoginRef.current = true;
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white antialiased">
      {/* Apple-style very subtle radial — no heavy grain, just depth */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(255,255,255,0.055) 0%, transparent 70%)",
        }}
      />
      {/* Soft vignette bottom */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 100% 50% at 50% 110%, rgba(0,0,0,0.7) 0%, transparent 60%)",
        }}
      />

      {/* Top bar — ultra-minimal */}
      <header className="relative z-10">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-center px-5 sm:h-16">
          <Link to="/" aria-label="RZ Trader Studio" className="opacity-80 transition hover:opacity-100">
            <Logo className="h-6 sm:h-7" />
          </Link>
        </div>
      </header>

      <main className="relative z-10 flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-5 pb-16 pt-6">
        <div className="w-full max-w-[380px]">

          {/* Eyebrow */}
          <p className="text-center font-mono text-[9px] uppercase tracking-[0.5em] text-white/25">
            Área de membros
          </p>

          {/* Title */}
          <h1 className="mt-5 text-center font-serif text-[28px] font-light leading-[1.1] tracking-tight text-white sm:text-[34px]">
            Entrar na plataforma
          </h1>
          <p className="mt-2 text-center text-[12.5px] leading-relaxed text-white/35">
            Use as credenciais criadas no cadastro.
          </p>

          {/* Card */}
          <form
            onSubmit={onSubmit}
            className="mt-8 overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 shadow-[0_32px_80px_-24px_rgba(0,0,0,0.8)] backdrop-blur-2xl sm:p-7"
            style={{ WebkitBackdropFilter: "blur(24px)" }}
          >
            <div className="flex flex-col gap-3.5">
              {/* Email */}
              <div>
                <label
                  htmlFor="login-email"
                  className="block pb-1.5 font-mono text-[10px] uppercase tracking-[0.28em] text-white/35"
                >
                  E-mail
                </label>
                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nome@email.com"
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-3.5 py-3 text-[15px] text-white placeholder:text-white/20 outline-none transition-all focus:border-white/20 focus:bg-white/[0.07] focus:ring-0"
                />
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between pb-1.5">
                  <label
                    htmlFor="login-pwd"
                    className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/35"
                  >
                    Senha
                  </label>
                  <Link
                    to="/recuperar-senha"
                    className="text-[11px] text-white/35 transition hover:text-white/60"
                  >
                    Esqueceu?
                  </Link>
                </div>
                <input
                  id="login-pwd"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-3.5 py-3 text-[15px] text-white placeholder:text-white/15 outline-none transition-all focus:border-white/20 focus:bg-white/[0.07]"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="group mt-1 flex h-12 items-center justify-center gap-2 rounded-xl bg-white text-[14px] font-medium text-neutral-900 shadow-[0_8px_32px_-8px_rgba(255,255,255,0.25)] transition hover:bg-neutral-50 active:scale-[0.98] disabled:opacity-55"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin text-neutral-500" />
                ) : (
                  <>
                    Entrar
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Footer links */}
          <div className="mt-6 flex flex-col items-center gap-3">
            <p className="text-[12px] text-white/30">
              Ainda não tem conta?{" "}
              <Link
                to="/signup?plan=free"
                className="font-medium text-white/55 underline-offset-2 transition hover:text-white/80"
              >
                Criar conta grátis
              </Link>
            </p>
            <p className="font-mono text-[9px] uppercase tracking-[0.35em] text-white/15">
              RZ Trader Studio
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
