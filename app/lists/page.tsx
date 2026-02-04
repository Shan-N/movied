import { Metadata } from 'next'
import ListsPage from './PageClient'

export const metadata: Metadata = {
  title: "Movie'd Lists | Movie'd",
  description: "Explore curated movie lists on Movie'd. Discover, track, and rate your favorite films all in one place.",
  openGraph: {
    title: "Movie'd Lists | Movie'd",
    description: "Explore curated movie lists on Movie'd. Discover, track, and rate your favorite films all in one place.",
    type: "website",
    locale: "en_US",
  },
}

const Lists = () => {
  return (
    <ListsPage />
  )
}

export default Lists