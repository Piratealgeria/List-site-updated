import React from 'react';
import { ClickToCopy } from './ClickToCopy';

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
  const isYoutube = url.includes('youtube.com') || url.includes('youtu.be');
  const isOdysee = url.includes('odysee.com');

  let embedUrl = '';
  if (isYoutube) {
    const id = url.includes('v=') ? url.split('v=')[1].split('&')[0] : url.split('/').pop();
    embedUrl = `https://www.youtube.com/embed/${id}`;
  } else if (isOdysee) {
    // Odysee embed format: https://odysee.com/$/embed/name/id
    embedUrl = url.replace('odysee.com/', 'odysee.com/$/embed/');
  }

  if (!embedUrl) return <a href={url} className="text-emerald-400 hover:text-black hover:bg-emerald-400 py-0.5 px-1 font-bold no-underline transition-colors">{url}</a>;

  return (
    <div className="relative aspect-video w-full bg-black border border-white/20 overflow-hidden my-12 shadow-[8px_8px_0_#10b981] group">
      <iframe
        src={embedUrl}
        className="absolute inset-0 w-full h-full"
        allowFullScreen
        title="Video player"
      />
    </div>
  );
};
