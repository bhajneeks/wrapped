import { motion } from 'framer-motion'
import { accent } from '../tokens'
import type { Theme } from '../tokens'

interface Props {
  total: number
  current: number
  theme: Theme
}

export function ProgressBar({ total, current, theme }: Props) {
  const accentColor = accent(theme)

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        display: 'flex',
        gap: 4,
        padding: '14px 16px',
        pointerEvents: 'none',
      }}
    >
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            height: 3,
            borderRadius: 2,
            background: 'rgba(255,255,255,0.15)',
            overflow: 'hidden',
          }}
        >
          {i <= current && (
            <motion.div
              style={{
                height: '100%',
                borderRadius: 2,
                background: i < current ? 'rgba(255,255,255,0.55)' : accentColor,
              }}
              initial={{ width: i < current ? '100%' : '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            />
          )}
        </div>
      ))}
    </div>
  )
}
