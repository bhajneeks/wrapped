import { motion, useReducedMotion } from 'framer-motion'
import { useAccentColor } from '../AccentContext'

const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'%2F%3E%3C%2Ffilter%3E%3Crect width='200' height='200' filter='url(%23n)'%2F%3E%3C%2Fsvg%3E")`

interface Props {
  variant?: 'default' | 'intense'
}

export function CardBg({ variant = 'default' }: Props) {
  const ac = useAccentColor()
  const reduced = useReducedMotion()
  const primaryAlpha = variant === 'intense' ? '28' : '18'
  const secondaryAlpha = variant === 'intense' ? '18' : '0E'

  return (
    <>
      <motion.div
        animate={
          reduced
            ? {}
            : { opacity: [0.55, 0.9, 0.55], scale: [1, 1.08, 1] }
        }
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', repeatType: 'loop' }}
        style={{
          position: 'absolute',
          top: '-25%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100vw',
          height: '100vw',
          maxWidth: 500,
          maxHeight: 500,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${ac}${primaryAlpha} 0%, ${ac}06 55%, transparent 70%)`,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-15%',
          right: '-15%',
          width: '60vw',
          height: '60vw',
          maxWidth: 300,
          maxHeight: 300,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${ac}${secondaryAlpha} 0%, transparent 65%)`,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: GRAIN,
          backgroundRepeat: 'repeat',
          backgroundSize: '200px 200px',
          opacity: 0.042,
          mixBlendMode: 'screen',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />
    </>
  )
}
