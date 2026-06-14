import { motion } from 'framer-motion'
import { colors, accent } from '../../tokens'
import type { WelcomeCardData } from '../../adapter/types'

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
      {/* Background radial glow */}
      <div
        style={{
          position: 'absolute',
          width: '70vw',
          height: '70vw',
          maxWidth: 400,
          maxHeight: 400,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${accentColor}1A 0%, transparent 70%)`,
          top: '15%',
          left: '50%',
          transform: 'translateX(-50%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ textAlign: 'center', zIndex: 1, width: '100%' }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          style={{
            color: colors.textMuted,
            fontSize: 11,
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            marginBottom: 32,
          }}
        >
          {data.year}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.6 }}
          style={{
            color: accentColor,
            fontSize: 'clamp(52px, 14vw, 80px)',
            fontWeight: 800,
            lineHeight: 1,
            marginBottom: 12,
            letterSpacing: '-0.02em',
          }}
        >
          {data.userName}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.6 }}
          style={{
            color: colors.textPrimary,
            fontSize: 'clamp(32px, 9vw, 52px)',
            fontWeight: 700,
            lineHeight: 1.05,
            marginBottom: 28,
            letterSpacing: '-0.02em',
          }}
        >
          Wrapped
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
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
        transition={{ delay: 1.1, duration: 0.6 }}
        style={{
          position: 'absolute',
          bottom: 44,
          color: colors.textMuted,
          fontSize: 12,
          letterSpacing: '0.1em',
          textAlign: 'center',
        }}
      >
        tap to continue →
      </motion.div>
    </div>
  )
}
