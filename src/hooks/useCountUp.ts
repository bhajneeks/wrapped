import { animate } from 'framer-motion'
import { useEffect, useState } from 'react'

export function useCountUp(target: number, delay = 350): number {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!Number.isFinite(target) || target < 0) {
      setValue(0)
      return
    }

    let stopped = false
    const timer = setTimeout(() => {
      const controls = animate(0, target, {
        duration: 1.8,
        ease: [0.16, 1, 0.3, 1],
        onUpdate: v => {
          if (!stopped) setValue(Math.round(v))
        },
      })
      return () => {
        stopped = true
        controls.stop()
      }
    }, delay)

    return () => {
      clearTimeout(timer)
      stopped = true
    }
  }, [target, delay])

  return value
}
