/**
 * Shared class strings. Kept in a plain module (not a "use client" one): a server component that
 * imports a value from a client module gets a reference, not the string.
 */

/** The look of a small floating card beside the character. */
export const floatCard =
  "rounded-2xl border border-line bg-surface/90 shadow-[0_20px_40px_-24px_rgba(22,48,58,0.55)] backdrop-blur-sm dark:shadow-[0_20px_40px_-20px_rgba(0,0,0,0.8)]";
