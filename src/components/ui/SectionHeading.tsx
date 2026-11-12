import { Words } from "./Words";

/**
 * Section title. Arabic: Alexandria 500. English: IF Pen (display-lg),
 * lowercase as the brand asks. Ends with the clay dot (unless it ends with a
 * question mark). Words enter one by one inside a <Reveal>.
 */
export function SectionHeading({
  id,
  locale,
  title,
  sub,
}: {
  id?: string;
  locale: string;
  title: string;
  sub?: string;
}) {
  const isAr = locale === "ar";
  // IF Pen only has lowercase, which would turn the pronoun "I" into "i".
  // English titles with "I" use Nunito instead (Ibrahim, Nov 10, 2026).
  const hasI = !isAr && /\bI\b/.test(title);
  const endsWithQuestion = /[?؟]\s*$/.test(title);
  return (
    <div className="max-w-2xl">
      <h2
        id={id}
        className={
          isAr
            ? "text-[30px] leading-[46px] font-medium md:text-[40px] md:leading-[60px]"
            : hasI
              ? "font-latin text-[32px] leading-[40px] font-bold tracking-[-0.02em] md:text-[42px] md:leading-[52px]"
              : "font-display text-[38px] leading-[46px] lowercase md:text-[48px] md:leading-[56px]"
        }
      >
        <Words text={title} />
        {endsWithQuestion ? null : (
          <span
            data-reveal="word"
            className="ms-1 inline-block size-[0.22em] translate-y-[-0.05em] rounded-full bg-clay align-baseline"
            aria-hidden
          />
        )}
      </h2>
      {/* A pen stroke under the title, drawn as it enters. */}
      <svg
        aria-hidden
        viewBox="0 0 220 14"
        className="mt-3 block h-[12px] w-[150px] text-clay md:w-[190px] rtl:-scale-x-100"
        fill="none"
      >
        <path
          data-reveal="pen"
          d="M3 9 C 40 3, 80 3, 118 7 S 190 12, 217 5"
          pathLength={100}
          strokeDasharray="100"
          stroke="currentColor"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
      </svg>
      {sub ? (
        <p data-reveal="text" className="mt-4 text-[17px] leading-[30px] text-ink-muted md:text-body-lg">
          {sub}
        </p>
      ) : null}
    </div>
  );
}
