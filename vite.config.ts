import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig, loadEnv} from 'vite';
import matter from 'gray-matter';

// Plugin to handle posts metadata automatically
const postsPlugin = () => {
  const virtualModuleId = 'virtual:posts';
  const resolvedVirtualModuleId = '\0' + virtualModuleId;

  const isImageUrl = (url: string) => /\.(jpg|jpeg|png|webp|gif|svg)(\?.*)?$/i.test(url);
  const getYouTubeThumbnail = (url: string) => {
    const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/);
    return ytMatch ? `https://img.youtube.com/vi/${ytMatch[1]}/maxresdefault.jpg` : null;
  };
  const getOdyseeThumbnail = async (url: string) => {
    try {
      const res = await fetch(`https://odysee.com/$/oembed?url=${encodeURIComponent(url)}`);
      if (!res.ok) return null;
      const data = await res.json();
      return typeof data?.thumbnail_url === 'string' ? data.thumbnail_url : null;
    } catch {
      return null;
    }
  };

  const getPosts = async () => {
    const postsDir = path.resolve(__dirname, 'public/posts');
    if (!fs.existsSync(postsDir)) return [];

    const files = fs.readdirSync(postsDir);
    const posts = await Promise.all(files
      .filter(file => file.endsWith('.md'))
      .map(async file => {
        const filePath = path.join(postsDir, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        
        const { data, content: body } = matter(content);
        
        const metadata: any = {
          ...data,
          id: path.basename(file, '.md'), // Prioritize filename as ID for consistency
          file: file,
          type: 'md'
        };

        // Ensure numericId for sorting
        if (metadata.numericId === undefined || metadata.numericId === null) {
          metadata.numericId = parseInt(metadata.id.replace(/\D/g, '')) || 0;
        }
        if (typeof metadata.numericId === 'string') {
          metadata.numericId = parseInt(metadata.numericId);
        }
        
        if (!metadata.title) metadata.title = metadata.id;

        // Handle thumbnail logic based on user rules:
        // 1. If thumbnail tag exists (YouTube or Odysee), use it.
        // 2. If no thumbnail tag, use the first link in the post body.
        let thumbnail = metadata.thumbnail;
        let videoUrl: string | null = null;

        if (!thumbnail) {
          const linkMatch = body.match(/https?:\/\/[^\s\)\n"']+/);
          if (linkMatch) {
            thumbnail = linkMatch[0];
          }
        }

        if (thumbnail) {
          const ytThumb = getYouTubeThumbnail(thumbnail);
          if (ytThumb) {
            videoUrl = thumbnail;
            thumbnail = ytThumb;
          } else if (thumbnail.includes('odysee.com')) {
            videoUrl = thumbnail;
            const odyseeThumb = await getOdyseeThumbnail(thumbnail);
            if (odyseeThumb) {
              thumbnail = odyseeThumb;
            }
          }
        }

        if (!thumbnail || (!thumbnail.startsWith('http') && !isImageUrl(thumbnail)) || (thumbnail && !isImageUrl(thumbnail) && !thumbnail.includes('img.youtube.com'))) {
          thumbnail = `https://picsum.photos/seed/${metadata.id}/800/450`;
        }

        metadata.thumbnail = thumbnail;
        if (videoUrl) metadata.videoUrl = videoUrl;

        return metadata;
      }));
    return posts
      .sort((a, b) => (b.numericId || 0) - (a.numericId || 0));
  };

  return {
    name: 'posts-plugin',
    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId;
      }
    },
    async load(id) {
      if (id === resolvedVirtualModuleId) {
        const posts = await getPosts();
        return `export default ${JSON.stringify(posts)};`;
      }
    },
    handleHotUpdate({ file, server }) {
      if (file.includes('/public/posts/')) {
        server.ws.send({
          type: 'full-reload',
          path: '*'
        });
      }
    }
  };
};

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    base: env.VITE_BASE_URL || '/',
    plugins: [
      react(), 
      tailwindcss(),
      postsPlugin(),
      {
        name: 'copy-index-to-404',
        closeBundle() {
          const distDir = path.resolve(process.cwd(), 'dist');
          const indexPath = path.join(distDir, 'index.html');
          const path404 = path.join(distDir, '404.html');
          if (fs.existsSync(indexPath)) {
            fs.copyFileSync(indexPath, path404);
          }
        }
      }
    ],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
