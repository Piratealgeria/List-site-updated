import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { Search, X, Music, ArrowLeft, ArrowRight } from 'lucide-react';
import { cn } from '../utils';
import { PostMetadata } from '../types';
import { useDebounce } from '../hooks/useDebounce';
import { PostCard } from '../components/PostCard';
import { fetchPosts } from '../api';

const POSTS_PER_PAGE = 6;

export const Home = () => {
  const [posts, setPosts] = useState<PostMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchPosts()
      .then((data: PostMetadata[]) => {
        setPosts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading posts:', err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const title = 'Viking Algeria | YouTube Channel Notes';
    const description = 'Personal notes and resources for the Viking Algeria YouTube channel.';
    
    document.title = title;
    
    const updateMeta = (name: string, content: string, attr: string = 'name') => {
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    updateMeta('description', description);
    updateMeta('og:title', title, 'property');
    updateMeta('og:description', description, 'property');
    updateMeta('twitter:title', title, 'property');
    updateMeta('twitter:description', description, 'property');
  }, []);

  // Reset to first page when searching
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchQuery]);

  // Global keyboard shortcuts: / or Ctrl/Cmd+K to search, Esc to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isInputActive = activeEl?.tagName === 'INPUT' || activeEl?.tagName === 'TEXTAREA' || (activeEl as HTMLElement)?.isContentEditable;

      if ((e.key === '/' || ((e.metaKey || e.ctrlKey) && e.key === 'k')) && !isInputActive) {
        e.preventDefault();
        setIsSearchOpen(true);
      } else if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
        setSearchQuery('');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen]);

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const filteredPosts = useMemo(() => {
    return posts.filter(post => 
      post.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
      post.tags?.some(tag => tag.toLowerCase().includes(debouncedSearchQuery.toLowerCase()))
    );
  }, [posts, debouncedSearchQuery]);

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  if (loading) return (
    <div className="min-h-screen bg-transparent flex items-center justify-center">
      <motion.div 
        animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="w-12 h-12 border-2 border-emerald-500 rounded-full border-t-transparent"
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-transparent text-white flex flex-col relative overflow-hidden font-sans">
      <div className="flex-grow relative z-10 w-full flex flex-col items-center">
        <div className="max-w-7xl mx-auto w-full px-4 md:px-8 py-12 md:py-20 flex-1">
          <header className="mb-16 md:mb-20 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 md:gap-8">
          <div className="w-full md:w-auto text-center md:text-left mx-auto md:mx-0 flex flex-col items-center md:items-start">
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => {
                setSearchQuery('');
                setIsSearchOpen(false);
                setCurrentPage(1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="group text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-display font-bold uppercase tracking-tighter leading-[0.85] mb-6 cursor-pointer transition-opacity whitespace-nowrap relative"
            >
              <span className="relative inline-block overflow-hidden">
                <span className="relative z-10 block group-hover:animate-glitch-1">Viking</span>
                <span className="absolute top-0 left-0 -translate-x-[2px] text-red-500 opacity-0 group-hover:opacity-70 group-hover:animate-glitch-2 mix-blend-screen z-0">Viking</span>
                <span className="absolute top-0 left-0 translate-x-[2px] text-blue-500 opacity-0 group-hover:opacity-70 group-hover:animate-glitch-3 mix-blend-screen z-0">Viking</span>
              </span>
              <br/>
              <span className="relative inline-block pb-2">
                <span className="text-emerald-400 relative z-10 block group-hover:animate-glitch-2">Algeria</span>
                <span className="absolute top-0 left-0 -translate-x-[2px] text-red-500 opacity-0 group-hover:opacity-70 group-hover:animate-glitch-3 mix-blend-screen z-0">Algeria</span>
                <span className="absolute top-0 left-0 translate-x-[2px] text-blue-500 opacity-0 group-hover:opacity-70 group-hover:animate-glitch-1 mix-blend-screen z-0">Algeria</span>
              </span>
            </motion.h1>
            <p className="text-white/40 max-w-sm text-[10px] md:text-xs uppercase tracking-[0.3em] font-mono leading-relaxed text-center md:text-left">
              Personal notes and resources for the Viking Algeria YouTube channel.
            </p>
          </div>

          <div className="relative w-full md:w-auto flex justify-center md:justify-end gap-4 items-center mt-6 md:mt-0">
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('toggle-music-player'))}
              className="w-12 h-12 bg-black border border-white/20 flex items-center justify-center hover:border-emerald-500 hover:shadow-[4px_4px_0_#10b981] transition-all group shrink-0"
              aria-label="Toggle music player"
            >
              <Music className="w-5 h-5 text-white/40 group-hover:text-emerald-500 transition-colors" />
            </button>
            <div className={cn(
              "flex items-center gap-4 transition-all duration-500",
              isSearchOpen ? "w-[calc(100%-4rem)] md:w-96" : "w-12"
            )}>
              {isSearchOpen ? (
                <div className="relative w-full group">
                  <input
                    autoFocus
                    type="text"
                    placeholder="Search posts (Press Esc to close)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') {
                        setIsSearchOpen(false);
                        setSearchQuery('');
                      }
                    }}
                    className="w-full bg-black border border-white/20 py-3 px-6 pl-12 focus:outline-none focus:border-emerald-500 transition-all font-mono text-[10px] md:text-sm uppercase tracking-widest shadow-[4px_4px_0_#10b98100] focus:shadow-[4px_4px_0_#10b981]"
                  />
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-focus-within:text-emerald-500 transition-colors" />
                  <button 
                    onClick={() => {
                      setIsSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-emerald-400 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setIsSearchOpen(true)}
                  className="w-12 h-12 bg-black border border-white/20 flex items-center justify-center hover:border-emerald-500 hover:shadow-[4px_4px_0_#10b981] transition-all group shrink-0"
                >
                  <Search className="w-5 h-5 text-white/40 group-hover:text-emerald-500 transition-colors" />
                </button>
              )}
            </div>
          </div>
        </header>

        {debouncedSearchQuery && (
          <div className="mb-12 text-center md:text-left">
            <h2 className="text-sm font-mono uppercase tracking-[0.4em] text-white/40 mb-4">
              Showing results for: <span className="text-emerald-500">{debouncedSearchQuery}</span>
            </h2>
            {filteredPosts.length === 0 && (
              <div className="py-20 flex justify-center">
                <div className="border border-red-500/30 bg-red-500/5 p-6 max-w-lg w-full relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-0.5 bg-red-500/50" />
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="font-mono text-xs text-red-500 font-bold uppercase tracking-widest">ERR_NOT_FOUND</span>
                  </div>
                  <p className="text-white/60 font-mono text-sm leading-relaxed mb-4">
                    $ grep -r "{debouncedSearchQuery}" /content/posts/* <br/>
                    <span className="text-red-400">grep: No match found.</span>
                  </p>
                  <button 
                    onClick={() => {
                      setSearchQuery('');
                      setIsSearchOpen(false);
                    }}
                    className="text-xs font-mono text-white/40 hover:text-white transition-colors underline underline-offset-4"
                  >
                    Clear Search Buffer
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {paginatedPosts.map((post, index) => (
            <PostCard key={post.id} post={post} index={index} />
          ))}
        </div>

        {totalPages > 1 && (
          <div className="mt-24 flex justify-center w-full px-4 max-w-7xl mx-auto">
            <div className="inline-flex flex-wrap items-center justify-center gap-1 md:gap-2 bg-black/80 backdrop-blur-xl border border-white/10 p-1.5 md:p-2 shadow-[4px_4px_0_rgba(255,255,255,0.05)] md:shadow-[8px_8px_0_rgba(16,185,129,0.15)]">
              
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="w-12 h-12 flex items-center justify-center text-white/50 hover:text-emerald-400 hover:bg-white/5 disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-white/50 cursor-pointer disabled:cursor-not-allowed transition-all group"
                aria-label="Previous page"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              </button>
              
              <div className="hidden md:flex flex-wrap items-center justify-center gap-1">
                {(() => {
                  const pages = [];
                  const delta = 2;
                  const left = Math.max(2, currentPage - delta);
                  const right = Math.min(totalPages - 1, currentPage + delta);
                  
                  // Avoid single-page ellipsis by expanding boundaries if adjacent
                  const startPage = left === 3 ? 2 : left;
                  const endPage = right === totalPages - 2 ? totalPages - 1 : right;

                  pages.push(
                    <button
                      key={1}
                      onClick={() => setCurrentPage(1)}
                      className={cn(
                        "w-12 h-12 flex items-center justify-center transition-all font-mono text-sm font-bold border border-transparent",
                        currentPage === 1 
                          ? "bg-emerald-500 text-black shadow-[2px_2px_0_#fff]" 
                          : "text-white/50 hover:text-emerald-400 hover:bg-white/5 hover:border-white/10"
                      )}
                    >
                      01
                    </button>
                  );

                  if (startPage > 2) {
                    pages.push(
                      <span key="ellipsis-left" className="w-8 text-center text-white/20 font-mono text-xs tracking-widest shrink-0">..</span>
                    );
                  }

                  for (let i = startPage; i <= endPage; i++) {
                    pages.push(
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i)}
                        className={cn(
                          "w-12 h-12 flex items-center justify-center transition-all font-mono text-sm font-bold border border-transparent",
                          currentPage === i 
                            ? "bg-emerald-500 text-black shadow-[2px_2px_0_#fff]" 
                            : "text-white/50 hover:text-emerald-400 hover:bg-white/5 hover:border-white/10"
                        )}
                      >
                        {i.toString().padStart(2, '0')}
                      </button>
                    );
                  }

                  if (endPage < totalPages - 1) {
                    pages.push(
                      <span key="ellipsis-right" className="w-8 text-center text-white/20 font-mono text-xs tracking-widest shrink-0">..</span>
                    );
                  }

                  if (totalPages > 1) {
                    pages.push(
                      <button
                        key={totalPages}
                        onClick={() => setCurrentPage(totalPages)}
                        className={cn(
                          "w-12 h-12 flex items-center justify-center transition-all font-mono text-sm font-bold border border-transparent",
                          currentPage === totalPages 
                            ? "bg-emerald-500 text-black shadow-[2px_2px_0_#fff]" 
                            : "text-white/50 hover:text-emerald-400 hover:bg-white/5 hover:border-white/10"
                        )}
                      >
                        {totalPages.toString().padStart(2, '0')}
                      </button>
                    );
                  }

                  return pages;
                })()}
              </div>

              <div className="md:hidden flex items-center justify-center min-w-[120px] font-mono text-[10px] uppercase tracking-widest text-white/40">
                <span className="text-emerald-400 font-bold text-sm mx-3 border-b border-emerald-400/30 pb-0.5">{currentPage.toString().padStart(2, '0')}</span> 
                <span className="opacity-50">/</span> 
                <span className="text-white/80 font-bold text-sm mx-3">{totalPages.toString().padStart(2, '0')}</span>
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="w-12 h-12 flex items-center justify-center text-white/50 hover:text-emerald-400 hover:bg-white/5 disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-white/50 cursor-pointer disabled:cursor-not-allowed transition-all group"
                aria-label="Next page"
              >
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        )}
        </div>
      </div>

      <footer className="border-t border-white/10 p-12 text-center flex flex-col items-center gap-6 mt-auto">
        <p className="text-white/20 text-[10px] uppercase tracking-[0.4em] font-mono">
          VikingAlgeria &copy; {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
};
