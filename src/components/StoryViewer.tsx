import { AnimatePresence, motion } from 'framer-motion'
import { colors } from '../tokens'
import type { NormalizedStory, CardData } from '../adapter/types'
import type { Theme } from '../tokens'
import { useNavigation } from '../hooks/useNavigation'
import { ProgressBar } from './ProgressBar'
import { WelcomeCard } from './cards/WelcomeCard'
import { VolumeCard } from './cards/VolumeCard'
import { TopItemCard } from './cards/TopItemCard'
import { TrendCard } from './cards/TrendCard'
import { HighlightCard } from './cards/HighlightCard'
import { ShareCard } from './cards/ShareCard'

const cardVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? '55%' : '-55%',
    opacity: 0,
    scale: 0.93,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (dir: number) => ({
    x: dir < 0 ? '55%' : '-55%',
    opacity: 0,
    scale: 0.93,
  }),
}

function renderCard(card: CardData, theme: Theme) {
  switch (card.type) {
    case 'welcome': return <WelcomeCard data={card} />
    case 'volume': return <VolumeCard data={card} theme={theme} />
    case 'topItem': return <TopItemCard data={card} theme={theme} />
    case 'trend': return <TrendCard data={card} theme={theme} />
    case 'highlight': return <HighlightCard data={card} theme={theme} />
    case 'share': return <ShareCard data={card} />
  }
}

interface Props {
  story: NormalizedStory
}

export function StoryViewer({ story }: Props) {
  const { current, direction, isFirst, isLast, handleTouchStart, handleTouchEnd, handleClick } =
    useNavigation(story.cards.length)

  const card = story.cards[current]
  const theme = story.meta.theme

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: colors.bg,
        overflow: 'hidden',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        userSelect: 'none',
        WebkitUserSelect: 'none',
      }}
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <ProgressBar total={story.cards.length} current={current} theme={theme} />

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={current}
          custom={direction}
          variants={cardVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          style={{ position: 'absolute', inset: 0 }}
        >
          {renderCard(card, theme)}
        </motion.div>
      </AnimatePresence>

      {/* Edge tap hints — subtle arrows visible on desktop */}
      {!isFirst && (
        <div
          style={{
            position: 'absolute',
            left: 12,
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'rgba(255,255,255,0.2)',
            fontSize: 24,
            pointerEvents: 'none',
          }}
        >
          ‹
        </div>
      )}
      {!isLast && (
        <div
          style={{
            position: 'absolute',
            right: 12,
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'rgba(255,255,255,0.2)',
            fontSize: 24,
            pointerEvents: 'none',
          }}
        >
          ›
        </div>
      )}
    </div>
  )
}
