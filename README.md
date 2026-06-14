# Wrapped

*A mobile-first year-in-review story experience.*

## Overview

The most-shared piece of product marketing of the last decade is probably Spotify Wrapped. GitHub did Skyline. Strava does Year in Sport. Apple does Year in Review. They all share a shape: take a year of someone's data, turn it into a sequence of designed story cards with motion, count-ups, and a memorable closing share image. The reason this format works is that the math is the user's own life and the design respects them. The reason most clones fall flat is that they look like dashboards in disguise.

You're going to build one. Given a year of data, build a multi-screen story that reveals the user's year progressively, with motion that earns its keep and a closing share card someone might actually want to post. Mobile-shaped, Wrapped is a phone experience, not a desktop one.

## Problem Statement

Build a mobile-first single-page web app that takes a JSON dataset (one year of user activity, provided) and renders an interactive Wrapped-style story experience. Multiple designed cards, motion between and within them, count-ups on numbers, surprising data treatments, and a downloadable share card at the end.

## Getting Started

### Prerequisites
- Node.js 20+
- Any modern frontend stack you're comfortable with (Vite + React, Next.js, SvelteKit, etc.). Starter is Vite + React + Framer Motion.

### Setup
Dependencies are installed automatically when you initialize the assessment with the Litmus CLI. You're ready to start coding.

What's in the workspace:
- `data/year_commits.json`, one year of GitHub-like commit data for a user. Has repos, commits, languages, day-of-week patterns, longest streak.
- `data/year_listening.json`, one year of listening history. Top artists, genres, total minutes, monthly breakdown.
- Pick one dataset. The grader will swap in a fresh dataset of the same shape; your story must work on either.
- `types.ts`, the dataset types.

## Requirements

1. The app shows a series of story cards. Minimum five. The cards reveal stats from the dataset progressively. Examples of what each card could be (you decide the cuts): total volume, top item, a trend over the year, a fun fact, a closing share card.
2. Navigation between cards. Forward and back, by tap/click or keyboard. Auto-advance is optional (if you build it, make it overridable).
3. Motion is required. Numbers count up. Charts animate in. Card transitions are designed (not jump-cuts). A static-screens version is a failure case.
4. Mobile-shaped. The app must look correct on iPhone SE width (375px) and modern mobile widths (390px, 414px). Desktop is fine but not the target.
5. The final card is a designed share card. The user can download it as an image (PNG / JPEG). The share card should be visually distinct and worth sharing, not just a screenshot of the totals page.
6. Cohesive visual identity. The cards share a palette, type system, and motion language. Inconsistency across cards is a failure case.
7. The story must work on either provided dataset (commits or listening). Don't hard-code to one, the data shapes are different, but the framework you build should handle both.

## Examples

**Example 1: Five cards from year_commits.json**
```
Card 1: "You shipped X commits across Y repos this year."  (counts-up)
Card 2: "Your top language was TypeScript. Here's the breakdown." (animated bar/pie reveal)
Card 3: "You committed on N% of weekdays. Here's your week-shape." (heatmap or histogram)
Card 4: "Your longest streak was K days, in March."  (highlight card, designed)
Card 5: Share card, "{Name}'s Year in Code, 2026", downloadable.
```

**Example 2: Five cards from year_listening.json**
```
Card 1: "You listened to X hours this year. That's enough to ..."
Card 2: "Your top artist was Y. You played them Z times."
Card 3: "Genre breakdown, animated treemap or stacked bar."
Card 4: "Your most-replayed track."
Card 5: Share card, downloadable.
```

## Submission Guidelines

### What to Submit
- All source code (frontend, any backend helpers, build config).
- The components for each story card. The grader inspects the structure to verify ~5+ designed cards exist.

### How to Submit
```bash
litmus submit
```
