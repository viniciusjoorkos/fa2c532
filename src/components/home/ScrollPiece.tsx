import ScrollVideo from "@/components/home/ScrollVideo";

/**
 * ScrollPiece — premium decorative element that sits in the middle of the page.
 * Scroll-driven video of the golden bull melting replaces the old golden king chair.
 *
 * The video plays forward as the user scrolls down and rewinds as they scroll up.
 * No parallax translation — the video stays fixed in position so it never
 * disappears outside its container.
 */
export default function ScrollPiece() {
  return (
    <div className="pointer-events-none relative mx-auto h-[420px] w-full max-w-lg sm:h-[520px] bg-white">
      {/* Scroll-driven bull video */}
      <ScrollVideo
        mp4Src="/hero/minha-narrativa-2.mp4"
        webmSrc="/hero/minha-narrativa-2.webm"
        posterSrc="/hero/minha-narrativa-2-poster.jpg"
        className="relative h-full w-full bg-white"
        videoClassName="rounded-2xl mix-blend-multiply"
        objectFit="contain"
      />
    </div>
  );
}
