import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import DottedSurface from "@/components/home/DottedSurface";
import Logo from "@/components/Logo";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname ?? "/app";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await login(email.trim(), password);
    setLoading(false);
    if (!res.ok) {
      toast.error(res.error ?? "Falha ao entrar");
      return;
    }
    toast.success("Bem-vindo de volta.");
    navigate(from, { replace: true });
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050505] text-white antialiased">
      <DottedSurface />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_30%,rgba(212,175,55,0.16),transparent_70%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_100%,rgba(0,0,0,0.6),transparent_60%)]" />

      {/* top bar */}
      <header className="relative z-10">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:h-16 sm:px-6">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[11px] text-white/60 backdrop-blur transition hover:border-white/20 hover:text-white"
          >
            <ArrowLeft className="h-3 w-3" /> Voltar
          </Link>
          <Link to="/" className="flex items-center" aria-label="RZ Trader Studio">
            <Logo className="h-5 sm:h-6" />
          </Link>
        </div>
      </header>

      <main className="relative z-10 flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-4 pb-16 pt-6 sm:pt-10">
        <div className="w-full max-w-[420px]">
          {/* eyebrow */}
          <div className="text-center">
            <p className="font-mono text-[9px] uppercase tracking-[0.45em] text-amber-300/80 sm:text-[10px]">
              Área <span className="mx-2 text-white/30">·</span> de <span className="mx-2 text-white/30">·</span> membros
            </p>
            <h1 className="mt-5 font-serif text-[30px] font-light leading-[1.05] tracking-tight text-white sm:text-4xl">
              Entrar no <span className="italic text-amber-300/95">hub.</span>
            </h1>
            <p className="mx-auto mt-3 max-w-xs text-[12.5px] leading-relaxed text-white/55">
              Acesso restrito por convite. Use as credenciais enviadas após a sua compra.
            </p>
          </div>

          <form
            onSubmit={onSubmit}
            className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-[0_40px_120px_-30px_rgba(0,0,0,0.8)] backdrop-blur-xl sm:p-7"
          >
            <div className="flex flex-col gap-4">
              <div>
                <label htmlFor="email" className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/40">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="mt-2 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2.5 text-[13px] text-white placeholder:text-white/25 outline-none transition focus:border-amber-300/40 focus:bg-black/50"
                />
              </div>

              <div>
                <label htmlFor="password" className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/40">
                  Senha
                </label>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="mt-2 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2.5 text-[13px] text-white placeholder:text-white/25 outline-none transition focus:border-amber-300/40 focus:bg-black/50"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group mt-2 inline-flex h-11 items-center justify-center gap-1.5 rounded-full bg-white text-[13px] font-medium text-neutral-900 shadow-[0_10px_40px_-10px_rgba(255,255,255,0.4)] transition hover:bg-neutral-100 disabled:opacity-60"
              >
                {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                {loading ? "Entrando…" : "Entrar"}
                {!loading && <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />}
              </button>
            </div>
          </form>

          <p className="mt-6 text-center text-[12px] text-white/50">
            Ainda não é membro?{" "}
            <Link to="/signup" className="font-medium text-amber-300/90 transition hover:text-amber-200">
              Solicitar acesso →
            </Link>
          </p>

          <p className="mt-8 text-center font-mono text-[9px] uppercase tracking-[0.32em] text-white/25">
            RZ Trader Studio · acesso por convite
          </p>
        </div>
      </main>
    </div>
  );
}
