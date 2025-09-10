import axios from "axios";
import { useEffect, useState } from "react";

// Map your numeric team IDs to ESPN team IDs
const teamIdMap: Record<number, string> = {
  1: "13",
  2: "30",
  3: "17",
  4: "19",
  5: "33",
  6: "10",
  7: "8",
  8: "1",
  9: "5",
  10: "4",
  11: "22",
  12: "21",
  13: "20",
  14: "25",
  15: "9",
  16: "3",
  17: "12",
  18: "28",
  19: "29",
  20: "2",
  21: "11",
  22: "23",
  23: "26",
  24: "27",
  25: "15",
  26: "34",
  27: "18",
  28: "7",
  29: "6",
  30: "24",
  31: "14",
  32: "16",
};

export const useNFLGamePossession = (
  home: number, // internal numeric ID
  away: number, // internal numeric ID
  date: string | { date?: string; utc?: string; timestamp?: number } | undefined
) => {
  const [possessionTeam, setPossessionTeam] = useState<number | undefined>();
  const [possesionLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("useNFLGamePossession called with:", { home, away, date });

    if (!home || !away || !date) {
      console.warn("Missing parameters:", { home, away, date });
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Parse the date
        let targetDate: Date | null = null;
        if (typeof date === "string") targetDate = new Date(date);
        else if (typeof date === "object") {
          targetDate = date.timestamp
            ? new Date(date.timestamp * 1000)
            : date.utc
            ? new Date(date.utc)
            : date.date
            ? new Date(date.date)
            : null;
        }

        if (!targetDate) throw new Error("Invalid date provided");

        console.log("Parsed targetDate:", targetDate);

        const makeYMD = (d: Date) =>
          d.toISOString().slice(0, 10).replace(/-/g, "");
        const datesToCheck = [
          makeYMD(new Date(targetDate.getTime() - 24 * 60 * 60 * 1000)),
          makeYMD(targetDate),
          makeYMD(new Date(targetDate.getTime() + 24 * 60 * 60 * 1000)),
        ];

        let foundGame: any = null;

        for (const yyyymmdd of datesToCheck) {
          const scoreboardUrl = `https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard?dates=${yyyymmdd}`;
          console.log("Fetching scoreboard:", scoreboardUrl);

          const { data: scoreboard } = await axios.get(scoreboardUrl);
          const games = scoreboard.events || [];

          foundGame = games.find((g: any) =>
            g.competitions[0].competitors.some((c: any) =>
              [teamIdMap[home], teamIdMap[away]].includes(c.team.id)
            )
          );

          console.log("Found game?", foundGame?.id);

          if (foundGame) break;
        }

        if (!foundGame) {
          setError("Game not found on ESPN");
          setPossessionTeam(undefined);
          console.warn("Game not found for home/away:", home, away);
          return;
        }

        const summaryUrl = `https://site.api.espn.com/apis/site/v2/sports/football/nfl/summary?event=${foundGame.id}`;
        console.log("Fetching summary:", summaryUrl);

        const { data: summary } = await axios.get(summaryUrl);

        // Log home/away ESPN IDs
        console.log("Home internal ID:", home, "→ ESPN ID:", teamIdMap[home]);
        console.log("Away internal ID:", away, "→ ESPN ID:", teamIdMap[away]);

        const possessionId = summary?.situation?.possession;
        console.log("Raw possessionId from ESPN:", possessionId);

        // Debug log for your mapping
        const entry = Object.entries(teamIdMap).find(
          ([internalId, espnId]) => espnId === possessionId
        );
        console.log("Matching entry in teamIdMap:", entry);

        const possessionTeamInternalId = entry
          ? Number(entry[0])
          : undefined;

        console.log("Mapped possessionTeamInternalId:", possessionTeamInternalId);

        setPossessionTeam(possessionTeamInternalId);
      } catch (err: any) {
        console.error("Error fetching possession:", err);
        setError(err.message || "Failed to fetch possession");
        setPossessionTeam(undefined);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [home, away, date]);

  return { possessionTeam, possesionLoading, error };
};
