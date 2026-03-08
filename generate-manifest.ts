
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDir = path.join(process.cwd(), 'public', 'posts');
const manifestPath = path.join(process.cwd(), 'src', 'posts-manifest.json');

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

function generateManifest() {
  if (!fs.existsSync(postsDir)) {
    console.error(`Posts directory not found: ${postsDir}`);
    return;
  }

  const files = fs.readdirSync(postsDir);
  const posts: PostMetadata[] = [];

  files.forEach(file => {
    if (!file.endsWith('.md') && !file.endsWith('.html')) return;

    const filePath = path.join(postsDir, file);
    const id = path.basename(file, path.extname(file));
    
    // Extract numeric ID if present (e.g., GWS100 -> 100)
    const numericMatch = id.match(/\d+/);
    const numericId = numericMatch ? parseInt(numericMatch[0], 10) : undefined;
    
    const type = file.endsWith('.md') ? 'md' : 'html';
    let title = id;
    let excerpt = '';
    let tags: string[] = [];
    let thumbnail = '';

    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      
      if (type === 'md') {
        const { data, content: mdContent } = matter(content);
        if (data.title) title = data.title;
        if (data.excerpt) excerpt = data.excerpt;
        if (data.tags) tags = data.tags;
        if (data.thumbnail) thumbnail = data.thumbnail;
        
        // Fallback for excerpt if not in frontmatter
        if (!excerpt) {
          excerpt = mdContent.slice(0, 150).replace(/[#*`]/g, '').trim() + '...';
        }
      } else {
        // Simple HTML parsing for title if needed, or just use ID
        // Could look for <title> tag if present
        const titleMatch = content.match(/<title>(.*?)<\/title>/);
        if (titleMatch) title = titleMatch[1];
      }
    } catch (err) {
      console.warn(`Error reading file ${file}:`, err);
    }

    posts.push({
      id,
      numericId,
      title,
      file,
      type,
      excerpt,
      tags,
      thumbnail
    });
  });

  // Sort by numeric ID descending
  posts.sort((a, b) => (b.numericId || 0) - (a.numericId || 0));

  fs.writeFileSync(manifestPath, JSON.stringify(posts, null, 2));
  console.log(`Generated manifest with ${posts.length} posts.`);
}

generateManifest();
