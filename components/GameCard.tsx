import { useESPNBroadcasts } from "@/hooks/useESPNBroadcasts";
import { matchBroadcastToGame } from "@/utils/matchBroadcast";
import { LinearGradient } from "expo-linear-gradient";
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

import { teams } from "../constants/teams";
import { useFetchPlayoffGames } from "../hooks/usePlayoffSeries";
import { getStyles } from "../styles/GameCard.styles";
import { Game, Team } from "../types/types";

const OSEXTRALIGHT = "Oswald_200ExtraLight";
const OSREGULAR = "Oswald_400Regular";
const OSMEDIUM = "Oswald_500Medium";
const OSBOLD = "Oswald_700Bold";
const OSSEMIBOLD = "Oswald_600SemiBold";

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

  const homeTeam = (game.home ?? {
    name: "Unknown",
    logo: "",
    record: "-",
    fullName: "Unknown",
  }) as Team;
  const awayTeam = (game.away ?? {
    name: "Unknown",
    logo: "",
    record: "-",
    fullName: "Unknown",
  }) as Team;

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


  // 🧠 Fetch updated playoff game info (if available)
  const homeId = Number(homeTeamData?.id);
  const awayId = Number(awayTeamData?.id);

  const playoffGames =
    homeId && awayId ? useFetchPlayoffGames(homeId, awayId, 2024).games : [];

  const currentPlayoffGame = playoffGames.find((g) => g.id === game.id);
  const gameNumber = currentPlayoffGame?.gameNumber;
  const seriesSummary = currentPlayoffGame?.seriesSummary;
  const isEndOfPeriod = game.periods?.endOfPeriod === true;
  const currentPeriod = game.periods?.current ?? game.period;
  const gameDate = new Date(game.date);
  const isNBAFinals =
    gameDate.getMonth() === 5 &&
    gameDate.getDate() >= 5 &&
    gameDate.getDate() <= 22;
  const isChristmasDay =
    gameDate.getMonth() === 11 && gameDate.getDate() === 25;
  const isNewYearsDay = gameDate.getMonth() === 0 && gameDate.getDate() === 1;
  const holidayLabel = isChristmasDay
    ? "Christmas Day"
    : isNewYearsDay
      ? "New Year's Day"
      : null;
  const finalsScoreStyle = (isWinner: boolean): TextStyle => ({
    color: isWinner ? "#000" : "rgba(0, 0, 0, 0.4)",
    fontWeight: isWinner ? "bold" : "normal",
  });

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
      {isNBAFinals ? (
        <LinearGradient
          colors={["#DFBD69", "#CDA765"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.card}
        >
          {/* Away team */}
          <View style={styles.teamSection}>
            <Image
              source={getLogoSource(awayTeamData, awayTeam)}
              style={styles.logo}
              accessibilityLabel={`${awayTeam.name} logo`}
            />
            <Text style={[styles.teamName, { color: "#000" }]}>
              {awayTeam.name}
            </Text>
          </View>

          {/* Away score or record */}
          <Text
            style={[
              game.status === "Scheduled"
                ? styles.teamRecord
                : styles.teamScore,
              game.status !== "Scheduled"
                ? finalsScoreStyle(awayWins)
                : { color: "#000", opacity: 0.6 },
            ]}
          >
            {game.status === "Scheduled"
              ? awayTeam.record || "-"
              : (game.awayScore ?? "-")}
          </Text>

          {/* Game info */}
          <View style={styles.info}>
            {/* 🆕 Game number + series summary at the top of info section */}
            {(gameNumberLabel || seriesSummary || holidayLabel) && (
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
                        color: "#000",
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
                  {gameNumberLabel && (seriesSummary || holidayLabel) && (
                    <View
                      style={{
                        height: 10,
                        width: 1,
                        backgroundColor: "#000",
                        opacity: 0.3,
                      }}
                    />
                  )}
                  {seriesSummary && (
                    <Text
                      style={{
                        color: "#000",
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
                  {holidayLabel && (
                    <Text
                      style={{
                        color: "#000",
                        fontFamily: OSEXTRALIGHT,
                        fontSize: 10,
                        textAlign: "center",
                        maxWidth: 180,
                        opacity: 0.8,
                      }}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {holidayLabel}
                    </Text>
                  )}
                </View>
              </View>
            )}

            {/* Status and time */}
            {isFinal ? (
              <>
                <Text style={[styles.finalText, { color: "rgb(204, 0, 0)" }]}>
                  Final
                </Text>
                <Text
                  style={[styles.dateFinal, { color: "rgba(0, 0, 0, .5)" }]}
                >
                  {new Date(game.date).toLocaleDateString("en-US", {
                    month: "numeric",
                    day: "numeric",
                  })}
                </Text>
              </>
            ) : game.status === "Scheduled" ? (
              <>
                <Text style={[styles.date, { color: "#000" }]}>
                  {new Date(game.date).toLocaleDateString("en-US", {
                    month: "numeric",
                    day: "numeric",
                  })}
                </Text>
                <Text style={[styles.time, { color: "#000" }]}>
                  {game.time}
                </Text>
              </>
            ) : inProgress ? (
              <>
                <Text style={styles.date}>
                  {game.isHalftime
                    ? "Halftime"
                    : isEndOfPeriod
                      ? `End of Q${currentPeriod}`
                      : `Q${currentPeriod ?? "Live"}`}
                </Text>
                {!game.isHalftime && !isEndOfPeriod && game.clock ? (
                  <Text style={[styles.clock, { color: "#000" }]}>
                    {game.clock}
                  </Text>
                ) : null}

                {broadcastNetworks && (
                  <Text style={[styles.broadcast, { color: "#000" }]}>
                    {broadcastNetworks}
                  </Text>
                )}
              </>
            ) : null}
          </View>

          {/* Home score or record */}
          <Text
            style={[
              game.status === "Scheduled"
                ? styles.teamRecord
                : styles.teamScore,
              game.status !== "Scheduled"
                ? finalsScoreStyle(homeWins)
                : { color: "#000", opacity: 0.6 },
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
            <Text style={[styles.teamName, { color: "#000" }]}>
              {homeTeam.name}
            </Text>
          </View>

          {/* ... your existing card content ... */}
        </LinearGradient>
      ) : (
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
              game.status === "Scheduled"
                ? styles.teamRecord
                : styles.teamScore,
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
            {(gameNumberLabel || seriesSummary || holidayLabel) && (
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
                  {gameNumberLabel && (seriesSummary || holidayLabel) && (
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
                  {holidayLabel && (
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
                      {holidayLabel}
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
                  {game.isHalftime
                    ? "Halftime"
                    : isEndOfPeriod
                      ? `End of Q${currentPeriod}`
                      : `Q${currentPeriod ?? "Live"}`}
                </Text>
                {!game.isHalftime && !isEndOfPeriod && game.clock ? (
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
              game.status === "Scheduled"
                ? styles.teamRecord
                : styles.teamScore,
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
      )}
    </TouchableOpacity>
  );
}
