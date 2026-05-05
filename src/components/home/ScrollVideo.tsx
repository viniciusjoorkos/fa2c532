import { useEffect, useRef, useCallback } from "react";

/**
 * ScrollVideo — premium scroll-driven video component.
 *
 * The video advances frame-by-frame as the user scrolls down and rewinds
 * when the user scrolls back up.
 *
 * Two progress modes:
 *
 * 1. **Hero mode** (`isHero=true`): For elements pinned to the top of the page.
 *    Progress = scrollY / elementHeight. Video starts at frame 0 on page load
 *    and plays through entirely as the user scrolls past the hero.
 *
 * 2. **Normal mode** (default): For elements further down the page.
 *    Progress 0 = element top entering viewport bottom.
 *    Progress 1 = element bottom exiting viewport top.
 *    Video plays through the entire time the element is visible.
 *
 * Performance:
 *  - Poster <img> for instant display
 *  - Single rAF scroll listener (60fps)
 *  - No canvas, no WebGL
 */

interface ScrollVideoProps {
  /** Path to the MP4 source */
  mp4Src: string;
  /** Path to the WebM source (optional) */
  webmSrc?: string;
  /** Path to the poster/thumbnail image */
  posterSrc: string;
  /** Additional CSS class for the outer container */
  className?: string;
  /** Additional CSS class for the <video> element */
  videoClassName?: string;
  /** How the video fills its container */
  objectFit?: "cover" | "contain";
  /**
   * Set to true for elements pinned at the top of the page (like the hero).
   * Progress will be based on scrollY, starting at 0 on load.
   * Default: false
   */
  isHero?: boolean;
}

export default function ScrollVideo({
  mp4Src,
  webmSrc,
  posterSrc,
  className = "",
  videoClassName = "",
  objectFit = "cover",
  isHero = false,
}: ScrollVideoProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const rafRef = useRef(0);
  const readyRef = useRef(false);

  const updateTime = useCallback(() => {
    rafRef.current = 0;
    const el = containerRef.current;
    const video = videoRef.current;
    if (!el || !video || !readyRef.current) return;

    const duration = video.duration;
    if (!duration || !isFinite(duration)) return;

    let progress: number;

    if (isHero) {
      // Hero mode: progress based on window.scrollY
      // At scrollY=0 → progress=0 (first frame)
      // At scrollY=elementHeight → progress=1 (last frame)
      const elHeight = el.offsetHeight || 1;
      progress = window.scrollY / elHeight;
    } else {
      // Normal mode: progress based on element visibility range
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // Progress 0 = element top at viewport bottom
      // Progress 1 = element bottom at viewport top
      const totalTravel = vh + rect.height;
      const passed = vh - rect.top;
      progress = passed / totalTravel;
    }

    const clamped = Math.max(0, Math.min(1, progress));
    const targetTime = clamped * duration;

    if (Math.abs(video.currentTime - targetTime) > 0.02) {
      video.currentTime = targetTime;
    }
  }, [isHero]);

  useEffect(() => {
    const onScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(updateTime);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    requestAnimationFrame(updateTime);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [updateTime]);

  const handleVideoReady = () => {
    readyRef.current = true;
    requestAnimationFrame(updateTime);
  };

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
    >
      {/* Poster image — always visible as fallback behind the video */}
      <img
        src={posterSrc}
        alt=""
        aria-hidden
        loading="eager"
        decoding="async"
        className={`absolute inset-0 h-full w-full select-none ${videoClassName}`}
        style={{ objectFit, zIndex: 0 }}
      />

      {/* Video element — loads eagerly, driven by scroll */}
      <video
        ref={videoRef}
        muted
        playsInline
        preload="auto"
        onLoadedData={handleVideoReady}
        className={`absolute inset-0 h-full w-full select-none ${videoClassName}`}
        style={{
          objectFit,
          zIndex: 1,
        }}
      >
        {webmSrc && <source src={webmSrc} type="video/webm" />}
        <source src={mp4Src} type="video/mp4" />
      </video>
    </div>
  );
}
