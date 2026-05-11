import { useState } from "react";
import { ArrowRight, Loader2, Lock, Users, Zap } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Logo from "@/components/Logo";

const MEMBERS_LINK = "https://chat.whatsapp.com/CZ1rZ0DQc33DpQVwVfWPOm?mode=gi_t";
const PLAN = "pro" as const;

export default function ThankYouPro() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || password.length < 6) {
      toast.error("Preencha e-mail e senha (mín. 6 caracteres).");
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/app`,
          data: { name: email.split("@")[0] },
        },
      });
      if (error) { toast.error(error.message); return; }

      if (data.user) {
        await new Promise((r) => setTimeout(r, 1200));
        await supabase.from("profiles").update({ plan: PLAN }).eq("id", data.user.id);
      }

      toast.success("Conta criada! Bem-vindo à RZ Studio.");
      navigate("/app");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white antialiased">
      {/* Subtle ambient — PRO uses a cool blue/cyan tint */}
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_40%_at_50%_0%,rgba(255,255,255,0.04),transparent_80%)]" />
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(40%_30%_at_50%_100%,rgba(6,182,212,0.06),transparent_70%)]" />

      {/* Top bar */}
      <header className="relative z-10">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-5 sm:h-16 sm:px-8">
          <Link to="/" aria-label="RZ Trader Studio">
            <Logo className="h-6 sm:h-7" />
          </Link>
          <span className="font-mono text-[9px] uppercase tracking-[0.45em] text-white/25">
            Plano PRO
          </span>
        </div>
      </header>

      <main className="relative z-10 flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center px-5 pb-16 pt-8">
        <div className="w-full max-w-[440px]">

          {/* Badge */}
          <div className="mb-6 flex justify-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 font-mono text-[9px] uppercase tracking-[0.4em] text-white/50">
              <Zap className="h-3 w-3 text-cyan-400/80" />
              PRO · Acesso confirmado
            </span>
          </div>

          {/* Headline */}
          <div className="text-center">
            <h1 className="font-serif text-[32px] font-light leading-[1.1] tracking-tight text-white sm:text-4xl">
              Parabéns,{" "}
              <span className="italic text-cyan-400/80">bem‑vindo.</span>
            </h1>
            <p className="mx-auto mt-3 max-w-xs text-[13px] leading-relaxed text-white/45">
              Acabamos de confirmar seu cadastro no plano <strong className="font-medium text-white/70">PRO</strong>. Crie seu acesso abaixo para entrar na plataforma.
            </p>
          </div>

            <form
              onSubmit={handleSubmit}
              className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)] backdrop-blur-xl sm:p-7"
            >
              <div className="flex flex-col gap-4">
                {/* Email */}
                <div>
                  <label htmlFor="tp-email" className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.28em] text-white/40">
                    E-mail
                  </label>
                  <input
                    id="tp-email"
                    type="email"
                    autoComplete="email"
                    required
                    maxLength={120}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    className="mt-2 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2.5 text-base text-white placeholder:text-white/20 outline-none transition focus:border-white/25 focus:bg-black/60"
                  />
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="tp-pwd" className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.28em] text-white/40">
                    <Lock className="h-3 w-3" /> Senha
                  </label>
                  <input
                    id="tp-pwd"
                    type="password"
                    autoComplete="new-password"
                    required
                    minLength={6}
                    maxLength={72}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className="mt-2 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2.5 text-base text-white placeholder:text-white/20 outline-none transition focus:border-white/25 focus:bg-black/60"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="group mt-2 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-white text-[13px] font-medium text-neutral-900 shadow-[0_10px_40px_-10px_rgba(255,255,255,0.35)] transition hover:bg-neutral-100 disabled:opacity-60"
                >
                  {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  {loading ? "Criando acesso…" : "Confirmar cadastro"}
                  {!loading && <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />}
                </button>
              </div>
            </form>

          {/* Área de Membros CTA */}
          <a
            href={MEMBERS_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-5 flex items-center justify-center gap-2 text-[12px] text-white/35 transition hover:text-white/60"
          >
            <Users className="h-3.5 w-3.5" />
            Entre aqui para aproveitar ao máximo a RZ Studio
            <ArrowRight className="h-3 w-3 transition group-hover:translate-x-0.5" />
          </a>

          <p className="mt-6 text-center font-mono text-[9px] uppercase tracking-[0.32em] text-white/20">
            RZ Trader Studio · Plano PRO
          </p>
        </div>
      </main>
    </div>
  );
}
