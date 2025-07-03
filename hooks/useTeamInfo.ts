import axios from "axios";
import { useEffect, useState } from "react";

type Team = {
  id: number;
  name: string;
  nickname: string;
  code: string;
  location: string;
  city?: string;
  state?: string;
  arena_name: string;
  arena_capacity: number;
  all_time_record: string;
  first_season: string;
  championships: any;
  conference_championships: any;
  conference: string;
  logo_filename: string;
  coach?: string; // added
  coach_image?: string; // added
  primary_color?: string;
  secondary_color?: string;
};

export function useTeamInfo(teamId?: string) {
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  if (!API_URL) {
    throw new Error("Missing EXPO_PUBLIC_API_URL environment variable");
  }
  useEffect(() => {
    if (!teamId) return;

    const controller = new AbortController();

    const fetchTeam = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get<Team>(
          `${API_URL}/api/teams/${teamId}`,
          {
            signal: controller.signal,
          }
        );

        setTeam(response.data);
      } catch (err: any) {
        if (err.name === "CanceledError") return;
        setError(
          err.response?.data?.error || "Failed to fetch team information."
        );
        setTeam(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();

    return () => {
      controller.abort();
    };
  }, [teamId]);

  return { team, loading, error };
}
