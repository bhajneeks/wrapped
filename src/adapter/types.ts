import type { Theme } from '../tokens'

export type { Theme }

export interface BarItem {
  label: string
  value: number
}

export interface WelcomeCardData {
  type: 'welcome'
  userName: string
  year: number
  theme: Theme
  tagline: string
}

export interface VolumeCardData {
  type: 'volume'
  label: string
  value: number
  context: string[]
}

export interface TopItemCardData {
  type: 'topItem'
  headline: string
  name: string
  detail: string
  bars: BarItem[]
}

export interface TrendCardData {
  type: 'trend'
  headline: string
  bars: BarItem[]
  peakLabel: string
}

export interface HighlightCardData {
  type: 'highlight'
  headline: string
  mainText: string
  subText: string
  funFact: string
}

export interface ShareCardData {
  type: 'share'
  userName: string
  year: number
  theme: Theme
  title: string
  stats: Array<{ label: string; value: string }>
}

export type CardData =
  | WelcomeCardData
  | VolumeCardData
  | TopItemCardData
  | TrendCardData
  | HighlightCardData
  | ShareCardData

export interface NormalizedStory {
  meta: { userName: string; year: number; theme: Theme }
  cards: CardData[]
}
