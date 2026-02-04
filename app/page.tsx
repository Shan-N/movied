import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getPopularMovies, getTopRatedMovies, getUpcomingMovies } from "@/lib/tmdb";
import { Navbar } from "@/components/Navbar";
import { MovieCard } from "@/components/MovieCard";
import { HeroSection } from "@/components/HeroSection";
import { Calendar, ChevronRight, List as ListIcon, Heart } from "lucide-react";
import { Movie } from "@/lib/types";

export const metadata: Metadata = {
  title: "Movie'd | Track, Rate, and Discover Movies",
  description: "Join the world's largest community of film critics. Track your watchlist, view trending movies, and share your taste in cinema.",
  openGraph: {
    title: "Movie'd - The Movie Enthusiast Network",
    description: "Discover trending movies and curate your own lists.",
    type: "website",
    locale: "en_US",
  },
};

export default async function LandingPage() {
  const [popularData, topRatedData, upcomingData] = await Promise.all([
    getPopularMovies(),
    getTopRatedMovies(),
    getUpcomingMovies(),
  ]);

  const featured = popularData?.results?.[0];
  const trending = popularData?.results?.slice(1, 11) || [];
  const upcomingList = upcomingData?.results?.slice(0, 5) || [];
  const topRatedList = topRatedData?.results || [];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Movie'd Home",
    "description": "Top rated and trending movies database.",
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": trending.map((movie: Movie, index: number) => ({
        "@type": "ListItem",
        "position": index + 1,
        "url": `https://movied.shannn.xyz/movie/${movie.id}`,
        "name": movie.title
      }))
    }
  };

  return (
    <div className="bg-[#f4f7f8] dark:bg-letterboxd-dark text-[#2c3440] dark:text-[#99aabb] min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <Navbar />

      <HeroSection featured={featured} />

      <main className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-4 gap-16">
        
        {/* MAIN FEED */}
        <div className="lg:col-span-3 space-y-20">
          <section aria-label="Trending Movies">
            <div className="flex justify-between items-end mb-10 border-b border-gray-300 dark:border-[#2c3440] pb-4">
              <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-gray-500 dark:text-[#99aabb]">Trending Now</h2>
              <Link href="/categories" className="text-[10px] font-bold text-gray-900 dark:text-white hover:text-brand-green flex items-center gap-1 transition-colors">
                ALL MOVIES <ChevronRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8">
              {trending.map((movie: Movie) => (
                <MovieCard 
                  key={movie.id} 
                  movie={{
                    id: movie.id,
                    title: movie.title,
                    posterPath: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
                    rating: movie.vote_average / 2
                  }} 
                />
              ))}
            </div>
          </section>

          {/* LISTS SECTION - UPDATED */}
          <section aria-label="Curated Lists">
            <div className="flex justify-between items-end mb-10 border-b border-gray-300 dark:border-[#2c3440] pb-4">
              <div className="flex items-center gap-2">
                <ListIcon size={16} className="text-brand-green" />
                <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-gray-900 dark:text-white">Popular Lists</h2>
              </div>
              <Link href="/lists" className="text-[10px] font-bold text-gray-900 dark:text-white hover:text-brand-green flex items-center gap-1 transition-colors">
                VIEW ALL <ChevronRight size={14} />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {[
                { 
                  id: "best-of-2020s", 
                  name: "Best of the 2020s",
                  movies: topRatedList.slice(0, 3) 
                },
                { 
                  id: "atmospheric-horror",
                  name: "Atmospheric Horror", 
                  movies: topRatedList.slice(3, 6) 
                },
                { 
                  id: "auteur-essentials", 
                  name: "Auteur Essentials", 
                  movies: topRatedList.slice(6, 9) 
                }
              ].map((list, i) => (
                // Added Link wrapper here
                <Link href={`/lists/${list.id}`} key={i} className="group cursor-pointer block">
                  <div className="relative h-40 flex items-center justify-center mb-12">
                    {list.movies.map((m: Movie, idx: number) => (
                      <div 
                        key={m.id}
                        className="absolute w-24 h-36 bg-gray-800 rounded shadow-2xl transition-all duration-500 border border-white/10 overflow-hidden"
                        style={{
                          left: `${35 + (idx * 15)}%`,
                          transform: `translateX(-50%) rotate(${(idx - 1) * 10}deg)`,
                          zIndex: 10 - idx,
                          marginTop: idx === 1 ? '-10px' : '0px'
                        }}
                      >
                        <Image
                            src={`https://image.tmdb.org/t/p/w200${m.poster_path}`}
                            alt={m.title}
                            fill
                            className="object-cover"
                            sizes="100px"
                        />
                      </div>
                    ))}
                  </div>
                  <h3 className="text-gray-900 dark:text-white font-bold group-hover:text-brand-green transition-colors">{list.name}</h3>
                  <div className="flex items-center gap-2 mt-1 text-[10px] text-gray-500 uppercase tracking-widest">
                    <span>124 films</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Heart size={10} fill="currentColor"/> 4.2k</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>

        {/* SIDEBAR */}
        <aside className="space-y-12">
          <div className="p-8 bg-white dark:bg-[#1b2228] rounded-2xl shadow-xl dark:shadow-none border border-gray-200 dark:border-black/50">
             <div className="flex items-center gap-2 mb-8 text-orange-500">
                <Calendar size={16} />
                <h2 className="text-[10px] font-bold uppercase tracking-[0.2em]">New Releases</h2>
             </div>
             <ul className="space-y-6">
               {upcomingList.map((movie: Movie, idx: number) => (
                 <li key={movie.id} className="group">
                   <Link href={`/movie/${movie.id}`} className="flex gap-4 items-start">
                     <span className="text-xl font-black text-gray-200 dark:text-[#2c3440] group-hover:text-brand-green leading-none transition-colors">0{idx + 1}</span>
                     <div>
                      <span className="text-sm font-bold text-gray-800 dark:text-gray-300 group-hover:text-brand-green block leading-tight">{movie.title}</span>
                      <time className="text-[10px] text-gray-400 mt-1 block uppercase tracking-tighter" dateTime={movie.release_date}>
                        {movie.release_date.split('-')[0]}
                      </time>
                     </div>
                   </Link>
                 </li>
               ))}
             </ul>
          </div>
        </aside>
      </main>
    </div>
  );
}