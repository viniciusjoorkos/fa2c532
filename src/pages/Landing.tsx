import { Link } from "react-router-dom";
import { useEffect, useState, useRef, useCallback, memo } from "react";
import {
  ArrowRight,
  Calendar,
  Wallet,
  Trophy,
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  Activity,
  Timer,
  Target,
  LineChart,
} from "lucide-react";
import DottedSurface from "@/components/home/DottedSurface";
import SmokeBackdrop from "@/components/home/SmokeBackdrop";
import ScrollPiece from "@/components/home/ScrollPiece";
import RezendeFloaters from "@/components/home/RezendeFloaters";
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

export default function Landing() {
  const [showStickyCta, setShowStickyCta] = useState(false);
  useEffect(() => {
    const handler = () => setShowStickyCta(window.scrollY > 400);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);
  const memberCounter = useAnimatedCounter(437);
  return (
    <div className="min-h-screen bg-white text-neutral-900 antialiased selection:bg-amber-200/70">
      {/* HERO — black, Apple-dark, SaaS feel */}
      <section className="relative isolate overflow-hidden bg-[#050505] text-white">
        <DottedSurface />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_30%,rgba(212,175,55,0.18),transparent_70%)]" />
        {/* premium fade to white */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent via-[#050505]/60 to-white" />

        {/* Header */}
        <header className="relative z-10">
          <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:h-16 sm:px-6">
            <Link to="/" className="flex items-center" aria-label="RZ Trader Studio">
              <Logo className="h-5 sm:h-6" />
            </Link>
            <nav className="flex items-center gap-1.5 text-xs sm:gap-2">
              <Link
                to="/login"
                className="hidden h-8 items-center rounded-full px-3 text-[12px] text-white/70 transition hover:text-white sm:inline-flex"
              >
                Entrar
              </Link>
              <Link
                to="/signup"
                className="inline-flex h-8 items-center rounded-full bg-white px-3.5 text-[12px] font-medium text-neutral-900 transition hover:bg-neutral-100 sm:px-4"
              >
                Solicitar acesso
              </Link>
            </nav>
          </div>
        </header>

        {/* Hero copy */}
        <div className="relative z-10 mx-auto max-w-5xl px-6 pb-24 pt-14 text-center sm:pb-32 sm:pt-20">
          <p className="font-mono text-[9px] uppercase tracking-[0.45em] text-amber-300/80 sm:text-[10px] sm:tracking-[0.55em]">
            Falha <span className="mx-2 text-white/30">·</span> é <span className="mx-2 text-white/30">·</span> falha
          </p>

          <h1 className="mt-5 font-serif text-[34px] font-light leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-[72px]">
            Frente a frente
            <br />
            <span className="italic text-amber-300/95">com o expert Rezende.</span>
          </h1>

          <p className="mx-auto mt-5 max-w-md text-[13px] leading-relaxed text-white/55 sm:max-w-lg sm:text-[14px]">
            O hub fechado de opções binárias para quem quer operar lado a lado
            com quem vive disso — sem ruído, sem promessa, sem grupo de Telegram.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5">
            <Link
              to="/signup"
              className="group inline-flex h-10 items-center gap-1.5 rounded-full bg-white px-5 text-[13px] font-medium text-neutral-900 shadow-[0_10px_40px_-10px_rgba(255,255,255,0.4)] transition hover:bg-neutral-100"
            >
              Quero meu acesso
              <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/login"
              className="inline-flex h-10 items-center rounded-full px-4 text-[13px] font-medium text-white/70 transition hover:text-white"
            >
              Já sou membro →
            </Link>
          </div>

          <div className="mt-5 flex items-center justify-center gap-4">
            <p className="text-[10px] uppercase tracking-[0.28em] text-white/30">
              Vagas limitadas · acesso por convite
            </p>
            <span className="h-1 w-1 rounded-full bg-white/20" />
            <p className="text-[10px] text-white/40">
              <span ref={memberCounter.ref} className="font-mono font-bold text-amber-300/70">{memberCounter.count}+</span> membros ativos
            </p>
          </div>

          {/* SaaS hero mockup — trading panel */}
          <div className="relative mx-auto mt-14 max-w-3xl sm:mt-16">
            <div className="absolute -inset-x-10 -top-10 -bottom-6 -z-10 rounded-[2rem] bg-[radial-gradient(50%_60%_at_50%_30%,rgba(212,175,55,0.18),transparent_70%)] blur-2xl" />
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.02] shadow-[0_40px_120px_-30px_rgba(0,0,0,0.6)] backdrop-blur">
              {/* window chrome */}
              <div className="flex items-center justify-between border-b border-white/5 px-4 py-2.5">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-white/15" />
                  <span className="h-2 w-2 rounded-full bg-white/15" />
                  <span className="h-2 w-2 rounded-full bg-white/15" />
                </div>
                <div className="flex items-center gap-2 text-[10px] text-white/40">
                  <Activity className="h-3 w-3" />
                  <span className="font-mono tracking-wider">EURUSD · M1</span>
                </div>
                <div className="flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/5 px-2 py-0.5 text-[9px] uppercase tracking-[0.2em] text-emerald-300">
                  <span className="h-1 w-1 rounded-full bg-emerald-400" /> live
                </div>
              </div>

              {/* chart area */}
              <div className="grid grid-cols-12">
                <div className="col-span-12 sm:col-span-9 px-5 pb-5 pt-4">
                  <div className="flex items-baseline justify-between">
                    <div className="text-left">
                      <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/40">
                        Payout
                      </p>
                      <p className="mt-1 font-serif text-2xl font-light text-white">
                        92<span className="text-white/40">%</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-emerald-300">
                      <TrendingUp className="h-3 w-3" />
                      + R$ 2.200
                    </div>
                  </div>

                  {/* candles */}
                  <div className="mt-4 flex h-24 items-end justify-between gap-1">
                    {[
                      { h: 30, c: "up" },
                      { h: 45, c: "up" },
                      { h: 38, c: "down" },
                      { h: 52, c: "up" },
                      { h: 60, c: "up" },
                      { h: 48, c: "down" },
                      { h: 70, c: "up" },
                      { h: 65, c: "up" },
                      { h: 55, c: "down" },
                      { h: 78, c: "up" },
                      { h: 88, c: "up" },
                      { h: 72, c: "down" },
                      { h: 92, c: "up" },
                      { h: 80, c: "up" },
                    ].map((b, i) => (
                      <div
                        key={i}
                        style={{ height: `${b.h}%` }}
                        className={`w-2 rounded-sm ${
                          b.c === "up" ? "bg-emerald-400/80" : "bg-rose-400/70"
                        }`}
                      />
                    ))}
                  </div>

                  <div className="mt-3 flex items-center justify-between font-mono text-[9px] text-white/30">
                    <span>09:42</span>
                    <span>09:48</span>
                    <span>09:54</span>
                    <span>10:00</span>
                  </div>
                </div>

                {/* side panel — CALL / PUT */}
                <div className="col-span-12 border-t border-white/5 px-5 py-4 sm:col-span-3 sm:border-l sm:border-t-0">
                  <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-white/40">
                    Próxima entrada
                  </p>
                  <div className="mt-3 flex items-center gap-1.5 text-[11px] text-white/70">
                    <Timer className="h-3 w-3 text-amber-300" />
                    <span className="font-mono">00:47</span>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-1">
                    <div className="flex items-center justify-center gap-1.5 rounded-md border border-emerald-400/30 bg-emerald-400/10 py-2 text-[11px] font-medium text-emerald-300">
                      <TrendingUp className="h-3 w-3" /> CALL
                    </div>
                    <div className="flex items-center justify-center gap-1.5 rounded-md border border-rose-400/20 bg-rose-400/5 py-2 text-[11px] font-medium text-rose-300/70">
                      <TrendingDown className="h-3 w-3" /> PUT
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* tiny stats below mockup */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 font-mono text-[10px] uppercase tracking-[0.24em] text-white/40">
              <span>+ 400 membros ativos</span>
              <span className="hidden h-1 w-1 rounded-full bg-white/20 sm:inline-block" />
              <span>7 lives grátis · 5 premium</span>
              <span className="hidden h-1 w-1 rounded-full bg-white/20 sm:inline-block" />
              <span>payout até 92%</span>
            </div>
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

      {/* EDITORIAL split — Iron-Man styled HUD + 3 stats */}
      <section className="relative overflow-hidden border-t border-neutral-200/70 bg-white">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-20 lg:grid-cols-2 lg:gap-16 lg:py-28">
          {/* IMAGE — student timeline */}
          <div className="relative order-2 lg:order-1">
            <div className="relative w-full overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-[0_30px_80px_-30px_rgba(0,0,0,0.18)]">
              <img
                src={timelineImg}
                alt="Linha do tempo do aluno: do início ao Studio Max"
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
              <span className="text-white/90">Arsenal</span>
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

      {/* PILLARS — editorial premium */}
      <section className="relative overflow-hidden border-t border-neutral-200/80 bg-gradient-to-b from-white via-neutral-50/60 to-white">
        {/* hairline accent */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
        <div className="mx-auto max-w-6xl px-6 pt-20 sm:pt-28">
          {/* Heading row — editorial */}
          <div className="grid items-end gap-8 sm:grid-cols-12">
            <div className="sm:col-span-7">
              <p className="font-mono text-[10px] uppercase tracking-[0.45em] text-amber-700/80">
                <span className="mr-3 text-neutral-400">/ 03</span>O essencial
              </p>
              <h2 className="mt-5 font-serif text-[34px] font-light leading-[1.05] tracking-tight text-neutral-900 sm:text-5xl">
                Tudo que você precisa.
                <br />
                <span className="italic text-neutral-400">Nada além.</span>
              </h2>
            </div>
            <div className="sm:col-span-5">
              <p className="max-w-sm text-[13px] leading-relaxed text-neutral-500 sm:ml-auto sm:text-right">
                Quatro pilares. Sem ruído, sem promessa milagrosa — apenas o suficiente para operar
                <span className="text-neutral-900"> com método </span>
                todos os dias.
              </p>
            </div>
          </div>

          {/* Pillars grid */}
          <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-neutral-200/80 bg-neutral-200/70 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.18)] sm:mt-20 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                n: "01",
                t: "Lives diárias",
                d: "Opere CALL/PUT em tempo real ao lado do expert. Leitura de mercado em voz alta.",
                tag: "Tempo real",
              },
              {
                n: "02",
                t: "Banca sob controle",
                d: "P&L automático, alertas de tilt e stop dinâmico. A disciplina que separa quem fica.",
                tag: "Risco",
              },
              {
                n: "03",
                t: "Sinais com leitura",
                d: "Entrada, expiração e contexto técnico. Você entende o porquê — não chuta.",
                tag: "Contexto",
              },
              {
                n: "04",
                t: "Sem promessa fácil",
                d: "Método, repetição, paciência. Resultado é consequência — nunca slogan.",
                tag: "Honestidade",
              },
            ].map((f) => (
              <article
                key={f.n}
                className="group relative isolate overflow-hidden bg-white p-7 transition-colors duration-500 hover:bg-neutral-50/70 sm:p-9"
              >
                {/* hover gold halo */}
                <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(120%_60%_at_50%_0%,rgba(212,175,55,0.07),transparent_60%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="flex items-baseline justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-amber-700/80">
                    {f.n}
                  </span>
                  <span className="font-mono text-[9px] uppercase tracking-[0.28em] text-neutral-400">
                    {f.tag}
                  </span>
                </div>
                <div className="mt-8 h-px w-8 bg-neutral-900/80 transition-all duration-500 group-hover:w-14 group-hover:bg-amber-600" />
                <h3 className="mt-5 font-serif text-[22px] font-light leading-tight tracking-tight text-neutral-900 sm:text-[26px]">
                  {f.t}
                </h3>
                <p className="mt-3 text-[12.5px] leading-relaxed text-neutral-500">{f.d}</p>
              </article>
            ))}
          </div>

          {/* footnote */}
          <p className="mx-auto mt-10 max-w-md pb-20 text-center font-mono text-[10px] uppercase tracking-[0.32em] text-neutral-400 sm:mt-14 sm:pb-28">
            Operação · Risco · Contexto · Honestidade
          </p>
        </div>
      </section>

      {/* === COLORED SMOKE WRAPPER — mid-page → black footer === */}
      <div className="relative isolate overflow-hidden bg-white">
        <SmokeBackdrop />

        {/* SCROLL PIECE — golden throne element with parallax lock */}
        <section className="relative z-10 min-h-[760px] overflow-hidden sm:min-h-[860px]">
          {/* Floating "Rezende" wordmarks — parallax background, syncs with throne reveal */}
          <RezendeFloaters />
          <div className="relative z-10 mx-auto max-w-6xl px-6 pt-20 pb-4 text-center sm:pt-24">
            <p className="font-mono text-[10px] uppercase tracking-[0.45em] text-amber-700/80">
              Estratégia
            </p>
            <h2 className="mx-auto mt-3 max-w-xl font-serif text-2xl font-light tracking-tight text-neutral-900 sm:text-3xl">
              Cada movimento.
              <span className="text-neutral-400"> Calculado.</span>
            </h2>
            <ScrollPiece />
          </div>
        </section>

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
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(40%_50%_at_20%_30%,rgba(212,175,55,0.12),transparent_70%)]" />
              <div className="relative grid items-center gap-10 px-6 py-20 sm:px-10 lg:grid-cols-12 lg:gap-14 lg:py-28">
                <div className="relative lg:col-span-5">
                  {/* Premium ambient glow loop */}
                  <div aria-hidden className="pointer-events-none absolute -inset-10 -z-10 overflow-hidden rounded-[2.5rem]">
                    <div className="absolute inset-0 rounded-[2.5rem] bg-[radial-gradient(60%_60%_at_50%_50%,rgba(212,175,55,0.22),transparent_70%)] blur-3xl animate-premium-pulse" />
                    <div className="absolute -inset-[40%] rounded-full bg-[conic-gradient(from_0deg,transparent_0deg,rgba(212,175,55,0.18)_60deg,transparent_140deg,transparent_360deg)] blur-2xl animate-premium-spin" />
                    <div className="absolute inset-0 rounded-[2.5rem] bg-[radial-gradient(40%_40%_at_80%_20%,rgba(255,210,120,0.18),transparent_60%)] blur-2xl animate-premium-glow-b" />
                  </div>
                  <div className="relative overflow-hidden rounded-2xl ring-1 ring-amber-300/15 shadow-[0_40px_120px_-30px_rgba(0,0,0,0.7)]">
                    <img
                      src={lanhouseImg}
                      alt="Rezende Trader Studio — sala premium com estações de operação"
                      width={1536}
                      height={896}
                      loading="lazy"
                      className="aspect-[16/10] w-full object-cover"
                    />
                    {/* Subtle sheen sweep */}
                    <div aria-hidden className="pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,transparent_30%,rgba(255,220,150,0.10)_50%,transparent_70%)] bg-[length:250%_100%] animate-premium-sheen" />
                    <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  </div>
                  {/* Premium badge — destaque, sem bolinha amarela */}
                  <div className="absolute -top-3 left-6 inline-flex items-center gap-2 rounded-md border border-amber-300/40 bg-gradient-to-b from-amber-300 to-amber-500 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.32em] text-neutral-900 shadow-[0_8px_24px_-8px_rgba(212,175,55,0.6)]">
                    <span className="font-mono">02</span>
                    <span className="h-3 w-px bg-neutral-900/30" />
                    <span>Premium</span>
                  </div>
                </div>

                <div className="lg:col-span-7">
                  <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-amber-300/80">Lives Premium</p>
                  <h2 className="mt-3 font-serif text-3xl font-light leading-[1.1] tracking-tight sm:text-4xl lg:text-5xl">
                    Sala fechada. <br />
                    <span className="italic text-amber-300">Decisões em segundos.</span>
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
                        <i.i className="h-3.5 w-3.5 text-amber-300/80" strokeWidth={1.5} />
                        {i.t}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8 flex flex-wrap items-center gap-3">
                    <Link
                      to="/signup"
                      className="group inline-flex h-10 items-center gap-1.5 rounded-full bg-white px-5 text-[13px] font-medium text-neutral-900 transition hover:bg-neutral-100"
                    >
                      Garantir minha vaga
                      <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                    </Link>
                    <span className="text-[10px] uppercase tracking-[0.28em] text-white/30">
                      Apenas por convite
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="relative z-10">
          <div className="mx-auto max-w-3xl px-6 py-24 text-center">
            <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-amber-700/80">
              Última palavra
            </p>
            <h2 className="mt-3 font-serif text-3xl font-light leading-[1.1] tracking-tight text-neutral-900 sm:text-5xl">
              Pare de operar sozinho.
              <br />
              <span className="italic text-amber-700">Comece hoje.</span>
            </h2>
            <p className="mx-auto mt-5 max-w-md text-[14px] leading-relaxed text-neutral-600">
              Acesso por convite. Vagas limitadas por turma para preservar a qualidade da sala.
            </p>
            <div className="mt-8">
              <Link
                to="/signup"
                className="group inline-flex h-11 items-center gap-1.5 rounded-full bg-neutral-900 px-6 text-[13px] font-medium text-white shadow-[0_10px_40px_-10px_rgba(0,0,0,0.4)] transition hover:bg-neutral-800"
              >
                Solicitar meu acesso
                <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </section>

        {/* FOOTER — black, blends with smoke bottom */}
        <footer className="relative z-10 border-t border-white/5 bg-black text-white/55">
          <div className="mx-auto max-w-6xl px-6 py-10">
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
            <p className="mt-8 max-w-3xl text-[11px] leading-relaxed text-white/45">
              Não garantimos resultados. Aplicamos um método de forma diária — você também pode aplicá-lo, e os
              resultados serão sempre individuais, dependendo de disciplina, contexto de mercado e gestão própria.
            </p>

            {/* Legal isolation */}
            <p className="mt-4 max-w-3xl text-[10.5px] leading-relaxed text-white/35">
              Este site não é afiliado, endossado, patrocinado ou administrado pela Meta Platforms, Inc.
              (Facebook / Instagram), Google LLC, TikTok ou qualquer outra rede de anúncios. Todo o conteúdo,
              ofertas e comunicações aqui veiculados são de responsabilidade exclusiva deste site. Operações em
              opções binárias envolvem alto risco e podem resultar em perda total do capital. Resultados passados
              não garantem retornos futuros.
            </p>

            <div className="mt-8 flex flex-col items-start justify-between gap-2 border-t border-white/5 pt-5 text-[10.5px] text-white/35 sm:flex-row sm:items-center">
              <span>© {new Date().getFullYear()} RZ Trader Studio · Todos os direitos reservados.</span>
              <span>contato@falhaéfalha.online</span>
            </div>
          </div>
        </footer>
      </div>

      {/* Sticky CTA — mobile only */}
      <div
        className={`fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-black/90 px-4 py-3 backdrop-blur-xl transition-transform duration-300 sm:hidden ${
          showStickyCta ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <Link
          to="/signup"
          className="flex h-11 w-full items-center justify-center gap-1.5 rounded-full bg-white text-[13px] font-semibold text-neutral-900 shadow-[0_4px_20px_-4px_rgba(255,255,255,0.3)] transition active:scale-[0.98]"
        >
          Quero meu acesso
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
