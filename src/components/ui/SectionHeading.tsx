import type { ReactNode } from "react";

/**
 * Section title. Arabic: Alexandria 500. English: IF Pen (display-lg),
 * lowercase as the brand asks. Ends with the clay dot.
 */
export function SectionHeading({
  id,
  locale,
  children,
  sub,
}: {
  id?: string;
  locale: string;
  children: ReactNode;
  sub?: ReactNode;
}) {
  const isAr = locale === "ar";
  // A heading that already ends with a question mark gets no extra dot.
  const endsWithQuestion = typeof children === "string" && /[?؟]\s*$/.test(children);
  return (
    <div className="max-w-2xl">
      <h2
        id={id}
        className={
          isAr
            ? "text-[30px] leading-[46px] font-medium md:text-[40px] md:leading-[60px]"
            : "font-display text-[38px] leading-[46px] lowercase md:text-[48px] md:leading-[56px]"
        }
      >
        {children}
        {endsWithQuestion ? null : (
          <span className="ms-1 inline-block size-[0.22em] translate-y-[-0.05em] rounded-full bg-clay align-baseline" aria-hidden />
        )}
      </h2>
      {sub ? <p className="mt-4 text-body-lg text-ink-muted">{sub}</p> : null}
    </div>
  );
}
