import { motion } from 'framer-motion'
import { colors, accent, spring } from '../../tokens'
import type { VolumeCardData } from '../../adapter/types'
import type { Theme } from '../../tokens'
import { useCountUp } from '../../hooks/useCountUp'
import { formatNumber } from '../../utils/format'

interface Props {
  data: VolumeCardData
  theme: Theme
}

export function VolumeCard({ data, theme }: Props) {
  const accentColor = accent(theme)
  const count = useCountUp(data.value)

  return (
    <div
      style={{
        height: '100%',
        background: colors.bg,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '0 32px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle background mark */}
      <div
        style={{
          position: 'absolute',
          bottom: '-10%',
          right: '-15%',
          fontSize: 'clamp(180px, 50vw, 280px)',
          fontWeight: 900,
          color: `${accentColor}07`,
          lineHeight: 1,
          pointerEvents: 'none',
          letterSpacing: '-0.05em',
          userSelect: 'none',
        }}
      >
        {formatNumber(data.value)}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={spring.stagger(0)}
        style={{
          color: colors.textMuted,
          fontSize: 11,
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          marginBottom: 20,
        }}
      >
        {data.label}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        style={{
          fontSize: 'clamp(64px, 18vw, 100px)',
          fontWeight: 800,
          lineHeight: 1,
          color: accentColor,
          fontVariantNumeric: 'tabular-nums',
          letterSpacing: '-0.03em',
          marginBottom: 28,
        }}
      >
        {formatNumber(count)}
      </motion.div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {data.context.map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={spring.stagger(i + 2)}
            style={{
              color: i === 0 ? colors.textSecondary : colors.textMuted,
              fontSize: i === 0 ? 18 : 13,
              fontWeight: i === 0 ? 500 : 400,
            }}
          >
            {line}
          </motion.div>
        ))}
      </div>
    </div>
  )
}
