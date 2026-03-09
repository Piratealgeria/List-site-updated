import express from "express";
import { createServer as createViteServer } from "vite";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import axios from "axios";

// Simple in-memory cache for thumbnails
const thumbnailCache = new Map<string, string>();

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
      const postsPromises = files
        .filter(file => file.endsWith(".md") || file.endsWith(".html"))
        .map(async file => {
          try {
            const filePath = path.join(postsDir, file);
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

            const fetchOgImage = async (url: string) => {
              if (!url || !url.startsWith('http')) return null;
              if (thumbnailCache.has(url)) return thumbnailCache.get(url);

              try {
                const response = await axios.get(url, { 
                  timeout: 15000, // Increased timeout to 15s for slow Odysee responses
                  headers: { 
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8'
                  }
                });
                const html = response.data;
                const ogImageMatch = html.match(/<meta.*?property="og:image".*?content="(.*?)".*?>/) || 
                                   html.match(/<meta.*?content="(.*?)".*?property="og:image".*?>/);
                
                if (ogImageMatch) {
                  const imageUrl = ogImageMatch[1];
                  thumbnailCache.set(url, imageUrl);
                  return imageUrl;
                }
              } catch (err: any) {
                console.error(`Error fetching og:image for ${url}:`, err.message);
              }
              return null;
            };

            let thumbnail = "";
            
            // PRIORITY 1: Frontmatter thumbnail tag
            if (data.thumbnail) {
              const thumbFromTag = getThumbnailFromUrl(data.thumbnail);
              if (thumbFromTag) {
                thumbnail = thumbFromTag;
              } else if (data.thumbnail.includes('odysee.com')) {
                // If it's an Odysee link but no YT ID, try to fetch og:image
                const ogImage = await fetchOgImage(data.thumbnail);
                if (ogImage) thumbnail = ogImage;
              }
            }

            // PRIORITY 2: If no valid image/yt-thumb from tag, look in body
            if (!thumbnail || (data.thumbnail && data.thumbnail.includes('odysee.com') && !thumbnail.includes('img.youtube.com') && !thumbnail.startsWith('http'))) {
              // Search for ANY YouTube link in the body
              const ytMatch = body.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{11})(?![ \w-])/);
              if (ytMatch) {
                thumbnail = `https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg`;
              } else {
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

            return {
              id: data.id?.toString() || file.replace(/\.[^/.]+$/, ""),
              numericId: typeof data.id === 'number' ? data.id : parseInt(data.id as string) || 0,
              title: data.title || file.replace(/\.[^/.]+$/, ""),
              file: file,
              type: file.endsWith(".md") ? "md" : "html",
              thumbnail: thumbnail,
              videoUrl: data.thumbnail && (data.thumbnail.includes('youtube.com') || data.thumbnail.includes('youtu.be') || data.thumbnail.includes('odysee.com')) ? data.thumbnail : null,
              excerpt: data.excerpt || body.slice(0, 150).replace(/[#*`]/g, '').trim() + '...',
              tags: data.tags || []
            };
          } catch (err) {
            console.error(`Error processing file ${file}:`, err);
            return null;
          }
        });

      const posts = (await Promise.all(postsPromises))
        .filter((p): p is any => p !== null)
        .sort((a, b) => (b.numericId || 0) - (a.numericId || 0));

      console.log(`Successfully processed ${posts.length} posts`);
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
