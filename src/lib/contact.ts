/** Shared by the contact form (client) and /api/contact (server). */
export const PROJECT_TYPES = ["internal", "platform", "other"] as const;
export type ProjectType = (typeof PROJECT_TYPES)[number];

export function isEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
}

/** A WhatsApp number: digits with an optional +, spaces, dashes or brackets. */
export function isPhone(v: string) {
  const s = v.trim();
  return /^\+?[\d\s()-]{8,20}$/.test(s) && s.replace(/\D/g, "").length >= 8;
}
