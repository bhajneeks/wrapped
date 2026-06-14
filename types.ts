// types.ts, dataset shapes for the two provided year-in-review datasets.

// ============================================================================
// year_commits.json
// ============================================================================
export interface CommitsDataset {
  kind: "commits"
  userName: string
  year: number
  totalCommits: number
  totalRepos: number
  totalLinesAdded: number
  totalLinesDeleted: number
  /** Top languages by commit count. */
  languages: Array<{ name: string; commits: number; share: number }>
  /** Per-month commit count. 12 entries, Jan..Dec. */
  monthlyCommits: number[]
  /** Per-day-of-week, Mon=0..Sun=6. */
  dayOfWeekCommits: number[]
  /** Longest contiguous-day commit streak. */
  longestStreakDays: number
  longestStreakStart: string // ISO date
  topRepos: Array<{ name: string; commits: number; lines: number }>
  funFacts: Array<{ kind: string; text: string }>
}

// ============================================================================
// year_listening.json
// ============================================================================
export interface ListeningDataset {
  kind: "listening"
  userName: string
  year: number
  totalMinutes: number
  totalTracks: number
  uniqueArtists: number
  topArtists: Array<{ name: string; plays: number; minutes: number }>
  topTracks: Array<{ title: string; artist: string; plays: number }>
  topGenres: Array<{ name: string; share: number }>
  /** Per-month minutes listened. 12 entries. */
  monthlyMinutes: number[]
  /** Track that was replayed most. */
  mostReplayedTrack: { title: string; artist: string; plays: number }
  funFacts: Array<{ kind: string; text: string }>
}

export type Dataset = CommitsDataset | ListeningDataset
