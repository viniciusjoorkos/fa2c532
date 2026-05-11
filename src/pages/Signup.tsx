import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, ShieldCheck, Lock, Sparkles, Loader2, CheckCircle2, Mail, InboxIcon } from "lucide-react";
import DottedSurface from "@/components/home/DottedSurface";
import { PERFECTPAY_PREMIUM_URL, PERFECTPAY_PRO_URL, goToCheckout } from "@/lib/checkout";
import { toast } from "sonner";
import Logo from "@/components/Logo";
import { useAuth } from "@/contexts/AuthContext";
import { siteSettingsApi } from "@/services/siteSettingsApi";

export default function Signup() {
  const [searchParams] = useSearchParams();
  const planParam = searchParams.get("plan");
  const navigate = useNavigate();
  const { signup } = useAuth();

  // Free plan availability
  const [freePlanOpen, setFreePlanOpen] = useState(true);
  const [closedMsg, setClosedMsg] = useState("Estamos sem vagas no momento. Tente novamente em breve.");

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    siteSettingsApi.getAll().then((all) => {
      const fp = all.find((s) => s.key === "free_plan_open");
      const msg = all.find((s) => s.key === "free_plan_closed_msg");
      if (fp) setFreePlanOpen(fp.value !== "false");
      if (msg) setClosedMsg(msg.value);
    }).catch(() => {});
  }, []);

  function handleCheckout(e: React.MouseEvent) {
    e.preventDefault();
    goToCheckout(planParam === "pro" ? "pro" : "premium");
  }

  async function handleFreeSignup(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password) {
      toast.error("Preencha todos os campos.");
      return;
    }
    if (password.length < 6) {
      toast.error("Senha deve ter ao menos 6 caracteres.");
      return;
    }
    setLoading(true);
    try {
      const res = await signup(name.trim(), email.trim(), password);
      if (!res.ok) {
        toast.error(res.error ?? "Erro ao criar conta.");
        return;
      }
      setSuccess(true);
      toast.success("Cadastro realizado! Verifique seu e-mail.");
    } finally {
      setLoading(false);
    }
  }

  // If plan param is premium/pro, show checkout flow
  const showCheckout = planParam === "premium" || planParam === "pro";
  // If plan param is free (or default), show registration form
  const showFreeForm = planParam === "free" || (!planParam && !showCheckout);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#080808] text-white antialiased">
      <DottedSurface />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_45%_at_50%_20%,rgba(255,255,255,0.03),transparent_70%)]" />
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
            <Logo className="h-7 sm:h-8" />
          </Link>
        </div>
      </header>

      <main className="relative z-10 flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-4 pb-16 pt-6 sm:pt-10">
        <div className="w-full max-w-[460px] text-center">

          {/* ======== FREE SIGNUP FORM ======== */}
          {showFreeForm && (
            <>
              <p className="font-mono text-[9px] uppercase tracking-[0.4em] text-white/30 sm:text-[10px]">
                Criar conta
              </p>
              <h1 className="mt-5 font-serif text-[30px] font-light leading-[1.05] tracking-tight text-white sm:text-4xl">
                Comece agora <br />
                <span className="italic text-white/80">de graça.</span>
              </h1>
              <p className="mx-auto mt-3 max-w-xs text-[12.5px] leading-relaxed text-white/55">
                Crie sua conta Free e acesse todas as lives gratuitas, dashboard completo e ranking.
              </p>

              {!freePlanOpen ? (
                <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-[0_40px_120px_-30px_rgba(0,0,0,0.8)] backdrop-blur-xl sm:p-7">
                  <div className="flex flex-col items-center gap-3 py-6 text-center">
                    <Lock className="h-8 w-8 text-white/30" />
                    <p className="text-sm text-white/60">{closedMsg}</p>
                    <Link
                      to="/"
                      className="mt-4 inline-flex h-10 items-center rounded-full border border-white/10 px-5 text-[13px] text-white/60 transition hover:border-white/20 hover:text-white"
                    >
                      Voltar ao site
                    </Link>
                  </div>
                </div>
              ) : success ? (
                <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-[0_40px_120px_-30px_rgba(0,0,0,0.8)] backdrop-blur-xl sm:p-8">
                  <div className="flex flex-col items-center gap-4 text-center">
                    {/* Animated envelope icon */}
                    <div className="flex h-16 w-16 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10">
                      <Mail className="h-7 w-7 text-emerald-400" />
                    </div>

                    <div>
                      <p className="text-[18px] font-semibold text-white">Verifique seu e-mail</p>
                      <p className="mt-1 text-[13px] text-white/50">Enviamos um link de confirmação para</p>
                      <p className="mt-0.5 break-all text-[13px] font-medium text-emerald-400">{email}</p>
                    </div>

                    {/* Steps */}
                    <div className="w-full rounded-xl border border-white/8 bg-white/[0.03] p-4 text-left">
                      <p className="mb-3 font-mono text-[9px] uppercase tracking-[0.35em] text-white/30">Como confirmar</p>
                      <ol className="flex flex-col gap-3">
                        {[
                          { n: "1", t: "Abra seu e-mail", d: `Acesse a caixa de entrada de ${email}` },
                          { n: "2", t: "Encontre o e-mail da RZ Studio", d: "Procure por \"Confirme seu cadastro\" — cheque o spam se não encontrar" },
                          { n: "3", t: "Clique em Confirmar", d: "Após clicar no link você será redirecionado e sua conta estará ativa" },
                        ].map((step) => (
                          <li key={step.n} className="flex items-start gap-3">
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/10 font-mono text-[10px] font-bold text-white/60">
                              {step.n}
                            </span>
                            <div>
                              <p className="text-[12px] font-medium text-white/80">{step.t}</p>
                              <p className="text-[11px] text-white/40">{step.d}</p>
                            </div>
                          </li>
                        ))}
                      </ol>
                    </div>

                    {/* Quick action button */}
                    <a
                      href="https://mail.google.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.04] text-[13px] text-white/70 transition hover:border-white/25 hover:bg-white/[0.08] hover:text-white"
                    >
                      <InboxIcon className="h-3.5 w-3.5" />
                      Abrir Gmail
                    </a>

                    <p className="text-[11px] text-white/30">
                      Não recebeu?{" "}
                      <button
                        onClick={() => setSuccess(false)}
                        className="text-white/50 underline transition hover:text-white/70"
                      >
                        Tentar novamente
                      </button>
                    </p>
                  </div>
                </div>
              ) : (
                <form
                  onSubmit={handleFreeSignup}
                  className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-[0_40px_120px_-30px_rgba(0,0,0,0.8)] backdrop-blur-xl sm:p-7"
                >
                  <div className="flex flex-col gap-4 text-left">
                    <div>
                      <label htmlFor="name" className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/40">
                        Nome
                      </label>
                      <input
                        id="name"
                        type="text"
                        required
                        maxLength={60}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Seu nome"
                        className="mt-2 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2.5 text-base text-white placeholder:text-white/25 outline-none transition focus:border-white/30 focus:bg-black/50"
                      />
                    </div>
                    <div>
                      <label htmlFor="signup-email" className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/40">
                        Email
                      </label>
                      <input
                        id="signup-email"
                        type="email"
                        autoComplete="email"
                        required
                        maxLength={120}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="seu@email.com"
                        className="mt-2 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2.5 text-base text-white placeholder:text-white/25 outline-none transition focus:border-white/30 focus:bg-black/50"
                      />
                    </div>
                    <div>
                      <label htmlFor="signup-pwd" className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/40">
                        Senha
                      </label>
                      <input
                        id="signup-pwd"
                        type="password"
                        autoComplete="new-password"
                        required
                        minLength={6}
                        maxLength={72}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Mínimo 6 caracteres"
                        className="mt-2 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2.5 text-base text-white placeholder:text-white/25 outline-none transition focus:border-white/30 focus:bg-black/50"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="group mt-2 inline-flex h-11 items-center justify-center gap-1.5 rounded-full bg-white text-[13px] font-medium text-neutral-900 shadow-[0_10px_40px_-10px_rgba(255,255,255,0.4)] transition hover:bg-neutral-100 disabled:opacity-60"
                    >
                      {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                      {loading ? "Criando conta…" : "Criar conta grátis"}
                      {!loading && <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />}
                    </button>
                  </div>

                  <p className="mt-4 text-center text-[10px] text-white/25">
                    Ao criar sua conta, você concorda com nossos{" "}
                    <Link to="/termos" className="underline hover:text-white/40">termos de uso</Link>.
                  </p>
                </form>
              )}

              <p className="mt-6 text-center text-[12px] text-white/50">
                Quer um plano pago?{" "}
                <Link to="/signup?plan=premium" className="font-medium text-white/80 transition hover:text-white">
                  Ver planos →
                </Link>
              </p>
            </>
          )}

          {/* ======== CHECKOUT FLOW (Premium/PRO) ======== */}
          {showCheckout && (
            <>
              <p className="font-mono text-[9px] uppercase tracking-[0.4em] text-white/30 sm:text-[10px]">
                Plano {planParam === "pro" ? "PRO" : "Premium"}
              </p>

              <h1 className="mt-5 font-serif text-[30px] font-light leading-[1.05] tracking-tight text-white sm:text-4xl">
                Finalizar <br />
                <span className="italic text-white/80">assinatura.</span>
              </h1>

              <p className="mx-auto mt-3 max-w-xs text-[12.5px] leading-relaxed text-white/55">
                O acesso ao plano {planParam === "pro" ? "PRO" : "Premium"} é liberado após confirmação do pagamento.
                Suas credenciais são enviadas por e-mail.
              </p>

              <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-left shadow-[0_40px_120px_-30px_rgba(0,0,0,0.8)] backdrop-blur-xl sm:p-7">
                <div className="mb-4 flex items-baseline justify-between">
                  <span className="text-xs font-semibold uppercase tracking-widest text-white/40">
                    {planParam === "pro" ? "PRO" : "Premium"}
                  </span>
                  <span className="text-2xl font-bold text-white">
                    R$ {planParam === "pro" ? "146" : "27"}
                    <span className="text-sm font-normal text-white/40">/mês</span>
                  </span>
                </div>

                <ul className="space-y-3 text-[13px] text-white/70">
                  <li className="flex items-start gap-3">
                    <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-white/50" strokeWidth={1.5} />
                    <span>Acesso à sala fechada e às lives ao vivo com Rezende.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-white/50" strokeWidth={1.5} />
                    <span>Pagamento processado de forma segura pela PerfectPay.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-white/50" strokeWidth={1.5} />
                    <span>Cadastro liberado manualmente após a confirmação.</span>
                  </li>
                </ul>

                <a
                  href={planParam === "pro" ? PERFECTPAY_PRO_URL : PERFECTPAY_PREMIUM_URL}
                  onClick={handleCheckout}
                  className="group mt-6 inline-flex h-11 w-full items-center justify-center gap-1.5 rounded-full bg-white text-[13px] font-medium text-neutral-900 shadow-[0_10px_40px_-10px_rgba(255,255,255,0.4)] transition hover:bg-neutral-100"
                >
                  Ir para o checkout
                  <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                </a>
              </div>

              <p className="mt-6 text-center text-[12px] text-white/50">
                Quer começar grátis?{" "}
                <Link to="/signup?plan=free" className="font-medium text-white/80 transition hover:text-white">
                  Criar conta Free →
                </Link>
              </p>
            </>
          )}

          {/* Common footer */}
          <p className="mt-6 text-center text-[12px] text-white/50">
            Já é membro?{" "}
            <Link to="/login" className="font-medium text-white/80 transition hover:text-white">
              Entrar →
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
