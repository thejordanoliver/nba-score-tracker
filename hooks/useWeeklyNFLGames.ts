// hooks/useWeeklyNFLGames.ts
import axios from "axios";
import { useEffect, useState } from "react";

type Team = {
  id: number;
  name: string;
  logo: string;
};

type Game = {
  game: {
    id: number;
    stage: string;
    week: string;
    date: {
      timezone: string;
      date: string;
      time: string;
      timestamp: number;
    };
    venue: {
      name: string;
      city: string;
    };
    status: {
      short: string;
      long: string;
      timer: string | null;
    };
  };
  league: {
    id: number;
    name: string;
    season: string;
    logo: string;
  };
  teams: {
    home: Team;
    away: Team;
  };
  scores: {
    home: Record<string, number | null>;
    away: Record<string, number | null>;
  };
};

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

// 🔹 New hook for weekly games
export function useNFLWeeklyGames(season = "2025", league = "1") {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchWeeklyGames() {
      try {
        setLoading(true);
        const res = await axios.get(`${BASE_URL}/api/gamesNFL/weekly`, {
          params: { season, league },
        });
        setGames(res.data.response || []);
      } catch (err: any) {
        setError(err.message || "Failed to fetch weekly games");
      } finally {
        setLoading(false);
      }
    }

    fetchWeeklyGames();
  }, [season, league]);

  return { games, loading, error };
}
