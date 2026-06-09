import { motion } from 'framer-motion'
import { useMouseParallax } from '@/hooks/useMouseParallax'
import { cn } from '@/lib/utils'

interface AuroraBackgroundProps {
  className?: string
  intensity?: number
}

export function AuroraBackground({ className, intensity = 0.015 }: AuroraBackgroundProps) {
  const { x, y } = useMouseParallax(intensity)

  return (
    <div className={cn('absolute inset-0 overflow-hidden pointer-events-none', className)}>
      <motion.div
        style={{ x: x * 2, y: y * 2 }}
        className="absolute -top-1/2 -left-1/4 w-[80%] h-[80%] rounded-full opacity-30 blur-[120px]"
        animate={{
          background: [
            'radial-gradient(circle, rgba(129,140,248,0.4) 0%, transparent 70%)',
            'radial-gradient(circle, rgba(192,132,252,0.4) 0%, transparent 70%)',
            'radial-gradient(circle, rgba(34,211,238,0.3) 0%, transparent 70%)',
            'radial-gradient(circle, rgba(129,140,248,0.4) 0%, transparent 70%)',
          ],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        style={{ x: x * -1.5, y: y * -1.5 }}
        className="absolute -bottom-1/4 -right-1/4 w-[70%] h-[70%] rounded-full opacity-25 blur-[100px]"
        animate={{
          background: [
            'radial-gradient(circle, rgba(192,132,252,0.35) 0%, transparent 70%)',
            'radial-gradient(circle, rgba(34,211,238,0.3) 0%, transparent 70%)',
            'radial-gradient(circle, rgba(129,140,248,0.35) 0%, transparent 70%)',
            'radial-gradient(circle, rgba(192,132,252,0.35) 0%, transparent 70%)',
          ],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        style={{ x: x * 0.8, y: y * 0.8 }}
        className="absolute top-1/3 left-1/3 w-[50%] h-[50%] rounded-full opacity-20 blur-[80px]"
        animate={{
          background: [
            'radial-gradient(circle, rgba(34,211,238,0.25) 0%, transparent 70%)',
            'radial-gradient(circle, rgba(129,140,248,0.3) 0%, transparent 70%)',
            'radial-gradient(circle, rgba(192,132,252,0.25) 0%, transparent 70%)',
            'radial-gradient(circle, rgba(34,211,238,0.25) 0%, transparent 70%)',
          ],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
      />
      <div className="absolute inset-0 noise-overlay opacity-50" />
    </div>
  )
}
