'use client';

import React from 'react';
import Link from 'next/link';
import { useQueries } from '@tanstack/react-query';
import { Navbar } from '@/components/Navbar';
import { Loader2, List as ListIcon, ChevronRight } from "lucide-react";
import data from "@/app/lists/lists.json"
import { getDiscoverMovies } from '@/lib/tmdb';
import { Movie } from '@/lib/types';


const LISTS_CONFIG = data;

const ListsPage = () => {
  const results = useQueries({
    queries: LISTS_CONFIG.map((list) => ({
      queryKey: ['list-preview', list.id],
      queryFn: () => getDiscoverMovies(list.params || list.overrideParams || {}),
      staleTime: 1000 * 60 * 60, // 1 hour
    }))
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Curated Movie Lists - MOVIE'D",
    "description": "Explore hand-picked selections of cinema's finest moments, categorized by genre, era, and mood on MOVIE'D.",
    "itemListElement": LISTS_CONFIG.map((list, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "url": `https://movied.example.com/lists/${list.id}`,
      "name": list.title,
      "description": list.description
    }))
  }

  return (
    <div className="min-h-screen bg-[#f4f7f8] dark:bg-letterboxd-dark transition-colors duration-300">
        <script 
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <header className="mb-16 text-center md:text-left">
          <div className="flex items-center gap-3 mb-4 justify-center md:justify-start">
             <div className="p-3 bg-brand-green/10 rounded-full">
                <ListIcon size={32} className="text-brand-green" />
             </div>
             <span className="text-xs font-bold tracking-[0.3em] uppercase text-gray-500 dark:text-gray-400">Curated Collections</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white tracking-tighter mb-4">
            DISCOVER YOUR <br/> <span className="text-transparent bg-clip-text bg-linear-to-r from-brand-green to-emerald-600">NEXT FAVORITE.</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
            Explore our hand-picked selections of cinema&apos;s finest moments, 
            categorized by genre, era, and mood.
          </p>
        </header>

        {/* Lists Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {LISTS_CONFIG.map((list, index) => {
            const { data, isLoading } = results[index];
            const movies = data?.results?.slice(0, 3) || []; // Get top 3 for preview

            return (
              <Link 
                href={`/lists/${list.id}`} 
                key={list.id}
                className="group relative h-96 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              >
                {/* Background linear */}
                <div className={`absolute inset-0 bg-linear-to-br ${list.color} opacity-90 transition-opacity group-hover:opacity-100 z-0`} />
                
                {/* Poster Collage (The "Fan" Effect) */}
                <div className="absolute inset-0 z-10 flex items-center justify-center top-4 transition-transform duration-700 group-hover:scale-105 group-hover:top-0">
                   {isLoading ? (
                     <Loader2 className="animate-spin text-white/50" />
                   ) : (
                     movies.map((m: Movie, idx: number) => (
                       <div 
                         key={m.id}
                         className="absolute w-32 h-48 bg-gray-800 rounded-lg shadow-2xl border border-white/20"
                         style={{
                           backgroundImage: `url(https://image.tmdb.org/t/p/w300${m.poster_path})`,
                           backgroundSize: 'cover',
                           // Fan effect calculations
                           left: '50%',
                           top: '40%',
                           marginLeft: `${(idx - 1) * 30}px`, // Spread horizontally
                           transform: `translate(-50%, -50%) rotate(${(idx - 1) * 12}deg) translateY(${idx === 1 ? '-15px' : '0'})`, // Rotate side cards
                           zIndex: idx === 1 ? 20 : 10, // Middle card on top
                           opacity: idx === 1 ? 1 : 0.8 // Side cards slightly faded
                         }}
                       />
                     ))
                   )}
                </div>

                {/* Content Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-8 z-20 bg-linear-to-t from-black/90 via-black/60 to-transparent">
                  <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-brand-green transition-colors">
                    {list.title}
                  </h2>
                  <p className="text-sm text-gray-300 line-clamp-2 mb-4 opacity-80 group-hover:opacity-100 transition-opacity">
                    {list.description}
                  </p>
                  
                  <div className="flex items-center justify-between border-t border-white/10 pt-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                      View Collection
                    </span>
                    <div className="bg-white/10 p-2 rounded-full group-hover:bg-brand-green group-hover:text-black transition-colors">
                      <ChevronRight size={16} />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default ListsPage;