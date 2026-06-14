import { motion } from 'framer-motion'
import { colors, accent } from '../../tokens'
import type { WelcomeCardData } from '../../adapter/types'
import { CardBg } from '../CardBg'

interface Props {
  data: WelcomeCardData
}

export function WelcomeCard({ data }: Props) {
  const accentColor = accent(data.theme)

  return (
    <div
      style={{
        height: '100%',
        background: colors.bg,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        padding: '0 32px',
      }}
    >
      <CardBg theme={data.theme} />

      <div style={{ textAlign: 'center', zIndex: 2, width: '100%', position: 'relative' }}>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{
            color: colors.textMuted,
            fontSize: 11,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            marginBottom: 28,
          }}
        >
          {data.year}
        </motion.div>

        {/* Name pops in with spring scale */}
        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.88 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.22, type: 'spring', stiffness: 280, damping: 22 }}
          style={{
            color: accentColor,
            fontSize: 'clamp(52px, 14vw, 80px)',
            fontWeight: 900,
            lineHeight: 1,
            marginBottom: 8,
            letterSpacing: '-0.03em',
            wordBreak: 'break-word',
          }}
        >
          {data.userName}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.42, type: 'spring', stiffness: 260, damping: 24 }}
          style={{
            color: colors.textPrimary,
            fontSize: 'clamp(32px, 9vw, 52px)',
            fontWeight: 800,
            lineHeight: 1.05,
            marginBottom: 28,
            letterSpacing: '-0.025em',
          }}
        >
          Wrapped
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.68, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          style={{
            color: colors.textSecondary,
            fontSize: 16,
            fontWeight: 400,
          }}
        >
          {data.tagline}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.7 }}
        style={{
          position: 'absolute',
          bottom: 44,
          color: colors.textMuted,
          fontSize: 12,
          letterSpacing: '0.1em',
          textAlign: 'center',
          zIndex: 2,
        }}
      >
        tap to continue →
      </motion.div>
    </div>
  )
}
