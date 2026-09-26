import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function copyToClipboard(text: string): Promise<boolean> {
  const cleanText = text.trim();
  if (!cleanText) return false;

  if (typeof navigator !== 'undefined' && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
    try {
      await navigator.clipboard.writeText(cleanText);
      return true;
    } catch {
      // Fallback below
    }
  }

  try {
    const textArea = document.createElement('textarea');
    textArea.value = cleanText;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    textArea.setAttribute('readonly', '');
    document.body.appendChild(textArea);
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch {
    return false;
  }
}

export function sanitizeHtml(rawHtml: string): string {
  if (!rawHtml) return '';

  if (typeof window !== 'undefined' && typeof DOMParser !== 'undefined') {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(rawHtml, 'text/html');

      // Strip dangerous tags completely
      const dangerousTags = [
        'script', 'iframe', 'object', 'embed', 'base', 'meta',
        'form', 'input', 'textarea', 'button', 'select', 'frame',
        'frameset', 'applet', 'link', 'style'
      ];

      dangerousTags.forEach(tag => {
        const elements = doc.querySelectorAll(tag);
        elements.forEach(el => el.remove());
      });

      // Strip dangerous attributes and protocols on all remaining elements
      const allElements = doc.querySelectorAll('*');
      allElements.forEach(el => {
        const attrs = Array.from(el.attributes);
        for (const attr of attrs) {
          const name = attr.name.toLowerCase();
          const val = attr.value.trim().toLowerCase();

          // Remove inline event handlers (onclick, onload, onerror, etc.)
          if (name.startsWith('on')) {
            el.removeAttribute(attr.name);
          }
          // Remove dangerous protocol schemes
          if (
            (name === 'href' || name === 'src' || name === 'action') &&
            (val.startsWith('javascript:') || val.startsWith('vbscript:') || (val.startsWith('data:') && !val.startsWith('data:image/')))
          ) {
            el.setAttribute(attr.name, '#');
          }
        }
      });

      return doc.body.innerHTML;
    } catch {
      // Fall through to regex-based fallback
    }
  }

  // Robust fallback for non-DOM environments
  return rawHtml
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<\/?(iframe|object|embed|base|meta|form|input|textarea|button|select|frame|frameset|applet|link|style)\b[^>]*>/gi, '')
    .replace(/\bon\w+\s*=\s*(?:'[^']*'|"[^"]*"|[^\s>]+)/gi, '')
    .replace(/(?:href|src|action)\s*=\s*["']?\s*(?:javascript|vbscript):[^"'>]*/gi, 'href="#"');
}
