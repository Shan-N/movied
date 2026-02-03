"use client";
import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import gsap from "gsap";

interface FeaturedMovie {
  backdrop_path: string;
  title: string;
}

export function HeroSection({ featured }: { featured: FeaturedMovie | null }) {
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".hero-text", { 
        y: 60, 
        opacity: 0, 
        duration: 1, 
        stagger: 0.2, 
        ease: "power4.out" 
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  if (!featured) return null;

  return (
    <div ref={containerRef} className="relative h-[65vh] w-full flex items-center overflow-hidden border-b border-gray-200 dark:border-white/5">
      <div className="absolute inset-0 z-0">
        <Image
          src={`https://image.tmdb.org/t/p/original${featured.backdrop_path}`}
          alt={`Backdrop for ${featured.title}`}
          fill
          priority // CRITICAL FOR SEO (LCP SCORE)
          className="object-cover opacity-20 dark:opacity-30 grayscale-50"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-linear-to-r from-[#f4f7f8] via-[#f4f7f8]/80 dark:from-letterboxd-dark/80 dark:via-letterboxd-dark/80 to-transparent" />
      </div>

      <div className="relative z-10 px-8 max-w-7xl mx-auto w-full">
        <div className="max-w-2xl">
          <span className="hero-text inline-block text-brand-green font-bold tracking-[0.3em] text-xs mb-4">PREMIER SELECTION</span>
          <h1 className="hero-text text-6xl md:text-8xl font-black text-gray-900 dark:text-white tracking-tighter leading-[0.9] mb-6">
            COLLECT <br/> <span className="text-transparent stroke-text">CINEMA.</span>
          </h1>
          <p className="hero-text text-lg text-gray-600 dark:text-[#99aabb] mb-8 font-medium">
            Join the world&apos;s largest community of film critics and enthusiasts. 
            Track your watchlist and share your taste.
          </p>
          <div className="hero-text flex gap-4">
            <button className="bg-gray-900 dark:bg-brand-green text-white dark:text-letterboxd-dark px-8 py-4 rounded-sm font-bold hover:scale-105 transition-transform flex items-center gap-2">
              GET STARTED <Play size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}