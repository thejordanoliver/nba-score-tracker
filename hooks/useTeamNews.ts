import axios from "axios";
import { useEffect, useState } from "react";

export type NewsArticle = {
  id: string;
  title: string;
  source: string;
  author: string | null;
  description: string | null;
  url: string;
  thumbnail: string;
  publishedAt: string;
  content: string;
};

interface BackendArticle {
  source: { name: string };
  author: string | null;
  title: string;
  description: string | null;
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

function htmlToPlainText(html: string | null): string {
  if (!html) return "Content not available";
  return html
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/?[^>]+(>|$)/g, "")
    .trim();
}

function formatContent(raw: string): string {
  return raw
    .replace(/(\r\n|\r|\n)+/g, "\n\n")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .join("\n\n");
}

export function useTeamNews(teamName: string) {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  const refreshNews = async () => {
    if (!teamName) {
      setArticles([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await axios.get<NewsApiResponse>(
        `${API_URL}/api/news/${encodeURIComponent(teamName)}`
      );

      const backendArticles = response.data.articles || [];

      const mapped: NewsArticle[] = backendArticles.map((article, index) => {
        const plain = htmlToPlainText(article.content);
        const formatted = formatContent(plain);

        return {
          id: `${article.publishedAt}-${index}`,
          title: article.title,
          source: article.source.name,
          author: article.author,
          description: article.description,
          url: article.url,
          thumbnail: article.urlToImage ?? "",
          publishedAt: article.publishedAt,
          content: formatted,
        };
      });

      setArticles(mapped);
    } catch (err: any) {
      console.error("Failed to fetch team news:", err?.message || err);
      setError("Unable to load team news. Please try again later.");
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshNews();
  }, [teamName]);

  // ✅ Return refreshNews so components can call it
  return {
    articles,
    loading,
    error,
    refreshNews,
  };
}
