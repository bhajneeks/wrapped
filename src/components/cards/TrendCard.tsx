import { motion } from 'framer-motion'
import { colors, accent, spring } from '../../tokens'
import type { TrendCardData } from '../../adapter/types'
import type { Theme } from '../../tokens'

interface Props {
  data: TrendCardData
  theme: Theme
}

export function TrendCard({ data, theme }: Props) {
  const accentColor = accent(theme)
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
      }}
    >
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
        }}
      >
        {data.peakLabel}
      </motion.div>

      {/* Vertical bar chart */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 5, height: 140 }}>
        {bars.map((bar, i) => {
          const pct = maxVal > 0 ? (bar.value / maxVal) * 100 : 0
          const isPeak = bar.value === peakVal

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
                  transition={spring.bar(i)}
                  style={{
                    width: '100%',
                    background: isPeak ? accentColor : 'rgba(255,255,255,0.18)',
                    borderRadius: '3px 3px 0 0',
                    position: 'relative',
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

      {/* Month labels strip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: 4,
          paddingLeft: 1,
          paddingRight: 1,
        }}
      >
        {['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'].map((m, i) => (
          <span
            key={i}
            style={{
              flex: 1,
              textAlign: 'center',
              color: 'transparent',
              fontSize: 0,
            }}
          >
            {m}
          </span>
        ))}
      </motion.div>
    </div>
  )
}
