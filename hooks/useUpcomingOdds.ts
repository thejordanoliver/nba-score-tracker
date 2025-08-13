// hooks/useUpcomingOdds.ts
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

export interface UpcomingGameOdds {
  id: string;
  commence_time: string;
  home_team: string;
  away_team: string;
  bookmakers: Bookmaker[];
}

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

interface UseUpcomingOddsOptions {
  team1?: string;
  team2?: string;
}

export const useUpcomingOdds = ({ team1, team2 }: UseUpcomingOddsOptions) => {
  const [data, setData] = useState<UpcomingGameOdds[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUpcoming = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`${BASE_URL}/api/odds/upcoming`, {
          params: {
            ...(team1 && { team1 }),
            ...(team2 && { team2 }),
          },
        });

        setData(res.data.games || []);
      } catch (err: any) {
        console.error("Error fetching upcoming odds:", err.response?.data || err.message);
        setError(err.response?.data?.error || "Failed to fetch upcoming odds");
      } finally {
        setLoading(false);
      }
    };

    fetchUpcoming();
  }, [team1, team2]);

  return { data, loading, error };
};
