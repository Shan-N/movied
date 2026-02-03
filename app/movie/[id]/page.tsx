'use client';

import { use } from "react";
import { getMovieCredits, getMovieDetails, getMovieVideos } from "@/lib/tmdb";
import { useQuery } from "@tanstack/react-query";
// import { useTheme } from "next-themes";
import {  Star, Calendar, Clock } from "lucide-react";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";

interface Member {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function MoviePage({ params }: PageProps) {
  const { id } = use(params);


  const { data, isLoading, error } = useQuery({
    queryKey: ["movie", id],
    queryFn: () => getMovieDetails(id),
  });
  
  const { data: creditsData } = useQuery({
    queryKey: ["movieCredits", id],
    queryFn: () => getMovieCredits(id),
  });

  const { data: videosData } = useQuery({
    queryKey: ["movieVideos", id],
    queryFn: () => getMovieVideos(id),
  });



  if (isLoading) return (
    <div className="min-h-screen bg-[(--background)] flex items-center justify-center">
      <div className="animate-pulse text-brand-green font-bold tracking-tighter text-2xl">MOVIE&apos;D</div>
    </div>
  );

  if (error) return <div className="p-10 text-red-500">Error loading movie details.</div>;

  const backdropUrl = `https://image.tmdb.org/t/p/original${data?.backdrop_path}`;
  const posterUrl = `https://image.tmdb.org/t/p/w500${data?.poster_path}`;

  return (
    <div className="min-h-screen transition-colors duration-300">
      {/* Navigation (Reused from Landing) */}
        <Navbar />

      <div className="relative h-[50vh] w-full overflow-hidden bg-black">
        <Image 
          src={backdropUrl} 
          alt={data?.title} 
          fill 
          className="object-cover opacity-60 dark:opacity-40 transition-opacity"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-t from-[(--background)] to-transparent z-10" />
      </div>

      {/* Content Section */}
      <main className="max-w-6xl mx-auto px-4 -mt-32 relative z-20 pb-20">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Poster Side */}
          <div className="w-64 shrink-0 mx-auto md:mx-0">
            <div className="relative aspect-2/3 rounded-md overflow-hidden border-2 border-[(--border)] shadow-2xl">
              <Image src={posterUrl} alt={data?.title} fill className="object-cover" />
            </div>
          </div>

          {/* Info Side */}
          <div className="flex-1 pt-32 md:pt-40">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 dark:text-white mb-2">
              {data?.title}
            </h2>
            
            <div className="flex flex-wrap items-center gap-4 text-sm font-bold opacity-80 mb-6">
              <div className="flex items-center gap-1 text-brand-green">
                <Star size={16} fill="currentColor" />
                <span>{(data?.vote_average / 2).toFixed(1)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar size={16} />
                <span>{new Date(data?.release_date).getFullYear()}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={16} />
                <span>{data?.runtime} min</span>
              </div>
            </div>

            <p className="text-lg leading-relaxed max-w-3xl text-gray-700 dark:text-[#99aabb]">
              {data?.overview}
            </p>

            <div>
                <h3 className="mt-8 mb-2 font-bold text-gray-900 dark:text-white">Cast</h3>
                <div className="flex flex-wrap gap-4">
                  {creditsData?.cast?.slice(0, 6).map((member: Member) => (
                    <div key={member.id} className="w-24 shrink-0">
                      <div className="relative h-32 w-24 rounded-md overflow-hidden bg-gray-200 dark:bg-[#2c3440]" onClick={() => window.location.href = `/person/${member.name}`}>
                        {member.profile_path ? (
                          <Image 
                            src={`https://image.tmdb.org/t/p/w185${member.profile_path}`} 
                            alt={member.name} 
                            fill 
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full p-2 text-center">
                            <span className="text-[#99aabb] text-[10px] uppercase font-bold tracking-widest">
                              {member.name}
                            </span>
                          </div>
                        )}
                      </div>
                      <p className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">{member.name}</p>
                      <p className="text-xs text-gray-600 dark:text-[#99aabb]">{member.character}</p>
                    </div>
                  ))}
                </div>
            </div>

            <div>
                <h3 className="mt-8 mb-2 font-bold text-gray-900 dark:text-white">Trailers & Videos</h3>
                <div className="flex flex-wrap gap-4">
                  {videosData?.results?.filter((video: Video) => video.site === "YouTube").slice(0, 2).map((video: Video) => (
                    <div key={video.id} className="w-64">
                      <iframe
                        width="100%"
                        height="360"
                        src={`https://www.youtube.com/embed/${video.key}`}
                        title={video.name}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="rounded-md"
                      ></iframe>
                    </div>
                  ))}
                </div>
            </div>

            <div className="mt-8 flex gap-4">
              <button className="bg-brand-green text-black font-bold px-6 py-2 rounded-sm hover:brightness-110 transition-all">
                WATCHED
              </button>
              <button className="bg-gray-200 dark:bg-[#2c3440] text-gray-900 dark:text-white font-bold px-6 py-2 rounded-sm hover:brightness-110 transition-all">
                + WATCHLIST
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}