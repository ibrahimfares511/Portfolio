"use client";

/**
 * An inline script that runs only from the server HTML.
 *
 * When the language changes, the root layout re-renders on the client. React
 * never executes scripts it creates on the client (and warns about them), and
 * this code must not run twice anyway. So on the client the tag is rendered
 * as an inert data block (type="text/plain"): no warning, no re-run.
 */
export function InlineScript({ id, code }: { id: string; code: string }) {
  const isServer = typeof window === "undefined";
  return (
    <script
      id={id}
      type={isServer ? undefined : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: code }}
    />
  );
}
