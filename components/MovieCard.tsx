"use client";
import { useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";

interface Movie {
  id: number;
  title: string;
  posterPath: string;
  rating?: number;
}

export const MovieCard = ({ movie }: { movie: Movie }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const borderRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    gsap.to(cardRef.current, { 
      scale: 1.05, 
      y: -4, 
      duration: 0.3, 
      ease: "power2.out" 
    });
    gsap.to(borderRef.current, { opacity: 1, scale: 1.05, duration: 0.2 });
  };

  const handleMouseLeave = () => {
    gsap.to(cardRef.current, { 
      scale: 1, 
      y: 0, 
      duration: 0.3, 
      ease: "power2.inOut" 
    });
    gsap.to(borderRef.current, { opacity: 0, duration: 0.2 });
  };

  return (
    <div 
      className="relative cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => window.location.href = `/movie/${movie.id}`}
    >
      <div 
        ref={cardRef}
        className="relative aspect-2/3 w-full bg-[#2c3440] rounded-md overflow-hidden border border-black/20 dark:border-white/10 shadow-lg"
      >
        {movie.posterPath ? (
          <Image
            src={movie.posterPath}
            alt={movie.title}
            fill
            sizes="(max-width: 768px) 33vw, (max-width: 1200px) 20vw, 15vw"
            className="object-cover"
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+ZNPQAIXQM49793qgAAAABJRU5ErkJggg=="
          />
        ) : (
          <div className="flex items-center justify-center h-full p-4 text-center">
            <span className="text-[#99aabb] text-[10px] uppercase font-bold tracking-widest">
              {movie.title}
            </span>
          </div>
        )}

        {/* Rating Star Overlay */}
        {movie.rating && movie.rating > 0 && (
          <div className="absolute bottom-2 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
             <div className="bg-black/80 px-2 py-0.5 rounded flex items-center gap-1">
                <span className="text-brand-green text-[10px] font-bold">{movie.rating.toFixed(1)}</span>
             </div>
          </div>
        )}
      </div>

      {/* High-quality Border Overlay */}
      <div 
        ref={borderRef}
        className="absolute -inset-0.5 border-2 border-brand-green rounded-md opacity-0 pointer-events-none z-20 transition-opacity"
      />
    </div>
  );
};