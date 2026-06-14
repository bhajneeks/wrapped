import { motion, useReducedMotion } from 'framer-motion'
import { colors, spring } from '../../tokens'
import { useAccentColor } from '../../AccentContext'
import type { HighlightCardData } from '../../adapter/types'
import type { Theme } from '../../tokens'
import { CardBg } from '../CardBg'

interface Props {
  data: HighlightCardData
  theme: Theme
}

export function HighlightCard({ data, theme }: Props) {
  const accentColor = useAccentColor()
  const reduced = useReducedMotion()

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
      <CardBg />

      {/* Large decorative star watermark */}
      <motion.div
        animate={reduced ? {} : { rotate: [0, 6, -6, 0], scale: [1, 1.04, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '65vw',
          fontWeight: 900,
          color: `${accentColor}07`,
          lineHeight: 1,
          pointerEvents: 'none',
          userSelect: 'none',
          whiteSpace: 'nowrap',
          zIndex: 0,
        }}
      >
        ★
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={reduced ? { duration: 0.1 } : spring.stagger(0)}
        style={{
          color: colors.textMuted,
          fontSize: 11,
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          marginBottom: 24,
          zIndex: 2,
          position: 'relative',
        }}
      >
        {data.headline}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={
          reduced
            ? { duration: 0.1 }
            : { delay: 0.15, type: 'spring', stiffness: 300, damping: 22 }
        }
        style={{
          color: accentColor,
          fontSize: 'clamp(44px, 13vw, 68px)',
          fontWeight: 900,
          lineHeight: 1.05,
          letterSpacing: '-0.025em',
          marginBottom: 16,
          wordBreak: 'break-word',
          zIndex: 2,
          position: 'relative',
        }}
      >
        {data.mainText}
      </motion.div>

      {data.subText ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={reduced ? { duration: 0.1 } : spring.stagger(2)}
          style={{
            color: colors.textSecondary,
            fontSize: 17,
            fontWeight: 400,
            marginBottom: 40,
            zIndex: 2,
            position: 'relative',
          }}
        >
          {data.subText}
        </motion.div>
      ) : null}

      {data.funFact ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={reduced ? { duration: 0.1 } : spring.stagger(3)}
          style={{
            background: `${accentColor}0C`,
            border: `1px solid ${accentColor}22`,
            borderRadius: 14,
            padding: '16px 20px',
            color: colors.textSecondary,
            fontSize: 14,
            lineHeight: 1.55,
            zIndex: 2,
            position: 'relative',
          }}
        >
          {data.funFact}
        </motion.div>
      ) : null}
    </div>
  )
}
