"use client";

import { useEffect } from "react";

/**
 * An inline script that runs only from the server HTML.
 *
 * When the language changes, the root layout re-renders on the client. React
 * never executes scripts it creates on the client (and warns about them), and
 * this code must not run twice anyway. So on the client the tag is rendered
 * as an inert data block (type="text/plain"): no warning, no re-run.
 *
 * One exception: a 404 is first served as Next's bare error shell and then
 * rendered on the client, so the server copy never ran. If the engine isn't
 * there after mount, run it once.
 */
export function InlineScript({ id, code, ready }: { id: string; code: string; ready?: string }) {
  const isServer = typeof window === "undefined";
  useEffect(() => {
    if (ready && !(ready in window)) new Function(code)();
  }, [code, ready]);
  return (
    <script
      id={id}
      type={isServer ? undefined : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: code }}
    />
  );
}
