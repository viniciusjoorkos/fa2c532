import { useEffect, useRef } from "react";

/**
 * DottedSurface — animated wave dot grid on a black canvas.
 * Pure 2D canvas (no three.js), fully responsive, respects DPR.
 */
export default function DottedSurface({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let w = 0, h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const parent = canvas.parentElement!;
      w = parent.clientWidth;
      h = parent.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement!);

    const spacing = 22;
    const dotR = 1.1;

    const start = performance.now();
    const draw = (now: number) => {
      const t = (now - start) / 1000;
      ctx.clearRect(0, 0, w, h);

      const cols = Math.ceil(w / spacing) + 2;
      const rows = Math.ceil(h / spacing) + 2;

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * spacing;
          const y = j * spacing;

          // perspective-ish wave
          const wave =
            Math.sin((i * 0.35) + t * 0.9) * 4 +
            Math.cos((j * 0.4) - t * 0.7) * 4;

          // distance from horizontal center for fade
          const cy = h * 0.55;
          const dy = Math.abs(y - cy);
          const fade = Math.max(0, 1 - dy / (h * 0.55));

          // gold tint near a moving "spotlight"
          const sx = w * (0.5 + 0.35 * Math.sin(t * 0.25));
          const dx = Math.abs(x - sx);
          const gold = Math.max(0, 1 - dx / (w * 0.35));

          const alpha = 0.08 + fade * 0.55;
          const r = 212, g = 175, b = 55;
          const useGold = gold > 0.35;
          const color = useGold
            ? `rgba(${r}, ${g}, ${b}, ${alpha * (0.4 + gold * 0.8)})`
            : `rgba(255,255,255, ${alpha * 0.55})`;

          ctx.beginPath();
          ctx.arc(x, y + wave, dotR, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.fill();
        }
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      aria-hidden
    />
  );
}
