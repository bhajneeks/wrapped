import type { Dataset, CommitsDataset, ListeningDataset } from '../../types'
import type { NormalizedStory, CardData, BarItem } from './types'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function safeNum(n: unknown, fallback = 0): number {
  const v = Number(n)
  return Number.isFinite(v) && v >= 0 ? v : fallback
}

function safeName(s: unknown, fallback: string): string {
  return typeof s === 'string' && s.trim().length > 0 ? s.trim() : fallback
}

function peakIndex(arr: number[]): number {
  if (!arr.length) return 0
  return arr.indexOf(Math.max(...arr))
}

function safeMonth(i: number): string {
  return MONTHS[i] ?? `M${i + 1}`
}

function formatDateStr(iso: string): string {
  try {
    return new Date(`${iso}T00:00:00`).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
  } catch {
    return iso
  }
}

function shortNum(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${Math.round(n / 1_000)}k`
  return String(n)
}

function commitsComparison(totalCommits: number): string {
  if (totalCommits === 0) return 'The best time to start is right now.'
  const wakingHoursPerYear = 365 * 16
  const hoursPerCommit = wakingHoursPerYear / totalCommits
  if (hoursPerCommit < 1) {
    return `That's ${Math.round(totalCommits / 365)} commits shipped every single day.`
  }
  if (hoursPerCommit < 1.5) {
    return `That's roughly one commit every waking hour.`
  }
  return `That's one commit every ${Math.round(hoursPerCommit)} waking hours.`
}

function listeningComparison(totalMinutes: number): string {
  if (totalMinutes === 0) return 'Tune in next year.'
  const hours = totalMinutes / 60
  const perDay = hours / 365
  if (perDay >= 1) {
    const rounded = Math.round(perDay * 10) / 10
    return `That's ${rounded} hours of music every single day.`
  }
  // NYC–LA cross-country flight ≈ 330 min
  const flights = Math.round((hours * 60) / 330)
  if (flights > 1) return `That's ${flights} cross-country flights worth of music.`
  return `That's ${Math.round(hours)} hours lost to beautiful music.`
}

function normalizeCommits(data: CommitsDataset): NormalizedStory {
  const languages = (data.languages ?? []).slice(0, 7)
  const topLang = languages[0]
  const monthly = (data.monthlyCommits ?? []).slice(0, 12).map(v => safeNum(v))
  const peak = peakIndex(monthly)
  const totalCommits = safeNum(data.totalCommits)
  const totalRepos = safeNum(data.totalRepos)
  const linesAdded = safeNum(data.totalLinesAdded)
  const linesDeleted = safeNum(data.totalLinesDeleted)
  const streakDays = safeNum(data.longestStreakDays)
  const userName = safeName(data.userName, 'You')

  const langBars: BarItem[] = languages.map(l => ({
    label: safeName(l?.name, 'Other'),
    value: safeNum(l?.share),
  }))
  const monthBars: BarItem[] = monthly.map((v, i) => ({ label: safeMonth(i), value: v }))
  const funFact = (data.funFacts ?? [])[0]?.text ?? ''

  const allZero = monthly.every(v => v === 0)
  const peakLabel = allZero
    ? 'A quiet year — more commits ahead'
    : `${safeMonth(peak)} was your biggest month`

  const cards: CardData[] = [
    {
      type: 'welcome',
      userName,
      year: safeNum(data.year) || 2026,
      theme: 'commits',
      tagline: 'Your year in code',
    },
    {
      type: 'volume',
      label: 'Commits shipped',
      value: totalCommits,
      context: [
        `across ${totalRepos} ${totalRepos === 1 ? 'repo' : 'repos'}`,
        `${linesAdded.toLocaleString()} lines added · ${linesDeleted.toLocaleString()} deleted`,
      ],
      comparison: commitsComparison(totalCommits),
    },
    {
      type: 'topItem',
      headline: 'Your top language',
      name: safeName(topLang?.name, 'Unknown'),
      detail: topLang
        ? `${Math.round(safeNum(topLang.share) * 100)}% of all commits`
        : 'No language data this year',
      bars: langBars,
    },
    {
      type: 'trend',
      headline: 'Your year, month by month',
      bars: monthBars,
      peakLabel,
    },
    {
      type: 'highlight',
      headline: 'Longest streak',
      mainText: `${streakDays} days`,
      subText: data.longestStreakStart
        ? `Starting ${formatDateStr(data.longestStreakStart)}`
        : '',
      funFact,
    },
    {
      type: 'share',
      userName,
      year: safeNum(data.year) || 2026,
      theme: 'commits',
      title: 'Year in Code',
      heroLabel: 'commits shipped',
      heroValue: totalCommits.toLocaleString(),
      heroSub: `across ${totalRepos} ${totalRepos === 1 ? 'repo' : 'repos'}`,
      stats: [
        { label: 'Top language', value: safeName(topLang?.name, 'N/A') },
        { label: 'Longest streak', value: `${streakDays}d` },
        { label: 'Lines added', value: shortNum(linesAdded) },
      ],
    },
  ]

  return { meta: { userName, year: safeNum(data.year) || 2026, theme: 'commits' }, cards }
}

function normalizeListening(data: ListeningDataset): NormalizedStory {
  const topArtists = (data.topArtists ?? []).slice(0, 5)
  const topArtist = topArtists[0]
  const monthly = (data.monthlyMinutes ?? []).slice(0, 12).map(v => safeNum(v))
  const peak = peakIndex(monthly)
  const totalMinutes = safeNum(data.totalMinutes)
  const totalHours = Math.round(totalMinutes / 60)
  const uniqueArtists = safeNum(data.uniqueArtists)
  const totalTracks = safeNum(data.totalTracks)
  const replayed = data.mostReplayedTrack
  const funFact = (data.funFacts ?? [])[0]?.text ?? ''
  const userName = safeName(data.userName, 'You')

  const artistBars: BarItem[] = topArtists.map(a => ({
    label: safeName(a?.name, 'Unknown'),
    value: safeNum(a?.plays),
  }))
  const monthBars: BarItem[] = monthly.map((v, i) => ({ label: safeMonth(i), value: v }))

  const allZero = monthly.every(v => v === 0)
  const peakLabel = allZero
    ? 'A quiet year — more music ahead'
    : `${safeMonth(peak)} was your biggest month`

  const cards: CardData[] = [
    {
      type: 'welcome',
      userName,
      year: safeNum(data.year) || 2026,
      theme: 'listening',
      tagline: 'Your year in music',
    },
    {
      type: 'volume',
      label: 'Minutes listened',
      value: totalMinutes,
      context: [
        `${totalHours.toLocaleString()} hours of music`,
        `${uniqueArtists} artists · ${totalTracks.toLocaleString()} tracks`,
      ],
      comparison: listeningComparison(totalMinutes),
    },
    {
      type: 'topItem',
      headline: 'Your most-played artist',
      name: safeName(topArtist?.name, 'Unknown'),
      detail: topArtist
        ? `${safeNum(topArtist.plays).toLocaleString()} plays · ${safeNum(topArtist.minutes).toLocaleString()} minutes`
        : 'No artist data this year',
      bars: artistBars,
    },
    {
      type: 'trend',
      headline: 'Your year, month by month',
      bars: monthBars,
      peakLabel,
    },
    {
      type: 'highlight',
      headline: 'On repeat',
      mainText: safeName(replayed?.title, 'Unknown'),
      subText: replayed
        ? `${safeName(replayed.artist, '')} · ${safeNum(replayed.plays).toLocaleString()} plays`
        : '',
      funFact,
    },
    {
      type: 'share',
      userName,
      year: safeNum(data.year) || 2026,
      theme: 'listening',
      title: 'Year in Music',
      heroLabel: 'minutes listened',
      heroValue: totalMinutes.toLocaleString(),
      heroSub: `${totalHours.toLocaleString()} hours of music`,
      stats: [
        { label: 'Top artist', value: safeName(topArtist?.name, 'N/A') },
        { label: 'Artists', value: String(uniqueArtists) },
        { label: 'Tracks', value: shortNum(totalTracks) },
      ],
    },
  ]

  return { meta: { userName, year: safeNum(data.year) || 2026, theme: 'listening' }, cards }
}

export function normalize(data: Dataset): NormalizedStory {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid dataset: expected an object with a "kind" field')
  }
  if (data.kind === 'commits') return normalizeCommits(data)
  if (data.kind === 'listening') return normalizeListening(data)
  throw new Error(`Unknown dataset kind: ${(data as Record<string, unknown>).kind}`)
}
