import { PostMetadata } from './types';

let cachedPostsPromise: Promise<PostMetadata[]> | null = null;
let postContentCache: Record<string, Promise<string>> = {};

const loadPosts = () => {
  return fetch('/posts.json')
    .then(async res => {
       const text = await res.text();
       if (text.trim().startsWith('<!DOCTYPE html>')) {
         throw new Error('Received HTML instead of JSON.');
       }
       return JSON.parse(text);
    })
    .catch(err => {
       // Reset cache on error so next attempt can retry
       cachedPostsPromise = null;
       throw err;
    });
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
         if (text.trim().startsWith('<!DOCTYPE html>')) {
             throw new Error('Could not load post content. Server returned HTML.');
         }
         return text;
      })
      .catch(err => {
         postContentCache[fileName] = Promise.reject(err);
         return "Could not load post content. Please try again.";
      });
  }
  return postContentCache[fileName];
};
