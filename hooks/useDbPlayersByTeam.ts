import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { Platform } from "react-native";

interface Player {
  id: number;
  name: string;
  jersey_number: string;
  position: string | null;
  avatarUrl: string | null;
  player_id: number;
  height: string;
}

interface PlayersResponse {
  players: Player[];
}

function getApiBaseUrl() {
  if (process.env.EXPO_PUBLIC_API_URL) return process.env.EXPO_PUBLIC_API_URL;

  if (Platform.OS === "android") {
    // Android emulator localhost workaround
    return "http://10.0.2.2:4000";
  }

  // iOS simulator or web fallback
  return "https://4f5b-132-170-9-118.ngrok-free.app";
}

export default function useDbPlayersByTeam(teamId: string) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = getApiBaseUrl();

  const refreshPlayers = useCallback(async () => {
    if (!teamId) return;

    console.log(`Fetching players from: ${API_URL}/api/players/team/${teamId}`);

    setLoading(true);
    try {
      const res = await axios.get<PlayersResponse>(
        `${API_URL}/api/players/team/${teamId}`
      );
      setPlayers(res.data.players || []);
      setError(null);
    } catch (err: any) {
      console.error(
        "Failed to load team players:",
        err.response?.status,
        err.message || err.toString()
      );
      setError("Could not load team roster.");
      setPlayers([]);
    } finally {
      setLoading(false);
    }
  }, [teamId, API_URL]);

  useEffect(() => {
    if (!teamId) return;
    refreshPlayers();
  }, [refreshPlayers, teamId]);

  return {
    players,
    loading,
    error,
    refreshPlayers, // exposed for pull-to-refresh or manual reload
  };
}
