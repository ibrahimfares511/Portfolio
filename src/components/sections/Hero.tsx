"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useLocale, useMessages, useTranslations } from "next-intl";
import { ButtonLink } from "@/components/ui/Button";
import { onReveal } from "@/lib/motion";
import { Words } from "@/components/ui/Words";

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

  // Entrance once the cover opens: the words are "typed in", each one coming
  // out of a blur, then the buttons, the avatar and the proof numbers.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let ctx: gsap.Context | undefined;
    const stop = onReveal(() => {
      ctx = gsap.context(() => {
        const blurIn = { opacity: 1, filter: "blur(0px)", y: 0, clearProps: "filter,transform" };
        const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
        tl.fromTo(
          "[data-reveal='word']",
          { opacity: 0, filter: "blur(12px)", y: "0.25em" },
          { ...blurIn, duration: 0.55, stagger: 0.045 },
        )
          .fromTo(
            "[data-reveal='text']",
            { opacity: 0, filter: "blur(8px)", y: 12 },
            { ...blurIn, duration: 0.6, stagger: 0.08 },
            "-=0.35",
          )
          .fromTo(
            "[data-reveal='avatar']",
            { opacity: 0, filter: "blur(16px)", y: 40, scale: 0.97 },
            { ...blurIn, scale: 1, duration: 1, ease: "power2.out" },
            0.15,
          )
          .fromTo(
            "[data-reveal='proof']",
            { opacity: 0, filter: "blur(10px)", y: 12 },
            { ...blurIn, duration: 0.6, stagger: 0.07 },
            0.5,
          );

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
            0.6 + i * 0.07,
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
      {/* Stage lighting: a soft spotlight behind the head, two calm rings, a vignette at the edges */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute top-[66%] left-1/2 aspect-square w-[min(120vw,1100px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,var(--sky-soft),transparent_72%)] opacity-80 dark:opacity-100" />
        <div className="absolute top-[68%] left-1/2 aspect-square w-[min(84vw,600px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-line/80" />
        <div className="hero-orbit absolute top-[68%] left-1/2 aspect-square w-[min(84vw,600px)] -translate-x-1/2 -translate-y-1/2">
          <span className="absolute top-0 left-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-clay shadow-[0_0_0_6px_var(--clay-soft)]" />
        </div>
        <div className="absolute top-[68%] left-1/2 aspect-square w-[min(120vw,900px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-line/60" />
        <div className="absolute inset-0 bg-[radial-gradient(130%_100%_at_50%_45%,transparent_60%,color-mix(in_srgb,var(--bg)_85%,black)_100%)] opacity-40 dark:opacity-70" />
      </div>

      <div className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 sm:px-6 xl:px-20">
        {/* Headline, centred above the character */}
        <div className="relative z-10 pt-6 text-center md:pt-8">
          <p className="inline-flex items-center gap-2 rounded-full border border-line bg-bg/60 px-4 py-1.5 text-[14px] text-ink-muted backdrop-blur-sm">
            <span aria-hidden className="size-2 rounded-full bg-clay" />
            <Words text={t("eyebrow")} />
          </p>
          <h1
            id="hero-title"
            className={
              isAr
                ? "mx-auto mt-4 max-w-5xl text-[36px] leading-[58px] font-semibold text-balance sm:text-[48px] sm:leading-[74px] lg:text-[56px] lg:leading-[84px] lg:whitespace-nowrap xl:text-[64px] xl:leading-[96px]"
                : "mx-auto mt-4 max-w-5xl font-latin text-[38px] leading-[44px] font-bold tracking-[-0.03em] text-balance sm:text-[52px] sm:leading-[58px] lg:text-[58px] lg:leading-[66px] lg:whitespace-nowrap xl:text-[66px] xl:leading-[74px]"
            }
          >
            <Words text={t("headline")} />
            <span data-reveal="word" className="ms-2 inline-block size-[0.18em] rounded-full bg-clay" aria-hidden />
          </h1>
          {/* On small screens the subline + buttons sit under the headline */}
          <p className="mx-auto mt-4 max-w-md text-[16px] leading-[28px] text-ink-muted xl:hidden">
            <Words text={t("subline")} />
          </p>
          <div data-reveal="text" className="mt-6 flex flex-wrap items-center justify-center gap-3 xl:hidden">
            <ButtonLink href={`/${locale}#contact`}>{t("primary")}</ButtonLink>
            <ButtonLink href={`/${locale}#projects`} variant="secondary">
              {t("secondary")}
            </ButtonLink>
          </div>
        </div>

        {/* The character, centred and standing on the proof strip.
            Previous full-body pose kept in /public/avatar/06-arms-crossed-* as a backup. */}
        <div className="relative flex min-h-[300px] flex-1 items-end justify-center [perspective:1200px]">
          <div
            ref={avatar}
            data-reveal="avatar"
            className="relative w-[min(100vw,520px)] origin-[50%_85%] will-change-transform sm:w-[min(90vw,640px)] lg:w-[min(64vw,calc((100dvh-470px)*1.225),860px)] xl:w-[min(64vw,calc((100dvh-400px)*1.225),860px)]"
          >
            <picture className="block drop-shadow-[0_24px_60px_rgba(19,48,59,0.18)] dark:drop-shadow-[0_0_40px_rgba(127,179,196,0.22)]">
              <source
                type="image/avif"
                srcSet="/avatar/hero-front-640.avif 640w, /avatar/hero-front-960.avif 960w, /avatar/hero-front-1280.avif 1280w, /avatar/hero-front-1808.avif 1808w"
                sizes="(min-width: 1024px) 860px, 92vw"
              />
              <img
                src="/avatar/hero-front-1280.webp"
                srcSet="/avatar/hero-front-640.webp 640w, /avatar/hero-front-960.webp 960w, /avatar/hero-front-1280.webp 1280w, /avatar/hero-front-1808.webp 1808w"
                sizes="(min-width: 1024px) 860px, 92vw"
                width={1808}
                height={1476}
                alt={t("avatarAlt")}
                fetchPriority="high"
                decoding="async"
                className="block h-auto w-full select-none [mask-image:linear-gradient(to_bottom,#000_82%,transparent)]"
                draggable={false}
              />
            </picture>
          </div>

          {/* Large screens: subline in one bottom corner, buttons in the other */}
          <p
            data-reveal="text"
            className="absolute start-0 bottom-8 z-10 hidden max-w-[280px] text-[16px] leading-[30px] text-ink-muted xl:block"
          >
            {t("subline")}
          </p>
          <div data-reveal="text" className="absolute end-0 bottom-8 z-10 hidden flex-col items-end gap-3 xl:flex xl:items-start">
            <ButtonLink href={`/${locale}#contact`}>{t("primary")}</ButtonLink>
            <ButtonLink href={`/${locale}#projects`} variant="secondary">
              {t("secondary")}
            </ButtonLink>
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
              <span className="num self-start font-display text-[36px] leading-[42px] text-petrol sm:text-[44px] sm:leading-[50px] lg:text-[52px] lg:leading-[58px] xl:text-[58px] xl:leading-[62px]">
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
