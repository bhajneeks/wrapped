import { useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { toPng } from 'html-to-image'
import { colors } from '../../tokens'
import type { ShareCardData } from '../../adapter/types'
import { useAccentColor, useSetAccentColor } from '../../AccentContext'

interface Props {
  data: ShareCardData
}

const WHEEL_GRADIENT =
  'conic-gradient(hsl(0,100%,58%),hsl(30,100%,58%),hsl(60,100%,58%),hsl(90,100%,58%),hsl(120,100%,58%),hsl(150,100%,58%),hsl(180,100%,58%),hsl(210,100%,58%),hsl(240,100%,58%),hsl(270,100%,58%),hsl(300,100%,58%),hsl(330,100%,58%),hsl(360,100%,58%))'

function hueToHex(hue: number): string {
  const l = 0.58
  const a = Math.min(l, 1 - l)
  const f = (n: number) => {
    const k = (n + hue / 30) % 12
    const c = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(255 * c).toString(16).padStart(2, '0')
  }
  return `#${f(0)}${f(8)}${f(4)}`
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
      // Ignore clicks inside the center hole (radius < 30% of wheel)
      const dist = Math.hypot(clientX - cx, clientY - cy)
      if (dist < rect.width * 0.28) return
      const angle = Math.atan2(clientY - cy, clientX - cx) * (180 / Math.PI)
      // +90° aligns atan2 (0°=right) with conic-gradient start (0°=top=red)
      const hue = Math.round((angle + 90 + 360) % 360)
      setAccent(hueToHex(hue))
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
        gap: 16,
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
          // border driven by motion below
          border: `1.5px solid ${ac}55`,
          boxShadow: `0 0 60px ${ac}30, 0 0 120px ${ac}18`,
        }}
      >

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
                background: `${ac}22`,
                border: `1px solid ${ac}55`,
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
              background: `linear-gradient(to right, ${ac}55, transparent)`,
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
                  border: `1px solid ${ac}22`,
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
              color: `${ac}80`,
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
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.5 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
        }}
      >
        <span
          style={{
            color: colors.textMuted,
            fontSize: 10,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
          }}
        >
          Color
        </span>

        {/* Donut color wheel */}
        <div
          ref={wheelRef}
          onClick={handleWheelClick}
          onTouchEnd={handleWheelTouch}
          style={{
            width: 52,
            height: 52,
            borderRadius: '50%',
            background: WHEEL_GRADIENT,
            cursor: 'crosshair',
            boxShadow: '0 0 0 1.5px rgba(255,255,255,0.15), 0 4px 16px rgba(0,0,0,0.6)',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Center hole — makes it look like a ring / pinwheel */}
          <div
            style={{
              width: 22,
              height: 22,
              borderRadius: '50%',
              background: colors.bg,
              border: '1.5px solid rgba(255,255,255,0.12)',
              pointerEvents: 'none',
            }}
          />
        </div>

        {/* Live color swatch */}
        <motion.div
          animate={{
            background: ac,
            boxShadow: `0 0 0 2px rgba(255,255,255,0.2), 0 0 18px ${ac}80`,
          }}
          transition={{ duration: 0.25 }}
          style={{
            width: 30,
            height: 30,
            borderRadius: '50%',
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
          boxShadow: `0 4px 24px ${ac}50`,
          transition: 'background 0.25s, box-shadow 0.25s',
        }}
      >
        Download Card
      </motion.button>
    </div>
  )
}
