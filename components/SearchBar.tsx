"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { searchMovies } from "@/lib/tmdb";
import { useDebounce } from "@/hooks/useDebounce"; // Ensure you have this hook file created
import { Search, X, Loader2, Film, Calendar, Star } from "lucide-react";
import Image from "next/image";
import { Movie } from "@/lib/types";

export function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  
  // 1. Debounce the input (wait 300ms before searching)
  const debouncedQuery = useDebounce(query, 300);

  // 2. Fetch Data
  const { data, isLoading } = useQuery({
    queryKey: ["search", debouncedQuery],
    queryFn: () => searchMovies(debouncedQuery),
    enabled: debouncedQuery.length > 1, // Only search if > 1 char
    staleTime: 1000 * 60, // Cache results for 1 minute
  });

  const results = data?.results?.slice(0, 5) || []; // Limit to top 5

  // 3. Logic to determine if dropdown should physically appear
  const showResults = isOpen && debouncedQuery.length > 1 && results.length > 0;

  // 4. Handle Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle search with Cmd+K / Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchRef.current?.querySelector("input")?.focus();
      }
      // Close on Escape
      if (e.key === "Escape") {
        setIsOpen(false);
        searchRef.current?.querySelector("input")?.blur();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // 5. Navigation Logic
  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > -1 ? prev - 1 : prev));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && results[selectedIndex]) {
        handleSelect(results[selectedIndex].id);
      } else {
        submitSearch();
      }
    }
  };

  const handleSelect = (movieId: number) => {
    setIsOpen(false);
    setQuery("");
    router.push(`/movie/${movieId}`);
  };

  const submitSearch = () => {
    if (!query) return;
    setIsOpen(false);
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={searchRef} className="relative w-full max-w-md group z-50">
      {/* INPUT FIELD CONTAINER */}
      <div className={`
        relative flex items-center bg-gray-100 dark:bg-[#2c3440] 
        rounded-full border transition-all duration-300 overflow-hidden
        ${showResults 
          ? "rounded-b-none border-brand-green ring-2 ring-brand-green/20" // Active State (Only if results exist)
          : "border-transparent focus-within:border-brand-green"             // Normal Focus State
        }
      `}>
        <div className="pl-4 text-gray-400">
          {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
        </div>
        
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setSelectedIndex(-1);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleInputKeyDown}
          placeholder="Search films..."
          className="w-full bg-transparent border-none focus:ring-0 outline-none px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500"
        />

        {query && (
          <button 
            onClick={() => { setQuery(""); setIsOpen(false); }}
            className="pr-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <X size={14} />
          </button>
        )}
        
        {/* Keyboard Shortcut Hint */}
        {!isOpen && !query && (
            <div className="absolute right-4 pointer-events-none hidden md:flex items-center gap-1">
                <kbd className="hidden sm:inline-block border border-gray-300 dark:border-gray-600 rounded px-1.5 text-[10px] font-medium text-gray-500 dark:text-gray-400">⌘K</kbd>
            </div>
        )}
      </div>

      {/* DROPDOWN RESULTS */}
      {showResults && (
        <div className="absolute top-full left-0 w-full bg-white dark:bg-[#2c3440] border-t-0 border border-gray-200 dark:border-gray-700 rounded-b-xl shadow-2xl overflow-hidden">
          
          <ul>
            <li className="px-4 py-2 text-[10px] uppercase tracking-wider text-gray-500 font-bold bg-gray-50 dark:bg-[#1b2228]">
              Best Matches
            </li>
            {results.map((movie: Movie, index: number) => (
              <li key={movie.id}>
                <button
                  onClick={() => handleSelect(movie.id)}
                  className={`
                    w-full text-left flex items-center gap-3 px-4 py-3 transition-colors
                    ${index === selectedIndex ? "bg-gray-100 dark:bg-[#384250]" : "hover:bg-gray-50 dark:hover:bg-[#323b47]"}
                  `}
                >
                  <div className="relative w-8 h-12 shrink-0 bg-gray-200 dark:bg-gray-800 rounded overflow-hidden shadow-sm">
                      {movie.poster_path ? (
                          <Image 
                              src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`} 
                              alt={movie.title} 
                              fill 
                              className="object-cover"
                          />
                      ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400"><Film size={12}/></div>
                      )}
                  </div>

                  {/* Meta Data */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                      {movie.title}
                    </h4>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                          <Calendar size={10} /> 
                          {movie.release_date?.split("-")[0] || "TBA"}
                      </span>
                      {movie.vote_average > 0 && (
                          <span className="flex items-center gap-1 text-yellow-600 dark:text-yellow-500">
                              <Star size={10} fill="currentColor" /> 
                              {movie.vote_average.toFixed(1)}
                          </span>
                      )}
                    </div>
                  </div>
                </button>
              </li>
            ))}
            
            {/* "See all results" Link */}
            <li className="border-t border-gray-100 dark:border-gray-700">
              <button 
                onClick={submitSearch}
                className={`w-full text-left px-4 py-3 text-xs font-bold text-brand-green hover:bg-gray-50 dark:hover:bg-[#323b47] transition-colors flex items-center gap-2 ${selectedIndex === results.length ? "bg-gray-100 dark:bg-[#384250]" : ""}`}
              >
                <Search size={12} />
                VIEW ALL RESULTS FOR &quot;{query}&quot;
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}