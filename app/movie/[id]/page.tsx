import { Metadata } from "next";
import MoviePage from "./PageClient";

interface PageProps {
    params: Promise<{id: string}>;
}

export const metadata: Metadata = {
    title: "Movie Details | Movie'd",
    description: "Discover detailed information about your favorite movies on Movie'd. Explore cast, crew, trailers, and more.",
    openGraph: {
        title: "Movie Details | Movie'd",
        description: "Discover detailed information about your favorite movies on Movie'd. Explore cast, crew, trailers, and more.",
        type: "website",
        locale: "en_US",
    },
}

const OuterPage = ({ params } : PageProps) => {
  return (
    <MoviePage params={params} />
  )
}

export default OuterPage