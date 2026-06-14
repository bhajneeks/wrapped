import { motion, useReducedMotion } from 'framer-motion'
import { colors, accent, spring } from '../../tokens'
import type { VolumeCardData } from '../../adapter/types'
import type { Theme } from '../../tokens'
import { useCountUp } from '../../hooks/useCountUp'
import { formatNumber } from '../../utils/format'

interface Props {
  data: VolumeCardData
  theme: Theme
}

function heroFontSize(formatted: string): string {
  const digits = formatted.replace(/[^0-9]/g, '').length
  if (digits > 9) return 'clamp(36px, 9vw, 56px)'
  if (digits > 6) return 'clamp(48px, 13vw, 76px)'
  return 'clamp(64px, 18vw, 100px)'
}

export function VolumeCard({ data, theme }: Props) {
  const accentColor = accent(theme)
  const reduced = useReducedMotion()
  const count = useCountUp(data.value)
  const finalFormatted = formatNumber(data.value)

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
      {/* Background glow */}
      <div
        style={{
          position: 'absolute',
          top: '-10%', left: '50%',
          transform: 'translateX(-50%)',
          width: '90vw', height: '90vw',
          maxWidth: 440, maxHeight: 440,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${accentColor}14 0%, transparent 65%)`,
          pointerEvents: 'none',
        }}
      />

      {/* Ghost watermark */}
      <div
        style={{
          position: 'absolute',
          bottom: '-10%',
          right: '-15%',
          fontSize: 'clamp(120px, 35vw, 200px)',
          fontWeight: 900,
          color: `${accentColor}07`,
          lineHeight: 1,
          pointerEvents: 'none',
          letterSpacing: '-0.05em',
          userSelect: 'none',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {finalFormatted}
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
          position: 'relative',
        }}
      >
        {data.label}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: reduced ? 0.1 : 0.3 }}
        style={{
          fontSize: heroFontSize(finalFormatted),
          fontWeight: 900,
          lineHeight: 1,
          color: accentColor,
          fontVariantNumeric: 'tabular-nums',
          letterSpacing: '-0.03em',
          marginBottom: 28,
          position: 'relative',
        }}
      >
        {formatNumber(count)}
      </motion.div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, position: 'relative' }}>
        {data.context.map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={reduced ? { duration: 0.1 } : spring.stagger(i + 2)}
            style={{
              color: i === 0 ? colors.textSecondary : colors.textMuted,
              fontSize: i === 0 ? 18 : 13,
              fontWeight: i === 0 ? 500 : 400,
            }}
          >
            {line}
          </motion.div>
        ))}

        {data.comparison && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={reduced ? { duration: 0.1 } : { delay: 0.9, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            style={{
              marginTop: 12,
              padding: '12px 16px',
              background: `${accentColor}12`,
              border: `1px solid ${accentColor}28`,
              borderRadius: 12,
              color: accentColor,
              fontSize: 13,
              fontWeight: 500,
              lineHeight: 1.5,
            }}
          >
            {data.comparison}
          </motion.div>
        )}
      </div>
    </div>
  )
}
