// hooks/useWeeklyNFLGames.ts
import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { Game } from "@/types/nfl";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export function useNFLWeeklyGames(season = "2025", league = "1") {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch weekly games
  const fetchWeeklyGames = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`${BASE_URL}/api/gamesNFL/weekly`, {
        params: { season, league },
      });
      setGames(res.data.response || []);
    } catch (err: any) {
      setError(err.message || "Failed to fetch weekly games");
    } finally {
      setLoading(false);
    }
  }, [season, league]);

  // Initial fetch
  useEffect(() => {
    fetchWeeklyGames();
  }, [fetchWeeklyGames]);

  return { games, loading, error, refetch: fetchWeeklyGames };
}
