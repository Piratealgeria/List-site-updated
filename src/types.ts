export interface PostMetadata {
  id: string;
  numericId?: number;
  title: string;
  file: string;
  type: 'md' | 'html';
  thumbnail?: string;
  videoUrl?: string | null;
  excerpt?: string;
  tags?: string[];
  content?: string;
}
