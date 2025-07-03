import { CustomHeaderTitle } from "@/components/CustomHeaderTitle";
import GameCard, { Game as GameCardType } from "@/components/GameCard";
import PlayerStatTable from "@/components/PlayerStatTable";
import SeasonStatCard from "@/components/SeasonStatCard";
import players from "@/constants/players"; // player image map
import { useLastTeamGame } from "@/hooks/useLastTeamGame";
import axios from "axios";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { teams } from "../../constants/teams";

const OSEXTRALIGHT = "Oswald_200ExtraLight";
const OSLIGHT = "Oswald_300Light";
const OSREGULAR = "Oswald_400Regular";
const OSMEDIUM = "Oswald_500Medium";
const OSBOLD = "Oswald_700Bold";
const OSSEMIBOLD = "Oswald_600SemiBold";

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
    return "https://80c4-132-170-9-118.ngrok-free.app";
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
  const teamGameTransformed: GameCardType | null = teamLastGame
    ? {
        id: teamLastGame.id,
        date: teamLastGame.date.start,
        time: new Date(teamLastGame.date.start).toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
        }),
        home: {
          name: teamLastGame.teams.home.name,
          logo: "",
        },
        away: {
          name: teamLastGame.teams.visitors.name,
          logo: "",
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
    <ScrollView
      style={[styles.container, dynamicStyles.scrollView]}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Player Header */}
      <View style={styles.playerHeader}>
        {loading ? (
          <ActivityIndicator size="large" color={isDark ? "white" : "black"} />
        ) : error ? (
          <Text style={dynamicStyles.errorTextColor}>{error}</Text>
        ) : player ? (
          <>
            <View style={[styles.avatarContainer, dynamicStyles.avatarBorder]}>
              {avatarUrl ? (
                <Image
                  source={{ uri: avatarUrl }}
                  style={[styles.avatar, dynamicStyles.avatarBackground]}
                  accessibilityLabel={`${player.first_name} ${player.last_name} photo`}
                />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.initial}>{initial}</Text>
                </View>
              )}
              <View style={styles.jerseyNumber}>
                <Text style={[styles.jersey, dynamicStyles.jerseyText]}>
                  {player.position?.charAt(0) ?? "N"} #
                  {player.jersey_number ?? "?"}
                </Text>
              </View>
            </View>

            <View style={styles.infoContainer}>
              <Text style={[styles.name, dynamicStyles.nameColor]}>
                {player?.first_name}
              </Text>
              <Text style={[styles.name, dynamicStyles.nameColor]}>
                {player?.last_name}
              </Text>

              <Text style={[styles.playerInfo, dynamicStyles.textColor]}>
                <Text
                  style={[dynamicStyles.nameColor, { fontFamily: OSMEDIUM }]}
                >
                  School:{" "}
                </Text>
                {player?.college || "Unknown"}
              </Text>

              <Text style={[styles.playerInfo, dynamicStyles.textColor]}>
                <Text
                  style={[dynamicStyles.nameColor, { fontFamily: OSMEDIUM }]}
                >
                  Height:{" "}
                </Text>
                {player?.height ?? "?"}
              </Text>

              <Text style={[styles.playerInfo, dynamicStyles.textColor]}>
                <Text
                  style={[dynamicStyles.nameColor, { fontFamily: OSMEDIUM }]}
                >
                  Weight:{" "}
                </Text>
                {player?.weight ?? "?"} lbs
              </Text>

              <Text style={[styles.playerInfo, dynamicStyles.textColor]}>
                <Text
                  style={[dynamicStyles.nameColor, { fontFamily: OSMEDIUM }]}
                >
                  Birth:{" "}
                </Text>
                {player?.birth_date
                  ? `${new Date(player.birth_date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })} (${calculateAge(player.birth_date) ?? "?"} years old)`
                  : "Unknown"}
              </Text>
            </View>
          </>
        ) : (
          <Text style={dynamicStyles.textColor}>Player not found.</Text>
        )}
      </View>

      {/* Season Stats */}
      {!loading && !error && player && (
        <View style={{ padding: 16 }}>
          <SeasonStatCard
            playerId={parsedPlayerId}
            teamColor={teamObj?.secondaryColor}
            teamColorDark={ teamObj?.secondaryColor}
          />
        </View>
      )}

      {/* Last Game + PlayerStatTable */}
      {!teamGameLoading && teamGameTransformed && (
        <View style={{ paddingHorizontal: 16, marginTop: 16 }}>
          <Text
            style={{
              fontSize: 20,
              fontFamily: OSMEDIUM,
              marginBottom: 8,
              marginTop: 8,
              paddingBottom: 4,
              borderBottomWidth: 1,
              borderBottomColor: isDark ? "#444" : "#ccc",
              color: isDark ? "#fff" : "#1d1d1d",
            }}
          >
            Previous Game
          </Text>
          <GameCard game={teamGameTransformed} isDark={isDark} />

          <View style={{ marginTop: 16 }}>
            <Text
              style={{
                fontSize: 20,
                fontFamily: OSMEDIUM,
                marginBottom: 8,
                paddingBottom: 4,
                borderBottomWidth: 1,
                borderBottomColor: isDark ? "#444" : "#ccc",
                color: isDark ? "#fff" : "#1d1d1d",
              }}
            >
              Career Stats
            </Text>

            <PlayerStatTable playerId={parsedPlayerId} seasons={seasons} />
          </View>
          {/* Legend */}
          <View
            style={[
              styles.legendContainer,
              isDark && styles.legendContainerDark,
            ]}
          >
            <View
              style={[
                styles.legendColorBox,
                isDark ? styles.legendColorBoxDark : styles.legendColorBoxLight,
              ]}
            />
            <Text style={[styles.legendText, isDark && styles.textDark]}>
              Best Season (highlighted)
            </Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 100,
  },
  container: {
    flex: 1,
  },
  playerHeader: {
    marginTop: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center", // 🔥 add this
    paddingHorizontal: 16,
  },
  avatarContainer: {
    marginRight: 20,
    paddingRight: 20,
    borderRightWidth: 1,
    alignItems: "center",
  },
  avatar: {
    width: 140,
    height: 140,
    borderRadius: 70,
  },
  avatarPlaceholder: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#888",
    justifyContent: "center",
    alignItems: "center",
  },
  initial: {
    fontSize: 48,
    color: "#fff",
    fontWeight: "bold",
  },
  jerseyNumber: { flexDirection: "row", justifyContent: "center" },
  jersey: {
    fontSize: 36,
    fontFamily: OSBOLD,
    textAlign: "center",
  },
  infoContainer: {
    justifyContent: "center",
  },
  name: {
    fontSize: 24,
    fontFamily: OSBOLD,
  },
  playerInfo: {
    fontFamily: OSLIGHT,
  },
  legendContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginTop: 12,
    borderTopColor: "#ccc",
  },
  legendContainerDark: {
    borderTopColor: "#555",
  },
  legendColorBox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    marginRight: 8,
  },
  legendColorBoxLight: {
    backgroundColor: "#ffd700",
  },
  legendColorBoxDark: {
    backgroundColor: "#5c4300",
  },
  legendText: {
    fontSize: 14,
    fontFamily: OSREGULAR,
  },
  textDark: {
    color: "#eee",
  },
});
