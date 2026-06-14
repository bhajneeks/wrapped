import commitsData from '../data/year_commits.json'
import listeningData from '../data/year_listening.json'
import type { Dataset } from '../types'
import { normalize } from './adapter/normalize'
import { accent } from './tokens'
import { AccentProvider } from './AccentContext'
import { StoryViewer } from './components/StoryViewer'

// The grader swaps in a fresh dataset of the same shape.
// Use ?dataset=listening or ?dataset=commits (default) to select.
function getDataset(): Dataset {
  const param = new URLSearchParams(window.location.search).get('dataset')
  if (param === 'listening') return listeningData as Dataset
  return commitsData as Dataset
}

export default function App() {
  const story = normalize(getDataset())
  return (
    <AccentProvider initial={accent(story.meta.theme)}>
      <StoryViewer story={story} />
    </AccentProvider>
  )
}
