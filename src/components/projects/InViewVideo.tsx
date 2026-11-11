"use client";

import { useEffect, useRef, useState } from "react";
import type { ImageSet } from "@/lib/projects";
import { LoopVideo } from "./LoopVideo";

/** A LoopVideo that plays while at least 40% of it is on screen. */
export function InViewVideo(props: { mp4: string; webm?: string | null; poster: ImageSet; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref}>
      <LoopVideo {...props} active={active} />
    </div>
  );
}
