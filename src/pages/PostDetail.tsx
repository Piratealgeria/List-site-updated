import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, ArrowUp, Music } from 'lucide-react';
import { PostMetadata } from '../types';
import { CopyLinkButton } from '../components/CopyLinkButton';
import { VideoEmbed, CopyableListItem, FormattedLine } from '../components/MarkdownComponents';

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
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    fetch('/posts.json')
      .then(async res => {
         const text = await res.text();
         if (text.trim().startsWith('<!DOCTYPE html>')) {
           throw new Error('Received HTML instead of JSON.');
         }
         return JSON.parse(text);
      })
      .then(async (data: PostMetadata[]) => {
        setAllPosts(data);
        
        const found = data.find(p => p.id === id);
        if (found) {
          setPost(found);
          let text = found.content || '';
          
          if (!text) {
             const contentRes = await fetch(`/posts/${encodeURIComponent(found.file)}`);
             if (contentRes.ok) {
                 text = await contentRes.text();
             } else {
                 text = "Could not load post content. Please try again.";
             }
          }
          
          if (text.trim().startsWith('<!DOCTYPE html>')) {
             text = "Could not load post content. Server returned HTML.";
          }
          
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
                      <div className="relative aspect-video w-full">
                        <img 
                          src={src} 
                          alt={alt} 
                          className="absolute inset-0 w-full h-full object-cover md:grayscale transition-all duration-500 md:group-hover:grayscale-0" 
                          referrerPolicy="no-referrer"
                          loading="lazy"
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
                }}
              >
                {content}
              </ReactMarkdown>
            </div>
          ) : (
            <div 
              className="html-post-content prose prose-invert max-w-none"
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
