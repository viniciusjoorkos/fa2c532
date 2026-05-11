/**
 * MorphingText — Magic UI port
 * Morphs through an array of text strings using SVG feTurbulence-style CSS filter blur.
 */
import { useEffect, useRef, useState, useCallback } from "react";
import { cn } from "@/lib/utils";

const MORPH_TIME = 1.2;   // seconds per morph
const COOLDOWN_TIME = 0.8; // seconds to hold before next morph

interface MorphingTextProps {
  texts: string[];
  className?: string;
}

export function MorphingText({ texts, className }: MorphingTextProps) {
  const text1Ref = useRef<HTMLSpanElement>(null);
  const text2Ref = useRef<HTMLSpanElement>(null);
  const animRef = useRef<number>(0);
  const morphRef = useRef(0);
  const cooldownRef = useRef(COOLDOWN_TIME);
  const timeRef = useRef<number | null>(null);
  const textIndexRef = useRef(texts.length - 1);

  const [text1, setText1] = useState(texts[texts.length - 2] ?? texts[0]);
  const [text2, setText2] = useState(texts[texts.length - 1]);

  const setMorph = useCallback((fraction: number) => {
    // text2 fades in
    if (text2Ref.current) {
      const blur2 = Math.min(8 / fraction - 8, 100);
      text2Ref.current.style.filter = `blur(${blur2}px)`;
      text2Ref.current.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;
    }
    // text1 fades out (inverted)
    const inv = 1 - fraction;
    if (text1Ref.current) {
      const blur1 = Math.min(8 / inv - 8, 100);
      text1Ref.current.style.filter = `blur(${blur1}px)`;
      text1Ref.current.style.opacity = `${Math.pow(inv, 0.4) * 100}%`;
    }
  }, []);

  const doCooldown = useCallback(() => {
    morphRef.current = 0;
    if (text2Ref.current) {
      text2Ref.current.style.filter = "";
      text2Ref.current.style.opacity = "100%";
    }
    if (text1Ref.current) {
      text1Ref.current.style.filter = "";
      text1Ref.current.style.opacity = "0%";
    }
  }, []);

  useEffect(() => {
    const animate = (now: number) => {
      animRef.current = requestAnimationFrame(animate);
      if (timeRef.current === null) {
        timeRef.current = now;
        return;
      }
      const dt = (now - timeRef.current) / 1000;
      timeRef.current = now;

      cooldownRef.current -= dt;
      let didMorph = false;

      if (cooldownRef.current <= 0) {
        morphRef.current += dt;
        const fraction = morphRef.current / MORPH_TIME;

        if (fraction > 1) {
          // advance to next word
          cooldownRef.current = COOLDOWN_TIME;
          didMorph = true;
          morphRef.current = 0;
          textIndexRef.current = (textIndexRef.current + 1) % texts.length;
          setText1(texts[(textIndexRef.current - 1 + texts.length) % texts.length]);
          setText2(texts[textIndexRef.current]);
        } else {
          setMorph(Math.min(Math.max(fraction, 0.001), 0.999));
        }
      }

      if (!didMorph) doCooldown();
    };

    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [texts, setMorph, doCooldown]);

  return (
    <div
      className={cn(
        "relative flex h-20 items-center justify-center overflow-hidden sm:h-24 lg:h-28",
        className
      )}
    >
      {/* SVG filter for extra gooey blur on supporting browsers */}
      <svg className="absolute h-0 w-0" aria-hidden>
        <defs>
          <filter id="morphing-blur">
            <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
              result="goo"
            />
          </filter>
        </defs>
      </svg>

      <span
        ref={text1Ref}
        className={cn("absolute select-none font-serif text-5xl font-black tracking-tight text-neutral-900 sm:text-7xl lg:text-8xl", className)}
        aria-hidden
      >
        {text1}
      </span>
      <span
        ref={text2Ref}
        className={cn("absolute select-none font-serif text-5xl font-black tracking-tight text-neutral-900 sm:text-7xl lg:text-8xl", className)}
      >
        {text2}
      </span>
    </div>
  );
}
