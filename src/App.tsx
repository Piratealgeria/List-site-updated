/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Share2, 
  ArrowLeft, 
  ArrowRight,
  ArrowUp,
  Copy, 
  Check, 
  ExternalLink, 
  Menu, 
  X,
  ChevronRight,
  Play,
  Search
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { MusicPlayer } from './components/MusicPlayer';

// Utility for tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Types ---
interface PostMetadata {
  id: string;
  numericId?: number;
  title: string;
  file: string;
  type: 'md' | 'html';
  thumbnail?: string;
  videoUrl?: string | null;
  excerpt?: string;
  tags?: string[];
}

// --- Components ---

const CopyLinkButton = ({ url }: { url: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Error copying:', err);
    }
  };

  return (
    <div className="relative flex flex-col items-center">
      <button
        onClick={handleCopy}
        className="p-3 bg-black border border-white/20 hover:border-emerald-500 hover:shadow-[4px_4px_0_#10b981] transition-all flex items-center justify-center group"
        aria-label="Copy Link"
      >
        {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5 text-white group-hover:text-emerald-400 transition-colors" />}
      </button>
      <AnimatePresence>
        {copied && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 10 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute top-full text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-400 whitespace-nowrap drop-shadow-md z-50 pointer-events-none mt-1"
          >
            Copied!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ClickToCopy = ({ text, children, className }: { text: string, children: React.ReactNode, className?: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    // If clicking a link, don't copy
    if ((e.target as HTMLElement).closest('a')) return;
    
    e.stopPropagation();
    if (!text) return;
    
    // Clean text: remove leading/trailing whitespace and multiple spaces
    const cleanText = text.trim();
    if (!cleanText) return;

    navigator.clipboard.writeText(cleanText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <span 
      onClick={handleCopy}
      className={cn(
        "cursor-pointer transition-colors relative group/copy inline-flex items-center w-full break-words", 
        className
      )}
    >
      <span className="flex-1 break-words">{children}</span>
      <span className={cn(
        "ml-2 opacity-0 group-hover/copy:opacity-100 transition-opacity shrink-0",
        copied && "opacity-100"
      )}>
        {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-white/20" />}
      </span>
    </span>
  );
};

const FormattedLine = ({ children }: { children: React.ReactNode }) => {
  const getText = (node: any): string => {
    if (typeof node === 'string') return node;
    if (typeof node === 'number') return String(node);
    if (Array.isArray(node)) return node.map(getText).join('');
    if (node?.props?.children) return getText(node.props.children);
    return '';
  };

  const fullText = getText(children);
  // Matches timestamps like 0:09, 12:34, 1:23:45 at the start of the string
  const timestampRegex = /^(\d{1,2}:\d{2}(?::\d{2})?)\s*(.*)/;
  const match = fullText.match(timestampRegex);

  // Matches "-Anime:", "Game : ", etc. but not "http:" or "https:"
  const categoryRegex = /^(-?\s*(?!http|https)[a-zA-Z0-9_]+)\s*:\s*(.*)/i;
  const categoryMatch = fullText.match(categoryRegex);

  if (match) {
    const timestamp = match[1];
    const rest = match[2].trim();
    
    // Try to remove the timestamp from the actual children to avoid duplication
    const restNodes = React.Children.map(children, (child, index) => {
      if (index === 0 && typeof child === 'string') {
        const tsMatch = child.match(/^(\d{1,2}:\d{2}(?::\d{2})?)\s*(.*)/);
        if (tsMatch) return tsMatch[2].trim();
      }
      return child;
    });

    return (
      <span className="flex items-start gap-3 w-full break-words">
        <span className="text-emerald-400 font-mono shrink-0 font-bold">{timestamp}</span>
        {rest ? (
          <ClickToCopy text={rest} className="flex-1">
            {restNodes}
          </ClickToCopy>
        ) : null}
      </span>
    );
  }

  if (categoryMatch) {
    const textToCopy = categoryMatch[2].trim();
    return (
      <ClickToCopy text={textToCopy} className="w-full">
        {children}
      </ClickToCopy>
    );
  }

  return (
    <ClickToCopy text={fullText} className="w-full">
      {children}
    </ClickToCopy>
  );
};

const CopyableListItem = ({ children }: { children: React.ReactNode }) => {
  return (
    <li className="relative py-3 px-5 transition-all list-none border-l-4 border-white/10 hover:border-emerald-500 bg-white/[0.02] hover:bg-white/[0.05] flex items-start gap-4 my-3 font-mono text-sm shadow-[4px_4px_0_transparent] hover:shadow-[4px_4px_0_#10b981]">
      <span className="mt-0.5 text-[10px] text-emerald-500 shrink-0">►</span>
      <div className="flex-1 min-w-0 break-words text-white/80">
        <FormattedLine>{children}</FormattedLine>
      </div>
    </li>
  );
};

const VideoEmbed = ({ url }: { url: string }) => {
  const isYoutube = url.includes('youtube.com') || url.includes('youtu.be');
  const isOdysee = url.includes('odysee.com');

  let embedUrl = '';
  if (isYoutube) {
    const id = url.includes('v=') ? url.split('v=')[1].split('&')[0] : url.split('/').pop();
    embedUrl = `https://www.youtube.com/embed/${id}`;
  } else if (isOdysee) {
    // Odysee embed format: https://odysee.com/$/embed/name/id
    embedUrl = url.replace('odysee.com/', 'odysee.com/$/embed/');
  }

  if (!embedUrl) return <a href={url} className="text-emerald-400 hover:text-black hover:bg-emerald-400 py-0.5 px-1 font-bold no-underline transition-colors">{url}</a>;

  return (
    <div className="relative aspect-video w-full bg-black border border-white/20 overflow-hidden my-12 shadow-[8px_8px_0_#10b981] group">
      <iframe
        src={embedUrl}
        className="absolute inset-0 w-full h-full"
        allowFullScreen
        title="Video player"
      />
    </div>
  );
};

// --- Pages ---

const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const PostCard = ({ post, index }: { post: PostMetadata; index: number }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: index * 0.05, duration: 0.4, ease: "easeOut" }}
      className="group relative h-full"
    >
      <Link to={`/post/${post.id}`} className="block h-full">
        <div className="relative h-full aspect-video bg-black border border-white/20 transition-all duration-300 group-hover:-translate-y-1 group-hover:-translate-x-1 group-hover:shadow-[8px_8px_0px_#10b981] group-hover:border-emerald-500 overflow-hidden flex flex-col">
          {/* Skeleton / Placeholder */}
          {!isLoaded && (
            <div className="absolute inset-0 bg-white/5 animate-pulse flex items-center justify-center z-0">
              <div className="w-8 h-8 md:w-12 md:h-12 border-2 border-emerald-500/20" />
            </div>
          )}

          <div className="flex-1 relative w-full h-full min-h-0">
            <img
              src={post.thumbnail}
              alt={post.title}
              onLoad={() => setIsLoaded(true)}
              onError={() => setIsLoaded(true)}
              className={cn(
                "absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out filter md:grayscale md:group-hover:grayscale-0",
                isLoaded ? "opacity-100 group-hover:scale-105" : "opacity-0 scale-110"
              )}
              referrerPolicy="no-referrer"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-100 z-10 pointer-events-none" />

            <div className="absolute bottom-0 left-0 p-5 md:p-6 w-full z-20">
              <div className="flex flex-wrap gap-2 mb-3">
                <div className="inline-block bg-black text-emerald-500 px-2 py-1 text-[10px] font-mono tracking-widest uppercase border border-emerald-500/30">
                  {post.id}
                </div>
                {post.tags?.slice(0, 2).map((tag, i) => (
                  <div key={i} className="inline-block bg-white/5 text-white/70 px-2 py-1 text-[10px] font-mono tracking-widest uppercase border border-white/10 backdrop-blur-sm shadow-sm">
                    {tag}
                  </div>
                ))}
              </div>
              <h2 className="text-xl md:text-2xl font-display font-black leading-none uppercase tracking-tighter group-hover:text-emerald-400 transition-colors drop-shadow-md">
                {post.title}
              </h2>
            </div>
            
            <div className="absolute top-0 right-0 bg-emerald-500 text-black px-3 py-1.5 md:px-4 md:py-2 font-mono text-[10px] md:text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all transform -translate-y-full group-hover:translate-y-0 z-20">
              OPEN PLAYLIST ►
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

const POSTS_PER_PAGE = 6;

const Home = () => {
  const [posts, setPosts] = useState<PostMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetch('/api/posts')
      .then(res => res.json())
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
    <div className="min-h-screen bg-[#030303] flex items-center justify-center">
      <motion.div 
        animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="w-12 h-12 border-2 border-emerald-500 rounded-full border-t-transparent"
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#030303] text-white flex flex-col relative overflow-hidden font-sans">
      {/* Background Mesh */}
      <div className="absolute inset-0 bg-grid-pattern pointer-events-none z-0 opacity-40 mix-blend-screen" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none z-0" />

      <div className="flex-grow px-6 md:px-12 lg:px-20 py-12 md:py-20 relative z-10">
        <header className="mb-20 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 md:gap-8">
          <div className="w-full md:w-auto">
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => window.location.reload()}
              className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-display font-bold uppercase tracking-tighter leading-[0.85] mb-6 cursor-pointer hover:opacity-80 transition-opacity"
            >
              Viking<br/><span className="text-emerald-500 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-emerald-600">Algeria</span>
            </motion.h1>
            <p className="text-white/40 max-w-sm text-[10px] md:text-xs uppercase tracking-[0.3em] font-mono leading-relaxed">
              Personal notes and resources for the Viking Algeria YouTube channel.
            </p>
          </div>

          <div className="relative w-full md:w-auto flex justify-start md:justify-end gap-4 items-center mt-6 md:mt-0">
            <div className={cn(
              "flex items-center gap-4 transition-all duration-500",
              isSearchOpen ? "w-[calc(100%-4rem)] md:w-96" : "w-12"
            )}>
              {isSearchOpen ? (
                <div className="relative w-full group">
                  <input
                    autoFocus
                    type="text"
                    placeholder="Search posts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
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
          <div className="mb-12">
            <h2 className="text-sm font-mono uppercase tracking-[0.4em] text-white/40 mb-4">
              Showing results for: <span className="text-emerald-500">{debouncedSearchQuery}</span>
            </h2>
            {filteredPosts.length === 0 && (
              <div className="py-20 text-center">
                <p className="text-white/20 uppercase tracking-widest font-mono">No posts found matching your search.</p>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {paginatedPosts.map((post, index) => (
            <PostCard key={post.id} post={post} index={index} />
          ))}
        </div>

        {totalPages > 1 && (
          <div className="mt-24 flex justify-center w-full px-4">
            <div className="inline-flex items-center gap-1 md:gap-2 bg-black/80 backdrop-blur-xl border border-white/10 p-1.5 md:p-2 shadow-[4px_4px_0_rgba(255,255,255,0.05)] md:shadow-[8px_8px_0_rgba(16,185,129,0.15)]">
              
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="w-12 h-12 flex items-center justify-center text-white/50 hover:text-emerald-400 hover:bg-white/5 disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-white/50 cursor-pointer disabled:cursor-not-allowed transition-all group"
                aria-label="Previous page"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              </button>
              
              <div className="hidden md:flex items-center gap-1">
                {(() => {
                  const pages = [];
                  const delta = 2; // Fixed delta for desktop
                  const left = currentPage - delta;
                  const right = currentPage + delta;
                  
                  for (let i = 1; i <= totalPages; i++) {
                    if (i === 1 || i === totalPages || (i >= left && i <= right)) {
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
                    } else if (i === left - 1 || i === right + 1) {
                      pages.push(
                        <span key={i} className="w-8 text-center text-white/20 font-mono text-xs tracking-widest shrink-0">..</span>
                      );
                    }
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

      <footer className="border-t border-white/10 p-12 text-center flex flex-col items-center gap-6">
        <p className="text-white/20 text-[10px] uppercase tracking-[0.4em] font-mono">
          VikingAlgeria &copy; {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
};

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<PostMetadata | null>(null);
  const [allPosts, setAllPosts] = useState<PostMetadata[]>([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    fetch('/api/posts')
      .then(res => res.json())
      .then(async (data: PostMetadata[]) => {
        setAllPosts(data);
        
        const found = data.find(p => p.id === id);
        if (found) {
          setPost(found);
          const contentRes = await fetch(`/posts/${found.file}`);
          let text = await contentRes.text();
          
          // Simple frontmatter strip
          if (text.startsWith('---')) {
            const parts = text.split('---');
            if (parts.length >= 3) {
              text = parts.slice(2).join('---').trim();
            }
          }
          
          setContent(text);
          window.scrollTo(0, 0);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading post:', err);
        setLoading(false);
      });
  }, [id]);

  const currentIndex = allPosts.findIndex(p => p.id === id);
  const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

  useEffect(() => {
    if (post) {
      document.title = `${post.title} | Viking Algeria`;
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', post.excerpt || `Read ${post.title} on Viking Algeria.`);
      }
    }
  }, [post]);

  if (loading) return (
    <div className="min-h-screen bg-[#030303] flex items-center justify-center">
      <div className="w-12 h-12 border-2 border-emerald-500 rounded-full border-t-transparent animate-spin" />
    </div>
  );

  if (!post) return (
    <div className="min-h-screen bg-[#030303] text-white flex flex-col items-center justify-center gap-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern pointer-events-none z-0 opacity-40 mix-blend-screen" />
      <h1 className="text-4xl font-display font-bold relative z-10">Post Not Found</h1>
      <Link to="/" className="text-emerald-500 hover:underline relative z-10">Back to Home</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#030303] text-white flex flex-col relative overflow-hidden font-sans">
      <div className="absolute inset-0 bg-grid-pattern pointer-events-none z-0 opacity-20 mix-blend-screen" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none z-0" />

      {/* Reading Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 h-1 bg-emerald-500 z-[60] origin-left"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Floating Header */}
      <header className="fixed top-0 left-0 right-0 z-50 p-6 flex justify-between items-center pointer-events-none">
        <button 
          onClick={() => navigate('/')}
          className="p-3 bg-black border border-white/20 hover:border-emerald-500 hover:shadow-[4px_4px_0_#10b981] transition-all pointer-events-auto flex items-center group cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5 text-white group-hover:-translate-x-1 transition-transform group-hover:text-emerald-400" />
        </button>
        <div className="pointer-events-auto">
          <CopyLinkButton url={window.location.href} />
        </div>
      </header>

      <main className="flex-grow max-w-3xl mx-auto px-6 md:px-12 pt-32 pb-24 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="mb-12">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-black uppercase tracking-tighter mb-6 leading-none text-white break-words drop-shadow-md">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-[10px] md:text-xs font-mono font-bold uppercase tracking-[0.2em] text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5">
                {post.id}
              </span>
              {post.tags?.map((tag, i) => (
                <span key={i} className="text-[10px] md:text-xs font-mono font-bold uppercase tracking-[0.2em] text-white/70 bg-white/5 border border-white/10 px-3 py-1.5 backdrop-blur-sm">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {post.videoUrl && <VideoEmbed url={post.videoUrl} />}
          {post.type === 'md' ? (
            <div className="prose prose-invert prose-emerald max-w-none break-words">
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkBreaks]}
                components={{
                  li: ({ children }) => <CopyableListItem>{children}</CopyableListItem>,
                  a: ({ href, children }) => {
                    const isVideo = href && (href.includes('youtube.com') || href.includes('youtu.be') || href.includes('odysee.com'));
                    if (isVideo) {
                      return <VideoEmbed url={href} />;
                    }
                    return <a href={href} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300 underline underline-offset-4 break-all">{children}</a>;
                  },
                  img: ({ src, alt }) => (
                    <div className="my-16 -mx-4 md:-mx-8 group bg-black border border-white/20 shadow-[8px_8px_0_#10b981] overflow-hidden">
                      <div className="relative aspect-video w-full">
                        <img 
                          src={src} 
                          alt={alt} 
                          className="absolute inset-0 w-full h-full object-cover md:grayscale transition-all duration-500 md:group-hover:grayscale-0" 
                          referrerPolicy="no-referrer"
                          loading="lazy"
                        />
                      </div>
                      {alt && <p className="text-left text-xs text-emerald-500 p-4 font-mono uppercase tracking-widest border-t border-white/20 bg-black/50">{alt}</p>}
                    </div>
                  ),
                  h1: ({ children }) => <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold uppercase tracking-tighter mb-8 md:mb-12 leading-none text-white break-words">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-xl md:text-2xl font-display font-bold mt-12 md:mt-16 mb-4 md:mb-6 text-emerald-500 uppercase tracking-widest break-words">{children}</h2>,
                  p: ({ children }) => (
                    <div className="text-base md:text-lg text-white/70 leading-relaxed mb-4 break-words">
                      <FormattedLine>{children}</FormattedLine>
                    </div>
                  ),
                }}
              >
                {content}
              </ReactMarkdown>
            </div>
          ) : (
            <div 
              className="html-post-content"
              dangerouslySetInnerHTML={{ __html: content }}
              onClick={(e) => {
                const target = e.target as HTMLElement;
                if (target.tagName === 'LI') {
                  navigator.clipboard.writeText(target.innerText);
                  const originalText = target.innerText;
                  target.innerText = 'Copied!';
                  target.classList.add('text-emerald-400');
                  setTimeout(() => {
                    target.innerText = originalText;
                    target.classList.remove('text-emerald-400');
                  }, 2000);
                }
              }}
            />
          )}

          {/* Next/Prev Navigation */}
          <div className="mt-24 pt-16 border-t border-white/20 grid grid-cols-1 md:grid-cols-2 gap-6 relative">
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="absolute -top-16 left-1/2 -translate-x-1/2 p-3 bg-black border border-white/20 hover:border-emerald-500 hover:shadow-[4px_4px_0_#10b981] transition-all flex items-center justify-center group"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-5 h-5 text-white group-hover:text-emerald-400 group-hover:-translate-y-1 transition-all" />
            </button>
            {nextPost ? (
              <Link 
                to={`/post/${nextPost.id}`}
                className="group p-6 bg-black border border-white/20 hover:border-emerald-500 hover:shadow-[4px_4px_0_#10b981] transition-all flex flex-col gap-4 text-left"
              >
                <div className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4 text-emerald-500 group-hover:-translate-x-1 transition-transform" />
                  <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/50 font-mono">Older Post</span>
                </div>
                <span className="text-xl md:text-2xl font-display font-bold uppercase tracking-tight group-hover:text-emerald-400 transition-colors">
                  {nextPost.title}
                </span>
              </Link>
            ) : <div />}

            {prevPost ? (
              <Link 
                to={`/post/${prevPost.id}`}
                className="group p-6 bg-black border border-white/20 hover:border-emerald-500 hover:shadow-[4px_4px_0_#10b981] transition-all flex flex-col gap-4 text-right items-end"
              >
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/50 font-mono">Newer Post</span>
                  <ArrowRight className="w-4 h-4 text-emerald-500 group-hover:translate-x-1 transition-transform" />
                </div>
                <span className="text-xl md:text-2xl font-display font-bold uppercase tracking-tight group-hover:text-emerald-400 transition-colors">
                  {prevPost.title}
                </span>
              </Link>
            ) : <div />}
          </div>
        </motion.div>
      </main>

      <footer className="border-t border-white/10 p-12 text-center flex flex-col items-center gap-6">
        <Link to="/" className="group flex items-center gap-2 text-emerald-500 font-bold uppercase tracking-widest text-sm hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>
        <p className="text-white/20 text-[10px] uppercase tracking-[0.4em] font-mono">
          VikingAlgeria &copy; {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <div className="relative min-h-screen pb-24">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/post/:id" element={<PostDetail />} />
        </Routes>
        <MusicPlayer />
      </div>
    </Router>
  );
}
