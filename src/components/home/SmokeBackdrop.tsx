/**
 * SmokeBackdrop — fixed-positioned colored smoke gradients on the LATERAL edges
 * that fade from white (mid-page) → colored haze → black (footer).
 *
 * Performance:
 *  - Pure CSS radial gradients (no canvas, no JS rAF).
 *  - Two animated layers max (transform + opacity only → compositor thread).
 *  - Mobile-friendly: lower blur, smaller layers, respects prefers-reduced-motion.
 *
 * Usage: place ONCE inside a relatively-positioned wrapper that spans the
 * "mid → footer" region. It fills its parent absolutely.
 */
export default function SmokeBackdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-0 overflow-hidden"
    >
      <style>{`
        .smoke-layer {
          filter: blur(80px);
          will-change: transform, opacity;
        }
        @keyframes smoke-drift-a {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(5%, 10%) scale(1.1); }
        }
        @keyframes smoke-drift-b {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-5%, 5%) scale(1.05); }
        }
        @media (prefers-reduced-motion: reduce) {
          .smoke-layer { animation: none !important; }
        }
      `}</style>

      {/* LEFT smoke — warm magenta/peach */}
      <div
        className="smoke-layer absolute -left-[20%] top-[10%] h-[70%] w-[55%] sm:-left-[12%] sm:w-[40%]"
        style={{
          animation: "smoke-drift-a 24s ease-in-out infinite",
          background:
            "radial-gradient(closest-side, hsl(15 90% 70% / 0.45), hsl(330 80% 70% / 0.30) 45%, transparent 75%)",
        }}
      />

      {/* RIGHT smoke — cool violet/cyan */}
      <div
        className="smoke-layer absolute -right-[20%] top-[20%] h-[70%] w-[55%] sm:-right-[12%] sm:w-[40%]"
        style={{
          animation: "smoke-drift-b 28s ease-in-out infinite",
          animationDelay: "-6s",
          background:
            "radial-gradient(closest-side, hsl(260 85% 72% / 0.40), hsl(195 85% 65% / 0.28) 45%, transparent 75%)",
        }}
      />

      {/* LEFT-LOWER smoke — deepening to indigo before the black */}
      <div
        className="smoke-layer absolute -left-[15%] top-[55%] h-[55%] w-[50%] sm:w-[35%]"
        style={{
          animation: "smoke-drift-b 32s ease-in-out infinite",
          animationDelay: "-10s",
          background:
            "radial-gradient(closest-side, hsl(230 70% 45% / 0.45), hsl(280 60% 35% / 0.30) 50%, transparent 78%)",
        }}
      />

      {/* RIGHT-LOWER smoke — deep crimson before the black */}
      <div
        className="smoke-layer absolute -right-[15%] top-[60%] h-[55%] w-[50%] sm:w-[35%]"
        style={{
          animation: "smoke-drift-a 30s ease-in-out infinite",
          animationDelay: "-14s",
          background:
            "radial-gradient(closest-side, hsl(345 75% 45% / 0.45), hsl(20 70% 40% / 0.28) 50%, transparent 78%)",
        }}
      />

      {/* CENTER white-keep mask — keeps the middle column readable on white */}
      <div className="absolute inset-y-0 left-1/2 h-full w-[55%] -translate-x-1/2 bg-[radial-gradient(closest-side,white_25%,transparent_75%)] sm:w-[45%]" />

      {/* SUBTLE depth — minimal grey radials for premium feel on white */}
      <div className="absolute left-[20%] top-[5%] h-[40%] w-[40%] bg-[radial-gradient(closest-side,hsl(0_0%_0%/0.04),transparent_70%)]" />
      <div className="absolute right-[15%] top-[25%] h-[35%] w-[35%] bg-[radial-gradient(closest-side,hsl(0_0%_0%/0.03),transparent_70%)]" />

      {/* BOTTOM fade → pure black for footer continuity */}
      <div className="absolute inset-x-0 bottom-0 h-[35%] bg-gradient-to-b from-transparent via-neutral-900/70 to-black" />
    </div>
  );
}
