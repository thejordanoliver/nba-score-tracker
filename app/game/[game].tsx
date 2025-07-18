import GameLeaders from "@/components/game-details/GameLeaders";
import GameTeamStats from "@/components/game-details/GameTeamStats";
import LastFiveGamesSwitcher from "@/components/game-details/LastFiveGames";
import LineScore from "@/components/game-details/LineScore";
import TeamLocationSection from "@/components/TeamLocationSection";
import TeamLocationSkeleton from "@/components/TeamLocationSkeleton";
import { useGameStatistics } from "@/hooks/useGameStatistics";
import { useLastFiveGames } from "@/hooks/useLastFiveGames";
import { useFetchPlayoffGames } from "@/hooks/usePlayoffSeries";
import { Game } from "@/types/types";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { goBack } from "expo-router/build/global-state/routing";
import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { CustomHeaderTitle } from "../../components/CustomHeaderTitle";
import { GameInfo, TeamRow } from "../../components/game-details";
import { teams } from "../../constants/teams";
import { useWeatherForecast } from "../../hooks/useWeather";

const OSEXTRALIGHT = "Oswald_200ExtraLight";
const OSREGULAR = "Oswald_400Regular";
const OSMEDIUM = "Oswald_500Medium";

type Team = {
  name: string;
  code: string;
  logo: any;
  logoLight?: any;
  record?: string;
  location?: string;
  arenaImage?: any;
  arenaName?: string;
};

export default function GameDetailsScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const { game } = useLocalSearchParams();
  const isDark = useColorScheme() === "dark";
  const navigation = useNavigation();

  if (typeof game !== "string") return null;
  const parsedGame: Game = JSON.parse(game);

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
    linescore,
  } = parsedGame;

  const homeTeamData = teams.find(
    (t) =>
      t.name === home.name || t.code === home.name || t.fullName === home.name
  );
  const awayTeamData = teams.find(
    (t) =>
      t.name === away.name || t.code === away.name || t.fullName === away.name
  );
  if (!homeTeamData || !awayTeamData) return null;

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

  const homeLastGames = useLastFiveGames(Number(homeTeamData.id));
  const awayLastGames = useLastFiveGames(Number(awayTeamData.id));

  const { data: gameStats, loading: statsLoading } = useGameStatistics(
    parsedGame.id
  );

  const { games: playoffGames } = useFetchPlayoffGames(
    Number(homeTeamData.id),
    Number(awayTeamData.id),
    2024
  );

  const {
    weather,
    loading: weatherLoading,
    error: weatherError,
  } = useWeatherForecast(
    homeTeamData.latitude ?? null,
    homeTeamData.longitude ?? null,
    `${date}T${time}`
  );

  const currentPlayoffGame = playoffGames.find((g) => g.id === parsedGame.id);
  const seriesSummary = currentPlayoffGame?.seriesSummary;

  const awayIsWinner =
    status === "Final" && (awayScore ?? 0) > (homeScore ?? 0);
  const homeIsWinner =
    status === "Final" && (homeScore ?? 0) > (awayScore ?? 0);

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <CustomHeaderTitle
          title={`${awayTeamData.code} @ ${homeTeamData.code}`}
          tabName="Game"
          onBack={goBack}
        />
      ),
    });
  }, [navigation, homeTeamData, awayTeamData, isDark]);

  useEffect(() => {
    const timeout = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(timeout);
  }, []);

  const getGameNumberLabel = () => {
    if (currentPlayoffGame?.gameNumber)
      return `Game ${currentPlayoffGame.gameNumber}`;
    if (status === "Scheduled") return `Game ${playoffGames.length + 1}`;
    return null;
  };

  return (
    <ScrollView
      contentContainerStyle={[styles.container, { paddingBottom: 100 }]}
      style={{ backgroundColor: colors.background }}
    >
      <View style={[styles.teamsContainer, { borderColor: colors.border }]}>
        {/* Away Team */}
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

        {/* Game Info */}
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

        {/* Playoff Summary */}
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
                  fontFamily: OSEXTRALIGHT,
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
                    fontFamily: OSEXTRALIGHT,
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

        {/* Home Team */}
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

      <View style={{ gap: 8, marginTop: 16 }}>
        {parsedGame.linescore && (
          <LineScore
            linescore={parsedGame.linescore}
            homeCode={homeTeamData.code}
            awayCode={awayTeamData.code}
          />
        )}

        <GameLeaders gameId={parsedGame.id.toString()} />
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

        {isLoading ? (
          <TeamLocationSkeleton />
        ) : (
          <TeamLocationSection
            arenaImage={homeTeamData.arenaImage}
            arenaName={homeTeamData.arenaName}
            location={homeTeamData.location}
            address={homeTeamData.address}
            arenaCapacity={homeTeamData.arenaCapacity}
            weather={weather}
            loading={weatherLoading}
            error={weatherError}
          />
        )}
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
