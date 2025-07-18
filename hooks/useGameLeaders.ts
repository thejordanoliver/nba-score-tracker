// hooks/useGameLeaders.ts
import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export function useGameLeaders(gameId: string) {
  const [data, setData] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchLeaders = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await axios.get(`${API_URL}/api/player-stats/${gameId}`);
        if (isMounted) {
          setData(res.data.response);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || "Failed to fetch game leaders");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchLeaders();

    return () => {
      isMounted = false;
    };
  }, [gameId]);

  return {
    data,
    isLoading: loading,
    isError: !!error,
    error,
  };
}
