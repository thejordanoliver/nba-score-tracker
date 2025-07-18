import { useLocalSearchParams, useNavigation } from "expo-router";
import { goBack } from "expo-router/build/global-state/routing";
import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { ScrollView, Text, useColorScheme, View } from "react-native";
import SaltLakeArena from "../../../assets/Arenas/SaltLakeArena.webp";
import VegasArena from "../../../assets/Arenas/VegasSummerLeagueArena.webp";
import { CustomHeaderTitle } from "../../../components/CustomHeaderTitle";
import { TeamRow } from "../../../components/game-details";
import { GameInfo } from "../../../components/summer-league/GameInfo";
import TeamLocationSection from "../../../components/TeamLocationSection";
import TeamLocationSkeleton from "../../../components/TeamLocationSkeleton";
import { teams } from "../../../constants/teams";
import { useWeatherForecast } from "../../../hooks/useWeather";

const OSEXTRALIGHT = "Oswald_200ExtraLight";

type Team = {
  id: string | number;
  name: string;
  logo: any;
  logoLight?: any;
  record?: string;
  location?: string;
  arenaImage?: any;
  arenaName?: string;
  address?: string;
  arenaCapacity?: number;
  code?: string;
};

type SummerGame = {
  id: number;
  home: Team;
  away: Team;
  date: string;
  time: string;
  status: string; // e.g. "Not Started", "Final", "Quarter 2"
  clock?: string;
  period?: number | string;
  homeScore?: number;
  awayScore?: number;
  league?: {
    name?: string;
  };
  venue?: string;
};

export default function SummerLeagueGameDetails() {
  const { game } = useLocalSearchParams();
  const isDark = useColorScheme() === "dark";
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);

  if (typeof game !== "string") return null;

  const parsedGame: SummerGame = JSON.parse(game);

  const homeTeamData = teams.find(
    (t) =>
      t.name === parsedGame.home.name ||
      t.code === parsedGame.home.name ||
      t.fullName === parsedGame.home.name
  );
  const awayTeamData = teams.find(
    (t) =>
      t.name === parsedGame.away.name ||
      t.code === parsedGame.away.name ||
      t.fullName === parsedGame.away.name
  );

  if (!homeTeamData || !awayTeamData) return null;

  const colors = useMemo(
    () => ({
      background: isDark ? "#1d1d1d" : "#fff",
      text: isDark ? "#fff" : "#000",
      secondaryText: isDark ? "#aaa" : "#444",
      record: isDark ? "#ccc" : "#555",
      score: isDark ? "#aaa" : "rgba(0, 0, 0, 0.4)",
      winnerScore: isDark ? "#fff" : "#000",
      border: isDark ? "#333" : "#ccc",
      finalText: isDark ? "#ff4c4c" : "#d10000",
    }),
    [isDark]
  );

  const {
    weather,
    loading: weatherLoading,
    error: weatherError,
  } = useWeatherForecast(
    homeTeamData.latitude ?? null,
    homeTeamData.longitude ?? null,
    parsedGame.date // ✅ This is already complete with time + timezone
  );

  const homeIsWinner =
    parsedGame.status === "Final" &&
    (parsedGame.homeScore ?? 0) > (parsedGame.awayScore ?? 0);
  const awayIsWinner =
    parsedGame.status === "Final" &&
    (parsedGame.awayScore ?? 0) > (parsedGame.homeScore ?? 0);

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
    const timeout = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timeout);
  }, []);

  const gameDateTime = new Date(parsedGame.date);

  const formattedDate = gameDateTime.toLocaleDateString("en-US", {
    month: "numeric",
    day: "numeric",
  });

  // --- NEW LOGIC START ---
  let quarterDisplay = "Live";

  if (
    typeof parsedGame.period === "number" &&
    parsedGame.status !== "Scheduled"
  ) {
    quarterDisplay = `Q${parsedGame.period}`;
  } else if (typeof parsedGame.period === "string") {
    quarterDisplay = parsedGame.period;
  }

  if (parsedGame.status === "Final") {
    quarterDisplay = "Final";
  }

  const formattedTime = gameDateTime.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const timeDisplay =
    parsedGame.status === "Not Started" ? formattedTime : quarterDisplay;

  function isSaltLakeCityGame(dateStr: string): boolean {
    const date = new Date(dateStr);
    const start = new Date("2025-07-05");
    const end = new Date("2025-07-09");
    return date >= start && date <= end;
  }

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={{ padding: 16, paddingBottom: 80 }}
    >
      {/* Summer League Label */}
      <View style={{ alignItems: "center" }}>
        <Text
          style={{
            fontFamily: OSEXTRALIGHT,
            fontSize: 14,
            color: colors.text,
            opacity: 0.8,
          }}
        >
          Summer League
        </Text>
      </View>

      {/* Teams + Scores */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
          borderBottomWidth: 1,
          borderColor: colors.border,
          paddingBottom: 12,
        }}
      >
        {/* Away Team */}
        <TeamRow
          team={{
            id: awayTeamData.id.toString(),
            name: parsedGame.away.name,
            logo:
              isDark && awayTeamData.logoLight
                ? awayTeamData.logoLight
                : awayTeamData.logo,
            code: awayTeamData.code,
          }}
          isDark={isDark}
          isHome={false}
          score={parsedGame.awayScore}
          isWinner={awayIsWinner}
          colors={colors}
        />

        {/* Game Info */}
        <GameInfo
          status={
            parsedGame.status === "Final"
              ? "Final"
              : parsedGame.clock
                ? "In Progress"
                : "Scheduled"
          }
          date={formattedDate}
          time={timeDisplay} // ✅ USE this instead of formattedTime
          period={
            typeof parsedGame.period === "number"
              ? `Q${parsedGame.period}`
              : parsedGame.period
          }
          clock={parsedGame.clock}
          colors={colors}
          isDark={isDark}
          homeTeam={parsedGame.home.name}
          awayTeam={parsedGame.away.name}
          isSummerLeague={true} // ✅ add this
        />

        {/* Home Team */}
        <TeamRow
          team={{
            id: homeTeamData.id.toString(),
            name: parsedGame.home.name,
            logo:
              isDark && homeTeamData.logoLight
                ? homeTeamData.logoLight
                : homeTeamData.logo,
            code: homeTeamData.code,
          }}
          isDark={isDark}
          isHome={true}
          score={parsedGame.homeScore}
          isWinner={homeIsWinner}
          colors={colors}
        />
      </View>

      {/* Arena & Weather Info */}
      {isLoading ? (
        <TeamLocationSkeleton />
      ) : (
        <TeamLocationSection
          arenaImage={
            isSaltLakeCityGame(parsedGame.date) ? SaltLakeArena : VegasArena
          }
          arenaName={
            isSaltLakeCityGame(parsedGame.date)
              ? "Jon M. Huntsman Center "
              : "Thomas & Mack Center"
          }
          location={
            isSaltLakeCityGame(parsedGame.date)
              ? "Salt Lake City, UT"
              : "Las Vegas, NV"
          }
          address={
            isSaltLakeCityGame(parsedGame.date)
              ? "1825 E. South Campus Dr, Salt Lake City, UT 84112 "
              : "4505 S Maryland Pkwy, Las Vegas, NV 89154"
          }
          arenaCapacity={
            isSaltLakeCityGame(parsedGame.date) ? "15,000" : "17,923"
          }
          weather={weather}
          loading={weatherLoading}
          error={weatherError}
        />
      )}
    </ScrollView>
  );
}
