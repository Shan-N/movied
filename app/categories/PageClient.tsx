"use client";
import React, { useState, useLayoutEffect, useRef, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCategories, getMoviesByCategory } from "@/lib/tmdb";
import { Navbar } from "@/components/Navbar";
import { MovieCard } from "@/components/MovieCard";
import { Loader2, Film } from "lucide-react";
import gsap from "gsap";

interface Genre {
  id: number;
  name: string;
}

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
}

export default function CategoryPage() {
  const [selectedGenreId, setSelectedGenreId] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 1. Fetch Categories
  const { data: categoryData, isLoading: catLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  // 2. Derive the ID: Use selected state OR fallback to first genre in list
  // This removes the need for the useEffect that caused the linting error
  const activeGenreId = selectedGenreId ?? categoryData?.genres?.[0]?.id;

  // 3. Fetch Movies based on the derived ID
  const { data: movieData, isFetching } = useQuery({
    queryKey: ["movies", "category", activeGenreId],
    queryFn: () => getMoviesByCategory(activeGenreId as number),
    enabled: !!activeGenreId,
    placeholderData: (previousData) => previousData, // Keeps UI stable during switch
  });

  // 4. GSAP Animation Logic
  useLayoutEffect(() => {
    // Only animate when we have data and aren't mid-fetch
    if (!isFetching && movieData?.results?.length && containerRef.current) {
      const ctx = gsap.context(() => {
        // Kill any existing animations to prevent conflicts
        gsap.killTweensOf(".movie-card");
        
        // Reset state and animate in
        gsap.fromTo(
          ".movie-card",
          { autoAlpha: 0, y: 20 },
          { 
            autoAlpha: 1, 
            y: 0, 
            duration: 0.4, 
            stagger: 0.05, 
            ease: "power2.out",
            overwrite: true 
          }
        );
      }, containerRef);

      return () => ctx.revert();
    }
  }, [movieData, isFetching]);

  if (catLoading) {
    return (
      <div className="min-h-screen bg-[#f4f7f8] dark:bg-letterboxd-dark flex items-center justify-center">
        <Loader2 className="animate-spin text-brand-green" size={40} />
      </div>
    );
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Movie Categories - MOVIE'D",
    "description": "Explore movies by categories and genres on MOVIE'D.",
    "itemListElement": categoryData?.genres.map((genre: Genre, index: number) => ({
      "@type": "ListItem",
      "position": index + 1,
      "url": `https://movied.example.com/categories/${genre.id}`,
      "name": genre.name
    })) || []
  }

  return (
    <div className="min-h-screen bg-[#f4f7f8] dark:bg-letterboxd-dark text-[#2c3440] dark:text-[#99aabb]">
        <script 
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row gap-10">
          
          {/* --- SIDEBAR --- */}
          <aside className="w-full md:w-64 shrink-0 z-10">
            <div className="sticky top-24">
              <div className="flex items-center gap-2 mb-6 text-gray-900 dark:text-white border-b border-gray-200 dark:border-white/10 pb-4">
                 <Film size={20} className="text-brand-green" />
                 <h2 className="font-bold tracking-widest text-sm uppercase">Genres</h2>
              </div>
              
              <div className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-4 md:pb-0 scrollbar-hide">
                {categoryData?.genres.map((genre: Genre) => {
                  const isActive = activeGenreId === genre.id;
                  return (
                    <button
                      key={genre.id}
                      onClick={() => setSelectedGenreId(genre.id)}
                      className={`
                        text-left px-4 py-3 rounded-md text-sm font-medium transition-all duration-300 whitespace-nowrap
                        ${isActive 
                          ? "bg-gray-900 text-white dark:bg-white dark:text-black shadow-lg md:translate-x-2" 
                          : "hover:bg-gray-200 dark:hover:bg-[#1b2228] text-gray-500 hover:text-gray-900 dark:hover:text-white"
                        }
                      `}
                    >
                      {genre.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* --- MAIN CONTENT --- */}
          <main className="flex-1 min-h-[60vh]" ref={containerRef}>
            <div className="flex justify-between items-center mb-8 h-8">
              <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                {categoryData?.genres.find((g: Genre) => g.id === activeGenreId)?.name || "Movies"}
              </h1>
              {isFetching && <Loader2 className="animate-spin text-brand-green" size={18} />}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {movieData?.results?.map((movie: Movie) => (
                <div 
                  key={`${activeGenreId}-${movie.id}`} // Unique key ensures fresh DOM nodes for GSAP
                  className="movie-card opacity-0"
                > 
                  <MovieCard 
                    movie={{
                      id: movie.id,
                      title: movie.title,
                      posterPath: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
                      rating: movie.vote_average / 2
                    }} 
                  />
                </div>
              ))}
            </div>
            
            {!isFetching && movieData?.results?.length === 0 && (
               <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 dark:border-white/10 rounded-xl">
                 <p className="text-gray-500 font-medium">No movies found in this category.</p>
               </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}