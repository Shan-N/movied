import { use } from 'react';
import { getDiscoverMovies } from '@/lib/tmdb';
import { Navbar } from '@/components/Navbar';
import { MovieCard } from '@/components/MovieCard';
import { ChevronLeft, Info } from 'lucide-react';
import Link from 'next/link';
import data from "@/app/lists/lists.json"
import { notFound } from 'next/navigation';
import { Movie } from '@/lib/types';

interface PageProps {
    params: Promise<{ list: string }>;
}


const LISTS_CONFIG = data
export default async function CuratedList({ params }: PageProps) {
    const { list: listSlug } = await params;

    // 1. Find the configuration for this specific URL slug
    const listConfig = LISTS_CONFIG.find(l => l.id === listSlug);

    // 2. Handle 404 if list doesn't exist
    if (!listConfig) {
        return notFound();
    }

    // 3. Fetch Data (Server-Side)
    // We use the same helper from lib/tmdb
    const movieData = await getDiscoverMovies(listConfig.params || listConfig.overrideParams || {});
    const movies = movieData?.results || [];

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": listConfig.title,
        "description": listConfig.description,
        "itemListElement": movies.map((movie: Movie, index: number) => ({
            "@type": "ListItem",
            "position": index + 1,
            "url": `https://movied.example.com/movie/${movie.id}`,
            "name": movie.title,
            "image": `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        }))
    }

    return (
        <div className="min-h-screen bg-[#f4f7f8] dark:bg-letterboxd-dark transition-colors duration-300">
            <script 
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Navbar />

            <div className={`relative w-full py-24 px-6 overflow-hidden bg-linear-to-br ${listConfig.color}`}>
                <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" /> {/* Overlay for readability */}
                
                <div className="relative z-10 max-w-7xl mx-auto">
                    <Link 
                        href="/lists" 
                        className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6 text-sm font-bold uppercase tracking-widest transition-colors"
                    >
                        <ChevronLeft size={16} /> Back to Collections
                    </Link>
                    
                    <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-4">
                        {listConfig.title}
                    </h1>
                    
                    <p className="text-lg md:text-xl text-white/80 max-w-2xl font-medium leading-relaxed">
                        {listConfig.description}
                    </p>

                    <div className="flex items-center gap-4 mt-8">
                        <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-white text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                            <Info size={14} />
                            {movies.length} Films
                        </div>
                    </div>
                </div>
            </div>

            {/* MOVIE GRID */}
            <main className="max-w-7xl mx-auto px-6 py-12">
                {movies.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {movies.map((movie: Movie) => (
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
                ) : (
                    <div className="py-20 text-center opacity-50">
                        <p>No movies found for this collection.</p>
                    </div>
                )}
            </main>
        </div>
    );
}