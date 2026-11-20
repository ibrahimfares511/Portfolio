import { Fragment } from "react";

/** Arabic letters (base block, supplement and presentation forms). */
const ARABIC = /[؀-ۿݐ-ݿࢠ-ࣿﭐ-﷿ﹰ-﻿]/;

/**
 * Splits text into words, each in its own span, for the "typed in, out of
 * blur" entrance. Words are never split into letters, so Arabic letters keep
 * their joined shapes. The spaces stay real spaces, so lines wrap normally.
 *
 * Each span is an inline-block, and the bidi algorithm orders inline-blocks
 * by the paragraph's direction. So in Arabic, a run of English words would be
 * laid out right to left ("Smart Control" → "Control Smart"). Consecutive
 * words without Arabic letters are therefore kept together in one span, which
 * keeps their own left-to-right order (Arabic text only; English text keeps
 * one span per word).
 */
export function Words({ text, group = "word" }: { text: string; group?: string }) {
  const words = text.split(/\s+/).filter(Boolean);
  // Only Arabic text needs the grouping; English text keeps one span per word.
  const mixed = ARABIC.test(text);
  const chunks: string[] = [];
  for (const w of words) {
    const last = chunks.length - 1;
    if (mixed && last >= 0 && !ARABIC.test(w) && !ARABIC.test(chunks[last])) chunks[last] += ` ${w}`;
    else chunks.push(w);
  }
  return (
    <>
      {chunks.map((w, i) => (
        <Fragment key={i}>
          <span data-reveal={group} className="inline-block will-change-[filter,opacity,transform]">
            {w}
          </span>
          {i < chunks.length - 1 ? " " : null}
        </Fragment>
      ))}
    </>
  );
}
