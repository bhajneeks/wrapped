import { motion } from 'framer-motion'
import { colors, accent, spring } from '../../tokens'
import type { HighlightCardData } from '../../adapter/types'
import type { Theme } from '../../tokens'

interface Props {
  data: HighlightCardData
  theme: Theme
}

export function HighlightCard({ data, theme }: Props) {
  const accentColor = accent(theme)

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
      {/* Large decorative background letter */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '70vw',
          fontWeight: 900,
          color: `${accentColor}06`,
          lineHeight: 1,
          pointerEvents: 'none',
          userSelect: 'none',
          whiteSpace: 'nowrap',
        }}
      >
        ★
      </div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={spring.stagger(0)}
        style={{
          color: colors.textMuted,
          fontSize: 11,
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          marginBottom: 24,
          zIndex: 1,
        }}
      >
        {data.headline}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={spring.stagger(1)}
        style={{
          color: accentColor,
          fontSize: 'clamp(44px, 13vw, 68px)',
          fontWeight: 800,
          lineHeight: 1.05,
          letterSpacing: '-0.02em',
          marginBottom: 16,
          wordBreak: 'break-word',
          zIndex: 1,
        }}
      >
        {data.mainText}
      </motion.div>

      {data.subText ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={spring.stagger(2)}
          style={{
            color: colors.textSecondary,
            fontSize: 17,
            fontWeight: 400,
            marginBottom: 40,
            zIndex: 1,
          }}
        >
          {data.subText}
        </motion.div>
      ) : null}

      {data.funFact ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={spring.stagger(3)}
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: `1px solid rgba(255,255,255,0.09)`,
            borderRadius: 14,
            padding: '16px 20px',
            color: colors.textSecondary,
            fontSize: 14,
            lineHeight: 1.5,
            zIndex: 1,
          }}
        >
          {data.funFact}
        </motion.div>
      ) : null}
    </div>
  )
}
