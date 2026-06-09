import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  label: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  label,
  title,
  description,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "mb-16 md:mb-20",
        align === "center" && "text-center mx-auto max-w-3xl",
        className,
      )}
    >
      <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-4">
        {label}
      </span>
      <h2 className="font-display text-[7.5vw] sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gradient">
        {title}
      </h2>
      {description && (
        <p className={cn(
          "mt-6 text-[3.6vw] sm:text-lg text-muted leading-relaxed max-w-2xl text-pretty",
          align === "center" && "mx-auto",
        )}>
          {description}
        </p>
      )}
    </motion.div>
  );
}
