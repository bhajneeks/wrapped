import { useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { toPng } from 'html-to-image'
import { colors } from '../../tokens'
import type { ShareCardData } from '../../adapter/types'
import { useAccentColor, useSetAccentColor } from '../../AccentContext'

interface Props {
  data: ShareCardData
}

export function ShareCard({ data }: Props) {
  const cardRef = useRef<HTMLDivElement>(null)
  const wheelRef = useRef<HTMLDivElement>(null)
  const ac = useAccentColor()
  const setAccent = useSetAccentColor()

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

  const pickColorFromEvent = useCallback(
    (clientX: number, clientY: number) => {
      if (!wheelRef.current) return
      const rect = wheelRef.current.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const angle = Math.atan2(clientY - cy, clientX - cx) * (180 / Math.PI)
      // +90 aligns atan2 (0° = right) with conic-gradient (0° = top)
      const hue = Math.round((angle + 90 + 360) % 360)
      setAccent(`hsl(${hue}, 100%, 58%)`)
    },
    [setAccent]
  )

  const handleWheelClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      pickColorFromEvent(e.clientX, e.clientY)
    },
    [pickColorFromEvent]
  )

  const handleWheelTouch = useCallback(
    (e: React.TouchEvent) => {
      e.stopPropagation()
      const t = e.changedTouches[0]
      pickColorFromEvent(t.clientX, t.clientY)
    },
    [pickColorFromEvent]
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
        gap: 18,
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
        {/* Background blooms */}
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

          {/* Header row */}
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

          {/* Supporting stats */}
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

          {/* Wordmark */}
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

      {/* ——— Color picker — outside the captured region ——— */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 14,
        }}
      >
        <div
          style={{
            color: colors.textMuted,
            fontSize: 10,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
          }}
        >
          Color
        </div>

        {/* Color wheel — conic gradient circle */}
        <div
          ref={wheelRef}
          onClick={handleWheelClick}
          onTouchEnd={handleWheelTouch}
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            background:
              'conic-gradient(hsl(0,100%,58%), hsl(30,100%,58%), hsl(60,100%,58%), hsl(90,100%,58%), hsl(120,100%,58%), hsl(150,100%,58%), hsl(180,100%,58%), hsl(210,100%,58%), hsl(240,100%,58%), hsl(270,100%,58%), hsl(300,100%,58%), hsl(330,100%,58%), hsl(360,100%,58%))',
            cursor: 'pointer',
            border: '2px solid rgba(255,255,255,0.18)',
            boxShadow: '0 2px 12px rgba(0,0,0,0.5)',
            flexShrink: 0,
          }}
        />

        {/* Current color preview dot */}
        <motion.div
          animate={{ background: ac, boxShadow: `0 0 14px ${ac}70` }}
          transition={{ duration: 0.2 }}
          style={{
            width: 24,
            height: 24,
            borderRadius: '50%',
            border: '2px solid rgba(255,255,255,0.25)',
            flexShrink: 0,
          }}
        />
      </motion.div>

      {/* Download button */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
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
          transition: 'background 0.2s, box-shadow 0.2s',
        }}
      >
        Download Card
      </motion.button>
    </div>
  )
}
