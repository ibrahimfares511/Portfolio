"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useLocale, useMessages, useTranslations } from "next-intl";
import { ButtonLink } from "@/components/ui/Button";
import { onPreloaderDone } from "@/lib/preloader";

type Proof = { value: string; label: string };

/** "+13,000" → { prefix: "+", n: 13000 }; "~100" → { prefix: "~", n: 100 }. */
function parseStat(value: string) {
  const m = value.match(/^([+~]?)([\d,]+)(\+?)$/);
  if (!m) return null;
  return { prefix: m[1], n: Number(m[2].replace(/,/g, "")), suffix: m[3] };
}
const fmt = (n: number) => Math.round(n).toLocaleString("en-US"); // Western digits, always

export function Hero() {
  const t = useTranslations("hero");
  const messages = useMessages() as { hero: { proof: Proof[] } };
  const proof = messages.hero.proof;
  const locale = useLocale();
  const isAr = locale === "ar";
  const root = useRef<HTMLElement>(null);
  const avatar = useRef<HTMLDivElement>(null);

  // Entrance after the preloader + count-up of the proof numbers.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    let ctx: gsap.Context | undefined;
    const stop = onPreloaderDone(() => {
      ctx = gsap.context(() => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.fromTo("[data-reveal='text']", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.09 })
          .fromTo(
            "[data-reveal='avatar']",
            { opacity: 0, y: 40, scale: 0.97 },
            { opacity: 1, y: 0, scale: 1, duration: 1, ease: "power2.out" },
            0.1,
          )
          .fromTo("[data-reveal='proof']", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.08 }, 0.35);

        el.querySelectorAll<HTMLElement>("[data-count]").forEach((node, i) => {
          const stat = parseStat(node.dataset.count!);
          if (!stat || stat.n < 10) return; // small numbers just appear
          const state = { n: 0 };
          tl.to(
            state,
            {
              n: stat.n,
              duration: 1.4,
              ease: "power2.out",
              onUpdate: () => (node.textContent = `${stat.prefix}${fmt(state.n)}${stat.suffix}`),
            },
            0.45 + i * 0.08,
          );
        });
      }, el);
    });
    return () => {
      stop();
      ctx?.revert();
    };
  }, []);

  // Gentle tilt + parallax of the whole avatar image with the mouse (never warp the face).
  useEffect(() => {
    const el = root.current;
    const av = avatar.current;
    if (!el || !av) return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    const rx = gsap.quickTo(av, "rotationX", { duration: 0.8, ease: "power3.out" });
    const ry = gsap.quickTo(av, "rotationY", { duration: 0.8, ease: "power3.out" });
    const x = gsap.quickTo(av, "x", { duration: 0.9, ease: "power3.out" });
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5; // -0.5 … 0.5
      const py = (e.clientY - r.top) / r.height - 0.5;
      ry(px * 8);
      rx(-py * 5);
      x(px * 14);
    };
    const leave = () => {
      rx(0);
      ry(0);
      x(0);
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <section
      ref={root}
      id="top"
      aria-labelledby="hero-title"
      className="relative flex min-h-dvh flex-col overflow-hidden pt-16 md:pt-[72px]"
    >
      <div className="mx-auto grid w-full max-w-6xl flex-1 grid-cols-1 items-center gap-x-8 px-4 sm:px-6 md:grid-cols-12">
        {/* Copy */}
        <div className="relative z-10 pt-10 pb-6 md:col-span-7 md:py-16">
          <p data-reveal="text" className="text-[15px] text-ink-muted">
            {t("eyebrow")}
          </p>
          <h1
            id="hero-title"
            data-reveal="text"
            className={
              isAr
                ? "mt-5 text-[36px] leading-[58px] font-medium text-balance sm:text-[44px] sm:leading-[68px] lg:text-[52px] lg:leading-[80px]"
                : "mt-5 font-display text-[40px] leading-[48px] lowercase text-balance sm:text-[50px] sm:leading-[58px] lg:text-[58px] lg:leading-[66px]"
            }
          >
            {t("headline")}
            <span className="ms-2 inline-block size-[0.2em] rounded-full bg-clay" aria-hidden />
          </h1>
          <p data-reveal="text" className="mt-5 max-w-xl text-[17px] leading-[30px] text-ink-muted md:text-body-lg">
            {t("subline")}
          </p>
          <div data-reveal="text" className="mt-8 flex flex-wrap items-center gap-3">
            <ButtonLink href={`/${locale}#contact`}>{t("primary")}</ButtonLink>
            <ButtonLink href={`/${locale}#projects`} variant="secondary">
              {t("secondary")}
            </ButtonLink>
          </div>
        </div>

        {/* Avatar, standing on the proof strip */}
        <div className="relative flex h-full items-end justify-center md:col-span-5 [perspective:900px]">
          <div
            aria-hidden
            className="absolute bottom-[-10%] left-1/2 aspect-square w-[115%] max-w-[560px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,var(--sky-soft),transparent)] opacity-90 dark:opacity-100"
          />
          <div ref={avatar} data-reveal="avatar" className="relative will-change-transform">
            <picture>
              <source
                type="image/avif"
                srcSet="/avatar/06-arms-crossed-420.avif 420w, /avatar/06-arms-crossed-640.avif 640w, /avatar/06-arms-crossed-848.avif 848w"
                sizes="(min-width: 768px) 420px, 300px"
              />
              <img
                src="/avatar/06-arms-crossed-640.webp"
                srcSet="/avatar/06-arms-crossed-420.webp 420w, /avatar/06-arms-crossed-640.webp 640w, /avatar/06-arms-crossed-848.webp 848w"
                sizes="(min-width: 768px) 420px, 300px"
                width={848}
                height={1264}
                alt={t("avatarAlt")}
                fetchPriority="high"
                decoding="async"
                className="block h-[min(50vh,380px)] w-auto select-none md:h-[min(68vh,600px)]"
                draggable={false}
              />
            </picture>
          </div>
        </div>
      </div>

      {/* Proof strip */}
      <div className="relative z-10 border-t border-line bg-bg/70 backdrop-blur-sm">
        <ul className="mx-auto grid max-w-6xl grid-cols-2 px-4 sm:px-6 md:grid-cols-4">
          {proof.map((p, i) => (
            <li
              key={i}
              data-reveal="proof"
              className="flex flex-col gap-1 border-line py-5 odd:pe-4 even:border-s even:ps-4 [&:nth-child(-n+2)]:border-b md:py-7 md:odd:pe-6 md:even:ps-6 md:[&:nth-child(-n+2)]:border-b-0 md:[&:nth-child(n+2)]:border-s md:[&:nth-child(n+2)]:ps-6"
            >
              <span className="num self-start font-display text-[32px] leading-[38px] text-petrol sm:text-[40px] sm:leading-[44px] lg:text-[52px] lg:leading-[56px]">
                <span aria-hidden data-count={p.value}>
                  {p.value}
                </span>
                <span className="sr-only">{p.value}</span>
              </span>
              <span className="text-[14px] leading-[22px] text-ink-muted md:text-[15px]">{p.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
