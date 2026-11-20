"use client";

import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from "react";
import { Link, useRouter } from "@/i18n/navigation";
import { coverSwitch, nextFrame, originOf, waitFor } from "@/lib/motion";

/**
 * A link to a project's case study (from the home page or another case study) that goes there through the brand cover (the same
 * transition as the language and theme switches): the cover grows from the
 * pointer, the next case study renders underneath at its top, the cover opens.
 */
export function ProjectLink({
  slug,
  className,
  children,
  ...rest
}: {
  slug: string;
  className?: string;
  children?: ReactNode;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "onClick" | "className" | "children"> & { "data-cursor-label"?: string }) {
  const router = useRouter();
  const href = `/projects/${slug}`;
  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    const { x, y } = originOf(e);
    void coverSwitch(x, y, async () => {
      router.push(href, { scroll: false });
      await waitFor(() => window.location.pathname.endsWith(href));
      await nextFrame();
      await nextFrame();
      window.scrollTo({ top: 0, behavior: "instant" });
    });
  };
  return (
    <Link data-track="open-project" data-track-project={slug} {...rest} href={href} scroll={false} onClick={onClick} className={className}>
      {children}
    </Link>
  );
}
