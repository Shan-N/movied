import React from 'react'
import PersonPage from './PageClient'
import { Metadata } from 'next';

type PageProps = {
    params: Promise<{ name: string }>;
}

export const metadata: Metadata = {
    title: "Actor & Actress Profiles | Movie'd",
    description: "Explore profiles of your favorite actors and actresses on Movie'd. Discover their filmography, biographies, and latest projects.",
    openGraph: {
        title: "Actor & Actress Profiles | Movie'd",
        description: "Explore profiles of your favorite actors and actresses on Movie'd. Discover their filmography, biographies, and latest projects.",
        type: "website",
        locale: "en_US",
    },
}

const Person = ({ params }: PageProps) => {
  return (
    <PersonPage params={params} />
  )
}

export default Person