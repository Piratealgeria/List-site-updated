import { PostMetadata } from './types';

let cachedPostsPromise: Promise<PostMetadata[]> | null = null;
const postContentCache: Record<string, Promise<string>> = {};

const loadPosts = async (): Promise<PostMetadata[]> => {
  try {
    const res = await fetch('/posts.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const text = await res.text();
    if (text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html')) {
      throw new Error('Received HTML instead of JSON.');
    }
    return JSON.parse(text);
  } catch (err) {
    // Fallback: try /api/posts if available
    try {
      const apiRes = await fetch('/api/posts');
      if (apiRes.ok) {
        const data = await apiRes.json();
        if (Array.isArray(data)) return data;
      }
    } catch {
      // Ignore API fallback failure
    }
    cachedPostsPromise = null;
    throw err;
  }
};

// Prefetch immediately
if (typeof window !== 'undefined') {
  cachedPostsPromise = loadPosts();
}

export const fetchPosts = (): Promise<PostMetadata[]> => {
  if (!cachedPostsPromise) {
    cachedPostsPromise = loadPosts();
  }
  return cachedPostsPromise;
};

export const fetchPostContent = (fileName: string): Promise<string> => {
  if (!postContentCache[fileName]) {
    postContentCache[fileName] = fetch(`/posts/${encodeURIComponent(fileName)}`)
      .then(async res => {
        if (!res.ok) throw new Error('Could not load post content. Please try again.');
        const text = await res.text();
        if (text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html')) {
          throw new Error('Could not load post content. Server returned HTML.');
        }
        return text;
      })
      .catch(err => {
        delete postContentCache[fileName];
        throw err;
      });
  }
  return postContentCache[fileName];
};
