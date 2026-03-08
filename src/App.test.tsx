import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from './App';

// Mock fetch
const mockPosts = [
  {
    id: 'post-1',
    numericId: 1,
    title: 'Test Post 1',
    file: 'post1.md',
    type: 'md',
    excerpt: 'This is a test post',
    tags: ['test']
  },
  {
    id: 'post-2',
    numericId: 2,
    title: 'Test Post 2',
    file: 'post2.md',
    type: 'md',
    excerpt: 'Another test post',
    tags: ['react']
  }
];

global.fetch = vi.fn();

describe('App Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock window.scrollTo
    Object.defineProperty(window, 'scrollTo', { value: vi.fn(), writable: true });

    (global.fetch as any).mockImplementation((url: string) => {
      if (url.endsWith('posts-manifest.json')) {
        return Promise.resolve({
          json: () => Promise.resolve(mockPosts),
        });
      }
      if (url.includes('/posts/')) {
        return Promise.resolve({
          text: () => Promise.resolve('# Test Post Content\n\nThis is the content.'),
        });
      }
      return Promise.reject(new Error('Not found'));
    });
  });

  it('renders the home page and fetches posts', async () => {
    render(<App />);

    // Wait for loading to finish and title to appear
    await waitFor(() => {
      const headings = screen.getAllByRole('heading', { level: 1 });
      expect(headings[0]).toHaveTextContent(/Viking/i);
    });
    
    // Check for posts
    expect(screen.getByText('Test Post 1')).toBeInTheDocument();
    expect(screen.getByText('Test Post 2')).toBeInTheDocument();
  });

  it('filters posts when searching', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Test Post 1')).toBeInTheDocument();
    });

    // Open search
    const searchButton = screen.getByRole('button', { name: /search posts/i });
    fireEvent.click(searchButton);
    
    // Type in search
    const searchInput = screen.getByPlaceholderText(/search posts/i);
    fireEvent.change(searchInput, { target: { value: 'Post 1' } });
    
    // Check filter
    expect(screen.getByText('Test Post 1')).toBeInTheDocument();
    expect(screen.queryByText('Test Post 2')).not.toBeInTheDocument();
  });
  
  it('navigates to post detail', async () => {
     render(<App />);
     
     await waitFor(() => {
       expect(screen.getByText('Test Post 1')).toBeInTheDocument();
     });
     
     // Click on a post
     fireEvent.click(screen.getByText('Test Post 1'));
     
     // Wait for detail page content
     await waitFor(() => {
       expect(screen.getByText('Test Post Content')).toBeInTheDocument();
     });
  });
});
