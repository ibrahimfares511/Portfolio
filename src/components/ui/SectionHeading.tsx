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
  const endsWithQuestion = /[?؟]\s*$/.test(title);
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
        <Words text={title} />
        {endsWithQuestion ? null : (
          <span
            data-reveal="word"
            className="ms-1 inline-block size-[0.22em] translate-y-[-0.05em] rounded-full bg-clay align-baseline"
            aria-hidden
          />
        )}
      </h2>
      {sub ? (
        <p data-reveal="text" className="mt-4 text-[17px] leading-[30px] text-ink-muted md:text-body-lg">
          {sub}
        </p>
      ) : null}
    </div>
  );
}
