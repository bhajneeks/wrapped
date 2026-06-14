# Wrapped

*A mobile-first year-in-review story experience.*

## What It Does

Wrapped takes a year of user activity (GitHub-style commits **or** music listening) and renders it as a Spotify-Wrapped-style interactive story: a sequence of full-screen cards revealed progressively, with animated count-ups, animated charts, designed transitions, and a downloadable share card at the end.

## Setup & Running

```bash
npm install     # dependencies are pre-installed by the Litmus CLI
npm run dev     # starts Vite dev server at http://localhost:5173
```

### Switching datasets

The app defaults to the commits dataset. Add a query param to switch:

```
http://localhost:5173/?dataset=commits    # default
http://localhost:5173/?dataset=listening  # music listening
```

Both datasets produce a six-card story. The adapter layer auto-detects which shape was provided.

## Architecture

```
src/
  adapter/
    types.ts        # NormalizedStory + per-card data interfaces
    normalize.ts    # Maps CommitsDataset | ListeningDataset → NormalizedStory
  components/
    StoryViewer.tsx # AnimatePresence container; routes cards; handles nav events
    ProgressBar.tsx # Segmented top progress indicator
    cards/
      WelcomeCard.tsx    # Card 1 — name, year, tagline
      VolumeCard.tsx     # Card 2 — animated count-up of the headline number
      TopItemCard.tsx    # Card 3 — top language / top artist + animated bars
      TrendCard.tsx      # Card 4 — monthly activity bar chart
      HighlightCard.tsx  # Card 5 — streak / most-replayed track + fun fact
      ShareCard.tsx      # Card 6 — designed share card + PNG download
  hooks/
    useCountUp.ts     # Animates a number from 0 to target (Framer Motion animate)
    useNavigation.ts  # Keyboard (←/→/Space), swipe, and tap-zone navigation
  utils/
    format.ts         # formatNumber, clamp
  tokens.ts           # Design tokens: palette, font stack, theme helpers, spring presets
  App.tsx             # Loads dataset, runs normalize(), renders StoryViewer
```

### Adapter / normalization layer

`normalize()` in `src/adapter/normalize.ts` is the entry point. It inspects `data.kind` and dispatches to `normalizeCommits` or `normalizeListening`. Both functions return an identical `NormalizedStory` shape:

```ts
interface NormalizedStory {
  meta: { userName: string; year: number; theme: 'commits' | 'listening' }
  cards: CardData[]  // always 6 cards in the same slot order
}
```

Every card component receives a typed slice of that model — no card ever imports a raw dataset type. This means swapping in a fresh dataset only requires replacing the JSON file; no card code changes.

**Defensive handling:** all field accesses use `?? fallback` so missing or null fields never crash the render. Arrays are guarded with `.slice()` on a default empty array. Numbers are validated with `Number.isFinite` before animating.

### Visual identity

| Token | Value |
|---|---|
| Background | `#08080F` |
| Surface | `#13131E` |
| Accent — commits | `#39FF14` (electric lime) |
| Accent — listening | `#FF2D78` (hot pink) |
| Primary text | `#FFFFFF` |
| Secondary text | `rgba(255,255,255,0.6)` |
| Font | Inter (700/800/900 weights) |

All cards share the same background, font, and accent colour. The accent colour is derived from the theme (`accent(theme)` in `tokens.ts`), so every element of the commits story is lime and every element of the listening story is pink — automatically.

### Motion language

- **Card transitions** — `AnimatePresence` in `wait` mode with a spring slide (x ± 55%, opacity, scale 0.93 → 1).
- **Number count-up** — `animate(0, target, { duration: 1.8, ease: [0.16, 1, 0.3, 1] })` from Framer Motion, updating React state via `onUpdate`.
- **Bar charts** — `motion.div` width/height animated from 0 with staggered delays (`spring.bar(i)`).
- **In-card elements** — staggered `opacity + y` entrance via `spring.stagger(i)`.

### Share card download

`ShareCard` holds a `ref` on the designed card `<div>`. On click, `html-to-image`'s `toPng` captures that div at 2× pixel ratio and triggers a browser download. The Download button is outside the captured div so it doesn't appear in the exported image.

## Navigation

| Input | Action |
|---|---|
| Tap right third of screen | Next card |
| Tap left third of screen | Previous card |
| Swipe left / right | Next / previous |
| `→` or `Space` | Next card |
| `←` or `Backspace` | Previous card |

## Dependencies

| Package | Purpose |
|---|---|
| `react` + `react-dom` | UI framework |
| `framer-motion` | Card transitions, bar animations, count-up |
| `html-to-image` | PNG export of the share card |
| `vite` + `@vitejs/plugin-react` | Build tooling |
| `typescript` | Type safety |

## Submitting

```bash
litmus submit
```
