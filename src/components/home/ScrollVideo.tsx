import { useEffect, useRef, useState, useCallback } from "react";

/**
 * ScrollVideo — premium scroll-driven video component.
 *
 * The video advances frame-by-frame as the user scrolls. When the user stops,
 * the video freezes. When the user scrolls back up, the video rewinds.
 *
 * Performance strategy:
 *  - Shows a poster image instantly (< 100ms render)
 *  - Video loads lazily via IntersectionObserver (preload="none" until near)
 *  - Single rAF scroll listener, paused when off-screen
 *  - Pure GPU compositing (native <video> element)
 *  - No canvas, no WebGL, no manual decode
 */

interface ScrollVideoProps {
  /** Path to the MP4 source */
  mp4Src: string;
  /** Path to the WebM source (optional, better compression) */
  webmSrc?: string;
  /** Path to the poster/thumbnail image shown before video loads */
  posterSrc: string;
  /** Additional CSS class for the outer container */
  className?: string;
  /** Additional CSS class for the <video> element */
  videoClassName?: string;
  /** How the video fills its container */
  objectFit?: "cover" | "contain";
  /**
   * Scroll range multiplier relative to the element height.
   * 1.0 = video completes over exactly the element's height of scroll.
   * 1.5 = video completes over 1.5× the element's height (slower scrub).
   * Default: 1.5
   */
  scrollRangeMultiplier?: number;
  /** Whether to start progress from when element enters bottom of viewport (true)
   *  or from when it's centered (false). Default: true */
  startFromBottom?: boolean;
}

export default function ScrollVideo({
  mp4Src,
  webmSrc,
  posterSrc,
  className = "",
  videoClassName = "",
  objectFit = "cover",
  scrollRangeMultiplier = 1.5,
  startFromBottom = true,
}: ScrollVideoProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isNear, setIsNear] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const rafRef = useRef(0);
  const visibleRef = useRef(false);

  // Detect when the element is near the viewport (preload trigger)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          setIsNear(true);
          io.disconnect(); // Once near, keep loaded forever
        }
      },
      { rootMargin: "400px 0px 400px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Track visibility for scroll listener activation
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        visibleRef.current = entries[0]?.isIntersecting ?? false;
      },
      { rootMargin: "200px 0px 200px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Scroll → currentTime sync
  const updateTime = useCallback(() => {
    rafRef.current = 0;
    const el = containerRef.current;
    const video = videoRef.current;
    if (!el || !video || !video.duration || !isFinite(video.duration)) return;

    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight || 1;
    const elHeight = rect.height || 1;

    // Calculate scroll progress (0 → 1)
    let progress: number;
    if (startFromBottom) {
      // Progress starts when element enters the bottom of viewport
      // and completes after scrollRangeMultiplier × elHeight of scrolling
      const scrollRange = elHeight * scrollRangeMultiplier;
      const start = vh; // element top at bottom of viewport
      const passed = start - rect.top;
      progress = passed / scrollRange;
    } else {
      // Progress based on element position relative to viewport center
      const center = vh / 2;
      const scrollRange = elHeight * scrollRangeMultiplier;
      const passed = center - rect.top + scrollRange / 2;
      progress = passed / scrollRange;
    }

    const clamped = Math.max(0, Math.min(1, progress));
    const targetTime = clamped * video.duration;

    // Only seek if there's a meaningful difference (avoids unnecessary seeks)
    if (Math.abs(video.currentTime - targetTime) > 0.03) {
      video.currentTime = targetTime;
    }
  }, [scrollRangeMultiplier, startFromBottom]);

  useEffect(() => {
    if (!videoReady) return;

    const onScroll = () => {
      if (!visibleRef.current || rafRef.current) return;
      rafRef.current = requestAnimationFrame(updateTime);
    };

    // Initial update
    updateTime();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [videoReady, updateTime]);

  const handleVideoLoaded = () => {
    setVideoReady(true);
  };

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
    >
      {/* Poster image — shows instantly, hides once video is ready */}
      <img
        src={posterSrc}
        alt=""
        aria-hidden
        loading="eager"
        decoding="async"
        className={`absolute inset-0 h-full w-full select-none transition-opacity duration-500 ${videoClassName}`}
        style={{
          objectFit,
          opacity: videoReady ? 0 : 1,
          zIndex: videoReady ? 0 : 2,
        }}
      />

      {/* Video element — loads lazily, driven by scroll */}
      {isNear && (
        <video
          ref={videoRef}
          muted
          playsInline
          preload="auto"
          onLoadedMetadata={handleVideoLoaded}
          className={`absolute inset-0 h-full w-full select-none ${videoClassName}`}
          style={{
            objectFit,
            opacity: videoReady ? 1 : 0,
            transition: "opacity 500ms ease",
            zIndex: 1,
          }}
        >
          {webmSrc && <source src={webmSrc} type="video/webm" />}
          <source src={mp4Src} type="video/mp4" />
        </video>
      )}
    </div>
  );
}
