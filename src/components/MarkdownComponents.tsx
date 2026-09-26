import React, { useState } from 'react';
import { ClickToCopy } from './ClickToCopy';
import { Check, Copy } from 'lucide-react';
import { copyToClipboard } from '../utils';

export const CodeBlock = ({ children, className }: any) => {
  const [copied, setCopied] = useState(false);
  
  const getText = (node: any): string => {
    if (typeof node === 'string') return node;
    if (typeof node === 'number') return String(node);
    if (Array.isArray(node)) return node.map(getText).join('');
    if (node?.props?.children) return getText(node.props.children);
    return '';
  };
  
  const textContent = getText(children).trim();

  const handleCopy = async () => {
    const success = await copyToClipboard(textContent);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="relative group my-8">
      <div className="absolute top-0 left-0 w-full h-10 bg-[#111] flex items-center justify-between px-4 border border-b-0 border-white/20 rounded-t-sm">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
        </div>
        <button
          onClick={handleCopy}
          className="text-white/40 hover:text-white transition-colors flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest"
        >
          {copied ? (
            <><Check className="w-3 h-3 text-emerald-400" /> <span className="text-emerald-400">Copied</span></>
          ) : (
            <><Copy className="w-3 h-3" /> <span>Copy</span></>
          )}
        </button>
      </div>
      <pre className="pt-14 pb-6 px-6 bg-black/50 border border-white/20 overflow-x-auto text-sm font-mono text-emerald-400 shadow-[4px_4px_0_rgba(16,185,129,0.15)] rounded-b-sm">
        <code className={className}>{children}</code>
      </pre>
    </div>
  );
};

export const FormattedLine = ({ children }: { children: React.ReactNode }) => {
  const getText = (node: any): string => {
    if (typeof node === 'string') return node;
    if (typeof node === 'number') return String(node);
    if (Array.isArray(node)) return node.map(getText).join('');
    if (node?.props?.children) return getText(node.props.children);
    return '';
  };

  const fullText = getText(children);
  // Matches timestamps like 0:09, 12:34, 1:23:45 at the start of the string
  const timestampRegex = /^(\d{1,2}:\d{2}(?::\d{2})?)\s*(.*)/;
  const match = fullText.match(timestampRegex);

  // Matches "-Anime:", "Game : ", etc. but not "http:" or "https:"
  const categoryRegex = /^(-?\s*(?!http|https)[a-zA-Z0-9_]+)\s*:\s*(.*)/i;
  const categoryMatch = fullText.match(categoryRegex);

  if (match) {
    const timestamp = match[1];
    const rest = match[2].trim();
    
    // Try to remove the timestamp from the actual children to avoid duplication
    const restNodes = React.Children.map(children, (child, index) => {
      if (index === 0 && typeof child === 'string') {
        const tsMatch = child.match(/^(\d{1,2}:\d{2}(?::\d{2})?)\s*(.*)/);
        if (tsMatch) return tsMatch[2].trim();
      }
      return child;
    });

    return (
      <span className="flex items-start gap-3 w-full break-words">
        <span className="text-emerald-400 font-mono shrink-0 font-bold">{timestamp}</span>
        {rest ? (
          <ClickToCopy text={rest} className="flex-1">
            {restNodes}
          </ClickToCopy>
        ) : null}
      </span>
    );
  }

  if (categoryMatch) {
    const textToCopy = categoryMatch[2].trim();
    return (
      <ClickToCopy text={textToCopy} className="w-full">
        {children}
      </ClickToCopy>
    );
  }

  return (
    <ClickToCopy text={fullText} className="w-full">
      {children}
    </ClickToCopy>
  );
};

export const CopyableListItem = ({ children }: { children: React.ReactNode }) => {
  return (
    <li className="relative py-3 px-5 transition-all list-none border-l-4 border-white/10 hover:border-emerald-500 bg-white/[0.02] hover:bg-white/[0.05] flex items-start gap-4 my-3 font-mono text-sm shadow-[4px_4px_0_transparent] hover:shadow-[4px_4px_0_#10b981]">
      <span className="mt-0.5 text-[10px] text-emerald-500 shrink-0">►</span>
      <div className="flex-1 min-w-0 break-words text-white/80">
        <FormattedLine>{children}</FormattedLine>
      </div>
    </li>
  );
};

export const VideoEmbed = ({ url }: { url: string }) => {
  if (!url || typeof url !== 'string') return null;

  // Clean URL to prevent protocol tampering
  const cleanUrl = url.trim();
  if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
    return null;
  }

  const isYoutube = cleanUrl.includes('youtube.com') || cleanUrl.includes('youtu.be');
  const isOdysee = cleanUrl.includes('odysee.com');

  let embedUrl = '';
  if (isYoutube) {
    const ytMatch = cleanUrl.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([\w-]{11})(?![ \w-])/);
    if (ytMatch && ytMatch[1]) {
      embedUrl = `https://www.youtube.com/embed/${ytMatch[1]}`;

      // Check for timestamp query parameter (e.g., ?t=120, &t=2m30s, ?start=60)
      const timeMatch = cleanUrl.match(/[?&](?:t|start)=([0-9hms]+)/i);
      if (timeMatch) {
        const rawTime = timeMatch[1];
        if (/^\d+$/.test(rawTime)) {
          const sec = parseInt(rawTime, 10);
          if (sec > 0) embedUrl += `?start=${sec}`;
        } else {
          const hours = (rawTime.match(/(\d+)h/i) || [])[1];
          const minutes = (rawTime.match(/(\d+)m/i) || [])[1];
          const seconds = (rawTime.match(/(\d+)s/i) || [])[1];
          let total = 0;
          if (hours) total += parseInt(hours, 10) * 3600;
          if (minutes) total += parseInt(minutes, 10) * 60;
          if (seconds) total += parseInt(seconds, 10);
          if (total > 0) embedUrl += `?start=${total}`;
        }
      }
    }
  } else if (isOdysee) {
    if (cleanUrl.includes('odysee.com/$/embed/')) {
      embedUrl = cleanUrl;
    } else {
      embedUrl = cleanUrl.replace(/https?:\/\/(?:www\.)?odysee\.com\//i, 'https://odysee.com/$/embed/');
    }
  }

  if (!embedUrl) {
    return (
      <a 
        href={cleanUrl} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="text-emerald-400 hover:text-black hover:bg-emerald-400 py-0.5 px-1 font-bold no-underline transition-colors break-all"
      >
        {cleanUrl}
      </a>
    );
  }

  return (
    <div className="relative aspect-video w-full bg-black border border-white/20 overflow-hidden my-12 shadow-[8px_8px_0_#10b981] group">
      <iframe
        src={embedUrl}
        className="absolute inset-0 w-full h-full"
        allowFullScreen
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        title="Video player"
      />
    </div>
  );
};
