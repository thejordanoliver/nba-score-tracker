import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

type Standing = {
  team: {
    id: number;
    name: string;
    logo: string;
  };
  games: {
    played: number;
    win: { total: number };
    lose: { total: number };
  };
};

export function useSummerLeagueStandings() {
  const [standings, setStandings] = useState<Map<string, string> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStandings() {
      try {
        const res = await axios.get(`${API_URL}/api/standings`);

        // The teams array is the first element inside response
        const teams: Standing[] = res.data.response[0];

        const map = new Map<string, string>();
        for (const t of teams) {
          const record = `${t.games.win.total}-${t.games.lose.total}`;
          map.set(t.team.name.toLowerCase(), record);
        }

        setStandings(map);
      } catch (err: any) {
        setError(err.message || "Failed to fetch standings");
      } finally {
        setLoading(false);
      }
    }

    fetchStandings();
  }, []);

  return { standings, loading, error };
}
