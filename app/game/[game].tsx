import { CustomHeaderTitle } from "@/components/CustomHeaderTitle";
import {
  BoxScore,
  GameInfo,
  GameLeaders,
  GameTeamStats,
  LastFiveGamesSwitcher,
  LineScore,
  PredictionBar,
  TeamLocationSection,
  TeamRow,
} from "@/components/GameDetails";
import GameUniforms from "@/components/GameDetails/GameUniforms";
import { Fonts } from "@/constants/fonts";
import { arenaImages, neutralArenas, teams } from "@/constants/teams";
import { useGameStatistics } from "@/hooks/useGameStatistics";
import { useHistoricalOdds } from "@/hooks/useHistoricalOdds";
import { useLastFiveGames } from "@/hooks/useLastFiveGames";
import { useFetchPlayoffGames } from "@/hooks/usePlayoffSeries";
import { useGamePrediction } from "@/hooks/usePredictions";
import { useWeatherForecast } from "@/hooks/useWeather";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { goBack } from "expo-router/build/global-state/routing";
import React, { useCallback, useLayoutEffect, useMemo } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";

export default function GameDetailsScreen() {
  const { game } = useLocalSearchParams();
  const isDark = useColorScheme() === "dark";
  const navigation = useNavigation();

  if (typeof game !== "string") return null;

  let parsedGame: any;
  try {
    parsedGame = JSON.parse(game);
  } catch (e) {
    console.warn("Failed to parse game:", game);
    return null;
  }

  if (!parsedGame || !parsedGame.id) return null;

  const {
    home,
    away,
    date,
    time,
    status,
    homeScore,
    awayScore,
    period,
    clock,
    arena,
    linescore,
    id: gameId,
  } = parsedGame;

  // 🟢 Memoized derived values
  const homeTeamData = useMemo(
    () =>
      teams.find(
        (t) =>
          t.name === home.name ||
          t.code === home.name ||
          t.fullName === home.name
      ),
    [home.name]
  );

  const awayTeamData = useMemo(
    () =>
      teams.find(
        (t) =>
          t.name === away.name ||
          t.code === away.name ||
          t.fullName === away.name
      ),
    [away.name]
  );

  if (!homeTeamData || !awayTeamData) return null;

  const homeTeamIdNum = Number(homeTeamData.id);
  const awayTeamIdNum = Number(awayTeamData.id);

  const homeColor = homeTeamData.color || "#007A33";
  const awayColor = awayTeamData.color || "#CE1141";

  const arenaNameFromGame = arena?.name ?? "";
  const arenaCityFromGame = arena?.city ?? "";
  const neutralArenaData = neutralArenas[arenaNameFromGame];

  const cleanedArenaName = useMemo(
    () => arenaNameFromGame.replace(/\s*\(.*?\)/, "").trim(),
    [arenaNameFromGame]
  );

  const resolvedArenaName = useMemo(
    () => cleanedArenaName || homeTeamData.arenaName,
    [cleanedArenaName, homeTeamData.arenaName]
  );
  const resolvedArenaCity = useMemo(
    () => arenaCityFromGame || homeTeamData.location,
    [arenaCityFromGame, homeTeamData.location]
  );
  const resolvedArenaAddress =
    neutralArenaData?.address || homeTeamData.address || "";
  const resolvedArenaCapacity =
    neutralArenaData?.arenaCapacity || homeTeamData.arenaCapacity || "";
  const resolvedArenaImage =
    neutralArenaData?.arenaImage ||
    arenaImages[arenaNameFromGame] ||
    arenaImages[arenaCityFromGame] ||
    arenaImages[homeTeamData.code] ||
    homeTeamData.arenaImage;

  // const gameDate = new Date(date).toISOString().split("T")[0];
  // const { data: historicalOdds, loading: oddsLoading, error: oddsError } =
  //   useHistoricalOdds({
  //     date: gameDate,
  //     team1: awayTeamData.code,
  //     team2: homeTeamData.code,
  //   });

  const lat =
    neutralArenaData?.latitude ??
    arena?.latitude ??
    homeTeamData.latitude ??
    null;
  const lon =
    neutralArenaData?.longitude ??
    arena?.longitude ??
    homeTeamData.longitude ??
    null;

  // 🟢 Memoize colors
  const colors = useMemo(
    () => ({
      background: isDark ? "#1d1d1d" : "#ffffff",
      text: isDark ? "#ffffff" : "#000000",
      secondaryText: isDark ? "#aaa" : "#444",
      record: isDark ? "#ccc" : "#555",
      score: isDark ? "#aaa" : "rgba(0, 0, 0, 0.4)",
      winnerScore: isDark ? "#fff" : "#000",
      live: isDark ? "#0f0" : "#090",
      border: isDark ? "#333" : "#ccc",
      finalText: isDark ? "#ff4c4c" : "#d10000",
    }),
    [isDark]
  );

  const season = 2024;
  const homeLastGames = useLastFiveGames(homeTeamIdNum);
  const awayLastGames = useLastFiveGames(awayTeamIdNum);

  const { data: gameStats, loading: statsLoading } =
    useGameStatistics(gameId);
  const { games: playoffGames } = useFetchPlayoffGames(
    homeTeamIdNum,
    awayTeamIdNum,
    season
  );
  const {
    data: prediction,
    loading: predictionLoading,
    error: predictionError,
  } = useGamePrediction(homeTeamIdNum, awayTeamIdNum, season);

  const { weather, loading, error } = useWeatherForecast(lat, lon, date);

  const currentPlayoffGame = playoffGames.find((g) => g.id === gameId);

  const awayIsWinner =
    status === "Final" && (awayScore ?? 0) > (homeScore ?? 0);
  const homeIsWinner =
    status === "Final" && (homeScore ?? 0) > (awayScore ?? 0);

  const cleanedArenaNameLower = cleanedArenaName.toLowerCase();
  const homeArenaNameLower = homeTeamData.arenaName.toLowerCase();
  const awayArenaNameLower = awayTeamData.arenaName.toLowerCase();

  const isNeutralSiteByArena =
    cleanedArenaNameLower !== "" &&
    cleanedArenaNameLower !== homeArenaNameLower &&
    cleanedArenaNameLower !== awayArenaNameLower;

  const isHomeSiteByArena = cleanedArenaNameLower === homeArenaNameLower;

  const headerTitle = useMemo(() => {
    return isNeutralSiteByArena
      ? `${awayTeamData.code} vs ${homeTeamData.code}`
      : isHomeSiteByArena
      ? `${awayTeamData.code} @ ${homeTeamData.code}`
      : `${awayTeamData.code} vs ${homeTeamData.code}`;
  }, [isNeutralSiteByArena, isHomeSiteByArena, homeTeamData.code, awayTeamData.code]);

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <CustomHeaderTitle title={headerTitle} tabName="Game" onBack={goBack} />
      ),
    });
  }, [navigation, headerTitle]);

  const getGameNumberLabel = useCallback(() => {
    if (currentPlayoffGame?.gameNumber)
      return `Game ${currentPlayoffGame.gameNumber}`;
    if (status === "Scheduled") return `Game ${playoffGames.length + 1}`;
    return null;
  }, [currentPlayoffGame, status, playoffGames.length]);

  const seriesSummary = currentPlayoffGame?.seriesSummary;

  return (
    <ScrollView
      contentContainerStyle={[styles.container, { paddingBottom: 140 }]}
      style={{ backgroundColor: colors.background }}
    >
      <View style={[styles.teamsContainer, { borderColor: colors.border }]}>
        <TeamRow
          team={{
            id: awayTeamData.id,
            code: awayTeamData.code,
            name: away.name,
            record: away.record,
            logo:
              isDark && awayTeamData.logoLight
                ? awayTeamData.logoLight
                : awayTeamData.logo || require("../../assets/Logos/NBA.png"),
          }}
          isDark={isDark}
          score={awayScore}
          isWinner={awayIsWinner}
          colors={colors}
        />

        <GameInfo
          status={status}
          date={date}
          time={time}
          clock={clock}
          period={period}
          colors={colors}
          isDark={isDark}
          homeTeam={home.name}
          awayTeam={away.name}
        />

        {playoffGames.length > 0 && (getGameNumberLabel() || seriesSummary) && (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              marginVertical: 4,
              position: "absolute",
              top: -25,
              width: "100%",
            }}
          >
            {getGameNumberLabel() && (
              <Text
                style={{
                  color: colors.text,
                  fontFamily: Fonts.OSEXTRALIGHT,
                  fontSize: 14,
                  textAlign: "center",
                }}
              >
                {getGameNumberLabel()}
              </Text>
            )}
            {getGameNumberLabel() && seriesSummary && (
              <View
                style={{
                  height: 16,
                  width: 1,
                  backgroundColor: colors.text,
                  opacity: 0.4,
                  marginHorizontal: 8,
                }}
              />
            )}
            {seriesSummary &&
              (status === "Final" || status === "Scheduled") && (
                <Text
                  style={{
                    color: colors.text,
                    fontFamily: Fonts.OSEXTRALIGHT,
                    fontSize: 14,
                    textAlign: "center",
                    flexShrink: 1,
                  }}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {seriesSummary}
                </Text>
              )}
          </View>
        )}

        <TeamRow
          team={{
            id: homeTeamData.id,
            code: homeTeamData.code,
            name: home.name,
            record: home.record,
            logo:
              isDark && homeTeamData.logoLight
                ? homeTeamData.logoLight
                : homeTeamData.logo || require("../../assets/Logos/NBA.png"),
          }}
          isDark={isDark}
          isHome
          score={homeScore}
          isWinner={homeIsWinner}
          colors={colors}
        />
      </View>

      <View style={{marginTop: 20 }}>
          {linescore && (
          <LineScore
            linescore={linescore}
            homeCode={homeTeamData.code}
            awayCode={awayTeamData.code}
          />
        )}
        
        {prediction && !predictionLoading && !predictionError && (
          <PredictionBar
            homeWinProbability={prediction.homeWinProbability * 100}
            awayWinProbability={prediction.awayWinProbability * 100}
            homeColor={homeColor}
            awayColor={awayColor}
            homeSecondaryColor={homeTeamData.secondaryColor}
            awaySecondaryColor={awayTeamData.secondaryColor}
            homeTeamId={homeTeamData.id}
            awayTeamId={awayTeamData.id}
          />
        )}
        {predictionError && (
          <Text style={{ color: "red" }}>
            Prediction error: {predictionError}
          </Text>
        )}

      

        <GameLeaders
          gameId={gameId.toString()}
          awayTeamId={awayTeamIdNum}
          homeTeamId={homeTeamIdNum}
        />

        <BoxScore
          gameId={gameId.toString()}
          homeTeamId={homeTeamIdNum}
          awayTeamId={awayTeamIdNum}
        />

        {!statsLoading && gameStats && <GameTeamStats stats={gameStats} />}

        <LastFiveGamesSwitcher
          isDark={isDark}
          home={{
            teamCode: homeTeamData.code,
            teamLogo: homeTeamData.logo,
            teamLogoLight: homeTeamData.logoLight,
            games: homeLastGames.games,
          }}
          away={{
            teamCode: awayTeamData.code,
            teamLogo: awayTeamData.logo,
            teamLogoLight: awayTeamData.logoLight,
            games: awayLastGames.games,
          }}
        />

        <GameUniforms
          homeTeamId={homeTeamData.id}
          awayTeamId={awayTeamData.id}
        />

        <TeamLocationSection
          arenaImage={resolvedArenaImage}
          arenaName={resolvedArenaName}
          location={resolvedArenaCity}
          address={resolvedArenaAddress}
          arenaCapacity={resolvedArenaCapacity}
          weather={weather}
          loading={loading}
          error={error}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
    paddingHorizontal: 12,
    paddingBottom: 60,
  },
  teamsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderBottomWidth: 1,
    paddingBottom: 12,
    position: "relative",
  },
});
