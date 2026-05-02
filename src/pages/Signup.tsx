import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, ShieldCheck, Lock, Sparkles } from "lucide-react";
import DottedSurface from "@/components/home/DottedSurface";
import { PERFECTPAY_CHECKOUT_URL, goToCheckout } from "@/lib/checkout";
import { toast } from "sonner";
import Logo from "@/components/Logo";

export default function Signup() {
  function handleCheckout(e: React.MouseEvent) {
    if (PERFECTPAY_CHECKOUT_URL === "#") {
      e.preventDefault();
      toast.message("Checkout em breve", {
        description: "O link de pagamento ainda está sendo configurado.",
      });
      return;
    }
    e.preventDefault();
    goToCheckout();
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050505] text-white antialiased">
      <DottedSurface />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_30%,rgba(212,175,55,0.18),transparent_70%)]" />
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
        <div className="w-full max-w-[460px] text-center">
          <p className="font-mono text-[9px] uppercase tracking-[0.45em] text-amber-300/80 sm:text-[10px]">
            Solicitar <span className="mx-2 text-white/30">·</span> acesso
          </p>

          <h1 className="mt-5 font-serif text-[34px] font-light leading-[1.05] tracking-tight text-white sm:text-5xl">
            Entrada por <br />
            <span className="italic text-amber-300/95">convite pago.</span>
          </h1>

          <p className="mx-auto mt-4 max-w-sm text-[13px] leading-relaxed text-white/55">
            O acesso ao hub é liberado após a confirmação da sua compra.
            Em seguida, suas credenciais são enviadas por e-mail manualmente pela curadoria.
          </p>

          {/* card */}
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-left shadow-[0_40px_120px_-30px_rgba(0,0,0,0.8)] backdrop-blur-xl sm:p-7">
            <ul className="space-y-3 text-[13px] text-white/70">
              <li className="flex items-start gap-3">
                <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-300/80" strokeWidth={1.5} />
                <span>Acesso à sala fechada e às lives ao vivo com Rezende.</span>
              </li>
              <li className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-300/80" strokeWidth={1.5} />
                <span>Pagamento processado de forma segura pela PerfectPay.</span>
              </li>
              <li className="flex items-start gap-3">
                <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-300/80" strokeWidth={1.5} />
                <span>Cadastro liberado manualmente após a confirmação.</span>
              </li>
            </ul>

            <a
              href={PERFECTPAY_CHECKOUT_URL}
              onClick={handleCheckout}
              className="group mt-6 inline-flex h-11 w-full items-center justify-center gap-1.5 rounded-full bg-white text-[13px] font-medium text-neutral-900 shadow-[0_10px_40px_-10px_rgba(255,255,255,0.4)] transition hover:bg-neutral-100"
            >
              Ir para o checkout
              <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
            </a>

            <p className="mt-3 text-center text-[10px] uppercase tracking-[0.28em] text-white/30">
              Vagas limitadas · acesso por convite
            </p>
          </div>

          <p className="mt-6 text-center text-[12px] text-white/50">
            Já é membro?{" "}
            <Link to="/login" className="font-medium text-amber-300/90 transition hover:text-amber-200">
              Entrar →
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
