import { useState, useCallback, useEffect, useRef } from 'react'

export interface NavigationState {
  current: number
  direction: number
  next: () => void
  prev: () => void
  isFirst: boolean
  isLast: boolean
  handleTouchStart: (e: React.TouchEvent) => void
  handleTouchEnd: (e: React.TouchEvent) => void
  handleClick: (e: React.MouseEvent) => void
}

export function useNavigation(total: number): NavigationState {
  const [state, setState] = useState({ current: 0, direction: 1 })
  const touchStartX = useRef<number | null>(null)

  const next = useCallback(() => {
    setState(prev =>
      prev.current >= total - 1 ? prev : { current: prev.current + 1, direction: 1 }
    )
  }, [total])

  const prev = useCallback(() => {
    setState(prev =>
      prev.current <= 0 ? prev : { current: prev.current - 1, direction: -1 }
    )
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); next() }
      if (e.key === 'ArrowLeft' || e.key === 'Backspace') { e.preventDefault(); prev() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [next, prev])

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }, [])

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(dx) > 50) {
      dx < 0 ? next() : prev()
    }
    touchStartX.current = null
  }, [next, prev])

  // Tapping left/right thirds navigates; tapping centre does nothing
  const handleClick = useCallback((e: React.MouseEvent) => {
    const x = e.clientX
    const w = window.innerWidth
    if (x > w * 0.6) next()
    else if (x < w * 0.4) prev()
  }, [next, prev])

  return {
    current: state.current,
    direction: state.direction,
    next,
    prev,
    isFirst: state.current === 0,
    isLast: state.current === total - 1,
    handleTouchStart,
    handleTouchEnd,
    handleClick,
  }
}
