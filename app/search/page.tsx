import SearchPage from './PageClient'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Search Movies | Movie'd",
  description: "Search for movies to track, rate, and discover on Movie'd.",
  openGraph: {
    title: "Search Movies | Movie'd",
    description: "Find your favorite movies and explore new ones on Movie'd.",
    type: "website",
    locale: "en_US",
  },
};

const OuterPage = () => {
  return (
    <SearchPage />
  )
}

export default OuterPage