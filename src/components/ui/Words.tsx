import { Fragment } from "react";

/**
 * Splits text into words, each in its own span, for the "typed in, out of
 * blur" entrance. Words are never split into letters, so Arabic letters keep
 * their joined shapes. The spaces stay real spaces, so lines wrap normally.
 */
export function Words({ text, group = "word" }: { text: string; group?: string }) {
  const words = text.split(/\s+/).filter(Boolean);
  return (
    <>
      {words.map((w, i) => (
        <Fragment key={i}>
          <span data-reveal={group} className="inline-block will-change-[filter,opacity,transform]">
            {w}
          </span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </>
  );
}
