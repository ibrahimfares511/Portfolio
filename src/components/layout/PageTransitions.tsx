"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { coverSwitch, nextFrame, waitFor } from "@/lib/motion";

const HEADER = 72;

/**
 * Every move inside the site goes through the brand cover, like the language
 * and theme switches: a circle grows from where you clicked until it covers
 * the screen, the "if" mark is written while the new page (or section) is put
 * in place underneath, then the circle closes back into the same point.
 *
 * One click listener for the whole site, so every internal link gets it:
 * header and footer links, buttons, "Read the story", back links, the 404.
 * Links that already run the cover themselves (project links, the language
 * switch) call preventDefault, so they are left alone here. New tabs,
 * modifier keys, downloads, external links, mailto/tel and the skip link keep
 * the browser's behaviour; data-transition="off" opts a link out.
 */
export function PageTransitions() {
  const router = useRouter();

  useEffect(() => {
    // The element a hash points at, scrolled to its band (home page) or itself.
    const scrollToHash = (hash: string) => {
      const id = hash ? decodeURIComponent(hash.slice(1)) : "";
      const el = id ? document.getElementById(id) : null;
      if (!el) {
        window.scrollTo({ top: 0, behavior: "instant" });
        return;
      }
      const pageY = (n: Element) => n.getBoundingClientRect().top + window.scrollY;
      // One screen of a band built of whole screens (the projects showcase): its own screen.
      const screens = el.closest<HTMLElement>("[data-screens]");
      if (screens && el.tagName === "LI" && el.parentElement) {
        const k = Array.from(el.parentElement.children).filter((c) => c.tagName === "LI").indexOf(el);
        if (window.matchMedia("(min-width: 1024px)").matches) {
          window.scrollTo({ top: pageY(screens) + k * window.innerHeight, behavior: "instant" });
        } else {
          const band = el.closest<HTMLElement>("[data-band]") ?? screens;
          window.scrollTo({ top: Math.max(0, pageY(band)), behavior: "instant" });
          el.scrollIntoView({ behavior: "instant", block: "nearest", inline: "center" });
        }
        return;
      }
      const band = el.closest<HTMLElement>("[data-band]");
      const top = pageY(band ?? el) - (band ? 0 : HEADER);
      window.scrollTo({ top: Math.max(0, top), behavior: "instant" });
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
      if (samePage && a.hash && !document.getElementById(decodeURIComponent(a.hash.slice(1)))) return;

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
        if (samePage) {
          history.replaceState(history.state, "", hash || a.pathname);
        } else {
          router.push(a.pathname + a.search + hash, { scroll: false });
          await waitFor(() => location.pathname === a.pathname);
          await nextFrame();
          await nextFrame();
          await document.fonts.ready;
        }
        scrollToHash(hash);
      });
    };

    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, [router]);

  return null;
}
