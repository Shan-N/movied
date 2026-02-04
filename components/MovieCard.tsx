"use client";
import { useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import { Star } from "lucide-react";

interface Movie {
  id: number;
  title: string;
  posterPath: string;
  rating?: number;
}

export const MovieCard = ({ movie }: { movie: Movie }) => {
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);
  const borderRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    gsap.to(cardRef.current, { 
      scale: 1.05, 
      y: -5, 
      duration: 0.3, 
      ease: "power2.out" 
    });
    gsap.to(borderRef.current, { 
      opacity: 1, 
      scale: 1.05, 
      duration: 0.2 
    });
  };

  const handleMouseLeave = () => {
    gsap.to(cardRef.current, { 
      scale: 1, 
      y: 0, 
      duration: 0.3, 
      ease: "power2.inOut" 
    });
    gsap.to(borderRef.current, { opacity: 0, scale: 1, duration: 0.2 });
  };

  return (
    <div 
      
      className="relative cursor-pointer group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => router.push(`/movie/${movie.id}`)}
    >
      <div 
        ref={cardRef}
        className="relative aspect-2/3 w-full bg-[#2c3440] rounded-md overflow-hidden shadow-lg transition-shadow duration-300"
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

        {typeof movie.rating === 'number' && movie.rating > 0 && (
          <div className="absolute inset-x-0 bottom-0 p-4 bg-linear-to-t from-black/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center z-10">
             <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 shadow-xl transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <Star size={12} className="text-brand-green fill-brand-green" />
                <span className="text-white text-xs font-bold tracking-wide">
                  {movie.rating.toFixed(1)}
                </span>
             </div>
          </div>
        )}
      </div>

      <div 
        ref={borderRef}
        className="absolute -inset-1 border-2 border-brand-green rounded-lg opacity-0 pointer-events-none z-20"
      />
    </div>
  );
};