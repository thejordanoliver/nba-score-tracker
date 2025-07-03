import axios from "axios";
import { useEffect, useState } from "react";
import { useNewsStore } from "./newsStore"; // ✅ Zustand store

// Article types
export type NewsItem = {
  id: string;
  title: string;
  source: string;
  url: string;
  thumbnail: string;
  content: string;
  publishedAt?: string;
  date?: string; // <-- add this
};

interface BackendArticle {
  source: { name: string };
  title: string;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

interface NewsApiResponse {
  status: string;
  totalResults: number;
  articles: BackendArticle[];
}

// Convert HTML to plain text
function htmlToPlainText(html: string | null): string {
  if (!html) return "Content not available";
  return html
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/?[^>]+(>|$)/g, "")
    .trim();
}

// Clean & format content
function formatContent(rawContent: string): string {
  if (!rawContent) return "No content available.";

  let formatted = rawContent
    // 🔴 REMOVE EMBEDDED IMAGES
    .replace(/<img[^>]*>/gi, "")                  // HTML image tags
    .replace(/!\[.*?\]\(.*?\)/g, "")              // Markdown image links
    .replace(/image:\s*https?:\/\/\S+/gi, "")     // "image: https://..." style
    .replace(/https?:\/\/\S+\.(jpg|jpeg|png|gif)/gi, "") // Any standalone image URLs

    // 🔧 CLEAN FORMATTING
    .replace(/\[\+\d+\schars\]/g, "")           // Remove truncation notes
    .replace(/https?:\/\/\S+/g, "")             // Remove leftover URLs
    .replace(/[^\S\r\n]+/g, " ")                // Collapse whitespace
    .replace(/\.(\s|$)/g, ". ")                 // Space after period
    .replace(/,(?=\S)/g, ", ")                  // Space after comma
    .replace(/\?(?=\S)/g, "? ")                 // Space after question mark
    .replace(/!(?=\S)/g, "! ")                  // Space after exclamation
    .replace(/\s{2,}/g, " ");                   // Remove extra spaces

  // 🧹 BOILERPLATE REMOVAL
  const boilerplatePatterns = [
    /subscribe\s+now[^\.]*\.?/gi,
    /read\s+more[^\.]*\.?/gi,
    /support\s+our\s+journalism[^\.]*\.?/gi,
    /follow\s+us\s+on\s+[^\.]*\.?/gi,
    /this\s+article\s+originally\s+appeared\s+on[^\.]*\.?/gi,
    /©\s*\d{4}[^\.]*\.?/gi,
    /all\s+rights\s+reserved\.?/gi,
    /advertisement/gi,
    /tap\s+to\s+continue/gi,
    /photo\s+credit[^\.]*\.?/gi,
    /\.\.\.\s*$/, // remove trailing ellipsis
  ];

  for (const pattern of boilerplatePatterns) {
    formatted = formatted.replace(pattern, "");
  }

  // 🧼 PARAGRAPH STRUCTURING
  formatted = formatted.replace(/(\r\n|\r|\n){2,}/g, "\n\n");

  const paragraphs = formatted
    .split("\n\n")
    .map((p) =>
      p
        .trim()
        .replace(/\s+/g, " ")
        .replace(/^\w/, (c) => c.toUpperCase()) // Capitalize first letter
    )
    .filter(Boolean);

  return paragraphs.join("\n\n");
}

export function useNews() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { setArticles, loadCachedArticles, articles } = useNewsStore.getState();

  const refreshNews = async () => {
    try {
      setLoading(true);
      setError(null);

      const API_URL = process.env.EXPO_PUBLIC_API_URL;
      if (!API_URL) throw new Error("EXPO_PUBLIC_API_URL is not defined");

const res = await axios.get<NewsApiResponse>(`${API_URL}/api/news`);

      if (!res.data.articles) {
        throw new Error("API response missing 'articles' field.");
      }

      const formatted: NewsItem[] = res.data.articles.map((article, index) => {
        const plainContent = htmlToPlainText(article.content);
        const content = formatContent(plainContent);

        return {
          id: `${article.publishedAt}-${index}`,
          title: article.title,
          source: article.source.name,
          url: article.url,
          thumbnail: article.urlToImage || "",
          content,
        };
      });

      setArticles(formatted);
      setNews(formatted);
    } catch (err) {
      console.error("Failed to fetch news:", err);
      setError("Failed to fetch news.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      await loadCachedArticles();
      const cached = useNewsStore.getState().articles;
      if (cached.length > 0) {
        setNews(cached);
        setLoading(false);
      }

      refreshNews();
    })();
  }, []);

  return { news, loading, error, refreshNews };
}
