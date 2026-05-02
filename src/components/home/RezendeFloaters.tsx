import { useEffect, useRef, useState } from "react";
import rezendeSm from "@/assets/rezende-sm.webp";
import rezendeMd from "@/assets/rezende-md.webp";
import rezendeLg from "@/assets/rezende-lg.webp";

/**
 * RezendeFloaters — 6 background instances of the "Rezende" wordmark
 * scattered across the throne section. Different sizes, rotations and
 * parallax speeds so they drift in concert with the user's scroll, picking
 * up right around the time the ScrollPiece (throne) finishes its travel.
 *
 * Performance notes:
 *  - Single shared image asset (3 WebP sizes via srcSet) — browser caches once.
 *  - Pure GPU transforms (translate3d + rotate). No layout thrash.
 *  - Single rAF scroll listener + IntersectionObserver to pause off-screen.
 *  - Respects prefers-reduced-motion.
 */

type Floater = {
  // position in % of container (top/left)
  top: string;
  left: string;
  // base width in px
  size: number;
  // rotation in deg (some tilted horizontally / askew)
  rot: number;
  // parallax depth (-1 .. 1). Positive = moves down with scroll.
  depth: number;
  // base opacity
  opacity: number;
  // which size variant to load (perf)
  src: string;
};

const FLOATERS: Floater[] = [
  { top: "4%",  left: "3%",  size: 130, rot: -8,  depth:  0.35, opacity: 0.22, src: rezendeMd },
  { top: "16%", left: "70%", size:  90, rot: 16,  depth: -0.28, opacity: 0.20, src: rezendeSm },
  { top: "40%", left: "80%", size: 110, rot: -4,  depth:  0.45, opacity: 0.24, src: rezendeMd },
  { top: "55%", left: "6%",  size:  80, rot: 24,  depth: -0.32, opacity: 0.18, src: rezendeSm },
  { top: "74%", left: "58%", size: 180, rot: -6,  depth:  0.55, opacity: 0.30, src: rezendeLg },
  { top: "84%", left: "20%", size: 100, rot: 10,  depth: -0.40, opacity: 0.22, src: rezendeMd },
];

export default function RezendeFloaters() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [offset, setOffset] = useState(0); // px scroll offset within section

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let visible = false;
    let raf = 0;

    const io = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? false;
        if (visible) update();
      },
      { rootMargin: "300px 0px 300px 0px" }
    );
    io.observe(el);

    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // 0 when section enters bottom, ~1 when it exits top
      const total = vh + rect.height;
      const passed = vh - rect.top;
      const p = Math.max(0, Math.min(1, passed / total));
      // Map to a px range for parallax travel (-60..+60)
      setOffset((p - 0.5) * 120);
    };

    const onScroll = () => {
      if (!visible || raf) return;
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[1] overflow-hidden"
    >
      {FLOATERS.map((f, i) => {
        const ty = offset * f.depth;
        return (
          <img
            key={i}
            src={rezendeLg}
            srcSet={`${rezendeSm} 240w, ${rezendeMd} 420w, ${rezendeLg} 720w`}
            sizes={`${f.size}px`}
            alt=""
            loading="lazy"
            decoding="async"
            width={f.size}
            height={Math.round(f.size * 0.62)}
            className="absolute select-none will-change-transform"
            style={{
              top: f.top,
              left: f.left,
              width: `${f.size}px`,
              opacity: f.opacity,
              transform: `translate3d(0, ${ty.toFixed(2)}px, 0) rotate(${f.rot}deg)`,
              transition: "opacity 400ms ease",
              filter: "saturate(0.85)",
            }}
          />
        );
      })}
    </div>
  );
}
