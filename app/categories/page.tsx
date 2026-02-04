import React from 'react'
import CategoryPage from './PageClient'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Movie Categories | Movie'd",
  description: "Browse movies by categories on Movie'd. Discover films across various genres and find your next favorite movie.",
  openGraph: {
    title: "Movie Categories | Movie'd",
    description: "Browse movies by categories on Movie'd. Discover films across various genres and find your next favorite movie.",
    type: "website",
    locale: "en_US",
  },
}

const Categories = () => {
  return (
    <CategoryPage />
  )
}

export default Categories