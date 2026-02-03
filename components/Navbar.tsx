'use client';
import { Moon, Search, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import React from 'react'

export const Navbar = () => {
    const { theme, setTheme } = useTheme();
    const [searchTerm, setSearchTerm] = React.useState("");
    const [isSearching, setIsSearching] = React.useState(false);
  return (
    <>
    <nav className="bg-[#f4f7f8] dark:bg-[#1b2228] h-16 border-b border-gray-200 dark:border-black flex items-center px-4 md:px-20 justify-between sticky top-0 z-50">
        <div className="flex items-center gap-8" onClick={() => window.location.href = "/"}>
          <h1 className="text-gray-900 dark:text-white font-black text-2xl tracking-tighter flex items-center">
            <span className="text-brand-green mr-1">●</span>MOVIE&apos;D
          </h1>
        </div>

        <div className="flex items-center gap-4">
          {/* Dark Mode Toggle */}
          <button 
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            {theme === "dark" ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} />}
          </button>
          
          <Search size={18} className="hover:text-black dark:hover:text-white cursor-pointer" onClick={() => { setSearchTerm(""); setIsSearching(!isSearching); }} />
        </div>
      </nav>
      {isSearching && (
        <div className="flex">
          <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search Movie'd" className="w-full p-2 border-b border-gray-300 dark:border-gray-600 bg-transparent outline-none text-black dark:text-white" />
          <button onClick={() => window.location.href = '/search?q=' + encodeURIComponent(searchTerm)} className="w-full bg-brand-green text-black font-bold py-2 px-4 flex-1 items-center justify-center"> Search </button>
        </div>
      )}
    </>
  )
}
