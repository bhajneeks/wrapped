import { motion, useReducedMotion } from 'framer-motion'
import { colors, accent, spring } from '../../tokens'
import type { TrendCardData } from '../../adapter/types'
import type { Theme } from '../../tokens'
import { CardBg } from '../CardBg'

interface Props {
  data: TrendCardData
  theme: Theme
}

export function TrendCard({ data, theme }: Props) {
  const accentColor = accent(theme)
  const reduced = useReducedMotion()
  const bars = data.bars.length > 0 ? data.bars : []
  const maxVal = Math.max(...bars.map(b => b.value), 1)
  const peakVal = Math.max(...bars.map(b => b.value))

  return (
    <div
      style={{
        height: '100%',
        background: colors.bg,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '0 24px',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <CardBg theme={theme} />

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={spring.stagger(0)}
        style={{
          color: colors.textMuted,
          fontSize: 11,
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          marginBottom: 8,
          position: 'relative',
        }}
      >
        {data.headline}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={spring.stagger(1)}
        style={{
          color: accentColor,
          fontSize: 16,
          fontWeight: 600,
          marginBottom: 36,
          position: 'relative',
        }}
      >
        {data.peakLabel}
      </motion.div>

      {/* Vertical bar chart */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 5, height: 140, position: 'relative' }}>
        {bars.map((bar, i) => {
          const pct = maxVal > 0 ? (bar.value / maxVal) * 100 : 2
          // Only highlight if there's a real peak (not all zeros)
          const isPeak = peakVal > 0 && bar.value === peakVal

          return (
            <div
              key={`${bar.label}-${i}`}
              style={{
                flex: 1,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: 8,
              }}
            >
              <div style={{ width: '100%', flex: 1, display: 'flex', alignItems: 'flex-end' }}>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.max(pct, 2)}%` }}
                  transition={
                    reduced
                      ? { duration: 0.15, delay: 0 }
                      : spring.bar(i)
                  }
                  style={{
                    width: '100%',
                    background: isPeak ? accentColor : 'rgba(255,255,255,0.18)',
                    borderRadius: '3px 3px 0 0',
                    boxShadow: isPeak ? `0 0 12px ${accentColor}50` : 'none',
                  }}
                />
              </div>
              <span
                style={{
                  color: isPeak ? accentColor : colors.textMuted,
                  fontSize: 9,
                  fontWeight: isPeak ? 700 : 400,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                {bar.label.slice(0, 1)}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
