import { useESPNBroadcasts } from "@/hooks/useESPNBroadcasts";
import { matchBroadcastToGame } from "@/utils/matchBroadcast";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import {
  Image,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import PlayoffLogo from "../assets/Logos/playoffslogo.png";
import PlayoffLogoDark from "../assets/Logos/playoffslogodark.png";
import { teams } from "../constants/teams";
import { useFetchPlayoffGames } from "../hooks/usePlayoffSeries";
import { getStyles } from "../styles/GameCard.styles";

const OSEXTRALIGHT = "Oswald_200ExtraLight";
const OSREGULAR = "Oswald_400Regular";
const OSMEDIUM = "Oswald_500Medium";
const OSBOLD = "Oswald_700Bold";
const OSSEMIBOLD = "Oswald_600SemiBold";

type Team = {
  name: string;
  logo: any;
  logoLight?: any;
  record?: string;
};

export type Game = {
  id: number;
  home: Team;
  away: Team;
  date: string;
  time: string;
  status: "Scheduled" | "In Progress" | "Final";
  clock?: string;
  period?: string;
  homeScore?: number;
  awayScore?: number;
  isHalftime?: boolean;
  isPlayoff?: boolean;
  stage?: number;

  // Optional playoff fields
  gameNumber?: number;
  seriesSummary?: string;
};

export default function GameCard({
  game,
  isDark,
}: {
  game: Game;
  isDark?: boolean;
}) {
  const colorScheme = useColorScheme();
  const dark = isDark ?? colorScheme === "dark";
  const styles = getStyles(dark);
  const router = useRouter();

  const homeTeam = game.home ?? { name: "Unknown", logo: "", record: "-" };
  const awayTeam = game.away ?? { name: "Unknown", logo: "", record: "-" };

  const homeTeamData = useMemo(() => {
    return teams.find(
      (t) =>
        homeTeam.name &&
        (t.name === homeTeam.name ||
          t.code === homeTeam.name ||
          t.name.includes(homeTeam.name))
    );
  }, [homeTeam.name]);

  const awayTeamData = useMemo(() => {
    return teams.find(
      (t) =>
        awayTeam.name &&
        (t.name === awayTeam.name ||
          t.code === awayTeam.name ||
          t.name.includes(awayTeam.name))
    );
  }, [awayTeam.name]);

  const isFinal = game.status === "Final";
  const inProgress = game.status === "In Progress";

  const homeWins = isFinal && (game.homeScore ?? 0) > (game.awayScore ?? 0);
  const awayWins = isFinal && (game.awayScore ?? 0) > (game.homeScore ?? 0);
  const isPlayoff =
    game.isPlayoff || (game.stage !== undefined && game.stage >= 4);

  const winnerStyle = (teamWins: boolean): TextStyle | undefined =>
    teamWins
      ? { color: dark ? "#fff" : "#000", fontWeight: "bold" as const }
      : {};

  const getLogoSource = (teamData?: Team, teamFallback?: Team) => {
    if (!teamData && teamFallback?.logo) {
      return { uri: teamFallback.logo };
    }
    if (!teamData) {
      return require("../assets/Logos/NBA.png");
    }
    if (dark && teamData.logoLight) {
      return teamData.logoLight;
    }
    return teamData.logo;
  };

  const { broadcasts } = useESPNBroadcasts();

  const matchedBroadcast = matchBroadcastToGame(game, broadcasts);

  const broadcastNetworks = matchedBroadcast?.broadcasts
    .map((b) => b.network)
    .filter(Boolean)
    .join(", ");

  const renderPlayoffLogo = () =>
    isPlayoff ? (
      <Image
        source={dark ? PlayoffLogoDark : PlayoffLogo}
        style={{
          width: 60,
          height: 20,
          resizeMode: "contain",
          alignSelf: "center",
          marginTop: 4,
        }}
        accessibilityLabel="Playoff Game"
      />
    ) : null;

  // 🧠 Fetch updated playoff game info (if available)
  const homeId = Number(homeTeamData?.id);
  const awayId = Number(awayTeamData?.id);

  const { games: playoffGames } = useFetchPlayoffGames(
    homeId && awayId ? homeId : 0,
    homeId && awayId ? awayId : 0,
    2024
  );

  const currentPlayoffGame = playoffGames.find((g) => g.id === game.id);
  const gameNumber = currentPlayoffGame?.gameNumber;
  const seriesSummary = currentPlayoffGame?.seriesSummary;

  const gameNumberLabel = gameNumber ? `Game ${gameNumber}` : null;
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() =>
        router.push({
          pathname: "/game/[game]",
          params: { game: JSON.stringify(game) },
        })
      }
    >
      <View style={styles.card}>
        {/* Away team */}
        <View style={styles.teamSection}>
          <Image
            source={getLogoSource(awayTeamData, awayTeam)}
            style={styles.logo}
            accessibilityLabel={`${awayTeam.name} logo`}
          />
          <Text style={styles.teamName}>{awayTeam.name}</Text>
        </View>

        {/* Away score or record */}
        <Text
          style={[
            game.status === "Scheduled" ? styles.teamRecord : styles.teamScore,
            winnerStyle(awayWins),
          ]}
        >
          {game.status === "Scheduled"
            ? awayTeam.record || "-"
            : (game.awayScore ?? "-")}
        </Text>

        {/* Game info */}
        <View style={styles.info}>
          {/* 🆕 Game number + series summary at the top of info section */}
          {(gameNumberLabel || seriesSummary) && (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 6,
                paddingHorizontal: 4,
                width: "100%",
                position: "absolute",
                top: -20,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  flexWrap: "nowrap",
                  gap: 6,
                }}
              >
                {gameNumberLabel && (
                  <Text
                    style={{
                      color: dark ? "#fff" : "#000",
                      fontFamily: OSEXTRALIGHT,
                      fontSize: 10,
                      maxWidth: 50,
                      textAlign: "center",
                      opacity: 0.8,
                    }}
                    numberOfLines={1}
                  >
                    {gameNumberLabel}
                  </Text>
                )}
                {gameNumberLabel && seriesSummary && (
                  <View
                    style={{
                      height: 10,
                      width: 1,
                      backgroundColor: dark ? "#fff" : "#000",
                      opacity: 0.3,
                    }}
                  />
                )}
                {seriesSummary && (
                  <Text
                    style={{
                      color: dark ? "#fff" : "#000",
                      fontFamily: OSEXTRALIGHT,
                      fontSize: 10,
                      textAlign: "center",
                      maxWidth: 180,
                      opacity: 0.8,
                    }}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {seriesSummary}
                  </Text>
                )}
              </View>
            </View>
          )}

          {/* Status and time */}
          {isFinal ? (
            <>
              <Text style={styles.finalText}>Final</Text>
              <Text style={styles.dateFinal}>
                {new Date(game.date).toLocaleDateString("en-US", {
                  month: "numeric",
                  day: "numeric",
                })}
              </Text>
            </>
          ) : game.status === "Scheduled" ? (
            <>
              <Text style={styles.date}>
                {new Date(game.date).toLocaleDateString("en-US", {
                  month: "numeric",
                  day: "numeric",
                })}
              </Text>
              <Text style={styles.time}>{game.time}</Text>
            </>
          ) : inProgress ? (
            <>
              <Text style={styles.date}>
                {game.isHalftime ? "Halftime" : (game.period ?? "Live")}
              </Text>
              {game.isHalftime ? (
                <Text style={[styles.clock, { fontWeight: "600" }]}>
                  Halftime
                </Text>
              ) : game.clock ? (
                <Text style={styles.clock}>{game.clock}</Text>
              ) : null}
              {broadcastNetworks && (
                <Text style={styles.broadcast}>{broadcastNetworks}</Text>
              )}
            </>
          ) : null}

        </View>

        {/* Home score or record */}
        <Text
          style={[
            game.status === "Scheduled" ? styles.teamRecord : styles.teamScore,
            winnerStyle(homeWins),
          ]}
        >
          {game.status === "Scheduled"
            ? homeTeam.record || "-"
            : (game.homeScore ?? "-")}
        </Text>

        {/* Home team */}
        <View style={styles.teamSection}>
          <Image
            source={getLogoSource(homeTeamData, homeTeam)}
            style={styles.logo}
            accessibilityLabel={`${homeTeam.name} logo`}
          />
          <Text style={styles.teamName}>{homeTeam.name}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
