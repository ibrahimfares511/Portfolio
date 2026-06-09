import { LazyMotion, domAnimation, m } from 'framer-motion'
import { useMouseParallax } from '@/hooks/useMouseParallax'
import { cn } from '@/lib/utils'

interface AuroraBackgroundProps {
  className?: string
  intensity?: number
}

export function AuroraBackground({ className, intensity = 0.015 }: AuroraBackgroundProps) {
  const { x, y } = useMouseParallax(intensity)

  return (
    <LazyMotion features={domAnimation}>
      <div className={cn('absolute inset-0 overflow-hidden pointer-events-none', className)}>
        {/* Blob 1 — indigo/violet, top-left */}
        <m.div
          style={{ x: x * 2, y: y * 2 }}
          animate={{ opacity: [0.25, 0.4, 0.25] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-1/2 -left-1/4 w-[80%] h-[80%] rounded-full blur-[120px]"
          aria-hidden="true"
        >
          <div className="w-full h-full rounded-full bg-[radial-gradient(circle,rgba(129,140,248,0.55)_0%,transparent_70%)]" />
        </m.div>

        {/* Blob 2 — purple/cyan, bottom-right */}
        <m.div
          style={{ x: x * -1.5, y: y * -1.5 }}
          animate={{ opacity: [0.2, 0.35, 0.2] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
          className="absolute -bottom-1/4 -right-1/4 w-[70%] h-[70%] rounded-full blur-[100px]"
          aria-hidden="true"
        >
          <div className="w-full h-full rounded-full bg-[radial-gradient(circle,rgba(192,132,252,0.5)_0%,transparent_70%)]" />
        </m.div>

        {/* Blob 3 — cyan/indigo, center */}
        <m.div
          style={{ x: x * 0.8, y: y * 0.8 }}
          animate={{ opacity: [0.15, 0.28, 0.15] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
          className="absolute top-1/3 left-1/3 w-[50%] h-[50%] rounded-full blur-[80px]"
          aria-hidden="true"
        >
          <div className="w-full h-full rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.45)_0%,transparent_70%)]" />
        </m.div>

        <div className="absolute inset-0 noise-overlay opacity-50" />
      </div>
    </LazyMotion>
  )
}
