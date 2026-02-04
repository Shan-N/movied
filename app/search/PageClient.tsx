'use client';

import { useState, useMemo, Suspense } from 'react';
import { searchMovies } from '@/lib/tmdb';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { Search, Clapperboard, Users, Tv, Loader2 } from "lucide-react";
import { MovieCard } from "@/components/MovieCard";
import { Navbar } from '@/components/Navbar';
import { SearchResult } from '@/lib/types';


type FilterType = 'all' | 'movie' | 'person' | 'tv';



const SearchResults = () => {
    const searchParams = useSearchParams();
    const searchTerm = searchParams.get('q') || '';
    const [activeFilter, setActiveFilter] = useState<FilterType>('all');

    const { data, isLoading } = useQuery({
        queryKey: ['search', searchTerm],
        queryFn: () => searchTerm ? searchMovies(searchTerm) : null,
        enabled: !!searchTerm,
    });

    const filteredResults = useMemo(() => {
        if (!data?.results) return [];
        if (activeFilter === 'all') return data.results;
        return data.results.filter((item: SearchResult) => item.media_type === activeFilter);
    }, [data, activeFilter]);

    const getCount = (type: FilterType) => {
        if (!data?.results) return 0;
        if (type === 'all') return data.results.length;
        return data.results.filter((item: SearchResult) => item.media_type === type).length;
    };



    return (
        <main>
            <header className="mb-8">
                <h2 className="text-2xl md:text-4xl font-serif font-bold text-gray-900 dark:text-white mb-6 line-clamp-2">
                    Results for <span className="text-brand-green">&ldquo;{searchTerm}&rdquo;</span>
                </h2>

                {/* Filter Tabs */}
                <div className="flex gap-4 md:gap-8 border-b border-[(--border)] text-[10px] font-bold tracking-widest uppercase overflow-x-auto no-scrollbar whitespace-nowrap">
                    {[
                        { id: 'all', label: 'All', icon: <Search size={12}/> },
                        { id: 'movie', label: 'Films', icon: <Clapperboard size={12}/> },
                        { id: 'person', label: 'People', icon: <Users size={12}/> },
                        { id: 'tv', label: 'TV Shows', icon: <Tv size={12}/> }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveFilter(tab.id as FilterType)}
                            className={`flex items-center gap-2 pb-3 transition-all border-b-2 shrink-0 ${
                                activeFilter === tab.id 
                                ? "border-brand-green text-gray-900 dark:text-white" 
                                : "border-transparent opacity-50 hover:opacity-100"
                            }`}
                        >
                            {tab.icon}
                            {tab.label}
                            <span className="opacity-40 ml-1 text-[9px]">({getCount(tab.id as FilterType)})</span>
                        </button>
                    ))}
                </div>
            </header>

            {/* Grid Content */}
            {isLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
                    {[...Array(12)].map((_, i) => (
                        <div key={i} className="aspect-2/3 bg-[(--card-bg)] animate-pulse rounded-md" />
                    ))}
                </div>
            ) : filteredResults.length === 0 ? (
                <div className="text-center py-20 opacity-40 italic">No matches found.</div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
                    {filteredResults.map((item: SearchResult) => (
                        <MovieCard 
                            key={item.id} 
                            movie={{
                                id: item.id,
                                title: item.title || item.name || '',
                                posterPath: (item.poster_path || item.profile_path)
                                    ? `https://image.tmdb.org/t/p/w500${item.poster_path || item.profile_path}`
                                    : "",
                                rating: item.vote_average ? item.vote_average / 2 : 0,
                            }} 
                        />
                    ))}
                </div>
            )}
        </main>
    );
};

// --- 2. The Main Page Export (Wraps Logic in Suspense) ---
const SearchPage = () => {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SearchResultsPage",
        "name": "Search Results",
        "description": "Search results page for movies, TV shows, and people.",
        "query": {
            "@type": "SearchAction",
            "target": "/search?q={search_term_string}",
            "query-input": "required name=search_term_string"
        }
    }
    return (
        <div className="min-h-screen transition-colors duration-300 overflow-x-hidden">
            <script 
                type="application/ld+json" 
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} 
            />
            <Navbar />
            <main className="max-w-6xl mx-auto px-4 py-8 md:py-12">
                <Suspense fallback={
                    <div className="flex h-64 items-center justify-center">
                        <Loader2 className="animate-spin text-brand-green" size={32} />
                    </div>
                }>
                    <SearchResults />
                </Suspense>
            </main>
        </div>
    );
};

export default SearchPage;