import { useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

type Highlight = {
  videoId: string;
  title: string;
  publishedAt: string;
  thumbnail: string;
  views: number;
};

export function useHighlights(
  query = "NBA dunks OR game winners OR buzzer beaters OR crossovers OR trending",
  maxResults = 50
) {
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Create a unique cache key based on query and maxResults
  const cacheKey = `cachedHighlights-${query}-${maxResults}`;

  useEffect(() => {
    const fetchHighlights = async () => {
      setLoading(true);
      setError(null);

      try {
        // 1. Try to load cached highlights first
        const cached = await AsyncStorage.getItem(cacheKey);
        if (cached) {
          const cachedData: Highlight[] = JSON.parse(cached);
          setHighlights(cachedData);
          setLoading(false);
        }

        // 2. Fetch fresh highlights from API
        const response = await fetch(
          `https://4e51-132-170-9-79.ngrok-free.app/api/highlights?maxResults=${maxResults}&query=${encodeURIComponent(
            query
          )}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch highlights");
        }

        const data: Highlight[] = await response.json();

        // 3. Update state with fresh data
        setHighlights(data);

        // 4. Update cache with fresh data
        await AsyncStorage.setItem(cacheKey, JSON.stringify(data));
      } catch (err: any) {
        setError(err.message);
        if (!highlights.length) {
          // Clear highlights only if no cached data was loaded
          setHighlights([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchHighlights();
  }, [query, maxResults]);

  return { highlights, loading, error };
}
