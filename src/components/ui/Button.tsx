import type { AnchorHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary";

const styles: Record<Variant, string> = {
  // The one thing to press: clay-strong with on-clay text. One per view.
  primary:
    "bg-clay-strong text-on-clay hover:brightness-[0.94] active:brightness-90 shadow-[0_8px_24px_-12px_var(--clay-strong)]",
  secondary: "border-[1.5px] border-line text-ink hover:border-petrol/50 hover:text-petrol bg-surface/40",
};

export function ButtonLink({
  variant = "primary",
  className = "",
  children,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & { variant?: Variant; children: ReactNode }) {
  return (
    <a
      {...props}
      className={`inline-flex h-12 items-center justify-center gap-2 rounded-md px-6 text-[16px] font-medium transition-[filter,color,border-color,transform] duration-200 hover:-translate-y-px focus-visible:outline-clay ${styles[variant]} ${className}`}
    >
      {children}
    </a>
  );
}
