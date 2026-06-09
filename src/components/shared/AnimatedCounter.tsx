import { useEffect, useState } from 'react'
import { useInView } from '@/hooks/useInView'

interface AnimatedCounterProps {
  value: number
  suffix?: string
  duration?: number
}

export function AnimatedCounter({ value, suffix = '', duration = 2000 }: AnimatedCounterProps) {
  const [ref, isInView] = useInView<HTMLSpanElement>({ threshold: 0.5 })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isInView) return

    let start = 0
    const startTime = performance.now()

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      start = Math.floor(eased * value)
      setCount(start)

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [isInView, value, duration])

  return (
    <span ref={ref} className="tabular-nums">
      {count}
      {suffix}
    </span>
  )
}
