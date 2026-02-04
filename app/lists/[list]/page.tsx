import { Metadata } from "next";
import CuratedList from "./PageClient";

interface ListProps {
    params: Promise<{ list: string }>;
}

export const metadata: Metadata = {
    title: "Curated Movie Lists | Movie'd",
    description: "Explore curated movie lists on Movie'd. Discover, track, and rate your favorite films all in one place.",
    openGraph: {
        title: "Curated Movie Lists | Movie'd",
        description: "Explore curated movie lists on Movie'd. Discover, track, and rate your favorite films all in one place.",
        type: "website",
        locale: "en_US",
    },
}

const List = ({ params }: ListProps) => {
    
  return (
    <CuratedList params={params} />
  )
}

export default List