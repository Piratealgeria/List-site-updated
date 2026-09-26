import { useEffect } from 'react';

export interface SEOProps {
  title: string;
  description: string;
  keywords?: string[];
  canonicalUrl?: string;
  image?: string;
  type?: 'website' | 'article';
  schema?: Record<string, any>;
}

export function usePageSEO({
  title,
  description,
  keywords = [],
  canonicalUrl,
  image = 'https://picsum.photos/seed/viking/1200/630',
  type = 'website',
  schema,
}: SEOProps) {
  useEffect(() => {
    // 1. Page Title
    document.title = title;

    // Helper to create or update meta tags
    const setMeta = (attr: 'name' | 'property', name: string, content: string) => {
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    // Helper to create or update link tags
    const setLink = (rel: string, href: string) => {
      let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
      if (!el) {
        el = document.createElement('link');
        el.setAttribute('rel', rel);
        document.head.appendChild(el);
      }
      el.setAttribute('href', href);
    };

    const resolvedUrl = canonicalUrl || (typeof window !== 'undefined' ? window.location.href : '');

    // Standard metadata
    setMeta('name', 'description', description);
    if (keywords.length > 0) {
      setMeta('name', 'keywords', keywords.join(', '));
    }
    setMeta('name', 'author', 'Viking Algeria');
    setMeta('name', 'robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    setLink('canonical', resolvedUrl);

    // OpenGraph metadata
    setMeta('property', 'og:type', type);
    setMeta('property', 'og:site_name', 'Viking Algeria');
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', resolvedUrl);
    setMeta('property', 'og:image', image);
    setMeta('property', 'og:locale', 'en_US');

    // Twitter card metadata
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:site', '@VikingAlgeria');
    setMeta('name', 'twitter:creator', '@VikingAlgeria');
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', image);
    setMeta('name', 'twitter:url', resolvedUrl);

    // Schema.org JSON-LD Structured Data
    const scriptId = 'page-schema-jsonld';
    let scriptEl = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (schema) {
      if (!scriptEl) {
        scriptEl = document.createElement('script');
        scriptEl.id = scriptId;
        scriptEl.type = 'application/ld+json';
        document.head.appendChild(scriptEl);
      }
      scriptEl.textContent = JSON.stringify(schema, null, 2);
    } else if (scriptEl) {
      scriptEl.remove();
    }

    return () => {
      // Clean up dynamic schema tag when unmounting
      const el = document.getElementById(scriptId);
      if (el) el.remove();
    };
  }, [title, description, keywords, canonicalUrl, image, type, schema]);
}
