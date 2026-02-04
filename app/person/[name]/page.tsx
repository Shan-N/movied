'use client';

import { use, useState, useMemo } from 'react';
import { getMoviesByActor } from '@/lib/tmdb';
import { useQuery } from '@tanstack/react-query';
import { Film, UserCircle, Tv, Clapperboard } from "lucide-react";
import Image from "next/image";
import { MovieCard } from "@/components/MovieCard";
import { Navbar } from '@/components/Navbar';
import { Movie } from '@/lib/types';

interface PageProps {
    params: Promise<{ name: string }>;
}

interface CreditItem extends Movie {
    media_type?: 'movie' | 'tv';
    name?: string;
}

type MediaType = 'movie' | 'tv';

const PersonPage = ({ params }: PageProps) => {
    const { name } = use(params);
    const decodedName = decodeURIComponent(name);
    
    const [activeFilter, setActiveFilter] = useState<MediaType>('movie');

    const { data, isLoading, error } = useQuery({
        queryKey: ["person", decodedName],
        queryFn: () => getMoviesByActor(decodedName),
    });

    const person = data?.person; 
    const rawCredits = data?.results || [];


    const filteredCredits = useMemo(() => {
        if (!rawCredits) return [];
        
        return rawCredits.filter((item: CreditItem) => {
            const itemType = item.media_type || (item.title ? 'movie' : 'tv');
            return itemType === activeFilter;
        });
    }, [rawCredits, activeFilter]);


    const counts = useMemo(() => {
        const movieCount = rawCredits.filter((i: CreditItem) => (i.media_type === 'movie' || i.title)).length;
        const tvCount = rawCredits.filter((i: CreditItem) => (i.media_type === 'tv' || i.name)).length;
        return { movie: movieCount, tv: tvCount };
    }, [rawCredits]);

    const profileUrl = person?.profile_path 
        ? `https://image.tmdb.org/t/p/h632${person.profile_path}`
        : null;

    if (isLoading) return (
        <div className="min-h-screen bg-[(--background)] flex items-center justify-center">
            <div className="animate-pulse text-brand-green font-bold text-2xl tracking-tighter">MOVIE&apos;D</div>
        </div>
    );

    if (error) return <div className="p-10 text-red-500">Error loading actor data.</div>;

    return (
        <div className="min-h-screen transition-colors duration-300">
            <Navbar />

            <main className="max-w-6xl mx-auto px-4 py-12">
                <div className="flex flex-col md:flex-row gap-12">
                    
                    {/* Sidebar: Actor Photo & Stats */}
                    <aside className="w-full md:w-64 shrink-0">
                        <div className="relative aspect-2/3 rounded-md overflow-hidden border border-[(--border)] bg-[(--card-bg)] shadow-xl mb-6">
                            {profileUrl ? (
                                <Image 
                                    src={profileUrl} 
                                    alt={decodedName} 
                                    fill 
                                    className="object-cover"
                                    priority
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full opacity-20 bg-gray-200 dark:bg-gray-800">
                                    <UserCircle size={80} />
                                </div>
                            )}
                        </div>
                        
                        <div className="space-y-4">
                            <h3 className="text-xs font-bold tracking-widest uppercase border-b border-[(--border)] pb-2 opacity-60">
                                Statistics
                            </h3>
                            <div className="flex justify-between items-center text-sm">
                                <span className="opacity-70">Total Credits</span>
                                <span className="font-bold text-gray-900 dark:text-white">{rawCredits.length}</span>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1">
                        <header className="mb-10">
                            <p className="text-brand-green font-bold text-xs tracking-widest uppercase mb-1">Actor</p>
                            <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 dark:text-white">
                                {decodedName}
                            </h2>
                        </header>

                        {/* Filter Tabs */}
                        <div className="flex items-center gap-6 mb-8 border-b border-[(--border)]">
                            <button
                                onClick={() => setActiveFilter('movie')}
                                className={`flex items-center gap-2 pb-3 text-sm font-bold uppercase tracking-wider transition-colors border-b-2 ${
                                    activeFilter === 'movie' 
                                    ? "border-brand-green text-gray-900 dark:text-white" 
                                    : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                }`}
                            >
                                <Clapperboard size={16} />
                                Movies
                                <span className="ml-1 bg-gray-200 dark:bg-gray-800 text-[10px] py-0.5 px-1.5 rounded-full opacity-70">
                                    {counts.movie}
                                </span>
                            </button>

                            <button
                                onClick={() => setActiveFilter('tv')}
                                className={`flex items-center gap-2 pb-3 text-sm font-bold uppercase tracking-wider transition-colors border-b-2 ${
                                    activeFilter === 'tv' 
                                    ? "border-brand-green text-gray-900 dark:text-white" 
                                    : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                }`}
                            >
                                <Tv size={16} />
                                TV Shows
                                <span className="ml-1 bg-gray-200 dark:bg-gray-800 text-[10px] py-0.5 px-1.5 rounded-full opacity-70">
                                    {counts.tv}
                                </span>
                            </button>
                        </div>

                        {/* Grid */}
                        {filteredCredits.length === 0 ? (
                            <div className="py-20 text-center opacity-40">
                                <Film size={40} className="mx-auto mb-4 opacity-50" />
                                <p>No {activeFilter === 'movie' ? 'movies' : 'TV shows'} found for this actor.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {filteredCredits.map((item: CreditItem) => (
                                    <MovieCard 
                                        key={item.id} 
                                        movie={{
                                            id: item.id,
                                            // Handle title (movies) vs name (TV)
                                            title: item.title || item.name || "Untitled", 
                                            posterPath: item.poster_path 
                                                ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                                                : "",
                                            rating: item.vote_average ? item.vote_average / 2 : 0
                                        }} 
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

export default PersonPage;