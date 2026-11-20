"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * Desktop cursor in the brand: the clay dot of the logo, with a ring that
 * follows a little behind. Over links and buttons the ring opens; over an
 * element with data-cursor-label it fills with clay and shows that text
 * (existing copy only, e.g. "Read the story" on project pictures).
 * Buttons lean toward the pointer, like the hero buttons: every element with
 * data-magnetic, and every other link or button that is button-sized
 * (small, not a picture or a whole card). data-magnetic="off" opts out.
 * Only for fine pointers with motion allowed; text fields keep their cursor.
 */
/** The element that should lean toward the pointer, if any. */
function magnetOf(target: Element | null): HTMLElement | null {
  const el = target?.closest<HTMLElement>("[data-magnetic], a[href], button") ?? null;
  if (!el) return null;
  if (el.dataset.magnetic === "off") return null;
  if (el.hasAttribute("data-magnetic")) return el;
  if ((el as HTMLButtonElement).disabled) return null;
  if (el.querySelector("img, picture, video, canvas")) return null;
  const b = el.getBoundingClientRect();
  return b.width <= 360 && b.height <= 72 ? el : null;
}

export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)");
    const d = dot.current;
    const r = ring.current;
    if (!d || !r) return;
    const root = document.documentElement;
    let on = false;
    const dx = gsap.quickTo(d, "x", { duration: 0.08, ease: "power3" });
    const dy = gsap.quickTo(d, "y", { duration: 0.08, ease: "power3" });
    const rx = gsap.quickTo(r, "x", { duration: 0.35, ease: "power3" });
    const ry = gsap.quickTo(r, "y", { duration: 0.35, ease: "power3" });
    let magnet: HTMLElement | null = null;

    const state = (target: Element | null) => {
      const lab = target?.closest<HTMLElement>("[data-cursor-label]");
      if (lab) {
        r.dataset.state = "label";
        if (label.current) label.current.textContent = lab.dataset.cursorLabel ?? "";
        return;
      }
      if (label.current) label.current.textContent = "";
      if (target?.closest("input, textarea, select")) r.dataset.state = "hidden";
      else if (target?.closest("a, button, [role=tab], label, summary")) r.dataset.state = "link";
      else delete r.dataset.state;
    };

    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      if (!on) {
        on = true;
        root.classList.add("if-cursor");
        gsap.set([d, r], { x: e.clientX, y: e.clientY });
      }
      dx(e.clientX);
      dy(e.clientY);
      rx(e.clientX);
      ry(e.clientY);
      // magnetic pull
      const m = magnetOf(e.target as Element | null);
      if (m !== magnet) {
        if (magnet) gsap.to(magnet, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.5)" });
        magnet = m;
      }
      if (magnet) {
        const b = magnet.getBoundingClientRect();
        gsap.to(magnet, {
          x: (e.clientX - (b.left + b.width / 2)) * 0.25,
          y: (e.clientY - (b.top + b.height / 2)) * 0.35,
          duration: 0.3,
          ease: "power3",
        });
      }
    };
    const over = (e: PointerEvent) => state(e.target as Element);
    const leave = () => {
      root.classList.remove("if-cursor");
      on = false;
    };
    const down = () => gsap.to(r, { scale: 0.85, duration: 0.15 });
    const up = () => gsap.to(r, { scale: 1, duration: 0.3, ease: "back.out(3)" });

    const start = () => {
      window.addEventListener("pointermove", move, { passive: true });
      window.addEventListener("pointerover", over, { passive: true });
      document.addEventListener("pointerleave", leave);
      window.addEventListener("pointerdown", down);
      window.addEventListener("pointerup", up);
    };
    const stopAll = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      document.removeEventListener("pointerleave", leave);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      root.classList.remove("if-cursor");
      on = false;
    };
    const apply = () => (mq.matches ? start() : stopAll());
    apply();
    mq.addEventListener("change", apply);
    return () => {
      mq.removeEventListener("change", apply);
      stopAll();
    };
  }, []);

  return (
    <>
      <div ref={ring} className="if-cursor-ring" aria-hidden>
        <span ref={label} />
      </div>
      <div ref={dot} className="if-cursor-dot" aria-hidden />
    </>
  );
}
