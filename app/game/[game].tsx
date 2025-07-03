import LastFiveGamesSwitcher from "@/components/LastFiveGames";
import TeamLocationSection from "@/components/TeamLocationSection";
import TeamLocationSkeleton from "@/components/TeamLocationSkeleton";
import { useLastFiveGames } from "@/hooks/useLastFiveGames";
import { useFetchPlayoffGames } from "@/hooks/usePlayoffSeries";
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
const OSBOLD = "Oswald_700Bold";
const OSSEMIBOLD = "Oswald_600SemiBold";

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

type Game = {
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
};

export default function GameDetailsScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const { game } = useLocalSearchParams();
  const parsedGame: Game = JSON.parse(game as string);
  const isDark = useColorScheme() === "dark";
  const navigation = useNavigation();

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

  const homeLastGames = useLastFiveGames(Number(homeTeamData.id));
  const awayLastGames = useLastFiveGames(Number(awayTeamData.id));

  const { games: playoffGames } = useFetchPlayoffGames(
    Number(homeTeamData.id),
    Number(awayTeamData.id),
    2024
  );

  // Weather hook call with arena location or city
  const {
    weather,
    loading: weatherLoading,
    error: weatherError,
  } = useWeatherForecast(
    homeTeamData.latitude ?? null,
    homeTeamData.longitude ?? null,
    `${date}T${time}` // game date and time in ISO format
  );

  const currentPlayoffGame = playoffGames.find((g) => g.id === parsedGame.id);
  const seriesRecord = currentPlayoffGame?.seriesRecord;
  const seriesSummary = currentPlayoffGame?.seriesSummary;

  const displayDate = new Date(date).toLocaleDateString("en-US", {
    month: "numeric",
    day: "numeric",
  });

  const awayIsWinner =
    status === "Final" && (awayScore ?? 0) > (homeScore ?? 0);
  const homeIsWinner =
    status === "Final" && (homeScore ?? 0) > (awayScore ?? 0);

  useLayoutEffect(() => {
    if (homeTeamData && awayTeamData) {
      navigation.setOptions({
        header: () => (
          <CustomHeaderTitle
            title={`${awayTeamData.code} @ ${homeTeamData.code}`}
            tabName="Game"
            onBack={goBack}
          />
        ),
      });
    }
  }, [navigation, homeTeamData, awayTeamData, isDark]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 400);
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
      contentContainerStyle={styles.container}
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
              isDark && awayTeamData?.logoLight
                ? awayTeamData.logoLight
                : awayTeamData?.logo || require("../../assets/Logos/NBA.png"),
          }}
          isDark={isDark}
          score={awayScore}
          isWinner={awayIsWinner}
          colors={colors}
        />

        <GameInfo
          status={status}
          date={displayDate}
          time={time}
          clock={clock}
          period={period}
          colors={colors}
          isDark={isDark}
        />

        {/* Game Number and Series Summary */}
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
              isDark && homeTeamData?.logoLight
                ? homeTeamData.logoLight
                : homeTeamData?.logo || require("../../assets/Logos/NBA.png"),
          }}
          isDark={isDark}
          isHome
          score={homeScore}
          isWinner={homeIsWinner}
          colors={colors}
        />
      </View>

      <View style={{ flexDirection: "row", marginTop: 20 }}>
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
            teamLogoLight: awayTeamData.logoLight,
            teamLogo: awayTeamData.logo,
            games: awayLastGames.games,
          }}
        />
      </View>

      {isLoading ? (
        <TeamLocationSkeleton />
      ) : (
        homeTeamData && (
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
        )
      )}
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
    position: "relative", // to allow absolute children positioning
  },
  teamName: {
    fontFamily: OSREGULAR,
    fontSize: 14,
    textAlign: "center",
  },
  score: {
    fontFamily: OSMEDIUM,
    fontSize: 28,
    textAlign: "center",
  },
  record: {
    fontFamily: OSREGULAR,
    fontSize: 12,
    textAlign: "center",
  },
  statusText: {
    fontFamily: OSMEDIUM,
    fontSize: 16,
    textAlign: "center",
  },
  timeText: {
    fontFamily: OSREGULAR,
    fontSize: 12,
    textAlign: "center",
  },
});
