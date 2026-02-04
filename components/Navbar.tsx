'use client';
import { Moon, Search, Sun, X } from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import React, { useState } from 'react';
import { SearchBar } from './SearchBar';

export const Navbar = () => {
    const { theme, setTheme } = useTheme();
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    return (
        <>
            <nav className="bg-[#f4f7f8] dark:bg-[#1b2228] h-16 border-b border-gray-200 dark:border-black flex items-center px-4 md:px-20 justify-between sticky top-0 z-50 transition-colors duration-300" suppressHydrationWarning>
                <Link href="/" className="flex items-center gap-8 group">
                    <h1 className="text-gray-900 dark:text-white font-black text-2xl tracking-tighter flex items-center transition-opacity group-hover:opacity-80">
                        <span className="text-brand-green mr-1">●</span>MOVIE&apos;D
                    </h1>
                </Link>

                <div className="flex items-center gap-4">
                    <div className="hidden md:block w-64 lg:w-80">
                        <SearchBar />
                    </div>

                    <button 
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
                        aria-label="Toggle Theme"
                    >
                        {theme === "dark" ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} />}
                    </button>
                    
                    <button 
                        className="md:hidden p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-900 dark:text-white"
                        onClick={() => setIsSearchOpen(!isSearchOpen)}
                    >
                        {isSearchOpen ? <X size={20} /> : <Search size={20} />}
                    </button>
                </div>
            </nav>


            {isSearchOpen && (
                <div className="md:hidden border-b border-gray-200 dark:border-gray-800 bg-[#f4f7f8] dark:bg-[#1b2228] p-4 animate-in slide-in-from-top-2 fade-in duration-200">
                    <SearchBar />
                </div>
            )}
        </>
    );
}