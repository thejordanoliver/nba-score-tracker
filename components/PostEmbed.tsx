// components/PostEmbed.tsx
import { useEffect } from 'react';

type PostEmbedProps = {
  url: string;
};

export default function PostEmbed({ url }: PostEmbedProps) {
  useEffect(() => {
    // Load appropriate SDK based on platform
    if (url.includes('twitter.com')) {
      const script = document.createElement('script');
      script.src = 'https://platform.twitter.com/widgets.js';
      script.async = true;
      document.body.appendChild(script);
    } else if (url.includes('instagram.com')) {
      const script = document.createElement('script');
      script.src = 'https://www.instagram.com/embed.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, [url]);

  if (url.includes('twitter.com')) {
    return (
      <blockquote className="twitter-tweet">
        <a href={url}></a>
      </blockquote>
    );
  }

  if (url.includes('instagram.com')) {
    return (
      <blockquote
        className="instagram-media"
        data-instgrm-permalink={url}
        data-instgrm-version="14"
        style={{ width: '100%', margin: '0 auto' }}
      ></blockquote>
    );
  }

  return null;
}
