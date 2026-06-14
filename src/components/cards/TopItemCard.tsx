import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { colors, accent, spring } from '../../tokens'
import type { TopItemCardData } from '../../adapter/types'
import type { Theme } from '../../tokens'

interface Props {
  data: TopItemCardData
  theme: Theme
}

export function TopItemCard({ data, theme }: Props) {
  const accentColor = accent(theme)
  const reduced = useReducedMotion()
  const maxVal = Math.max(...data.bars.map(b => b.value), 1)

  // Suspense → reveal beat
  const [phase, setPhase] = useState<'suspense' | 'reveal'>(reduced ? 'reveal' : 'suspense')
  useEffect(() => {
    if (reduced) return
    const t = setTimeout(() => setPhase('reveal'), 950)
    return () => clearTimeout(t)
  }, [reduced])

  return (
    <div
      style={{
        height: '100%',
        background: colors.bg,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '0 28px',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: 'absolute',
          top: '-20%', right: '-20%',
          width: '80vw', height: '80vw',
          maxWidth: 360, maxHeight: 360,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${accentColor}10 0%, transparent 65%)`,
          pointerEvents: 'none',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={spring.stagger(0)}
        style={{
          color: colors.textMuted,
          fontSize: 11,
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          marginBottom: 16,
          position: 'relative',
        }}
      >
        {data.headline}
      </motion.div>

      {/* Suspense → reveal animation */}
      <AnimatePresence mode="wait">
        {phase === 'suspense' ? (
          <motion.div
            key="suspense"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12, scale: 0.94 }}
            transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
            style={{
              color: `${accentColor}45`,
              fontSize: 'clamp(36px, 10vw, 52px)',
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: '0.18em',
              marginBottom: 8,
              position: 'relative',
            }}
          >
            · · ·
          </motion.div>
        ) : (
          <motion.div
            key="reveal"
            initial={{ opacity: 0, y: 28, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 340, damping: 22 }}
            style={{
              color: accentColor,
              fontSize: 'clamp(36px, 10vw, 52px)',
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
              marginBottom: 8,
              wordBreak: 'break-word',
              position: 'relative',
            }}
          >
            {data.name}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === 'reveal' ? 1 : 0 }}
        transition={{ duration: 0.4 }}
        style={{
          color: colors.textSecondary,
          fontSize: 14,
          marginBottom: 36,
          position: 'relative',
        }}
      >
        {data.detail}
      </motion.div>

      {/* Animated bar chart */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, position: 'relative' }}>
        {data.bars.map((bar, i) => {
          const pct = maxVal > 0 ? (bar.value / maxVal) * 100 : 0
          const isTop = i === 0

          return (
            <div key={bar.label}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  marginBottom: 6,
                }}
              >
                <span
                  style={{
                    color: isTop ? colors.textPrimary : colors.textSecondary,
                    fontSize: isTop ? 14 : 13,
                    fontWeight: isTop ? 600 : 400,
                  }}
                >
                  {bar.label}
                </span>
                <span style={{ color: colors.textMuted, fontSize: 11 }}>
                  {bar.value < 1 ? `${Math.round(bar.value * 100)}%` : bar.value.toLocaleString()}
                </span>
              </div>
              <div
                style={{
                  height: isTop ? 7 : 5,
                  background: 'rgba(255,255,255,0.07)',
                  borderRadius: 4,
                  overflow: 'hidden',
                }}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={
                    reduced
                      ? { duration: 0.1 }
                      : spring.bar(i)
                  }
                  style={{
                    height: '100%',
                    background: isTop ? accentColor : 'rgba(255,255,255,0.22)',
                    borderRadius: 4,
                    boxShadow: isTop ? `0 0 10px ${accentColor}40` : 'none',
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
