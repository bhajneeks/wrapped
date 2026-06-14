import type { Dataset, CommitsDataset, ListeningDataset } from '../../types'
import type { NormalizedStory, CardData, BarItem } from './types'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

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

function normalizeCommits(data: CommitsDataset): NormalizedStory {
  const languages = (data.languages ?? []).slice(0, 7)
  const topLang = languages[0]
  const monthly = (data.monthlyCommits ?? []).slice(0, 12)
  const peak = peakIndex(monthly)
  const totalCommits = data.totalCommits ?? 0
  const totalRepos = data.totalRepos ?? 0
  const linesAdded = data.totalLinesAdded ?? 0
  const linesDeleted = data.totalLinesDeleted ?? 0

  const langBars: BarItem[] = languages.map(l => ({ label: l.name ?? 'Other', value: l.share ?? 0 }))
  const monthBars: BarItem[] = monthly.map((v, i) => ({ label: safeMonth(i), value: v ?? 0 }))
  const funFact = (data.funFacts ?? [])[0]?.text ?? ''

  const cards: CardData[] = [
    {
      type: 'welcome',
      userName: data.userName ?? 'You',
      year: data.year ?? 2026,
      theme: 'commits',
      tagline: 'Your year in code',
    },
    {
      type: 'volume',
      label: 'Commits shipped',
      value: totalCommits,
      context: [
        `across ${totalRepos} repos`,
        `${linesAdded.toLocaleString()} lines added · ${linesDeleted.toLocaleString()} deleted`,
      ],
    },
    {
      type: 'topItem',
      headline: 'Your top language',
      name: topLang?.name ?? 'Unknown',
      detail: `${Math.round((topLang?.share ?? 0) * 100)}% of all commits`,
      bars: langBars,
    },
    {
      type: 'trend',
      headline: 'Your year, month by month',
      bars: monthBars,
      peakLabel: `${safeMonth(peak)} was your biggest month`,
    },
    {
      type: 'highlight',
      headline: 'Longest streak',
      mainText: `${data.longestStreakDays ?? 0} days`,
      subText: data.longestStreakStart ? `Starting ${formatDateStr(data.longestStreakStart)}` : '',
      funFact,
    },
    {
      type: 'share',
      userName: data.userName ?? 'You',
      year: data.year ?? 2026,
      theme: 'commits',
      title: 'Year in Code',
      stats: [
        { label: 'Commits', value: totalCommits.toLocaleString() },
        { label: 'Repos', value: String(totalRepos) },
        { label: 'Lines added', value: linesAdded.toLocaleString() },
        { label: 'Day streak', value: String(data.longestStreakDays ?? 0) },
      ],
    },
  ]

  return { meta: { userName: data.userName ?? 'You', year: data.year ?? 2026, theme: 'commits' }, cards }
}

function normalizeListening(data: ListeningDataset): NormalizedStory {
  const topArtists = (data.topArtists ?? []).slice(0, 5)
  const topArtist = topArtists[0]
  const monthly = (data.monthlyMinutes ?? []).slice(0, 12)
  const peak = peakIndex(monthly)
  const totalMinutes = data.totalMinutes ?? 0
  const totalHours = Math.round(totalMinutes / 60)
  const uniqueArtists = data.uniqueArtists ?? 0
  const totalTracks = data.totalTracks ?? 0
  const replayed = data.mostReplayedTrack
  const funFact = (data.funFacts ?? [])[0]?.text ?? ''

  const artistBars: BarItem[] = topArtists.map(a => ({ label: a.name ?? 'Unknown', value: a.plays ?? 0 }))
  const monthBars: BarItem[] = monthly.map((v, i) => ({ label: safeMonth(i), value: v ?? 0 }))

  const cards: CardData[] = [
    {
      type: 'welcome',
      userName: data.userName ?? 'You',
      year: data.year ?? 2026,
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
    },
    {
      type: 'topItem',
      headline: 'Your most-played artist',
      name: topArtist?.name ?? 'Unknown',
      detail: `${(topArtist?.plays ?? 0).toLocaleString()} plays · ${(topArtist?.minutes ?? 0).toLocaleString()} minutes`,
      bars: artistBars,
    },
    {
      type: 'trend',
      headline: 'Your year, month by month',
      bars: monthBars,
      peakLabel: `${safeMonth(peak)} was your biggest month`,
    },
    {
      type: 'highlight',
      headline: 'On repeat',
      mainText: replayed?.title ?? 'Unknown',
      subText: replayed ? `${replayed.artist} · ${(replayed.plays ?? 0).toLocaleString()} plays` : '',
      funFact,
    },
    {
      type: 'share',
      userName: data.userName ?? 'You',
      year: data.year ?? 2026,
      theme: 'listening',
      title: 'Year in Music',
      stats: [
        { label: 'Minutes', value: totalMinutes.toLocaleString() },
        { label: 'Hours', value: totalHours.toLocaleString() },
        { label: 'Artists', value: String(uniqueArtists) },
        { label: 'Tracks', value: totalTracks.toLocaleString() },
      ],
    },
  ]

  return { meta: { userName: data.userName ?? 'You', year: data.year ?? 2026, theme: 'listening' }, cards }
}

export function normalize(data: Dataset): NormalizedStory {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid dataset: expected an object with a "kind" field')
  }
  if (data.kind === 'commits') return normalizeCommits(data)
  if (data.kind === 'listening') return normalizeListening(data)
  // Defensive: should never happen if types.ts is correct
  throw new Error(`Unknown dataset kind: ${(data as Record<string, unknown>).kind}`)
}
