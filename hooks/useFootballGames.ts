// hooks/useFootballGames.ts
import { useState, useEffect } from "react";
import axios from "axios";

type Team = {
  id: number;
  name: string;
  logo: string;
};

type League = {
  id: number;
  name: string;
  season: string;
  logo: string;
};

type GameStatus = {
  short: string;
  long: string;
};

export type Game = {
  id: number;
  week: string;
  date: string;
  time: string;
  timestamp: number;
  status: GameStatus;
  league: League;
  teams: {
    home: Team;
    away: Team;
  };
};

const RAPID_API_KEY = process.env.EXPO_PUBLIC_RAPIDAPI_KEY;
const RAPID_API_HOST = process.env.EXPO_PUBLIC_FOOTBALL_RAPIDAPI_HOST;

export const useFootballGames = (date: string) => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!date) return;

    const fetchGames = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get("https://api-american-football.p.rapidapi.com/games", {
          params: { date },
          headers: {
            "x-rapidapi-key": RAPID_API_KEY!,
            "x-rapidapi-host": RAPID_API_HOST!,
          },
        });

        const rawGames = response.data.response || [];

        // Map API structure into your Game type
        const mappedGames: Game[] = rawGames.map((g: any) => ({
          id: g.game.id,
          week: g.game.week,
          date: g.game.date.date,
          time: g.game.date.time,
          timestamp: g.game.date.timestamp,
          status: {
            short: g.game.status.short,
            long: g.game.status.long,
          },
          league: {
            id: g.league.id,
            name: g.league.name,
            season: g.league.season,
            logo: g.league.logo,
          },
          teams: {
            home: {
              id: g.teams.home.id,
              name: g.teams.home.name,
              logo: g.teams.home.logo,
            },
            away: {
              id: g.teams.away.id,
              name: g.teams.away.name,
              logo: g.teams.away.logo,
            },
          },
        }));

        setGames(mappedGames);
      } catch (err: any) {
        setError(err.message || "Error fetching games");
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, [date]);

  return { games, loading, error };
};
