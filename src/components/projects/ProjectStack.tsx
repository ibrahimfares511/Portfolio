"use client";

import { useEffect, useRef, useState } from "react";
import type { Project } from "@/lib/projects";
import { ProjectCard, type CardStrings } from "./ProjectCard";

/**
 * Stacked cards: each card sticks under the header and the next one slides
 * over it; the card underneath shrinks a little and dims. Pure CSS sticky +
 * one passive scroll listener, so it stays smooth on phones. Only the card on
 * top plays its video. On short screens the cards simply follow each other.
 */
export function ProjectStack({
  projects,
  lang,
  strings,
}: {
  projects: Project[];
  lang: "ar" | "en";
  strings: CardStrings;
}) {
  const list = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState(-1);

  useEffect(() => {
    const ol = list.current;
    if (!ol) return;
    const items = Array.from(ol.querySelectorAll<HTMLLIElement>(":scope > li"));
    const cards = items.map((li) => li.querySelector<HTMLElement>("[data-card]")!);
    const shades = items.map((li) => li.querySelector<HTMLElement>("[data-shade]")!);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;

    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      const box = ol.getBoundingClientRect();
      const inView = box.bottom > vh * 0.2 && box.top < vh * 0.8;
      let top = 0;
      for (let i = 0; i < items.length - 1; i++) {
        const next = items[i + 1];
        const stick = parseFloat(getComputedStyle(next).top) || 0;
        const sticky = getComputedStyle(next).position === "sticky";
        const nextTop = next.getBoundingClientRect().top;
        // 0 when the next card is at the bottom of the screen, 1 when it has covered this one.
        const p = Math.min(1, Math.max(0, (vh - nextTop) / Math.max(1, vh - stick)));
        if (sticky && !reduced) {
          cards[i].style.transform = `scale(${1 - 0.05 * p})`;
          shades[i].style.opacity = String(0.55 * p);
        } else {
          cards[i].style.transform = "";
          shades[i].style.opacity = "0";
        }
        if (p > 0.55) top = i + 1;
      }
      setActive(inView ? top : -1);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <ol ref={list} className="relative mt-10 md:mt-14">
      {projects.map((p, i) => (
        <li
          key={p.slug}
          id={`project-${p.slug}`}
          className="stack-item mb-6 scroll-mt-24 lg:mb-[10vh]"
          style={{ ["--i" as string]: i }}
        >
          <div data-card className="relative origin-top will-change-transform lg:h-[min(74vh,600px)]">
            <ProjectCard project={p} index={i} total={projects.length} lang={lang} strings={strings} active={active === i} />
            <div data-shade className="pointer-events-none absolute inset-0 rounded-xl bg-bg opacity-0" aria-hidden />
          </div>
        </li>
      ))}
    </ol>
  );
}
