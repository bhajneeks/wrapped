import { useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { toPng } from 'html-to-image'
import { colors, accent } from '../../tokens'
import type { ShareCardData } from '../../adapter/types'
import { spring } from '../../tokens'

interface Props {
  data: ShareCardData
}

export function ShareCard({ data }: Props) {
  const cardRef = useRef<HTMLDivElement>(null)
  const accentColor = accent(data.theme)

  const handleDownload = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation()
      if (!cardRef.current) return
      try {
        const dataUrl = await toPng(cardRef.current, {
          pixelRatio: 2,
          backgroundColor: colors.surface,
        })
        const a = document.createElement('a')
        a.download = `${data.userName}-${data.year}-wrapped.png`
        a.href = dataUrl
        a.click()
      } catch (err) {
        console.error('Image export failed', err)
      }
    },
    [data.userName, data.year]
  )

  return (
    <div
      style={{
        height: '100%',
        background: colors.bg,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 24px',
        gap: 28,
      }}
    >
      {/* ——— The shareable card ——— */}
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        style={{
          width: '100%',
          maxWidth: 320,
          borderRadius: 24,
          padding: '36px 28px 32px',
          background: colors.surface,
          border: `1px solid ${accentColor}30`,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Corner glow */}
        <div
          style={{
            position: 'absolute',
            top: -60,
            right: -60,
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${accentColor}30 0%, transparent 70%)`,
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -40,
            left: -40,
            width: 140,
            height: 140,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${accentColor}18 0%, transparent 70%)`,
            pointerEvents: 'none',
          }}
        />

        {/* Year badge */}
        <div
          style={{
            color: colors.textMuted,
            fontSize: 10,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            marginBottom: 20,
          }}
        >
          {data.year} · Wrapped
        </div>

        {/* Name + title */}
        <div
          style={{
            color: accentColor,
            fontSize: 34,
            fontWeight: 800,
            lineHeight: 1,
            marginBottom: 6,
            letterSpacing: '-0.02em',
            wordBreak: 'break-word',
          }}
        >
          {data.userName}
        </div>
        <div
          style={{
            color: colors.textSecondary,
            fontSize: 16,
            fontWeight: 500,
            marginBottom: 32,
          }}
        >
          {data.title}
        </div>

        {/* Stats grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 12,
          }}
        >
          {data.stats.map(stat => (
            <div
              key={stat.label}
              style={{
                background: 'rgba(0,0,0,0.35)',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: 12,
                padding: '14px 12px',
              }}
            >
              <div
                style={{
                  color: accentColor,
                  fontSize: 20,
                  fontWeight: 700,
                  marginBottom: 4,
                  letterSpacing: '-0.01em',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  color: colors.textMuted,
                  fontSize: 10,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Wordmark */}
        <div
          style={{
            marginTop: 28,
            color: colors.textMuted,
            fontSize: 10,
            textAlign: 'center',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
          }}
        >
          ✦ wrapped ✦
        </div>
      </motion.div>

      {/* Download button — outside the captured region */}
      <motion.button
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={spring.stagger(2)}
        onClick={handleDownload}
        whileTap={{ scale: 0.94 }}
        style={{
          padding: '14px 36px',
          background: accentColor,
          color: '#000',
          border: 'none',
          borderRadius: 50,
          fontSize: 14,
          fontWeight: 700,
          cursor: 'pointer',
          letterSpacing: '0.04em',
          fontFamily: 'inherit',
        }}
      >
        Download Card
      </motion.button>
    </div>
  )
}
