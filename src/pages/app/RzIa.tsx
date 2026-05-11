import { useState } from "react";
import { Copy, Check, ExternalLink, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const ACCESS_CODE = "974592";
const RZ_IA_URL = "https://rzdinamico.com";

export default function RzIa() {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(ACCESS_CODE).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }

  return (
    <div className="flex flex-col gap-6 sm:gap-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="h-5 w-5 text-cyan-500" />
          <p className="text-xs font-semibold uppercase tracking-widest text-cyan-500">
            RZ IA
          </p>
        </div>
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Inteligência Artificial
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Acesse a IA exclusiva da RZ Studio com seu código de membro.
        </p>
      </div>

      {/* Code Section */}
      <div className="glass-card rounded-2xl p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-cyan-500/15 ring-1 ring-cyan-500/30">
            <span className="text-[11px] font-bold text-cyan-500">1</span>
          </div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Código de Acesso
          </h3>
        </div>

        <p className="mb-5 text-[13px] leading-relaxed text-muted-foreground">
          Use este código para acessar a plataforma RZ IA. Copie e cole quando
          for solicitado.
        </p>

        {/* Code box */}
        <div className="flex items-center gap-3">
          <div className="flex-1 flex items-center justify-between rounded-xl border border-border bg-black/40 px-5 py-4 backdrop-blur-sm ring-1 ring-white/5">
            <span className="font-mono text-3xl font-bold tracking-[0.35em] text-white sm:text-4xl">
              {ACCESS_CODE}
            </span>
            <div className="hidden sm:flex items-center gap-1.5">
              {ACCESS_CODE.split("").map((digit, i) => (
                <span
                  key={i}
                  className="flex h-8 w-8 items-center justify-center rounded-md bg-white/5 font-mono text-lg font-semibold text-cyan-400"
                >
                  {digit}
                </span>
              ))}
            </div>
          </div>

          <button
            onClick={handleCopy}
            className={`group relative flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl border transition-all duration-200 sm:h-16 sm:w-16 ${
              copied
                ? "border-emerald-500/50 bg-emerald-500/15 text-emerald-400"
                : "border-border bg-card text-muted-foreground hover:border-cyan-500/50 hover:bg-cyan-500/10 hover:text-cyan-400"
            }`}
            aria-label="Copiar código"
          >
            {copied ? (
              <>
                <Check className="h-5 w-5" />
                <span className="mt-0.5 text-[9px] font-semibold uppercase tracking-wide">
                  Copiado
                </span>
              </>
            ) : (
              <>
                <Copy className="h-5 w-5" />
                <span className="mt-0.5 text-[9px] font-semibold uppercase tracking-wide">
                  Copiar
                </span>
              </>
            )}
          </button>
        </div>

        {/* Hint */}
        <p className="mt-3 text-[11px] text-muted-foreground/70">
          ⓘ Toque no botão "Copiar" para copiar o código automaticamente.
        </p>
      </div>

      {/* Access button section */}
      <div className="glass-card rounded-2xl p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-cyan-500/15 ring-1 ring-cyan-500/30">
            <span className="text-[11px] font-bold text-cyan-500">2</span>
          </div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Acessar Plataforma
          </h3>
        </div>

        <p className="mb-6 text-[13px] leading-relaxed text-muted-foreground">
          Com o código em mãos, clique no botão abaixo para acessar a RZ IA e
          insira o código quando solicitado.
        </p>

        <div className="flex flex-col items-start gap-3">
          <a
            href={RZ_IA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3.5 text-[14px] font-semibold text-white shadow-[0_8px_30px_-8px_rgba(6,182,212,0.6)] transition-all duration-300 hover:shadow-[0_12px_40px_-8px_rgba(6,182,212,0.8)] hover:from-cyan-400 hover:to-blue-500 active:scale-[0.98]"
          >
            <Sparkles className="h-4 w-4 transition-transform group-hover:rotate-12" />
            Acessar RZ IA
            <ExternalLink className="h-3.5 w-3.5 opacity-70" />
          </a>
          <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground/60">
            <Zap className="h-3 w-3" />
            versão 1.4
          </span>
        </div>
      </div>

      {/* Info card */}
      <div className="rounded-xl border border-border bg-card/50 p-4 text-[12px] leading-relaxed text-muted-foreground">
        <strong className="text-foreground">Como funciona?</strong> A RZ IA é
        uma ferramenta exclusiva de inteligência artificial para análise de
        mercado. Seu código de acesso é pessoal e único — mantenha-o em sigilo.
      </div>
    </div>
  );
}
