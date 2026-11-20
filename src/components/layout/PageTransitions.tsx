"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { useRouter } from "next/navigation";
import { coverSwitch, nextFrame, waitFor } from "@/lib/motion";

gsap.registerPlugin(ScrollToPlugin);

const HEADER = 72;

/**
 * Moving to another page goes through the brand cover, like the language and
 * theme switches: a circle grows from where you clicked until it covers the
 * screen, the "if" mark is written while the new page is put in place
 * underneath, then the circle closes back into the same point.
 * Moving within the same page (#projects, #contact, "technical") is a plain,
 * smooth scroll, with no cover.
 *
 * One click listener for the whole site, so every internal link gets it:
 * header links, buttons, "Read the story", back links, the logo, the 404.
 * Links that already run the cover themselves (project links, the language
 * switch) call preventDefault, so they are left alone here. New tabs,
 * modifier keys, downloads, external links, mailto/tel and the skip link keep
 * the browser's behaviour; data-transition="off" opts a link out.
 */
export function PageTransitions() {
  const router = useRouter();

  useEffect(() => {
    // Where a hash points: its band (home page), its own screen in the projects
    // showcase, or the element itself under the header. null: the page top.
    const destination = (hash: string) => {
      const id = hash ? decodeURIComponent(hash.slice(1)) : "";
      const el = id ? document.getElementById(id) : null;
      const pageY = (n: Element) => n.getBoundingClientRect().top + window.scrollY;
      if (!el) return { y: 0, el: null as HTMLElement | null, inline: false };
      const screens = el.closest<HTMLElement>("[data-screens]");
      if (screens && el.tagName === "LI" && el.parentElement) {
        const k = Array.from(el.parentElement.children).filter((c) => c.tagName === "LI").indexOf(el);
        if (window.matchMedia("(min-width: 1024px)").matches) return { y: pageY(screens) + k * window.innerHeight, el, inline: false };
        const band = el.closest<HTMLElement>("[data-band]") ?? screens;
        return { y: Math.max(0, pageY(band)), el, inline: true }; // phones: the carousel then slides to it
      }
      const band = el.closest<HTMLElement>("[data-band]");
      return { y: Math.max(0, pageY(band ?? el) - (band ? 0 : HEADER)), el, inline: false };
    };
    const jump = (hash: string) => {
      const d = destination(hash);
      window.scrollTo({ top: d.y, behavior: "instant" });
      if (d.inline) d.el?.scrollIntoView({ behavior: "instant", block: "nearest", inline: "center" });
    };
    const glide = (hash: string) => {
      const d = destination(hash);
      const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const after = () => { if (d.inline) d.el?.scrollIntoView({ behavior: still ? "instant" : "smooth", block: "nearest", inline: "center" }); };
      if (still) { window.scrollTo({ top: d.y, behavior: "instant" }); after(); return; }
      gsap.to(window, { scrollTo: { y: d.y, autoKill: false }, duration: 1, ease: "power3.out", overwrite: true, onComplete: after });
    };

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.<HTMLAnchorElement>("a[href]");
      if (!a) return;
      if (a.target && a.target !== "_self") return;
      if (a.hasAttribute("download") || a.dataset.transition === "off") return;
      if (a.origin !== location.origin) return; // external, mailto:, tel:
      const samePage = a.pathname === location.pathname && a.search === location.search;
      if (samePage && a.hash === "#main") return; // skip link: plain focus jump
      if (samePage) {
        // Same page: just scroll there, smoothly.
        if (a.hash && !document.getElementById(decodeURIComponent(a.hash.slice(1)))) return;
        e.preventDefault();
        history.replaceState(history.state, "", a.hash || a.pathname);
        glide(a.hash);
        return;
      }

      e.preventDefault();
      // Where the pointer was, or the link's centre (keyboard).
      let x = e.clientX, y = e.clientY;
      if (!x && !y) {
        const r = a.getBoundingClientRect();
        x = r.left + r.width / 2;
        y = r.top + r.height / 2;
      }
      const hash = a.hash;
      void coverSwitch(x, y, async () => {
        router.push(a.pathname + a.search + hash, { scroll: false });
        await waitFor(() => location.pathname === a.pathname);
        await nextFrame();
        await nextFrame();
        await document.fonts.ready;
        jump(hash);
      });
    };

    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, [router]);

  return null;
}
