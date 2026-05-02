import { useEffect, useRef, useState } from "react";
import goldenKing from "@/assets/golden-king.png";

/**
 * ScrollPiece — premium decorative element that sits in the middle of the page.
 * When the user scrolls into view, it slides down a few centimeters with the
 * scroll, then locks in place. Pure CSS transform driven by a single rAF
 * scroll listener (passive, throttled). Lightweight and GPU-accelerated.
 *
 * Usage: place inside a relatively-positioned section. It absolutely fills
 * a container; size via the wrapper's height.
 */
export default function ScrollPiece() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(0); // 0 → 1 (clamped)
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Activate only when near viewport (saves CPU when off-screen).
    const io = new IntersectionObserver(
      (entries) => setVisible(entries[0]?.isIntersecting ?? false),
      { rootMargin: "200px 0px 200px 0px" }
    );
    io.observe(el);

    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // Start when element top hits ~70% of viewport, finish when it hits ~30%.
      const start = vh * 0.7;
      const end = vh * 0.3;
      const p = (start - rect.top) / (start - end);
      setProgress(Math.max(0, Math.min(1, p)));
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
  }, [visible]);

  // Travel ~80px down + subtle scale + fade-in. Locks once progress hits 1.
  const translateY = progress * 80;
  const opacity = 0.15 + progress * 0.85;

  return (
    <div ref={ref} className="pointer-events-none relative mx-auto h-[420px] w-full max-w-md sm:h-[520px]">
      <div
        aria-hidden
        className="absolute inset-0 flex items-center justify-center will-change-transform"
        style={{
          transform: `translate3d(0, ${translateY}px, 0)`,
          opacity,
          transition: "opacity 200ms linear",
        }}
      >
        {/* Soft gold glow halo */}
        <div className="absolute h-[70%] w-[70%] rounded-full bg-[radial-gradient(closest-side,rgba(212,175,55,0.30),transparent_70%)] blur-2xl" />
        <img
          src={goldenKing}
          alt=""
          width={384}
          height={512}
          loading="lazy"
          decoding="async"
          className="relative h-full w-auto object-contain drop-shadow-[0_30px_40px_rgba(0,0,0,0.18)]"
        />
      </div>
    </div>
  );
}
