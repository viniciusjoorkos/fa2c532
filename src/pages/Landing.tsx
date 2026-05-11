import { Link } from "react-router-dom";
import { Users, Gift } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import {
  ArrowRight,
  Trophy,
  ShieldCheck,
  TrendingUp,
  Target,
  LineChart,
  Zap,
  CheckCircle2,
  Star,
} from "lucide-react";
import * as PricingCard from '@/components/ui/pricing-card';
import { Button } from '@/components/ui/button';
import SmokeBackdrop from "@/components/home/SmokeBackdrop";
import FeaturesSection from "@/components/home/FeaturesSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import Logo from "@/components/Logo";
import timelineImg from "@/assets/student-timeline.jpg";
import lanhouseImg from "@/assets/lanhouse-rezende.jpg";
import rezendeHistoriaImg from "@/assets/rezende-historia.webp";

function useAnimatedCounter(target: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        let start = 0;
        const step = target / (duration / 16);
        const id = setInterval(() => {
          start += step;
          if (start >= target) { setCount(target); clearInterval(id); }
          else setCount(Math.floor(start));
        }, 16);
        obs.disconnect();
      }
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target, duration]);
  return { count, ref };
}

function VturbVideo({ id, scriptSrc, html }: { id: string; scriptSrc: string; html: string }) {
  useEffect(() => {
    const existingScript = document.querySelector(`script[src="${scriptSrc}"]`);
    if (!existingScript) {
      const s = document.createElement("script");
      s.src = scriptSrc;
      s.async = true;
      document.head.appendChild(s);
    }
  }, [scriptSrc]);

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

function PricingSection() {
  const [freePlanOpen, setFreePlanOpen] = useState(true);
  const [closedMsg, setClosedMsg] = useState("Estamos sem vagas no momento. Tente novamente em breve.");

  useEffect(() => {
    import("@/services/siteSettingsApi").then(({ siteSettingsApi }) => {
      siteSettingsApi.getAll().then((all) => {
        const fp = all.find((s: any) => s.key === "free_plan_open");
        const msg = all.find((s: any) => s.key === "free_plan_closed_msg");
        if (fp) setFreePlanOpen(fp.value !== "false");
        if (msg) setClosedMsg(msg.value);
      }).catch(() => {});
    });
  }, []);

  const plans = [
    {
      id: "free",
      name: "Free",
      icon: <Zap className="text-muted-foreground" />,
      price: "Grátis",
      sub: "comece sem risco",
      desc: "Perfeito pra quem quer entrar no jogo e entender o método.",
      highlight: false,
      badge: null,
      features: [
        "7 lives por semana",
        "Acesso às lives abertas",
        "Controle e histórico da sua evolução",
        "Ranking e sistema de progresso",
        "Indicações e recompensas",
      ],
      extraMsg: "Entre no mercado sem pagar nada",
      cta: freePlanOpen ? "Começar grátis" : null,
      ctaHref: freePlanOpen ? "/signup?plan=free" : null,
      ctaMsg: freePlanOpen ? null : closedMsg,
    },
    {
      id: "premium",
      name: "Premium",
      icon: <ShieldCheck className="text-muted-foreground" />,
      price: "R$ 27",
      sub: "mais leitura, mais precisão",
      desc: "Aqui você sai do básico e começa a enxergar o mercado com vantagem.",
      highlight: false,
      badge: null,
      features: [
        "Tudo do plano Free",
        "+1 live extra por semana (8 no total)",
        "Lives exclusivas com análises mais profundas",
        "Setups explicados ao vivo",
        "Acesso à sala fechada",
      ],
      extraMsg: "Menos achismo. Mais leitura de mercado.",
      cta: "Comprar agora!",
      ctaHref: "https://go.perfectpay.com.br/PPU38CQBJT8",
      ctaExternal: true,
    },
    {
      id: "pro",
      name: "PRO",
      icon: <TrendingUp className="text-muted-foreground" />,
      price: "R$ 146",
      sub: "nível de quem leva isso a sério",
      desc: "Esse plano não é pra testar. É pra quem quer resultado.",
      highlight: true,
      badge: "Mais popular",
      features: [
        "Tudo do Premium",
        "+1 live extra (9 no total)",
        "+1 live PRO exclusiva (conteúdo avançado)",
        "Mentoria individual mensal",
        "Acesso ao histórico completo",
        "Prioridade total no suporte",
        "Caminho para o plano Gold",
      ],
      extraMsg: "Você não assiste o mercado. Você aprende a dominar.",
      cta: "Comprar agora!",
      ctaHref: "https://go.perfectpay.com.br/PPU38CQBJTI",
      ctaExternal: true,
    },
    {
      id: "gold",
      name: "GOLD",
      icon: <Star className="text-muted-foreground" />,
      price: "Exclusivo",
      sub: "acesso por mérito",
      desc: "Não está à venda. Aqui entram apenas os que provaram resultado.",
      highlight: false,
      badge: "✦ Não está à venda",
      features: [
        "Tudo do plano PRO",
        "Ambiente fechado com os melhores",
        "Acesso direto e estratégico",
      ],
      cta: null,
      extraMsg: "Não é sobre pagar. É sobre merecer.",
    },
  ];

  return (
    <section id="planos" className="relative bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        {/* header */}
        <div className="text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.45em] text-neutral-400">Planos</p>
          <h2 className="mt-3 font-serif text-3xl font-light leading-tight tracking-tight text-neutral-900 sm:text-5xl">
            Escolha seu plano.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[14px] leading-relaxed text-neutral-500">
            Comece de graça e evolua conforme seus resultados. O plano Gold não está à venda — ele é conquistado.
          </p>
        </div>

        {/* cards grid */}
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan) => {
            const isGold = plan.id === "gold";
            const isPro = plan.id === "pro";
            const isStd = !isGold && !isPro;
            
            return (
              <PricingCard.Card key={plan.id} className={`flex flex-col w-full max-w-none ${isPro ? "border-neutral-900 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.2)] bg-white text-neutral-900" : ""} ${isGold ? "border-yellow-200 bg-gradient-to-b from-yellow-50/80 to-white" : ""} ${isStd ? "bg-white border-neutral-200 text-neutral-900 shadow-md" : ""}`}>
                <PricingCard.Header className="bg-transparent">
                  <PricingCard.Plan>
                    <PricingCard.PlanName className={isPro ? "text-neutral-900 drop-shadow-[0_0_15px_rgba(0,0,0,0.15)]" : isGold ? "text-yellow-700 drop-shadow-[0_0_20px_rgba(234,179,8,0.6)]" : "text-neutral-900 drop-shadow-[0_0_15px_rgba(0,0,0,0.1)]"}>
                      {plan.icon}
                      <span className="text-2xl sm:text-[15px] font-bold tracking-tight">{plan.name}</span>
                    </PricingCard.PlanName>
                    {plan.badge && (
                      <PricingCard.Badge className={isPro ? "bg-neutral-900 text-white border-transparent" : isGold ? "bg-yellow-100 text-yellow-700 border-yellow-300" : "bg-neutral-100 text-neutral-600 border-neutral-200"}>
                        {plan.badge}
                      </PricingCard.Badge>
                    )}
                  </PricingCard.Plan>
                  <PricingCard.Price>
                    <PricingCard.MainPrice className={isGold ? "bg-gradient-to-r from-yellow-500 to-amber-600 bg-clip-text text-transparent" : "text-neutral-900"}>
                      {plan.price}
                    </PricingCard.MainPrice>
                  </PricingCard.Price>
                  <PricingCard.Period className={isGold ? "text-yellow-800" : "text-neutral-500"}>{plan.sub}</PricingCard.Period>

                  {plan.cta && plan.ctaHref ? (
                    <Button
                      asChild
                      variant="outline"
                      className={`w-full mt-4 font-semibold ${isGold ? "border-yellow-300 bg-yellow-50 text-yellow-700 hover:bg-yellow-100" : "bg-neutral-900 text-white hover:bg-neutral-800 border-transparent"}`}
                    >
                      {(plan as any).ctaExternal ? (
                        <a href={plan.ctaHref} target="_blank" rel="noopener noreferrer">{plan.cta}</a>
                      ) : (
                        <Link to={plan.ctaHref}>{plan.cta}</Link>
                      )}
                    </Button>
                  ) : "ctaMsg" in plan && plan.ctaMsg ? (
                    <div className="w-full mt-4 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2 text-center text-[11px] text-neutral-500">
                      {plan.ctaMsg}
                    </div>
                  ) : !isGold ? (
                    <Button disabled variant="outline" className="w-full mt-4">
                      Em breve
                    </Button>
                  ) : null}
                </PricingCard.Header>

                <PricingCard.Body className="flex-1 flex flex-col">
                  {plan.desc && (
                    <PricingCard.Description className={isGold ? "text-[12px]" : "text-neutral-600 text-[12px]"}>
                      {plan.desc}
                    </PricingCard.Description>
                  )}
                  <PricingCard.List className="mt-4 flex-1">
                    {plan.features.map((item) => (
                      <PricingCard.ListItem key={item} className={isGold ? "" : "text-neutral-700"}>
                        <CheckCircle2
                          className={isGold ? "text-yellow-500 w-4 h-4" : "text-emerald-500 w-4 h-4"}
                          aria-hidden="true"
                        />
                        <span>{item}</span>
                      </PricingCard.ListItem>
                    ))}
                  </PricingCard.List>

                  {/* extra message / note */}
                  {"extraMsg" in plan && plan.extraMsg && (
                    <div className={`mt-6 rounded-xl border p-3 text-[11px] leading-relaxed ${
                      isGold
                        ? "border-yellow-200 bg-yellow-50 text-yellow-700"
                        : "border-neutral-200 bg-neutral-50 text-neutral-600"
                    }`}>
                      {plan.extraMsg}
                    </div>
                  )}
                </PricingCard.Body>
              </PricingCard.Card>
            );
          })}
        </div>

        {/* authority note */}
        <p className="mt-10 text-center text-[11px] text-neutral-400">
          Planos pagos são liberados manualmente após análise. Todos os preços e condições são comunicados na confirmação.
        </p>
      </div>
    </section>
  );
}

export default function Landing() {
  const [showStickyCta, setShowStickyCta] = useState(false);
  useEffect(() => {
    const handler = () => setShowStickyCta(window.scrollY > 400);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);
  return (
    <div className="min-h-screen bg-white text-neutral-900 antialiased selection:bg-amber-200/70">
      {/* HERO — full-bleed scroll-driven video */}
      <section className="relative isolate overflow-hidden bg-[#050505] text-white" style={{ minHeight: '100vh' }}>
        {/* No additional overlays — the cinematic video is already dark enough for white text legibility */}

        {/* fade to white at bottom */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[4] h-40 bg-gradient-to-b from-transparent via-[#050505]/60 to-white" />

        {/* Header */}
        <header className="relative z-[10]">
          <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:h-16 sm:px-6">
            <Link to="/" className="flex items-center" aria-label="RZ Trader Studio">
              <Logo className="h-7 sm:h-8" />
            </Link>
            <nav className="flex items-center gap-1.5 text-xs sm:gap-2">
              <Link
                to="/login"
                className="inline-flex h-8 items-center rounded-full border border-white/20 bg-black/30 px-3.5 text-[12px] font-medium text-white backdrop-blur-sm transition hover:bg-white/10 sm:px-4"
              >
                LOGIN
              </Link>
              <a
                href="#planos"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('planos')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex h-8 items-center rounded-full bg-white px-3.5 text-[12px] font-medium text-neutral-900 transition hover:bg-neutral-100 sm:px-4"
              >
                Quero meu acesso
              </a>
            </nav>
          </div>
        </header>

        {/* Hero copy — REZENDE MEET */}
        <div className="relative z-[10] mx-auto flex min-h-[calc(100vh-64px)] max-w-5xl flex-col items-center justify-center px-3 sm:px-6 pb-32 pt-10 text-center">
          <h1 className="font-serif text-[48px] font-bold leading-[1] tracking-tight text-white drop-shadow-[0_4px_30px_rgba(0,0,0,0.6)] sm:text-[72px] lg:text-[96px]">
            REZENDE
            <br />
            <span className="bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent">#FALHAEFALHA</span>
          </h1>

          <p className="mt-4 max-w-lg text-[14px] font-light leading-relaxed tracking-wide text-white/70 drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)] sm:mt-6 sm:text-[16px] lg:text-[18px]" style={{ fontWeight: 300 }}>
            Entre no free ou no vip
            <br />
            Te espero dentro da RZ STUDIO.
          </p>

          {/* VTurb Hero Video */}
          <div className="mt-6 sm:mt-12 w-full sm:max-w-4xl mx-auto rounded-xl sm:rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] -mx-3 sm:mx-auto" style={{width: 'calc(100% + 1.5rem)'}}>
            <VturbVideo
              scriptSrc="https://scripts.converteai.net/512f6166-0536-4361-9189-645ba6587dff/players/69fadd77ce8c536e45bf5317/v4/player.js"
              html={`<vturb-smartplayer id="vid-69fadd77ce8c536e45bf5317" style="display: block; margin: 0 auto; width: 100%;"></vturb-smartplayer>`}
            />
          </div>

          {/* Hero CTA Buttons */}
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
            <a
              href="https://chat.whatsapp.com/CZ1rZ0DQc33DpQVwVfWPOm?mode=gi_t"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex h-12 w-full max-w-[260px] items-center justify-center gap-2.5 rounded-full border border-white/20 bg-white/10 px-6 text-[14px] font-semibold text-white backdrop-blur-md transition-all duration-300 hover:bg-white/20 hover:border-white/40 hover:shadow-[0_0_30px_rgba(255,255,255,0.15)] sm:w-auto"
            >
              <Users className="h-4 w-4 transition-transform group-hover:scale-110" />
              Área de Membros
            </a>
            <a
              href="#planos"
              onClick={(e) => {
                e.preventDefault();
                const freePlanEl = document.getElementById('planos');
                if (freePlanEl) freePlanEl.scrollIntoView({ behavior: 'smooth' });
              }}
              className="group inline-flex h-12 w-full max-w-[260px] items-center justify-center gap-2.5 rounded-full bg-white px-6 text-[14px] font-semibold text-neutral-900 shadow-[0_8px_30px_-6px_rgba(255,255,255,0.3)] transition-all duration-300 hover:bg-neutral-100 hover:shadow-[0_12px_40px_-6px_rgba(255,255,255,0.4)] sm:w-auto"
            >
              <Gift className="h-4 w-4 transition-transform group-hover:scale-110" />
              Plano Free
            </a>
          </div>
        </div>
      </section>

      {/* HISTORIC HIGHLIGHT — editorial, no box */}
      <section className="border-t border-neutral-200/70 bg-white">
        <div className="mx-auto max-w-4xl px-6 py-24 text-center sm:py-32">
          <p className="font-mono text-[10px] uppercase tracking-[0.45em] text-amber-700/80">
            Marco histórico
          </p>
          <h3 className="mt-6 font-serif text-[40px] font-light leading-[1.02] tracking-tight text-neutral-900 sm:text-6xl lg:text-7xl">
            30 WIN
            <br />
            <span className="text-neutral-400">sem gale</span>
            <br />
            <span className="italic text-amber-700">em live.</span>
          </h3>
          <p className="mt-8 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-[0.5em] text-neutral-500 sm:tracking-[0.6em]">
            <span>Rezende</span>
            <span aria-hidden className="text-neutral-300">·</span>
            <span>fez história</span>
          </p>

          {/* Portrait — editorial, premium */}
          <div className="relative mx-auto mt-12 w-full max-w-[340px] sm:mt-16 sm:max-w-[400px]">
            {/* ambient golden glow */}
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-10 -z-10 bg-[radial-gradient(60%_55%_at_50%_50%,rgba(212,175,55,0.22),transparent_70%)] blur-2xl"
            />
            {/* hairline halo behind */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-10 top-6 -z-10 h-[88%] rounded-[40%_60%_55%_45%/45%_50%_50%_55%] bg-gradient-to-b from-neutral-100 to-white shadow-[0_40px_120px_-30px_rgba(0,0,0,0.18)] ring-1 ring-neutral-200/70"
            />
            <img
              src={rezendeHistoriaImg}
              alt="Rezende — operador, dia que fez história"
              width={900}
              height={1100}
              loading="lazy"
              className="relative z-10 mx-auto block h-auto w-full select-none drop-shadow-[0_30px_50px_rgba(0,0,0,0.25)]"
            />
            {/* signature mark */}
            <div className="relative z-10 mt-4 flex items-center justify-center gap-3 font-mono text-[9px] uppercase tracking-[0.42em] text-neutral-400">
              <span className="h-px w-8 bg-neutral-300" />
              <span>30 · WIN · sem gale</span>
              <span className="h-px w-8 bg-neutral-300" />
            </div>
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <PricingSection />

      {/* BÔNUS SECTION — IA RZ DINÂMICO */}
      <section className="relative overflow-hidden bg-[#fafafa] py-24 sm:py-32">
        {/* Ambient top glow */}
        <div aria-hidden className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-[600px] w-[1000px] bg-[radial-gradient(ellipse_at_top,rgba(6,182,212,0.07),transparent_65%)] blur-3xl" />

        <div className="mx-auto max-w-6xl px-6">

          {/* ── Header ─────────────────────────────────── */}
          <div className="text-center">
            <p className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.45em] text-cyan-700">
              <Gift className="h-3.5 w-3.5" />
              Bônus Exclusivo
            </p>

            <h2 className="mt-6 font-serif text-5xl font-bold leading-none tracking-tight text-neutral-900 sm:text-6xl lg:text-7xl">
              BÔNUS
            </h2>

            {/* Brand wordmark — IA (RZ DINÂMICO) */}
            <div className="mt-4 flex flex-col items-center gap-1">
              <div className="flex items-baseline gap-3">
                <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text font-serif text-3xl font-black tracking-tight text-transparent sm:text-4xl lg:text-5xl">
                  IA
                </span>
                <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.55em] text-neutral-400 sm:text-[13px]">
                  RZ DINÂMICO
                </span>
              </div>
              <p className="mt-1 font-sans text-[13px] font-medium uppercase tracking-[0.3em] text-cyan-600 sm:text-[14px]">
                Ilimitado
              </p>
            </div>

            <p className="mx-auto mt-6 max-w-xl text-[15px] leading-relaxed text-neutral-600">
              Em qualquer plano — inclusive o <strong className="text-neutral-900">Free</strong> — estamos liberando a{" "}
              <strong className="text-neutral-900">IA (RZ Dinâmico)</strong> ilimitada. Gratuito para os primeiros{" "}
              <strong className="text-cyan-600">500 novos alunos</strong>.
            </p>
          </div>

          {/* ── Images — large, stacked mobile / featured grid desktop ── */}
          <div className="mt-14 flex flex-col gap-5 lg:grid lg:grid-cols-5 lg:grid-rows-2 lg:gap-5" style={{minHeight: 0}}>

            {/* Image 1 — featured large, spans 3 cols + 2 rows on desktop */}
            <div className="group relative overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-900 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.18)] transition-all duration-500 hover:shadow-[0_30px_80px_-20px_rgba(6,182,212,0.22)] hover:border-cyan-300/60 lg:col-span-3 lg:row-span-2">
              <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <img
                src="/motivos2/home-lavenga-1.png"
                alt="IA RZ Dinâmico — Interface principal"
                loading="lazy"
                className="block h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.025]"
                style={{minHeight: '320px', maxHeight: '520px'}}
              />
              {/* Label */}
              <div className="absolute bottom-4 left-4 z-10 inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-black/60 px-3 py-1.5 backdrop-blur-md">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                <span className="font-mono text-[10px] uppercase tracking-widest text-white/80">Interface principal</span>
              </div>
            </div>

            {/* Image 2 — right top */}
            <div className="group relative overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-900 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.18)] transition-all duration-500 hover:shadow-[0_30px_80px_-20px_rgba(6,182,212,0.22)] hover:border-cyan-300/60 lg:col-span-2 lg:row-span-1">
              <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <img
                src="/motivos2/home-lavenga-2.png"
                alt="IA RZ Dinâmico — Entrada de urgência"
                loading="lazy"
                className="block h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.025]"
                style={{minHeight: '240px', maxHeight: '260px'}}
              />
              <div className="absolute bottom-3 left-3 z-10 inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-black/60 px-3 py-1.5 backdrop-blur-md">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                <span className="font-mono text-[10px] uppercase tracking-widest text-white/80">Entrada de urgência</span>
              </div>
            </div>

            {/* Image 3 — right bottom */}
            <div className="group relative overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-900 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.18)] transition-all duration-500 hover:shadow-[0_30px_80px_-20px_rgba(6,182,212,0.22)] hover:border-cyan-300/60 lg:col-span-2 lg:row-span-1">
              <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <img
                src="/motivos2/home-lavenga-3.png"
                alt="IA RZ Dinâmico — Dashboard completo"
                loading="lazy"
                className="block h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.025]"
                style={{minHeight: '240px', maxHeight: '260px'}}
              />
              <div className="absolute bottom-3 left-3 z-10 inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-black/60 px-3 py-1.5 backdrop-blur-md">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span className="font-mono text-[10px] uppercase tracking-widest text-white/80">Dashboard completo</span>
              </div>
            </div>
          </div>

          {/* ── Bottom badge ───────────────────────────── */}
          <div className="mt-10 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-gradient-to-r from-cyan-50 to-blue-50 px-5 py-2.5 text-[12px] font-medium text-cyan-700 shadow-sm">
              <Zap className="h-3.5 w-3.5" />
              Disponível para os primeiros 500 alunos — Grátis em todos os planos
            </div>
          </div>
        </div>
      </section>


      {/* EDITORIAL split — Iron-Man styled HUD + 3 stats */}
      <section className="relative overflow-hidden border-t border-neutral-200/70 bg-white">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-20 lg:grid-cols-2 lg:gap-16 lg:py-28">
          {/* IMAGE — student timeline */}
          <div className="relative order-2 lg:order-1">
            <div className="relative w-full overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-[0_30px_80px_-30px_rgba(0,0,0,0.18)]">
              <img
                src="/motivos/motivos-rezende.JPG"
                alt="Rotina Lucrativa"
                width={1536}
                height={896}
                loading="lazy"
                className="block h-auto w-full object-contain"
              />
            </div>

            {/* Premium badge — destaque, sem bolinha amarela */}
            <div className="absolute -top-3 left-6 z-20 inline-flex items-center gap-2 rounded-md border border-neutral-900/90 bg-neutral-900 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.32em] text-amber-300 shadow-[0_8px_24px_-8px_rgba(0,0,0,0.5)]">
              <span className="font-mono text-amber-400">01</span>
              <span className="h-3 w-px bg-amber-300/40" />
              <span className="text-white/90">ROTINA LUCRATIVA</span>
            </div>
          </div>

          {/* STATS — premium editorial, horizontal em todos breakpoints */}
          <div className="order-1 lg:order-2">
            <div className="grid grid-cols-3 gap-2 sm:gap-5">
              {[
                { k: "7+5", l: "Lives", s: "Grátis · Premium" },
                { k: "92", u: "%", l: "Payout", s: "Média semanal" },
                { k: "0", l: "Hype", s: "Só método" },
              ].map((m) => (
                <div
                  key={m.l}
                  className="group relative overflow-hidden rounded-xl border border-neutral-200/80 bg-gradient-to-b from-white to-neutral-50/60 p-3 shadow-[0_1px_0_rgba(255,255,255,0.9)_inset,0_10px_30px_-18px_rgba(0,0,0,0.18)] sm:p-5"
                >
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
                  <p className="font-mono text-[8px] uppercase tracking-[0.28em] text-amber-700/80 sm:text-[9px]">
                    {m.l}
                  </p>
                  <p className="mt-1.5 flex items-baseline font-serif text-2xl font-light leading-none text-neutral-900 sm:mt-3 sm:text-5xl">
                    {m.k}
                    {m.u && <span className="ml-0.5 text-base text-neutral-400 sm:text-2xl">{m.u}</span>}
                  </p>
                  <p className="mt-1.5 text-[9px] leading-tight text-neutral-500 sm:mt-3 sm:text-[11px]">
                    {m.s}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>



      {/* === COLORED SMOKE WRAPPER — mid-page → black footer === */}
      <div className="relative isolate overflow-hidden bg-white">
        <SmokeBackdrop />

        {/* FEATURES SECTION — glowing dark cards */}
        <FeaturesSection />

        {/* METRICS strip */}
        <section className="relative z-10 border-t border-neutral-200/60">
          <div className="mx-auto grid max-w-6xl grid-cols-2 divide-y divide-neutral-200/60 px-6 py-14 sm:grid-cols-4 sm:divide-x sm:divide-y-0 sm:py-16">
            {[
              { k: "+400", l: "Membros ativos" },
              { k: "+R$ 500k", l: "Faturados na sala" },
              { k: "30 win", l: "Sem gale em live" },
              { k: "92%", l: "Payout médio" },
            ].map((m) => (
              <div key={m.l} className="px-2 py-4 text-center sm:py-2">
                <p className="font-serif text-3xl font-light text-neutral-900 sm:text-4xl">{m.k}</p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.28em] text-neutral-500">{m.l}</p>
              </div>
            ))}
          </div>
        </section>

        {/* PREMIUM — dark glass card floating over smoke */}
        <section className="relative z-10 mt-8">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="relative overflow-hidden rounded-[2rem] bg-[#0A0A0A] text-white shadow-[0_60px_120px_-40px_rgba(0,0,0,0.6)] ring-1 ring-white/5">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(40%_50%_at_20%_30%,rgba(6,182,212,0.12),transparent_70%)]" />
              <div className="relative grid items-center gap-10 px-6 py-20 sm:px-10 lg:grid-cols-12 lg:gap-14 lg:py-28">
                <div className="relative lg:col-span-5">
                  {/* Premium ambient glow loop */}
                  <div aria-hidden className="pointer-events-none absolute -inset-10 -z-10 overflow-hidden rounded-[2.5rem]">
                    <div className="absolute inset-0 rounded-[2.5rem] bg-[radial-gradient(60%_60%_at_50%_50%,rgba(6,182,212,0.22),transparent_70%)] blur-3xl animate-premium-pulse" />
                    <div className="absolute -inset-[40%] rounded-full bg-[conic-gradient(from_0deg,transparent_0deg,rgba(6,182,212,0.18)_60deg,transparent_140deg,transparent_360deg)] blur-2xl animate-premium-spin" />
                    <div className="absolute inset-0 rounded-[2.5rem] bg-[radial-gradient(40%_40%_at_80%_20%,rgba(56,189,248,0.18),transparent_60%)] blur-2xl animate-premium-glow-b" />
                  </div>
                  <div className="relative overflow-hidden rounded-2xl ring-1 ring-cyan-400/15 shadow-[0_40px_120px_-30px_rgba(0,0,0,0.7)]">
                    <img
                      src="/motivos/rezende-siteoficial.JPG"
                      alt="Rezende Trader Studio — sala premium"
                      width={1536}
                      height={896}
                      loading="lazy"
                      className="aspect-[16/10] w-full object-cover brightness-75"
                    />
                    {/* Orb / Smoke animation overlay */}
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
                      <div className="absolute h-[150%] w-[150%] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15)_0%,transparent_50%)] animate-premium-spin blur-3xl opacity-60" />
                      <div className="absolute h-[120%] w-[120%] bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.1)_0%,transparent_60%)] animate-pulse blur-2xl opacity-70 mix-blend-screen" />
                    </div>
                    {/* Centered Text */}
                    <div className="absolute inset-0 flex items-center justify-center text-center p-4">
                      <h3 className="font-serif text-2xl font-semibold tracking-wide text-white drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)] sm:text-4xl">
                        ESTOU TE ESPERANDO <br />
                        <span className="text-cyan-400">DENTRO DO GRUPO</span>
                      </h3>
                    </div>
                    {/* Subtle sheen sweep */}
                    <div aria-hidden className="pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,transparent_30%,rgba(165,243,252,0.10)_50%,transparent_70%)] bg-[length:250%_100%] animate-premium-sheen" />
                    <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  </div>
                  {/* Premium badge — destaque, azul cyan */}
                  <div className="absolute -top-3 left-6 inline-flex items-center gap-2 rounded-md border border-cyan-400/40 bg-gradient-to-b from-cyan-400 to-blue-500 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.32em] text-white shadow-[0_8px_24px_-8px_rgba(6,182,212,0.6)]">
                    <span className="font-mono">02</span>
                    <span className="h-3 w-px bg-white/30" />
                    <span>PREMIUM</span>
                  </div>
                </div>

                <div className="lg:col-span-7">
                  <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-cyan-400/80">Lives Premium</p>
                  <h2 className="mt-3 font-serif text-3xl font-light leading-[1.1] tracking-tight sm:text-4xl lg:text-5xl">
                    Sala fechada. <br />
                    <span className="italic text-cyan-400">Decisões em segundos.</span>
                  </h2>
                  <p className="mt-5 max-w-md text-[14px] leading-relaxed text-white/55">
                    Leitura de fluxo ao vivo, gestão de risco, expiração e entrada
                    chamadas em tempo real. Para quem opera sério e não tem mais tempo a perder.
                  </p>

                  <ul className="mt-6 space-y-2.5 text-[13px] text-white/70">
                    {[
                      { i: LineChart, t: "Leitura de gráfico em tempo real" },
                      { i: Target, t: "Entradas CALL/PUT com expiração definida" },
                      { i: ShieldCheck, t: "Gestão de risco e stop diário" },
                      { i: Trophy, t: "Replays exclusivos das sessões" },
                    ].map((i) => (
                      <li key={i.t} className="flex items-center gap-3">
                        <i.i className="h-3.5 w-3.5 text-cyan-400/80" strokeWidth={1.5} />
                        {i.t}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8 flex flex-wrap items-center gap-3">
                    <a
                      href="#planos"
                      onClick={(e) => {
                        e.preventDefault();
                        document.getElementById('planos')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="group inline-flex h-10 items-center gap-1.5 rounded-full bg-white px-5 text-[13px] font-medium text-neutral-900 transition hover:bg-neutral-100"
                    >
                      Garantir minha vaga
                      <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS SECTION */}
        <TestimonialsSection />

        {/* FINAL CTA & FOOTER WRAPPER */}
        <div className="relative w-full overflow-hidden bg-black text-white/90">
          {/* Background Video */}
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260217_030345_246c0224-10a4-422c-b324-070b7c0eceda.mp4"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/50" />

          {/* Content Area */}
          <div className="relative z-10">
            {/* FINAL CTA */}
            <section className="border-b border-white/10">
              <div className="mx-auto max-w-3xl px-6 py-24 text-center">
                <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-white/60">
                  Comece hoje
                </p>
                <h2 className="mt-3 font-serif text-3xl font-light leading-[1.1] tracking-tight text-white sm:text-5xl">
                  Pare de operar sozinho.
                  <br />
                  <span className="italic text-white/80">Comece com o plano certo.</span>
                </h2>
                <p className="mx-auto mt-5 max-w-md text-[14px] leading-relaxed text-white">
                  Crie sua conta gratuita agora ou escolha um plano premium para acelerar seus resultados.
                </p>
                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                  <Link
                    to="/signup"
                    className="group inline-flex h-11 items-center gap-1.5 rounded-full bg-white px-6 text-[13px] font-medium text-black shadow-[0_10px_40px_-10px_rgba(255,255,255,0.2)] transition hover:bg-neutral-200"
                  >
                    Criar conta gratuita
                    <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                  </Link>
                  <Link
                    to="/login"
                    className="inline-flex h-11 items-center rounded-full border border-white/30 px-6 text-[13px] font-medium text-white transition hover:border-white hover:bg-white/5"
                  >
                    Já tenho conta
                  </Link>
                </div>
              </div>
            </section>

            {/* FOOTER */}
            <footer className="mx-auto max-w-6xl px-6 py-10">
              {/* Top row: brand + links */}
              <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
                <Logo className="h-4" />
                <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px]">
                  <Link to="/privacidade" className="transition hover:text-white">Política de Privacidade</Link>
                  <span className="hidden h-1 w-1 rounded-full bg-white/15 sm:inline-block" />
                  <Link to="/termos" className="transition hover:text-white">Política de Uso</Link>
                  <span className="hidden h-1 w-1 rounded-full bg-white/15 sm:inline-block" />
                  <a href="mailto:contato@falhaéfalha.online" className="transition hover:text-white">
                    contato@falhaéfalha.online
                  </a>
                </nav>
              </div>

              {/* Minimal honest disclaimer */}
              <p className="mt-8 max-w-3xl text-[11px] leading-relaxed text-white/55">
                Não garantimos resultados. Aplicamos um método de forma diária — você também pode aplicá-lo, e os
                resultados serão sempre individuais, dependendo de disciplina, contexto de mercado e gestão própria.
              </p>

              {/* Legal isolation */}
              <p className="mt-4 max-w-3xl text-[10.5px] leading-relaxed text-white/45">
                Este site não é afiliado, endossado, patrocinado ou administrado pela Meta Platforms, Inc.
                (Facebook / Instagram), Google LLC, TikTok ou qualquer outra rede de anúncios. Todo o conteúdo,
                ofertas e comunicações aqui veiculados são de responsabilidade exclusiva deste site. Operações em
                opções binárias envolvem alto risco e podem resultar em perda total do capital. Resultados passados
                não garantem retornos futuros.
              </p>

              <div className="mt-8 flex flex-col items-start justify-between gap-2 border-t border-white/10 pt-5 text-[10.5px] text-white/45 sm:flex-row sm:items-center">
                <span>© {new Date().getFullYear()} RZ Trader Studio · Todos os direitos reservados.</span>
                <span>contato@falhaéfalha.online</span>
              </div>
            </footer>
          </div>
        </div>
        {/* Spacer for sticky CTA on mobile */}
        <div className="h-20 sm:hidden"></div>
      </div>

      {/* Sticky CTA — mobile only */}
      <div
        className={`fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-black/90 px-4 py-3 backdrop-blur-xl transition-transform duration-300 sm:hidden ${
          showStickyCta ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <button
          onClick={() => { window.scrollTo({ top: 0, behavior: "smooth" }); setTimeout(() => document.getElementById("planos")?.scrollIntoView({ behavior: "smooth" }), 300); }}
          className="flex h-11 w-full items-center justify-center gap-1.5 rounded-full bg-white text-[13px] font-semibold text-neutral-900 shadow-[0_4px_20px_-4px_rgba(255,255,255,0.3)] transition active:scale-[0.98]"
        >
          Ver planos
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
