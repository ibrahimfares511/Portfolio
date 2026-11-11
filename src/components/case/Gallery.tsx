"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { srcSets } from "@/lib/projects";
import type { Shot } from "@/lib/project-page";

type Strings = { desktop: string; mobile: string; close: string; prev: string; next: string };

function Picture({ shot, sizes, className, lazy = true, alt }: { shot: Shot; sizes: string; className?: string; lazy?: boolean; alt: string }) {
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
        className={className}
      />
    </picture>
  );
}

/**
 * The project's screens: desktop shots in a grid, phone shots in a row
 * (swipe on mobile). Any shot opens in a lightbox (<dialog>) with its
 * caption; arrows and Esc work there.
 */
export function Gallery({ shots, lang, strings }: { shots: Shot[]; lang: "ar" | "en"; strings: Strings }) {
  const desktop = shots.filter((s) => s.device === "desktop");
  const mobile = shots.filter((s) => s.device === "mobile");
  const all = [...desktop, ...mobile];
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState<number | null>(null);

  const closeBtn = useRef<HTMLButtonElement>(null);
  const show = (i: number) => setOpen(i);

  // Open once the content is rendered, then put focus on "Close".
  useEffect(() => {
    const el = dialog.current;
    if (open === null || !el || el.open) return;
    el.showModal();
    closeBtn.current?.focus();
  }, [open]);
  const count = all.length;
  const step = useCallback(
    (d: number) => setOpen((i) => (i === null ? i : (i + d + count) % count)),
    [count],
  );

  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    const onKey = (e: KeyboardEvent) => {
      if (!el.open) return;
      const rtl = document.documentElement.dir === "rtl";
      if (e.key === "ArrowRight") step(rtl ? -1 : 1);
      if (e.key === "ArrowLeft") step(rtl ? 1 : -1);
    };
    const onClose = () => setOpen(null);
    window.addEventListener("keydown", onKey);
    el.addEventListener("close", onClose);
    return () => {
      window.removeEventListener("keydown", onKey);
      el.removeEventListener("close", onClose);
    };
  }, [step]);

  const current = open === null ? null : all[open];

  const thumb = (shot: Shot, i: number, kind: "desktop" | "mobile") => (
    <figure key={`${kind}-${shot.name}`} className="group">
      <button
        type="button"
        onClick={() => show(i)}
        className={`block w-full overflow-hidden border border-line bg-surface shadow-[0_18px_40px_-30px_rgba(22,48,58,0.55)] transition-transform duration-300 hover:-translate-y-1 focus-visible:outline-clay ${
          kind === "mobile" ? "rounded-[22px]" : "rounded-lg"
        }`}
        aria-label={shot.caption[lang]}
        dir="ltr"
      >
        <Picture
          shot={shot}
          alt=""
          sizes={kind === "mobile" ? "200px" : "(min-width: 1024px) 540px, 100vw"}
          className="block h-auto w-full transition-transform duration-500 group-hover:scale-[1.015]"
        />
      </button>
      <figcaption className="mt-3 text-[14px] leading-[22px] text-ink-muted">{shot.caption[lang]}</figcaption>
    </figure>
  );

  return (
    <>
      {desktop.length ? (
        <div>
          <h3 className="mb-5 text-[15px] font-medium text-petrol">{strings.desktop}</h3>
          <div className="-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-8 sm:overflow-visible sm:px-0 sm:pb-0 max-sm:[&>*]:w-[82vw] max-sm:[&>*]:shrink-0 max-sm:[&>*]:snap-start">
            {desktop.map((s, i) => thumb(s, i, "desktop"))}
          </div>
        </div>
      ) : null}
      {mobile.length ? (
        <div className={desktop.length ? "mt-14" : ""}>
          <h3 className="mb-5 text-[15px] font-medium text-petrol">{strings.mobile}</h3>
          <div className="-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-5 overflow-x-auto px-4 pb-4 sm:mx-0 sm:px-0 [&>*]:w-[46vw] [&>*]:max-w-[200px] [&>*]:shrink-0 [&>*]:snap-start">
            {mobile.map((s, i) => thumb(s, desktop.length + i, "mobile"))}
          </div>
        </div>
      ) : null}

      <dialog
        ref={dialog}
        className="m-auto max-h-none max-w-none bg-transparent p-0 backdrop:bg-[#0D1B21]/85 backdrop:backdrop-blur-sm"
        onClick={(e) => {
          if (e.target === e.currentTarget) dialog.current?.close();
        }}
      >
        {current ? (
          <div className="flex h-[100dvh] w-[100vw] flex-col items-center justify-center gap-4 p-4 sm:p-8" onClick={(e) => e.target === e.currentTarget && dialog.current?.close()}>
            <div className={`overflow-hidden border border-white/10 bg-surface ${current.device === "mobile" ? "h-[74dvh] rounded-[26px]" : "w-full max-w-5xl rounded-lg"}`} dir="ltr">
              <Picture
                shot={current}
                alt={current.caption[lang]}
                lazy={false}
                sizes={current.device === "mobile" ? "400px" : "100vw"}
                className={current.device === "mobile" ? "block h-full w-auto" : "block h-auto max-h-[76dvh] w-full object-contain"}
              />
            </div>
            <div className="flex w-full max-w-5xl items-center justify-between gap-4 text-[#EAF0F0]">
              <p className="text-[15px] leading-[24px]">
                <span className="num me-3 text-[#9BAEB3]">
                  {(open ?? 0) + 1} / {all.length}
                </span>
                {current.caption[lang]}
              </p>
              <div className="flex shrink-0 gap-2">
                <button type="button" onClick={() => step(-1)} aria-label={strings.prev} className="grid size-11 place-items-center rounded-full border border-white/20 hover:bg-white/10">
                  <svg viewBox="0 0 24 24" className="size-5 rtl:rotate-180" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M15 6l-6 6 6 6" /></svg>
                </button>
                <button type="button" onClick={() => step(1)} aria-label={strings.next} className="grid size-11 place-items-center rounded-full border border-white/20 hover:bg-white/10">
                  <svg viewBox="0 0 24 24" className="size-5 rtl:rotate-180" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 6l6 6-6 6" /></svg>
                </button>
                <button ref={closeBtn} type="button" onClick={() => dialog.current?.close()} aria-label={strings.close} className="grid size-11 place-items-center rounded-full bg-white/10 hover:bg-white/20">
                  <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </dialog>
    </>
  );
}
