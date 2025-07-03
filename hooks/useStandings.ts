import { useEffect, useState } from "react";
import { teams } from "../constants/teams";

export type TeamStanding = {
  team: {
    id: number;
    name: string;
    nickname: string;
    code: string;
    logo: any;
    logoLight: any;
  };
  conference: {
    name: string;
    rank: number;
    win: number;
    loss: number;
  };
  division: {
    name: string;
    rank: number;
    win: number;
    loss: number;
    gamesBehind: string;
  };
  win: {
    total: number;
    percentage: string;
  };
  loss: {
    total: number;
  };
  streak: number;
  winStreak: boolean;
  gamesBehind: string;
};

const RAPIDAPI_KEY = process.env.EXPO_PUBLIC_RAPIDAPI_KEY || "";
const RAPIDAPI_HOST = process.env.EXPO_PUBLIC_RAPIDAPI_HOST || "";

export function useStandings(season = 2024) {
  const [standings, setStandings] = useState<TeamStanding[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStandings = async () => {
      try {
        const response = await fetch(
          `https://${RAPIDAPI_HOST}/standings?season=${season}&league=standard`,
          {
            method: "GET",
            headers: {
              "X-RapidAPI-Key": RAPIDAPI_KEY,
              "X-RapidAPI-Host": RAPIDAPI_HOST,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`API error: ${response.statusText}`);
        }

        const json = await response.json();

        const enrichedStandings: TeamStanding[] = json.response.map(
          (teamData: any) => {
            const localTeam = teams.find(
              (t) => t.id === String(teamData.team.id)
            );

            return {
              ...teamData,
              team: {
                ...teamData.team,
                logo: localTeam?.logo ?? teamData.team.logo,
                logoLight: localTeam?.logoLight ?? null, // inject logoLight here
              },
            };
          }
        );

        setStandings(enrichedStandings);
        setError(null);
      } catch (err: any) {
        console.error("Error fetching standings:", err);
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchStandings();
  }, [season]);

  return { standings, loading, error };
}
