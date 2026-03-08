/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  ArrowRight,
  Copy, 
  Check, 
  X,
  ChevronRight,
  Search
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

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
    <button
      onClick={handleCopy}
      aria-label="Copy link"
      className="p-2 md:p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all flex items-center gap-2 group"
    >
      {copied ? <Check className="w-4 h-4 md:w-5 md:h-5 text-emerald-400" /> : <Copy className="w-4 h-4 md:w-5 md:h-5 text-white" />}
      <span className="text-[10px] md:text-xs font-medium text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Copy Link</span>
    </button>
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
  const getText = (node: React.ReactNode): string => {
    if (typeof node === 'string') return node;
    if (typeof node === 'number') return String(node);
    if (Array.isArray(node)) return node.map(getText).join('');
    if (React.isValidElement(node) && node.props.children) {
      return getText(node.props.children);
    }
    return '';
  };

  const fullText = getText(children);
  // Matches timestamps like 0:09, 12:34, 1:23:45 at the start of the string
  const timestampRegex = /^(\d{1,2}:\d{2}(?::\d{2})?)\s*(.*)/;
  const match = fullText.match(timestampRegex);

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

  return (
    <ClickToCopy text={fullText} className="w-full">
      {children}
    </ClickToCopy>
  );
};

const CopyableListItem = ({ children }: { children: React.ReactNode }) => {
  return (
    <li className="relative py-1 px-2 transition-colors list-none">
      <div className="flex items-start gap-3">
        <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-emerald-500/50 shrink-0" />
        <div className="flex-1 min-w-0 break-words">
          <FormattedLine>{children}</FormattedLine>
        </div>
      </div>
    </li>
  );
};

// --- Pages ---

const PostCard = ({ post, index }: { post: PostMetadata; index: number }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <motion.div
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: index * 0.1 }}
      className="group relative"
    >
      <Link to={`/post/${post.id}`} className="block">
        <div className="relative aspect-video md:aspect-[4/5] rounded-3xl overflow-hidden bg-white/5 border border-white/10 transition-transform duration-500 group-hover:scale-[0.98]">
          {/* Skeleton / Placeholder */}
          {!isLoaded && (
            <div className="absolute inset-0 bg-white/5 animate-pulse flex items-center justify-center">
              <div className="w-12 h-12 border-2 border-white/10 rounded-full" />
            </div>
          )}

          <img
            src={post.thumbnail}
            alt={post.title}
            onLoad={() => setIsLoaded(true)}
            className={cn(
              "absolute inset-0 w-full h-full object-cover transition-all duration-700",
              isLoaded ? "opacity-60 group-hover:opacity-100 scale-100" : "opacity-0 scale-110"
            )}
            referrerPolicy="no-referrer"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

          <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full">
            <h2 className="text-2xl md:text-3xl font-bold leading-tight group-hover:text-emerald-400 transition-colors">
              {post.title}
            </h2>
          </div>

          <div className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0">
            <ChevronRight className="w-6 h-6" />
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
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetch('/posts-manifest.json')
      .then(res => res.json())
      .then((data: PostMetadata[]) => {
        setPosts(data.sort((a, b) => (b.numericId || 0) - (a.numericId || 0)));
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading manifest:', err);
        setLoading(false);
      });
  }, []);

  // Optimized thumbnail enhancement: only for posts on current page
  useEffect(() => {
    if (posts.length === 0) return;

    const enhanceThumbnails = async () => {
      const start = (currentPage - 1) * POSTS_PER_PAGE;
      const end = currentPage * POSTS_PER_PAGE;
      const visiblePosts = posts.slice(start, end);

      const updatedPosts = [...posts];
      let changed = false;

      await Promise.all(visiblePosts.map(async (post, index) => {
        const globalIndex = start + index;
        if (post.thumbnail) return;

        try {
          const contentRes = await fetch(`/posts/${post.file}`);
          const content = await contentRes.text();
          
          let thumbnail = `https://picsum.photos/seed/${post.id}/800/450`;
          
          // Try to find video
          const ytMatch = content.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
          if (ytMatch) {
            thumbnail = `https://img.youtube.com/vi/${ytMatch[1]}/maxresdefault.jpg`;
          } else {
            // Try to find image
            const imgMatch = content.match(/!\[.*?\]\((.*?)\)/) || content.match(/<img.*?src="(.*?)"/);
            if (imgMatch) {
              thumbnail = imgMatch[1];
            }
          }

          updatedPosts[globalIndex] = { ...post, thumbnail };
          changed = true;
        } catch (e) {
          console.error('Error fetching post content for thumbnail:', e);
        }
      }));

      if (changed) {
        setPosts(updatedPosts);
      }
    };

    enhanceThumbnails();
  }, [currentPage, posts]);

  useEffect(() => {
    document.title = 'Viking Algeria | YouTube Channel Notes';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Personal notes and resources for the Viking Algeria YouTube channel.');
    }
  }, []);

  // Reset to first page when searching
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  if (loading) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
      <motion.div 
        animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="w-12 h-12 border-2 border-emerald-500 rounded-full border-t-transparent"
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col">
      <div className="flex-grow px-6 md:px-12 lg:px-20 py-12 md:py-20">
        <header className="mb-20 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 md:gap-8">
          <div className="w-full md:w-auto">
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter leading-[0.85] mb-6"
            >
              Viking<br/><span className="text-emerald-500">Algeria</span>
            </motion.h1>
            <p className="text-white/40 max-w-sm text-[10px] md:text-xs uppercase tracking-[0.3em] font-mono leading-relaxed">
              Personal notes and resources for the Viking Algeria YouTube channel.
            </p>
          </div>

          <div className="relative w-full md:w-auto flex justify-start md:justify-end">
            <div className={cn(
              "flex items-center gap-4 transition-all duration-500",
              isSearchOpen ? "w-full md:w-80" : "w-10 md:w-12"
            )}>
              {isSearchOpen ? (
                <div className="relative w-full group">
                  <input
                    autoFocus
                    type="text"
                    placeholder="Search posts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 md:py-3 px-6 pl-12 focus:outline-none focus:border-emerald-500/50 transition-all font-mono text-[10px] md:text-sm uppercase tracking-widest"
                  />
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 md:w-4 md:h-4 text-white/40 group-focus-within:text-emerald-500 transition-colors" />
                  <button 
                    onClick={() => {
                      setIsSearchOpen(false);
                      setSearchQuery('');
                    }}
                    aria-label="Close search"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                  >
                    <X className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setIsSearchOpen(true)}
                  aria-label="Search posts"
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-emerald-500/30 transition-all group"
                >
                  <Search className="w-4 h-4 md:w-5 md:h-5 text-white/40 group-hover:text-emerald-500 transition-colors" />
                </button>
              )}
            </div>
          </div>
        </header>

        {searchQuery && (
          <div className="mb-12">
            <h2 className="text-sm font-mono uppercase tracking-[0.4em] text-white/40 mb-4">
              Showing results for: <span className="text-emerald-500">{searchQuery}</span>
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
          <div className="mt-20 flex flex-col items-center gap-8">
            <div className="flex items-center gap-2 md:gap-4">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-3 md:p-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed transition-all group"
                aria-label="Previous page"
              >
                <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 group-hover:-translate-x-1 transition-transform" />
              </button>
              
              <div className="flex items-center gap-1 md:gap-2">
                {(() => {
                  const pages = [];
                  const delta = window.innerWidth < 768 ? 1 : 2;
                  const left = currentPage - delta;
                  const right = currentPage + delta;
                  
                  for (let i = 1; i <= totalPages; i++) {
                    if (i === 1 || i === totalPages || (i >= left && i <= right)) {
                      pages.push(
                        <button
                          key={i}
                          onClick={() => setCurrentPage(i)}
                          className={cn(
                            "w-10 h-10 md:w-12 md:h-12 rounded-full border transition-all font-mono text-[10px] md:text-xs",
                            currentPage === i 
                              ? "bg-emerald-500 border-emerald-500 text-black font-bold" 
                              : "bg-white/5 border-white/10 text-white/40 hover:text-white hover:border-white/30"
                          )}
                        >
                          {i.toString().padStart(2, '0')}
                        </button>
                      );
                    } else if (i === left - 1 || i === right + 1) {
                      pages.push(
                        <span key={i} className="w-6 md:w-8 text-center text-white/20 font-mono text-[10px] md:text-xs">...</span>
                      );
                    }
                  }
                  return pages;
                })()}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="p-3 md:p-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed transition-all group"
                aria-label="Next page"
              >
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            
            <p className="text-[10px] uppercase tracking-[0.3em] font-mono text-white/20">
              Page {currentPage} of {totalPages}
            </p>
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
    fetch('/posts-manifest.json')
      .then(res => res.json())
      .then(async (data: PostMetadata[]) => {
        const sorted = data.sort((a, b) => (b.numericId || 0) - (a.numericId || 0));
        setAllPosts(sorted);
        
        const found = sorted.find(p => p.id === id);
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
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
      <div className="w-12 h-12 border-2 border-emerald-500 rounded-full border-t-transparent animate-spin" />
    </div>
  );

  if (!post) return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold">Post Not Found</h1>
      <Link to="/" className="text-emerald-500 hover:underline">Back to Home</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col">
      {/* Reading Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 h-1 bg-emerald-500 z-[60] origin-left"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Floating Header */}
      <header className="fixed top-0 left-0 right-0 z-50 p-4 md:p-8 flex justify-between items-center pointer-events-none">
        <button 
          onClick={() => navigate('/')}
          aria-label="Go back"
          className="p-2.5 md:p-3 rounded-full bg-black/60 backdrop-blur-xl border border-white/10 hover:bg-white/10 transition-all pointer-events-auto shadow-lg"
        >
          <ArrowLeft className="w-5 h-5 md:w-6 md:h-6" />
        </button>
        <div className="pointer-events-auto">
          <CopyLinkButton url={window.location.href} />
        </div>
      </header>

      <main className="flex-grow max-w-3xl mx-auto px-6 md:px-12 pt-32 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {post.type === 'md' ? (
            <div className="prose prose-invert prose-emerald max-w-none break-words">
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkBreaks]}
                components={{
                  li: ({ children }) => <CopyableListItem>{children}</CopyableListItem>,
                  a: ({ href, children }) => {
                    return <a href={href} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300 underline underline-offset-4 break-all">{children}</a>;
                  },
                  img: ({ src, alt }) => (
                    <div className="my-12 -mx-6 md:-mx-12">
                      <img 
                        src={src} 
                        alt={alt} 
                        className="w-full rounded-3xl shadow-2xl border border-white/10" 
                        referrerPolicy="no-referrer"
                        loading="lazy"
                      />
                      {alt && <p className="text-center text-sm text-white/40 mt-4 font-mono uppercase tracking-widest">{alt}</p>}
                    </div>
                  ),
                  h1: ({ children }) => <h1 className="text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter mb-8 md:mb-12 leading-none text-white break-words">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-xl md:text-2xl font-bold mt-12 md:mt-16 mb-4 md:mb-6 text-emerald-500 uppercase tracking-widest break-words">{children}</h2>,
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
          <div className="mt-24 pt-12 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 gap-6">
            {nextPost ? (
              <Link 
                to={`/post/${nextPost.id}`}
                className="group p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-emerald-500/50 transition-all flex flex-col gap-4 text-left"
              >
                <span className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-mono">Older Post</span>
                <span className="text-xl font-bold group-hover:text-emerald-400 transition-colors flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  {nextPost.title}
                </span>
              </Link>
            ) : <div />}

            {prevPost ? (
              <Link 
                to={`/post/${prevPost.id}`}
                className="group p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-emerald-500/50 transition-all flex flex-col gap-4 text-right items-end"
              >
                <span className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-mono">Newer Post</span>
                <span className="text-xl font-bold group-hover:text-emerald-400 transition-colors flex items-center gap-2">
                  {prevPost.title}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/post/:id" element={<PostDetail />} />
      </Routes>
    </Router>
  );
}
