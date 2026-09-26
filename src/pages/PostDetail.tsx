import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, ArrowUp, Music } from 'lucide-react';
import { PostMetadata } from '../types';
import { CopyLinkButton } from '../components/CopyLinkButton';
import { VideoEmbed, CopyableListItem, FormattedLine, CodeBlock } from '../components/MarkdownComponents';
import { CopyHint } from '../components/CopyHint';
import { fetchPosts, fetchPostContent } from '../api';
import { sanitizeHtml, copyToClipboard } from '../utils';

export const PostDetail = () => {
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
      const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    fetchPosts()
      .then(async (data: PostMetadata[]) => {
        setAllPosts(data);
        
        const found = data.find(p => p.id === id);
        if (found) {
          setPost(found);
          let text = found.content || '';
          
          if (!text) {
             try {
               text = await fetchPostContent(found.file);
             } catch (e) {
               text = "Could not load post content. Please try again.";
             }
          }
          
          // Robust frontmatter strip (handles horizontal rules inside body without truncating)
          if (text.startsWith('---')) {
            text = text.replace(/^---[\r\n]+[\s\S]*?[\r\n]+---[\r\n]*/, '').trim();
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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input, textarea, or select
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA' ||
        document.activeElement?.tagName === 'SELECT' ||
        (document.activeElement as HTMLElement)?.isContentEditable
      ) {
        return;
      }

      if (e.key === 'Escape') {
        navigate('/');
        return;
      }

      // Left arrow navigates to nextPost (Older post on the left card)
      // Right arrow navigates to prevPost (Newer post on the right card)
      if (e.key === 'ArrowLeft' && nextPost) {
        navigate(`/post/${nextPost.id}`);
      } else if (e.key === 'ArrowRight' && prevPost) {
        navigate(`/post/${prevPost.id}`);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prevPost, nextPost, navigate]);

  if (loading) return (
    <div className="min-h-screen bg-transparent flex items-center justify-center">
      <div className="w-12 h-12 border-2 border-emerald-500 rounded-full border-t-transparent animate-spin" />
    </div>
  );

  if (!post) return (
    <div className="min-h-screen bg-transparent text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="border border-red-500/30 bg-red-500/5 p-8 max-w-lg w-full relative overflow-hidden shadow-[0_0_30px_rgba(239,68,68,0.1)]">
        <div className="absolute top-0 left-0 w-full h-1 bg-red-500/50" />
        <div className="flex items-center gap-3 mb-6">
          <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
          <span className="font-mono text-sm text-red-500 font-bold uppercase tracking-widest">FATAL_ERROR: 404</span>
        </div>
        <p className="text-white/60 font-mono text-sm leading-relaxed mb-8 break-words">
          $ curl https://viking.algeria/post/{id} <br/>
          <span className="text-red-400">Error: Remote host rejected connection.</span><br/>
          <span className="text-white/40">Reason: Block does not exist in the current timeline.</span>
        </p>
        <Link 
          to="/" 
          className="inline-block bg-white/5 border border-white/20 px-6 py-3 font-mono text-xs uppercase tracking-widest hover:border-emerald-500 hover:text-emerald-400 transition-colors"
        >
          Return to Base
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-transparent text-white flex flex-col relative overflow-hidden font-sans">
      {/* Reading Progress Bar */}
      <CopyHint />
      <motion.div 
        className="fixed top-0 left-0 h-1 bg-emerald-500 z-[60] origin-left"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Floating Header */}
      <header className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
        <div className="max-w-4xl mx-auto p-4 md:p-6 flex justify-between items-center w-full">
          <button 
            onClick={() => navigate('/')}
            className="p-3 bg-black border border-white/20 hover:border-emerald-500 hover:shadow-[4px_4px_0_#10b981] transition-all pointer-events-auto flex items-center group cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 text-white group-hover:-translate-x-1 transition-transform group-hover:text-emerald-400" />
          </button>
          <div className="pointer-events-auto flex items-center gap-2 md:gap-4">
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('toggle-music-player'))}
              className="p-3 bg-black border border-white/20 hover:border-emerald-500 hover:shadow-[4px_4px_0_#10b981] transition-all flex items-center group cursor-pointer"
              aria-label="Toggle music player"
            >
              <Music className="w-5 h-5 text-white/40 group-hover:text-emerald-500 transition-colors" />
            </button>
            <CopyLinkButton url={window.location.href} />
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-3xl mx-auto px-6 md:px-12 pt-32 pb-24 relative z-10 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="mb-12 text-center md:text-left">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-black uppercase tracking-tighter mb-6 leading-none text-white break-words drop-shadow-md">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
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
                      <div className="relative w-full flex justify-center bg-white/5 min-h-[120px] items-center">
                        <img 
                          src={src} 
                          alt={alt} 
                          className="w-full h-auto object-contain max-h-[80vh] md:grayscale transition-all duration-500 md:group-hover:grayscale-0" 
                          referrerPolicy="no-referrer"
                          loading="lazy"
                          onError={(e) => {
                            const target = e.currentTarget;
                            target.style.display = 'none';
                            const parent = target.parentElement;
                            if (parent && !parent.querySelector('.img-fallback-block')) {
                              const fallback = document.createElement('div');
                              fallback.className = 'img-fallback-block p-8 text-center font-mono text-xs text-white/40 uppercase tracking-widest';
                              fallback.innerText = '[IMAGE_UNAVAILABLE_OR_OFFLINE]';
                              parent.appendChild(fallback);
                            }
                          }}
                        />
                      </div>
                      {alt && <p className="text-center md:text-left text-xs text-emerald-500 p-4 font-mono uppercase tracking-widest border-t border-white/20 bg-black/50">{alt}</p>}
                    </div>
                  ),
                  h1: ({ children }) => <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold uppercase tracking-tighter mb-8 md:mb-12 leading-none text-white break-words text-center md:text-left">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-xl md:text-2xl font-display font-bold mt-12 md:mt-16 mb-4 md:mb-6 text-emerald-500 uppercase tracking-widest break-words text-center md:text-left">{children}</h2>,
                  p: ({ children }) => (
                    <div className="text-base md:text-lg text-white/70 leading-relaxed mb-4 break-words">
                      <FormattedLine>{children}</FormattedLine>
                    </div>
                  ),
                  code: ({ node, inline, className, children, ...props }: any) => {
                    const match = /language-(\w+)/.exec(className || '');
                    const isCodeBlock = !inline && (Boolean(match) || (typeof children === 'string' && children.includes('\n')));
                    return isCodeBlock ? (
                      <CodeBlock className={className} {...props}>
                        {children}
                      </CodeBlock>
                    ) : (
                      <code className="bg-white/10 px-1.5 py-0.5 rounded-sm font-mono text-emerald-400 text-sm" {...props}>
                        {children}
                      </code>
                    );
                  },
                  pre: ({ children }) => <>{children}</>, // Wrapper is handled by code component
                }}
              >
                {content}
              </ReactMarkdown>
            </div>
          ) : (
            <div 
              className="html-post-content prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }}
              onClick={async (e) => {
                const target = (e.target as HTMLElement).closest('li');
                if (target && !((e.target as HTMLElement).closest('a'))) {
                  const textToCopy = target.innerText;
                  const success = await copyToClipboard(textToCopy);
                  if (success) {
                    target.classList.add('outline', 'outline-1', 'outline-emerald-400', 'bg-emerald-500/10');
                    setTimeout(() => {
                      target.classList.remove('outline', 'outline-1', 'outline-emerald-400', 'bg-emerald-500/10');
                    }, 1500);
                  }
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
                className="group p-6 bg-black border border-white/20 hover:border-emerald-500 hover:shadow-[4px_4px_0_#10b981] transition-all flex flex-col gap-4 text-center md:text-left"
              >
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <ArrowLeft className="w-4 h-4 text-emerald-500 group-hover:-translate-x-1 transition-transform" />
                  <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/50 font-mono">Older Post</span>
                </div>
                <span className="text-xl md:text-2xl font-display font-bold uppercase tracking-tight group-hover:text-emerald-400 transition-colors">
                  {nextPost.title}
                </span>
              </Link>
            ) : <div className="hidden md:block" />}

            {prevPost ? (
              <Link 
                to={`/post/${prevPost.id}`}
                className="group p-6 bg-black border border-white/20 hover:border-emerald-500 hover:shadow-[4px_4px_0_#10b981] transition-all flex flex-col gap-4 text-center md:text-right md:items-end"
              >
                <div className="flex items-center justify-center md:justify-end gap-2">
                  <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/50 font-mono">Newer Post</span>
                  <ArrowRight className="w-4 h-4 text-emerald-500 group-hover:translate-x-1 transition-transform" />
                </div>
                <span className="text-xl md:text-2xl font-display font-bold uppercase tracking-tight group-hover:text-emerald-400 transition-colors">
                  {prevPost.title}
                </span>
              </Link>
            ) : <div className="hidden md:block" />}
          </div>
        </motion.div>
      </main>

      <footer className="border-t border-white/10 p-12 text-center flex flex-col items-center gap-6 mt-auto">
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
