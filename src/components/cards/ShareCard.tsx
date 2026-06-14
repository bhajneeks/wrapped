import { useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { toPng } from 'html-to-image'
import { colors, accent } from '../../tokens'
import type { ShareCardData } from '../../adapter/types'

interface Props {
  data: ShareCardData
}

export function ShareCard({ data }: Props) {
  const cardRef = useRef<HTMLDivElement>(null)
  const ac = accent(data.theme)

  const handleDownload = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation()
      if (!cardRef.current) return
      try {
        const dataUrl = await toPng(cardRef.current, {
          pixelRatio: 2,
          backgroundColor: '#0A0A14',
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
        padding: '0 20px',
        gap: 22,
        overflow: 'hidden',
      }}
    >
      {/* ——— The poster card — captured by toPng ——— */}
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{
          width: '100%',
          maxWidth: 340,
          background: '#0A0A14',
          borderRadius: 28,
          overflow: 'hidden',
          position: 'relative',
          border: `1px solid ${ac}30`,
        }}
      >
        {/* Background — large radial bloom top-left */}
        <div
          style={{
            position: 'absolute',
            top: -100, left: -80,
            width: 340, height: 340,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${ac}2A 0%, ${ac}0A 45%, transparent 70%)`,
            pointerEvents: 'none',
          }}
        />
        {/* Secondary bloom bottom-right */}
        <div
          style={{
            position: 'absolute',
            bottom: -60, right: -60,
            width: 220, height: 220,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${ac}18 0%, transparent 65%)`,
            pointerEvents: 'none',
          }}
        />
        {/* Thin diagonal highlight line */}
        <div
          style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            background: `linear-gradient(135deg, ${ac}08 0%, transparent 50%)`,
            pointerEvents: 'none',
          }}
        />

        {/* Content */}
        <div style={{ padding: '28px 26px 26px', position: 'relative', zIndex: 1 }}>

          {/* Header row — year on left, theme badge on right */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 36,
            }}
          >
            <div
              style={{
                color: colors.textMuted,
                fontSize: 10,
                letterSpacing: '0.28em',
                textTransform: 'uppercase',
              }}
            >
              {data.year}
            </div>
            <div
              style={{
                padding: '4px 10px',
                background: `${ac}15`,
                border: `1px solid ${ac}35`,
                borderRadius: 20,
                color: ac,
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
              }}
            >
              {data.theme === 'commits' ? 'Code' : 'Music'}
            </div>
          </div>

          {/* User name */}
          <div
            style={{
              color: ac,
              fontSize: 'clamp(26px, 7.5vw, 40px)',
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: '-0.03em',
              marginBottom: 24,
              wordBreak: 'break-word',
            }}
          >
            {data.userName}
          </div>

          {/* Hero number */}
          <div
            style={{
              color: colors.textPrimary,
              fontSize: 'clamp(48px, 13vw, 68px)',
              fontWeight: 900,
              lineHeight: 0.9,
              letterSpacing: '-0.04em',
              fontVariantNumeric: 'tabular-nums',
              marginBottom: 8,
              wordBreak: 'break-all',
            }}
          >
            {data.heroValue}
          </div>
          <div
            style={{
              color: colors.textMuted,
              fontSize: 10,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              marginBottom: 4,
            }}
          >
            {data.heroLabel}
          </div>
          <div
            style={{
              color: colors.textSecondary,
              fontSize: 13,
              marginBottom: 28,
            }}
          >
            {data.heroSub}
          </div>

          {/* Divider */}
          <div
            style={{
              height: 1,
              background: `linear-gradient(to right, ${ac}30, transparent)`,
              marginBottom: 20,
            }}
          />

          {/* Supporting stats pills */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {data.stats.map(stat => (
              <div
                key={stat.label}
                style={{
                  flex: '1 1 0',
                  minWidth: 0,
                  background: 'rgba(0,0,0,0.45)',
                  border: `1px solid ${ac}14`,
                  borderRadius: 12,
                  padding: '10px 9px',
                }}
              >
                <div
                  style={{
                    color: colors.textPrimary,
                    fontSize: stat.value.length > 9 ? 11 : stat.value.length > 5 ? 13 : 15,
                    fontWeight: 700,
                    marginBottom: 3,
                    letterSpacing: '-0.01em',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {stat.value}
                </div>
                <div
                  style={{
                    color: colors.textMuted,
                    fontSize: 9,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                  }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Wordmark footer */}
          <div
            style={{
              marginTop: 22,
              textAlign: 'center',
              color: `${ac}55`,
              fontSize: 9,
              letterSpacing: '0.32em',
              textTransform: 'uppercase',
            }}
          >
            ✦ wrapped ✦
          </div>
        </div>
      </motion.div>

      {/* Download button — outside the captured region */}
      <motion.button
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        onClick={handleDownload}
        whileTap={{ scale: 0.94 }}
        style={{
          padding: '14px 42px',
          background: ac,
          color: '#000',
          border: 'none',
          borderRadius: 50,
          fontSize: 14,
          fontWeight: 700,
          cursor: 'pointer',
          letterSpacing: '0.05em',
          fontFamily: 'inherit',
          boxShadow: `0 4px 24px ${ac}40`,
        }}
      >
        Download Card
      </motion.button>
    </div>
  )
}
