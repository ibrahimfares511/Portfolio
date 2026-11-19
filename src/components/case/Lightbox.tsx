"use client";

import { useEffect, useRef } from "react";
import type { Shot } from "@/lib/project-page";
import { ShotPicture } from "./ShotPicture";

export type LightboxStrings = { close: string; prev: string; next: string };

/** A screen opened large (<dialog>): caption, counter, arrows (and the arrow keys), Esc or a click outside closes it. */
export function Lightbox({
  shots,
  index,
  lang,
  strings,
  onClose,
  onStep,
}: {
  shots: Shot[];
  index: number | null;
  lang: "ar" | "en";
  strings: LightboxStrings;
  onClose: () => void;
  onStep: (d: 1 | -1) => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const current = index === null ? null : shots[index];

  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    if (index !== null && !el.open) {
      el.showModal();
      closeBtn.current?.focus();
    }
    if (index === null && el.open) el.close();
  }, [index]);

  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    const onKey = (e: KeyboardEvent) => {
      if (!el.open) return;
      const rtl = document.documentElement.dir === "rtl";
      if (e.key === "ArrowRight") onStep(rtl ? -1 : 1);
      if (e.key === "ArrowLeft") onStep(rtl ? 1 : -1);
    };
    window.addEventListener("keydown", onKey);
    el.addEventListener("close", onClose);
    return () => {
      window.removeEventListener("keydown", onKey);
      el.removeEventListener("close", onClose);
    };
  }, [onClose, onStep]);

  return (
    <dialog
      ref={dialog}
      className="m-auto max-h-none max-w-none bg-transparent p-0 backdrop:bg-[#0D1B21]/88 backdrop:backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && dialog.current?.close()}
    >
      {current ? (
        <div className="flex h-[100dvh] w-[100vw] flex-col items-center justify-center gap-4 p-4 sm:p-8" onClick={(e) => e.target === e.currentTarget && dialog.current?.close()}>
          <div className={`overflow-hidden border border-white/10 bg-surface ${current.device === "mobile" ? "h-[76dvh] rounded-[28px]" : "w-full max-w-6xl rounded-xl"}`} dir="ltr">
            <ShotPicture
              shot={current}
              alt={current.caption[lang]}
              lazy={false}
              sizes={current.device === "mobile" ? "420px" : "100vw"}
              className={current.device === "mobile" ? "block h-full w-auto" : "block h-auto max-h-[78dvh] w-full object-contain"}
            />
          </div>
          <div className="flex w-full max-w-6xl items-center justify-between gap-4 text-[#EAF0F0]">
            <p className="text-[15px] leading-[24px]">
              <span className="num me-3 text-[#9BAEB3]">
                {(index ?? 0) + 1} / {shots.length}
              </span>
              {current.caption[lang]}
            </p>
            <div className="flex shrink-0 gap-2">
              <button type="button" onClick={() => onStep(-1)} aria-label={strings.prev} className="grid size-11 place-items-center rounded-full border border-white/20 hover:bg-white/10">
                <svg viewBox="0 0 24 24" className="size-5 rtl:rotate-180" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M15 6l-6 6 6 6" /></svg>
              </button>
              <button type="button" onClick={() => onStep(1)} aria-label={strings.next} className="grid size-11 place-items-center rounded-full border border-white/20 hover:bg-white/10">
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
  );
}
