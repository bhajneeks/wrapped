import { motion } from 'framer-motion'
import { colors, accent, spring } from '../../tokens'
import type { TopItemCardData } from '../../adapter/types'
import type { Theme } from '../../tokens'

interface Props {
  data: TopItemCardData
  theme: Theme
}

export function TopItemCard({ data, theme }: Props) {
  const accentColor = accent(theme)
  const maxVal = Math.max(...data.bars.map(b => b.value), 1)

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
          marginBottom: 16,
        }}
      >
        {data.headline}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={spring.stagger(1)}
        style={{
          color: accentColor,
          fontSize: 'clamp(36px, 10vw, 52px)',
          fontWeight: 800,
          lineHeight: 1.05,
          letterSpacing: '-0.02em',
          marginBottom: 8,
          wordBreak: 'break-word',
        }}
      >
        {data.name}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={spring.stagger(2)}
        style={{
          color: colors.textSecondary,
          fontSize: 14,
          marginBottom: 36,
        }}
      >
        {data.detail}
      </motion.div>

      {/* Animated bar chart */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
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
                  transition={spring.bar(i)}
                  style={{
                    height: '100%',
                    background: isTop ? accentColor : 'rgba(255,255,255,0.22)',
                    borderRadius: 4,
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
