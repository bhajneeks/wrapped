# Wrapped

*A mobile-first year-in-review story experience.*

## What It Does

Wrapped takes a year of user activity (GitHub-style commits **or** music listening) and renders it as a Spotify-Wrapped-style interactive story: a sequence of full-screen cards revealed progressively, with animated count-ups, animated charts, spring slide transitions, and a downloadable poster share card at the end.

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
    ProgressBar.tsx # Segmented top progress indicator (Instagram-style)
    CardBg.tsx      # Shared animated gradient bloom + grain overlay
    cards/
      WelcomeCard.tsx    # Card 1 — name, year, tagline (spring-scale entrance)
      VolumeCard.tsx     # Card 2 — animated count-up + comparison fact callout
      TopItemCard.tsx    # Card 3 — suspense reveal + top language/artist + animated bars
      TrendCard.tsx      # Card 4 — monthly activity bar chart
      HighlightCard.tsx  # Card 5 — streak / most-replayed track + fun fact
      ShareCard.tsx      # Card 6 — designed poster + PNG download
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

**Defensive handling:** `safeNum()` and `safeName()` helpers guard every field access so null, undefined, NaN, empty strings, and negative values all fall back to safe defaults. Arrays are guarded with `.slice()` on a default empty array. All-zero monthly data renders gracefully without false highlights. Numbers are validated with `Number.isFinite` before animating. An invalid `kind` field throws a clear error message.

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

All cards share the same background, font, and accent colour. `CardBg` renders a breathing radial bloom (8 s loop, scale 1→1.08) + a secondary corner bloom + a 4% SVG fractal-noise grain overlay on every story card. The accent colour is derived from the theme (`accent(theme)` in `tokens.ts`), so the entire commits story is lime and the entire listening story is pink — automatically.

### Motion language

- **Card transitions** — `AnimatePresence` in `wait` mode with a spring slide (x ± 55%, opacity, scale 0.93 → 1). Fades instead of slides when `prefers-reduced-motion` is set.
- **Number count-up** — `animate(0, target, { duration: 1.8, ease: [0.16, 1, 0.3, 1] })` from Framer Motion, updating React state via `onUpdate`. Shows final value instantly when `prefers-reduced-motion` is set.
- **Bar charts** — `motion.div` width/height animated from 0 with staggered delays (`spring.bar(i)`). Stagger collapses to near-instant under reduced motion.
- **Top-item reveal beat** — TopItemCard shows `· · ·` for 950 ms, then springs the top language/artist name in with scale + y (stiffness 340, damping 22). Skipped when `prefers-reduced-motion` is set.
- **In-card elements** — staggered `opacity + y` entrance via `spring.stagger(i)`. Hero text (Welcome and Highlight cards) uses spring-scale entrance.

### Comparison fact callout

The volume card derives a human-readable "life as math" line from the raw number:

- **Commits** — calculates waking hours per commit: `"That's one commit every 3 waking hours."`
- **Listening** — calculates daily average: `"That's 1.8 hours of music every single day."`

Both handle zero/edge values gracefully (`"The best time to start is right now."` / `"Tune in next year."`).

### Share card (poster)

`ShareCard` is designed as a shareable poster, not a stats screenshot: large accent name, giant hero number (commits shipped or minutes listened) with a small-caps label, gradient accent divider, supporting stats in pill cells, and a `✦ wrapped ✦` wordmark. The background has layered radial blooms.

`ShareCard` holds a `ref` on the poster `<div>`. On click, `html-to-image`'s `toPng` captures that div at 2× pixel ratio and triggers a browser download. The Download button is outside the captured div so it doesn't appear in the exported image.

## Navigation

| Input | Action |
|---|---|
| Tap left third of screen | Previous card |
| Tap right two-thirds of screen | Next card |
| Swipe left / right | Next / previous |
| `→` or `Space` | Next card |
| `←` or `Backspace` | Previous card |

Progress segments at the top (Instagram-style) show position in the sequence: past segments fill white, current segment fills with the accent colour, future segments remain dim.

## Dependencies

| Package | Purpose |
|---|---|
| `react` + `react-dom` | UI framework |
| `framer-motion` | Card transitions, bar animations, count-up, reduced-motion detection |
| `html-to-image` | PNG export of the share card poster |
| `vite` + `@vitejs/plugin-react` | Build tooling |
| `typescript` | Type safety |

## Submitting

```bash
litmus submit
```
