'use client';

import { use } from 'react';
import { getMoviesByActor } from '@/lib/tmdb';
import { useQuery } from '@tanstack/react-query';
import { Film, UserCircle } from "lucide-react";
import Image from "next/image";
import { MovieCard } from "@/components/MovieCard";
import { Navbar } from '@/components/Navbar';
import { Movie } from '@/lib/types';

interface PageProps {
    params: Promise<{ name: string }>;
}

const PersonPage = ({ params }: PageProps) => {
    const { name } = use(params);
    const decodedName = decodeURIComponent(name);

    const { data, isLoading, error } = useQuery({
        queryKey: ["person", decodedName],
        queryFn: () => getMoviesByActor(decodedName),
    });

    // useEffect(() => setMounted(true), []);

    if (isLoading) return (
        <div className="min-h-screen bg-[(--background)] flex items-center justify-center">
            <div className="animate-pulse text-brand-green font-bold text-2xl tracking-tighter">MOVIE&apos;D</div>
        </div>
    );

    if (error) return <div className="p-10 text-red-500">Error loading actor data.</div>;

    // Assuming TMDB returns person details in the first result or a specific person object
    const person = data?.person; 
    const movies = data?.results || [];
    const profileUrl = person?.profile_path 
        ? `https://image.tmdb.org/t/p/h632${person.profile_path}`
        : null;

    return (
        <div className="min-h-screen transition-colors duration-300">
            {/* Navigation */}
            <Navbar />

            <main className="max-w-6xl mx-auto px-4 py-12">
                <div className="flex flex-col md:flex-row gap-12">
                    
                    {/* Sidebar: Actor Photo & Info */}
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
                                <div className="flex items-center justify-center h-full opacity-20">
                                    <UserCircle size={80} />
                                </div>
                            )}
                        </div>
                        
                        <div className="space-y-4">
                            <h3 className="text-xs font-bold tracking-widest uppercase border-b border-[(--border)] pb-2 opacity-60">
                                Statistics
                            </h3>
                            <div className="text-sm">
                                <p className="font-bold text-gray-900 dark:text-white">{movies.length}</p>
                                <p className="opacity-60 text-[10px] uppercase tracking-wider">Films Credited</p>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content: Bio & Filmography */}
                    <div className="flex-1">
                        <header className="mb-10">
                            <p className="text-brand-green font-bold text-xs tracking-widest uppercase mb-1">Actor</p>
                            <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 dark:text-white">
                                {decodedName}
                            </h2>
                        </header>

                        <div className="mb-8 border-b border-[(--border)] pb-2">
                            <h3 className="text-xs font-bold tracking-widest uppercase flex items-center gap-2">
                                <Film size={14} className="text-brand-green" />
                                Filmography
                            </h3>
                        </div>

                        {/* Movies Grid */}
                        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {movies.map((movie: Movie) => (
                                <MovieCard 
                                    key={movie.id} 
                                    movie={{
                                        id: movie.id,
                                        title: movie.title,
                                        posterPath: movie.poster_path 
                                            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                                            : "",
                                        rating: movie.vote_average / 2
                                    }} 
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default PersonPage;