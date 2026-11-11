"use client";

import { useEffect, useRef } from "react";
import { srcSets, type ImageSet } from "@/lib/projects";

/**
 * A muted, looping screen recording. The poster is a real <picture>; the
 * video only downloads when `active` (the card is on top of the stack and
 * near the viewport), and pauses otherwise. Reduced motion: poster only.
 */
export function LoopVideo({
  mp4,
  webm,
  poster,
  active,
  label,
}: {
  mp4: string;
  webm?: string | null;
  poster: ImageSet;
  active: boolean;
  label: string;
}) {
  const video = useRef<HTMLVideoElement>(null);
  const loaded = useRef(false);
  const s = srcSets(poster);

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (active) {
      if (!loaded.current) {
        loaded.current = true;
        v.preload = "auto";
        v.load();
      }
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [active]);

  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface">
      <picture>
        <source type="image/avif" srcSet={s.avif} sizes="(min-width: 1024px) 640px, 100vw" />
        <img
          src={s.fallback}
          srcSet={s.webp}
          sizes="(min-width: 1024px) 640px, 100vw"
          alt={label}
          width={poster.width}
          height={poster.height}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 size-full object-cover object-top"
        />
      </picture>
      <video
        ref={video}
        muted
        loop
        playsInline
        preload="none"
        aria-hidden
        className="absolute inset-0 size-full object-cover object-top opacity-0 transition-opacity duration-500 data-[on]:opacity-100"
        onPlaying={(e) => (e.currentTarget.dataset.on = "1")}
      >
        {webm ? <source src={webm} type="video/webm" /> : null}
        <source src={mp4} type="video/mp4" />
      </video>
    </div>
  );
}
