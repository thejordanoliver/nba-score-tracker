import { Fonts } from "@/constants/fonts";
import { useESPNBroadcasts } from "@/hooks/useESPNBroadcasts";
import { useTeamInfo } from "@/hooks/useTeamInfo";
import { matchBroadcastToGame } from "@/utils/matchBroadcast";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import {
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import { teams } from "../../constants/teams";
import { useFetchPlayoffGames } from "../../hooks/usePlayoffSeries";
import { getStyles } from "../../styles/GameCard.styles";
import { Game, Team } from "../../types/types";

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

  const { team: homeInfo } = useTeamInfo(homeTeamData?.id?.toString());
  const { team: awayInfo } = useTeamInfo(awayTeamData?.id?.toString());
  const currentPeriodRaw = Number(game.periods?.current ?? game.period);
  const totalPeriodsPlayed =
    game.linescore?.home?.length ??
    game.linescore?.away?.length ??
    currentPeriodRaw;

  const isFinal = game.status === "Final";
  const inProgress = game.status === "In Progress";
  const isCanceled = game.status === "Canceled";
  const isDelayed = game.status === "Delayed";
  const isPostponed = game.status === "Postponed";
  const finalPeriod = isFinal ? totalPeriodsPlayed : currentPeriodRaw;

  const homeWins = isFinal && (game.homeScore ?? 0) > (game.awayScore ?? 0);
  const awayWins = isFinal && (game.awayScore ?? 0) > (game.homeScore ?? 0);

  const winnerStyle = (teamWins: boolean): TextStyle => ({
    color: dark ? "#fff" : "#1d1d1d",
    opacity: inProgress ? 1 : teamWins ? 1 : 0.5, // no fade when in progress
  });

  const finalsScoreStyle = (isWinner: boolean): TextStyle => ({
    color: "#1d1d1d",
    opacity: inProgress ? 1 : isWinner ? 1 : 0.5, // no fade when in progress
  });

  const getLogoSource = (teamData?: Team, teamFallback?: Team) => {
    if (!teamData && teamFallback?.logo) {
      return { uri: teamFallback.logo };
    }
    if (!teamData) {
      return require("../../assets/Logos/NBA.png");
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
  const currentPeriod = Number(game.periods?.current ?? game.period);
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

  const gameNumberLabel = gameNumber ? `Game ${gameNumber}` : null;

  function getTeamRecord(
    team: Team,
    teamData?: Team,
    fallbackInfo?: Team | null
  ) {
    const record =
      team.record && team.record.trim() !== "" && team.record !== "0-0"
        ? team.record
        : teamData?.current_season_record ||
          fallbackInfo?.current_season_record;

    return record ?? "-";
  }

  function getOrdinalQuarter(period?: number, linescoreLength?: number) {
    if (!period) return "Live";

    // ✅ Handle normal 1–4 quarters
    if (period <= 4) {
      switch (period) {
        case 1:
          return "1st";
        case 2:
          return "2nd";
        case 3:
          return "3rd";
        case 4:
          return "4th";
      }
    }

    // ✅ Handle overtime using linescore length
    const overtimeNumber = period - 4; // OT starts after Q4
    return overtimeNumber === 1 ? "OT" : `OT${overtimeNumber}`;
  }

  function getFinalPeriodLabel(period?: number, linescoreLength?: number) {
    if (!period) return "";

    if (period <= 4) {
      return ""; // no need to show quarter on final games usually
    }

    const overtimeNumber = period - 4;
    return overtimeNumber === 1 ? " (OT)" : ` (OT${overtimeNumber})`;
  }

  function getFinalWithQuarterLabel(period?: number) {
    if (!period) return "Final";

    if (period <= 4) {
      const suffix = ["st", "nd", "rd", "th"][period - 1] ?? "th";
      return `Final ${period}${suffix}`;
    }

    const overtimeNumber = period - 4;
    return overtimeNumber === 1 ? "Final OT" : `Final OT${overtimeNumber}`;
  }

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
      {/* NBA Finals Card */}
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
              game.status === "Scheduled" || isCanceled
                ? styles.teamRecord
                : styles.teamScore,
              isCanceled
                ? { color: "red", fontWeight: "bold" }
                : finalsScoreStyle(awayWins),
            ]}
          >
            {isCanceled
              ? "—"
              : game.status === "Scheduled"
                ? getTeamRecord(awayTeam, awayTeamData, awayInfo)
                : (game.awayScore ?? "-")}
          </Text>

          {/* Game info */}
          <View style={styles.info}>
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
                        fontFamily: Fonts.OSEXTRALIGHT,
                        fontSize: 10,
                        textAlign: "center",
                        maxWidth: 180,
                        opacity: 0.8,
                      }}
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
                        fontFamily: Fonts.OSEXTRALIGHT,
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
                        fontFamily: Fonts.OSEXTRALIGHT,
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

            {isCanceled ? (
              <Text
                style={[styles.finalText, { color: "red", fontWeight: "bold" }]}
              >
                Cancelled
              </Text>
            ) : isFinal ? (
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
                      ? `End of ${getOrdinalQuarter(
                          currentPeriod,
                          game.linescore?.home?.length ??
                            game.linescore?.away?.length
                        )}`
                      : getOrdinalQuarter(
                          currentPeriod,
                          game.linescore?.home?.length ??
                            game.linescore?.away?.length
                        )}
                </Text>
                {!game.isHalftime && !isEndOfPeriod && game.clock ? (
                  <Text style={[styles.clock, { color: "#000" }]}>
                    {game.clock}
                  </Text>
                ) : null}

                {broadcastNetworks && broadcastNetworks.length > 0 && (
                  <Text style={styles.broadcast}>{broadcastNetworks}</Text>
                )}
              </>
            ) : null}
          </View>

          {/* Home score or record */}
          <Text
            style={[
              game.status === "Scheduled" || isCanceled
                ? styles.teamRecord
                : styles.teamScore,
              isCanceled
                ? { color: "red", fontWeight: "bold" }
                : finalsScoreStyle(homeWins),
            ]}
          >
            {isCanceled
              ? "—"
              : game.status === "Scheduled"
                ? getTeamRecord(homeTeam, homeTeamData, homeInfo)
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
              game.status === "Scheduled" ||
              isCanceled ||
              isDelayed ||
              isPostponed
                ? styles.teamRecord
                : styles.teamScore,
              winnerStyle(awayWins),
            ]}
          >
            {isCanceled
              ? getTeamRecord(
                  awayTeam,
                  awayTeamData ?? undefined,
                  awayInfo ?? undefined
                )
              : game.status === "Scheduled" ||
                  isCanceled ||
                  isDelayed ||
                  isPostponed
                ? getTeamRecord(
                    awayTeam,
                    awayTeamData ?? undefined,
                    awayInfo ?? undefined
                  )
                : (game.awayScore ?? "-")}
          </Text>

          {/* Game info */}
          <View style={styles.info}>
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
                    <Text style={styles.seriesStatus}>{gameNumberLabel}</Text>
                  )}
                  {gameNumberLabel && (seriesSummary || holidayLabel) && (
                    <View style={styles.seriesDivider} />
                  )}
                  {seriesSummary && (
                    <Text style={styles.seriesStatus}>{seriesSummary}</Text>
                  )}
                  {holidayLabel && (
                    <Text style={styles.seriesStatus}>{holidayLabel}</Text>
                  )}
                </View>
              </View>
            )}

            {isCanceled ? (
              <Text style={styles.finalText}>Canceled</Text>
            ) : isDelayed ? (
              <Text style={styles.finalText}>Delayed</Text>
            ) : isPostponed ? (
              <Text style={styles.finalText}>Postponed</Text>
            ) : isFinal ? (
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
                      ? `End of ${getOrdinalQuarter(
                          currentPeriod,
                          game.linescore?.home?.length ??
                            game.linescore?.away?.length
                        )}`
                      : getOrdinalQuarter(
                          currentPeriod,
                          game.linescore?.home?.length ??
                            game.linescore?.away?.length
                        )}
                </Text>
                {!game.isHalftime && !isEndOfPeriod && game.clock ? (
                  <Text style={[styles.clock]}>{game.clock}</Text>
                ) : null}

                {broadcastNetworks && broadcastNetworks.length > 0 && (
                  <Text style={styles.broadcast}>{broadcastNetworks}</Text>
                )}
              </>
            ) : null}
          </View>

          {/* Home score or record */}
          <Text
            style={[
              game.status === "Scheduled" ||
              isCanceled ||
              isDelayed ||
              isPostponed
                ? styles.teamRecord
                : styles.teamScore,
              winnerStyle(homeWins),
            ]}
          >
            {isCanceled
              ? getTeamRecord(homeTeam, homeTeamData, homeInfo)
              : game.status === "Scheduled" ||
                  isCanceled ||
                  isDelayed ||
                  isPostponed
                ? getTeamRecord(homeTeam, homeTeamData, homeInfo)
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
