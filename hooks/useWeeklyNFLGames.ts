import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { Game } from "@/types/nfl";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export function useNFLWeeklyGames(season = "2025", league = "1") {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeeklyGames = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await axios.get(`${BASE_URL}/api/gamesNFL/weekly`, {
        params: { season, league },
      });

      console.log("NFL Weekly API raw response:", res.data);

      const games = res.data.response || [];

      games.forEach((g: Game, i: number) => {
        const ts = g?.game?.date?.timestamp;
        if (ts) {
          const utc = new Date(ts * 1000);
          console.log(
            `WeeklyGame[${i}] → timestamp: ${ts}, UTC: ${utc.toISOString()}, Local: ${utc.toString()}`
          );
        }
      });

      setGames(games);
    } catch (err: any) {
      console.error("Error fetching weekly games:", err.message);
      setError(err.message || "Failed to fetch weekly games");
    } finally {
      setLoading(false);
    }
  }, [season, league]);

  useEffect(() => {
    fetchWeeklyGames();
  }, [fetchWeeklyGames]);

  return { games, loading, error, refetch: fetchWeeklyGames };
}
