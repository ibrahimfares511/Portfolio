import { useEffect, useState } from 'react'

export function useMouseParallax(intensity = 0.02) {
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    // No-op on mobile — avoids unnecessary event listener and state churn
    if (window.innerWidth < 768) return

    const handleMove = (e: MouseEvent) => {
      const x = Math.round((e.clientX - window.innerWidth / 2) * intensity)
      const y = Math.round((e.clientY - window.innerHeight / 2) * intensity)
      setPosition({ x, y })
    }

    window.addEventListener('mousemove', handleMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMove)
  }, [intensity])

  return position
}
