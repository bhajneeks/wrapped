export const colors = {
  bg: '#08080F',
  surface: '#13131E',
  border: 'rgba(255,255,255,0.08)',
  textPrimary: '#FFFFFF',
  textSecondary: 'rgba(255,255,255,0.6)',
  textMuted: 'rgba(255,255,255,0.3)',
  accentCommits: '#39FF14',
  accentListening: '#FF2D78',
} as const

export const fonts = {
  sans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
}

export type Theme = 'commits' | 'listening'

export function accent(theme: Theme): string {
  return theme === 'commits' ? colors.accentCommits : colors.accentListening
}

export const spring = {
  card: { type: 'spring' as const, stiffness: 280, damping: 28 },
  bar: (i: number) => ({ delay: 0.2 + i * 0.07, duration: 0.55, ease: [0.16, 1, 0.3, 1] as const }),
  stagger: (i: number) => ({ delay: 0.1 + i * 0.12, duration: 0.5 }),
}
