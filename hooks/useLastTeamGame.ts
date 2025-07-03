import axios from "axios";
import { useEffect, useState } from "react";
import { teams } from "@/constants/teams"; // adjust relative path

type GameApiResponse = {
  id: number;
  date: { start: string };
  teams: {
    home: { id: number; name: string };
    visitors: { id: number; name: string };
  };
  scores: {
    home: { points: number };
    visitors: { points: number };
  };
  status: { long: string };
};

type LocalTeam = {
  id: string;      // changed to string to match local teams
  name: string;
  logo: string;
};

type EnrichedGame = Omit<GameApiResponse, "teams"> & {
  teams: {
    home: LocalTeam;
    visitors: LocalTeam;
  };
};

export function useLastTeamGame(teamId: number) {
  const [lastGame, setLastGame] = useState<EnrichedGame | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLastGame = async () => {
      setLoading(true);
      try {
        const response = await axios.get<{ response: GameApiResponse[] }>(
          "https://api-nba-v1.p.rapidapi.com/games",
          {
            params: {
              team: teamId,
              season: "2024",
            },
            headers: {
              "X-RapidAPI-Key": process.env.EXPO_PUBLIC_RAPIDAPI_KEY!,
              "X-RapidAPI-Host": "api-nba-v1.p.rapidapi.com",
            },
          }
        );

        const games = response.data.response;
        const completedGames = games.filter(
          (g) => g.status.long === "Finished"
        );

        const sorted = completedGames.sort(
          (a, b) =>
            new Date(b.date.start).getTime() - new Date(a.date.start).getTime()
        );

        const last = sorted[0] ?? null;

        if (last) {
          // Convert API numeric IDs to string for matching local teams
          const homeTeamLocal = teams.find(
            (t) => t.id === String(last.teams.home.id)
          );
          const visitorsTeamLocal = teams.find(
            (t) => t.id === String(last.teams.visitors.id)
          );

          if (!homeTeamLocal || !visitorsTeamLocal) {
            throw new Error("Team info missing locally");
          }

          const enrichedGame: EnrichedGame = {
            ...last,
            teams: {
              home: homeTeamLocal,
              visitors: visitorsTeamLocal,
            },
          };

          setLastGame(enrichedGame);
        } else {
          setLastGame(null);
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch last game.");
      } finally {
        setLoading(false);
      }
    };

    if (!teamId) return;
    fetchLastGame();
  }, [teamId]);

  return { lastGame, loading, error };
}
