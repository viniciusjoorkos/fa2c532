import { useEffect, useRef, useState } from "react";
import { TRADING_PHRASES } from "@/lib/phrases";
import { Activity } from "lucide-react";

/** Terminal IA simulada: digita frase com cursor e mantém histórico que scrolla. */
export function AITerminal() {
  const [history, setHistory] = useState<string[]>([]);
  const [current, setCurrent] = useState("");
  const idxRef = useRef(0);
  const charRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    const tick = () => {
      const phrase = TRADING_PHRASES[idxRef.current % TRADING_PHRASES.length];
      if (charRef.current <= phrase.length) {
        setCurrent(phrase.slice(0, charRef.current));
        charRef.current += 1;
        timeout = setTimeout(tick, 28 + Math.random() * 30);
      } else {
        // commit and start next
        setHistory((h) => {
          const next = [...h, phrase];
          return next.slice(-30);
        });
        setCurrent("");
        charRef.current = 0;
        idxRef.current += 1;
        timeout = setTimeout(tick, 700);
      }
    };

    tick();
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    containerRef.current?.scrollTo({ top: containerRef.current.scrollHeight, behavior: "smooth" });
  }, [history, current]);

  return (
    <div className="glass-card relative overflow-hidden rounded-xl">
      <div className="flex items-center justify-between border-b border-border/60 bg-background/40 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-destructive/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-warning/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-primary" />
          <span className="ml-3 font-mono text-xs text-muted-foreground">tradedesk.ai — sinais ao vivo</span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
          <Activity className="h-3 w-3" />
          análise
        </div>
      </div>

      <div
        ref={containerRef}
        className="relative h-[260px] overflow-y-auto bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.08),transparent_60%)] p-4 font-mono text-sm leading-relaxed scroll-smooth"
      >
        {history.map((line, i) => (
          <div key={i} className="text-muted-foreground">
            <span className="mr-2 text-primary/80">›</span>
            {line}
          </div>
        ))}
        <div className="text-foreground">
          <span className="mr-2 text-primary">›</span>
          <span className="terminal-cursor">{current}</span>
        </div>
      </div>
    </div>
  );
}
