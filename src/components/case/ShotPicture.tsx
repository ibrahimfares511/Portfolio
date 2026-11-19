import { srcSets } from "@/lib/projects";
import type { Shot } from "@/lib/project-page";

/** A screenshot as a responsive <picture> (AVIF, WebP). */
export function ShotPicture({ shot, sizes, className, lazy = true, alt }: { shot: Shot; sizes: string; className?: string; lazy?: boolean; alt: string }) {
  const s = srcSets(shot.image);
  return (
    <picture>
      <source type="image/avif" srcSet={s.avif} sizes={sizes} />
      <img
        src={s.fallback}
        srcSet={s.webp}
        sizes={sizes}
        alt={alt}
        width={shot.image.width}
        height={shot.image.height}
        loading={lazy ? "lazy" : "eager"}
        decoding="async"
        draggable={false}
        className={className}
      />
    </picture>
  );
}
