// hooks/useHistoricalOdds.ts
import { useEffect, useState } from "react";
import axios from "axios";

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
  date?: string; // e.g. "2025-04-03"
  timestamp?: number; // UNIX ms
  team1?: string;
  team2?: string;
}

export const useHistoricalOdds = ({ date, timestamp, team1, team2 }: UseHistoricalOddsOptions) => {
  const [data, setData] = useState<HistoricalGameOdds[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!date) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const params: Record<string, string> = { date };

        if (timestamp) {
          // Convert UNIX ms to ISO string (UTC) for backend compatibility
          params.timestamp = new Date(timestamp).toISOString();
        }

        if (team1) params.team1 = team1;
        if (team2) params.team2 = team2;

        const res = await axios.get(`${BASE_URL}/api/odds/historical`, { params });

        setData(res.data.games);
      } catch (err: any) {
        console.error("Error fetching historical odds:", err.response?.data || err.message);
        setError(err.response?.data?.error || "Failed to fetch odds");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [date, timestamp, team1, team2]); // ✅ Include timestamp in dependency array

  return { data, loading, error };
};
