import { useEffect, useState, useRef } from "react";
import axios, { CancelTokenSource } from "axios";

export interface Bookmaker {
  key: string;
  title: string;
  markets: {
    key: string;
    outcomes: {
      name: string;
      price: number;
      point?: number;
    }[];
  }[];
}

export interface HistoricalGameOdds {
  id: string;
  commence_time: string;
  commence_time_local?: string;
  home_team: string;
  away_team: string;
  bookmakers: Bookmaker[];
}

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

interface UseHistoricalOddsOptions {
  date?: string;
  timestamp?: number;
  team1?: string;
  team2?: string;
  gameId?: string | number; // stable identifier
}

const cache: Record<string, HistoricalGameOdds[]> = {}; // ✅ in-memory cache

export const useHistoricalOdds = ({
  date,
  timestamp,
  team1,
  team2,
  gameId,
}: UseHistoricalOddsOptions) => {
  const [data, setData] = useState<HistoricalGameOdds[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lastParamsRef = useRef<string | null>(null);

  useEffect(() => {
    if (!date || !gameId) return;

    const params: Record<string, string> = { date };
    if (timestamp) params.timestamp = new Date(timestamp).toISOString();
    if (team1) params.team1 = team1;
    if (team2) params.team2 = team2;

    const key = JSON.stringify(params);

    // 🔎 Debug log
    console.log("🔎 useHistoricalOdds triggered with params:", params);

    // ✅ Check cache
    if (cache[key]) {
      console.log("✅ Returning cached odds for key:", key);
      setData(cache[key]);
      setError(null);
      return;
    }

    // ✅ Prevent refetch if already requested
    if (lastParamsRef.current === key) {
      console.log("⏸ Skipping fetch (params unchanged):", key);
      return;
    }
    lastParamsRef.current = key;

    let cancelSource: CancelTokenSource | null = axios.CancelToken.source();

    const fetchData = async () => {
      setLoading(true);
      try {
        console.log("🌍 Fetching odds from API:", params);
        console.log("📡 useHistoricalOdds API call:", { date, team1, team2, gameId });

        const res = await axios.get(`${BASE_URL}/api/odds/historical`, {
          params,
          cancelToken: cancelSource?.token,
          
        });
        const games = res.data.games || [];
        cache[key] = games; // ✅ save to cache
        console.log("✅ Fetched and cached odds for key:", key, games);
        console.log(
  "✅ Fetched and cached odds for key:",
  key,
  JSON.stringify(games, null, 2)
);
        setData(games);
        setError(null);
      } catch (err: any) {
        if (axios.isCancel(err)) return;
        console.error(
          "❌ Error fetching historical odds:",
          err.response?.data || err.message
        );
        setError(err.response?.data?.error || "Failed to fetch odds");
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      cancelSource?.cancel("Component unmounted");
    };
  }, [date, timestamp, team1, team2, gameId]);

  return { data, loading, error };
};
