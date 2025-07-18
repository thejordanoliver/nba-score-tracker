import { CustomHeaderTitle } from "@/components/CustomHeaderTitle";
import GameCard from "@/components/GameCard";
import PlayerStatTable from "@/components/player/PlayerStatTable";
import SeasonStatCard from "@/components/player/SeasonStatCard";
import players from "@/constants/players"; // player image map
import { useLastTeamGame } from "@/hooks/useLastTeamGame";
import axios from "axios";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";
import { teams } from "../../constants/teams";
import type { Game } from "../../types/types";

import Heading from "@/components/Heading";
import PlayerHeader from "@/components/player/PlayerHeader";
type DbPlayer = {
  id: number;
  player_id: number;
  first_name: string;
  last_name: string;
  team_id: number;
  position: string;
  headshot_url: string;
  jersey_number: string;
  weight: string;
  height: string;
  birth_date: string;
  college: string;
  nba_start: number;
  nba_pro: number;
};

const BASE_API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function PlayerDetailScreen() {
  const params = useLocalSearchParams();
  const playerIdParam = Array.isArray(params.id) ? params.id[0] : params.id; // read `id` param here
  const teamIdParam = Array.isArray(params.teamId)
    ? params.teamId[0]
    : params.teamId;

  console.log("playerIdParam:", playerIdParam);

  const parsedPlayerId = parseInt(playerIdParam ?? "", 10);
  const sanitizedTeamId = String(teamIdParam ?? "")
    .replace(/"/g, "")
    .trim();

  const teamObj = teams.find((t) => String(t.id) === sanitizedTeamId);
  const isDark = useColorScheme() === "dark";
  const teamNumericId = parseInt(sanitizedTeamId, 10);
  const { lastGame: teamLastGame, loading: teamGameLoading } =
    useLastTeamGame(teamNumericId);

  const router = useRouter();
  const navigation = useNavigation();
  const [player, setPlayer] = useState<DbPlayer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const goBack = () => router.back();

  function getApiBaseUrl() {
    if (process.env.EXPO_PUBLIC_API_URL) return process.env.EXPO_PUBLIC_API_URL;

    if (Platform.OS === "android") {
      // Android emulator localhost workaround
      return "http://10.0.2.2:4000";
    }

    // iOS simulator or web fallback
    return BASE_API_URL;
  }

  const API_URL = getApiBaseUrl();

  useEffect(() => {
    if (isNaN(parsedPlayerId)) {
      setError("Invalid player ID");
      setLoading(false);
      return;
    }

    const fetchPlayer = async () => {
      setLoading(true);
      try {
        const resp = await axios.get<{ player: DbPlayer }>(
          `${API_URL}/api/players/player-id/${parsedPlayerId}`
        );
        setPlayer(resp.data.player);
      } catch (err: any) {
        setError(err.message || "Failed to load player data.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlayer();
  }, [parsedPlayerId]);

  const calculateAge = (birthDateString?: string) => {
    if (!birthDateString) return null;
    const birthDate = new Date(birthDateString);
    if (isNaN(birthDate.getTime())) return null;

    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const fullName = player
    ? `${player.first_name} ${player.last_name}`
    : "Player Details";

  const avatarUrl = player?.headshot_url || players[fullName];

  // Memoize styles based on dark mode
  const dynamicStyles = useMemo(() => {
    return StyleSheet.create({
      scrollView: {
        backgroundColor: isDark ? "#1d1d1d" : "#fff",
      },
      containerBorder: {
        borderBottomColor: isDark ? "#444" : "#ccc",
      },
      textColor: {
        color: isDark ? "#fff" : "#000",
      },
      nameColor: {
        color: isDark ? "#fff" : teamObj?.color,
      },
      errorTextColor: {
        color: isDark ? "red" : "darkred",
      },
      avatarBorder: {
        borderRightColor: isDark ? "#444" : "#ddd",
      },
      avatarBackground: {
        backgroundColor: isDark ? "#444" : "#ddd",
      },
      jerseyText: {
        color: isDark ? "#fff" : teamObj?.color,
      },
    });
  }, [isDark, teamObj]);

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <CustomHeaderTitle
          playerName={fullName}
          logo={teamObj?.logo}
          logoLight={teamObj?.logoLight}
          teamColor={teamObj?.color}
          onBack={goBack}
          isTeamScreen={!!teamObj}
          isPlayerScreen={true} // 👈 Add this
        />
      ),
    });
  }, [navigation, fullName, teamObj, isDark]);

  const initial = player ? player.first_name[0]?.toUpperCase() : "?";
 const teamGameTransformed: Game | null = teamLastGame
  ? {
      id: teamLastGame.id,
      date: teamLastGame.date.start,
      time: new Date(teamLastGame.date.start).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      }),
      home: {
        id: String(teamLastGame.teams.home.id), // ✅ required
        name: teamLastGame.teams.home.name,
        logo: "", // You can map this later with `teams` if needed
        record: teamLastGame.teams.home.record?.summary ?? "",
        fullName: teamLastGame.teams.home.name,
      },
      away: {
        id: String(teamLastGame.teams.visitors.id), // ✅ required
        name: teamLastGame.teams.visitors.name,
        logo: "",
        record: teamLastGame.teams.visitors.record?.summary ?? "",
        fullName: teamLastGame.teams.visitors.name,
      },
      status: "Final",
      homeScore: teamLastGame.scores.home.points,
      awayScore: teamLastGame.scores.visitors.points,
      isPlayoff: false,
    }
  : null;


  const seasons = useMemo(() => {
    const start = player?.nba_start || 2015;
    return Array.from(
      { length: new Date().getFullYear() - start + 1 },
      (_, i) => (start + i).toString()
    );
  }, [player]);

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
      {player && (
<PlayerHeader
  player={player}
  avatarUrl={avatarUrl}
  isDark={isDark}
  teamColor={teamObj?.color}              // primary team color
  teamSecondaryColor={teamObj?.secondaryColor} // secondary team color
  team_name={teamObj?.name}                // team name string
  calculateAge={calculateAge}
/>


      )}

      {!loading && !error && player && (
        <View style={{ padding: 16 }}>
          <SeasonStatCard
            playerId={parsedPlayerId}
            teamColor={teamObj?.secondaryColor}
            teamColorDark={teamObj?.secondaryColor}
          />
        </View>
      )}
      {!teamGameLoading && teamGameTransformed && (
        <>
          <Heading>Previous Game</Heading>
          <View style={{ paddingHorizontal: 16 }}>
            <GameCard game={teamGameTransformed} isDark={isDark} />
          </View>

          <Heading>Career Stats</Heading>
          <View style={{ paddingHorizontal: 16 }}>
            <PlayerStatTable playerId={parsedPlayerId} seasons={seasons} />
          </View>
        </>
      )}
    </ScrollView>
  );
}
