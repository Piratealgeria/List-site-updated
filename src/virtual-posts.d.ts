declare module 'virtual:posts' {
  const posts: {
    id: string;
    numericId?: number;
    title: string;
    file: string;
    type: 'md' | 'html';
    thumbnail?: string;
    videoUrl?: string | null;
    excerpt?: string;
    tags?: string[];
  }[];
  export default posts;
}
