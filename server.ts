import express from "express";
import { createServer as createViteServer } from "vite";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import axios from "axios";

// Simple in-memory cache for thumbnails, persisted to disk
const CACHE_FILE = path.join(process.cwd(), '.thumbnailCache.json');
let thumbnailCache = new Map<string, string>();
try {
  if (fs.existsSync(CACHE_FILE)) {
    const data = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'));
    thumbnailCache = new Map(Object.entries(data));
  }
} catch (e) {
  console.warn("Could not load thumbnail cache", e);
}

const saveThumbnailCache = () => {
  try {
    fs.writeFileSync(CACHE_FILE, JSON.stringify(Object.fromEntries(thumbnailCache)));
  } catch (e) {
    console.error("Could not save thumbnail cache", e);
  }
};

const fetchOgImage = async (url: string) => {
  if (!url || !url.startsWith('http')) return null;
  if (thumbnailCache.has(url)) return thumbnailCache.get(url);

  try {
    const isOdysee = url.includes('odysee.com');
    const targetUrl = isOdysee ? `https://odysee.com/$/oembed?url=${encodeURIComponent(url)}` : url;
    
    // Use a shorter timeout to prevent blocking the /api/posts request for too long
    const response = await axios.get(targetUrl, { 
      timeout: 5000,
      headers: { 
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': isOdysee ? 'application/json' : 'text/html,application/xhtml+xml'
      }
    });

    let imageUrl = null;
    if (isOdysee && response.data?.thumbnail_url) {
      imageUrl = response.data.thumbnail_url;
    } else if (!isOdysee) {
      const html = response.data;
      const ogImageMatch = html.match(/<meta.*?property="og:image".*?content="(.*?)".*?>/) || 
                         html.match(/<meta.*?content="(.*?)".*?property="og:image".*?>/);
      if (ogImageMatch) imageUrl = ogImageMatch[1];
    }

    if (imageUrl) {
      thumbnailCache.set(url, imageUrl);
      saveThumbnailCache();
      return imageUrl;
    }
  } catch (err: any) {
    if (err.code === 'ECONNABORTED' || err.message.includes('timeout')) {
      console.warn(`[Timeout] Could not fetch thumbnail for ${url}`);
    } else {
      console.error(`Error fetching thumbnail for ${url}:`, err.message);
    }
  }
  return null;
};

// In-memory cache for parsed post data, validates against mtime
const fileCache = new Map<string, {mtimeMs: number, post: any}>();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // API route to list posts
  app.get("/api/posts", async (req, res) => {
    console.log(`[${new Date().toISOString()}] GET /api/posts`);
    const postsDir = path.resolve(process.cwd(), "public", "posts");
    
    if (!fs.existsSync(postsDir)) {
      console.error(`Posts directory not found at: ${postsDir}`);
      return res.json([]);
    }

    try {
      const files = fs.readdirSync(postsDir);
      
      // Batch process files in small chunks to prevent Odysee rate limit/timeouts on first fetch
      const postsPromises = files
        .filter(file => file.endsWith(".md") || file.endsWith(".html"))
        .map(async file => {
          try {
            const filePath = path.join(postsDir, file);
            const stats = fs.statSync(filePath);
            const cached = fileCache.get(file);
            
            // Return from cache if file hasn't been modified
            if (cached && cached.mtimeMs === stats.mtimeMs) {
              return cached.post;
            }

            const fileContent = fs.readFileSync(filePath, "utf-8");
            const { data, content: body } = matter(fileContent);

            const getThumbnailFromUrl = (url: string) => {
              if (!url) return null;
              
              // YouTube - strictly 11 characters
              const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{11})(?![ \w-])/);
              if (ytMatch) return `https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg`;
              
              // Odysee - try to extract a 11-char ID which is often a YouTube ID
              const cleanUrl = url.split('?')[0];
              const odyseeMatch = cleanUrl.match(/odysee\.com\/.*\/([\w-]{11})(?::[a-f0-9]+)?$/i) || 
                                 cleanUrl.match(/odysee\.com\/.*?[:\/]([\w-]{11})(?::[a-f0-9]+)?$/i);
              if (odyseeMatch) return `https://img.youtube.com/vi/${odyseeMatch[1]}/hqdefault.jpg`;
              
              // If it's already an image URL
              if (/\.(jpg|jpeg|png|webp|gif|svg)(\?.*)?$/i.test(url)) return url;
              
              return null;
            };

            let thumbnail = "";
            let videoUrl = null;
            
            // PRIORITY 1: Frontmatter thumbnail tag
            if (data.thumbnail) {
              videoUrl = data.thumbnail;
              const thumbFromTag = getThumbnailFromUrl(data.thumbnail);
              if (thumbFromTag) {
                thumbnail = thumbFromTag;
              } else if (data.thumbnail.includes('odysee.com')) {
                const ogImage = await fetchOgImage(data.thumbnail);
                if (ogImage) thumbnail = ogImage;
              }
            }

            // PRIORITY 2: If no valid image/yt-thumb from tag, look in body
            if (!thumbnail) {
              const ytMatch = body.match(/(https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)[\w-]{11})(?![ \w-])/);
              const odyseeMatch = body.match(/(https?:\/\/(?:www\.)?odysee\.com\/[^\s<)\]"']+)/);
              
              if (ytMatch && (!odyseeMatch || body.indexOf(ytMatch[1]) < body.indexOf(odyseeMatch[1]))) {
                 videoUrl = videoUrl || ytMatch[1];
                 const idMatch = ytMatch[1].match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{11})/);
                 if(idMatch) thumbnail = `https://img.youtube.com/vi/${idMatch[1]}/hqdefault.jpg`;
              } else if (odyseeMatch) {
                 videoUrl = videoUrl || odyseeMatch[1];
                 const url = odyseeMatch[1];
                 const thumbFromTag = getThumbnailFromUrl(url);
                 if (thumbFromTag) {
                   thumbnail = thumbFromTag;
                 } else {
                   const ogImage = await fetchOgImage(url);
                   if (ogImage) thumbnail = ogImage;
                 }
              }
              
              if (!thumbnail && ytMatch) { // fallback to ytMatch if odysee failed
                 videoUrl = videoUrl || ytMatch[1];
                 const idMatch = ytMatch[1].match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{11})/);
                 if(idMatch) thumbnail = `https://img.youtube.com/vi/${idMatch[1]}/hqdefault.jpg`;
              }

              if (!thumbnail) {
                // Search for first image
                const imgMatch = body.match(/!\[.*?\]\((.*?)\)/) || body.match(/<img.*?src="(.*?)"/);
                if (imgMatch) {
                  thumbnail = imgMatch[1];
                }
              }
            }

            // FINAL FALLBACK: If still no valid image URL, use placeholder
            if (!thumbnail || (!thumbnail.includes('img.youtube.com') && !/\.(jpg|jpeg|png|webp|gif|svg)/i.test(thumbnail) && !thumbnail.startsWith('http'))) {
              thumbnail = `https://picsum.photos/seed/${data.id || file}/800/450`;
            }

            // Also check videoUrl validity
            const isValidVideoUrl = (url: string | null) => {
              if(!url) return false;
              return url.includes('youtube.com') || url.includes('youtu.be') || url.includes('odysee.com');
            };

            const postData = {
              id: data.id?.toString() || file.replace(/\.[^/.]+$/, ""),
              numericId: typeof data.id === 'number' ? data.id : parseInt(data.id as string) || 0,
              title: data.title || file.replace(/\.[^/.]+$/, ""),
              file: file,
              type: file.endsWith(".md") ? "md" : "html",
              thumbnail: thumbnail,
              videoUrl: isValidVideoUrl(videoUrl) ? videoUrl : (isValidVideoUrl(data.thumbnail) ? data.thumbnail : null),
              excerpt: data.excerpt || body.slice(0, 150).replace(/[#*`]/g, '').trim() + '...',
              tags: data.tags || []
            };

            // Cache the successfully parsed post data
            fileCache.set(file, { mtimeMs: stats.mtimeMs, post: postData });

            return postData;
          } catch (err) {
            console.error(`Error processing file ${file}:`, err);
            return null;
          }
        });

      // Execute sequentially or in small chunks? Current Promise.all is fully concurrent.
      // But since we use fileCache, most requests are skipped immediately.
      // We will loop to limit concurrency of any remaining un-cached fetches.
      const resolvedPosts = [];
      const CHUNK_SIZE = 5;
      for (let i = 0; i < postsPromises.length; i += CHUNK_SIZE) {
        const chunk = postsPromises.slice(i, i + CHUNK_SIZE);
        const results = await Promise.all(chunk);
        resolvedPosts.push(...results);
      }

      const posts = resolvedPosts
        .filter((p): p is any => p !== null)
        .sort((a, b) => (b.numericId || 0) - (a.numericId || 0));

      res.json(posts);
    } catch (error) {
      console.error("Error processing posts directory:", error);
      res.status(500).json({ error: "Failed to load posts" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
    app.get("*", (req, res) => {
      res.sendFile(path.join(process.cwd(), "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
