"use client";
import React, { useState, useLayoutEffect, useRef } from "react";
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
  const [activeGenreId, setActiveGenreId] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: categoryData, isLoading: catLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });


  React.useEffect(() => {
    if (categoryData?.genres?.length && !activeGenreId) {
      setActiveGenreId(categoryData.genres[0].id);
    }
  }, [categoryData, activeGenreId]);


  const { data: movieData, isFetching } = useQuery({
    queryKey: ["movies", "category", activeGenreId],
    queryFn: () => getMoviesByCategory(activeGenreId as number),
    enabled: !!activeGenreId,
  });


  useLayoutEffect(() => {
    if (movieData?.results && containerRef.current) {
      const ctx = gsap.context(() => {
        gsap.killTweensOf(".movie-card");

        // Animate in
        gsap.fromTo(
          ".movie-card",
          { 
            autoAlpha: 0, // Sets opacity:0 and visibility:hidden
            y: 20         // Start 20px down
          },
          { 
            autoAlpha: 1, // Sets opacity:1 and visibility:visible
            y: 0,         // Move to natural position
            duration: 0.4, 
            stagger: 0.05, // Waterfall effect
            ease: "power2.out",
          }
        );
      }, containerRef);
      return () => ctx.revert();
    }
  }, [movieData, activeGenreId]);

  // Initial Loading State
  if (catLoading) {
    return (
      <div className="min-h-screen bg-[#f4f7f8] dark:bg-letterboxd-dark flex items-center justify-center">
        <Loader2 className="animate-spin text-brand-green" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f7f8] dark:bg-letterboxd-dark text-[#2c3440] dark:text-[#99aabb]">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row gap-10">
          
          {/* --- SIDEBAR FILTER --- */}
          <aside className="w-full md:w-64 shrink-0 z-10">
            <div className="sticky top-24">
              <div className="flex items-center gap-2 mb-6 text-gray-900 dark:text-white border-b border-gray-200 dark:border-white/10 pb-4">
                 <Film size={20} className="text-brand-green" />
                 <h2 className="font-bold tracking-widest text-sm uppercase">Genres</h2>
              </div>
              
              {/* Responsive: Horizontal scroll on mobile, Vertical list on desktop */}
              <div className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-4 md:pb-0 scrollbar-hide">
                {categoryData?.genres.map((genre: Genre) => {
                  const isActive = activeGenreId === genre.id;
                  return (
                    <button
                      key={genre.id}
                      onClick={() => setActiveGenreId(genre.id)}
                      className={`
                        text-left px-4 py-3 rounded-md text-sm font-medium transition-all duration-300 whitespace-nowrap
                        ${isActive 
                          ? "bg-gray-900 text-white dark:bg-white dark:text-black shadow-lg translate-x-2" 
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
          <main className="flex-1 min-h-[50vh]" ref={containerRef}>
            <div className="flex justify-between items-center mb-8 h-8">
              <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                {categoryData?.genres.find((g: Genre) => g.id === activeGenreId)?.name || "Movies"}
              </h1>
              {isFetching && <Loader2 className="animate-spin text-brand-green" size={18} />}
            </div>

            {/* Movie Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {!isFetching && movieData?.results?.map((movie: Movie) => (
                <div 
                  key={movie.id} 
                  className="movie-card invisible opacity-0"
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
            
            {/* Empty State */}
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