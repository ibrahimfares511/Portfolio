import { motion } from 'framer-motion'
import { useMagnetic } from '@/hooks/useMagnetic'
import { Button, type ButtonProps } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface MagneticButtonProps extends ButtonProps {
  magneticStrength?: number
}

export function MagneticButton({
  magneticStrength = 0.25,
  className,
  children,
  ...props
}: MagneticButtonProps) {
  const { ref, handleMouseMove, handleMouseLeave } = useMagnetic(magneticStrength)

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      <Button
        ref={ref as React.RefObject<HTMLButtonElement>}
        className={cn('transition-transform duration-200 ease-out', className)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {children}
      </Button>
    </motion.div>
  )
}
