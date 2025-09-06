import { CustomHeaderTitle } from "@/components/CustomHeaderTitle";
import { NFLGameCenterInfo } from "@/components/NFL/GameInfo";
import { NFLTeamRow } from "@/components/NFL/NFLTeamRow";
import {
  getNFLTeamsLogo,
  getTeamInfo,
  getTeamName,
} from "@/constants/teamsNFL";
import { useNavigation } from "@react-navigation/native";
import { useLocalSearchParams } from "expo-router";
import { goBack } from "expo-router/build/global-state/routing";
import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { ScrollView, StyleSheet, useColorScheme, View } from "react-native";
import { LineScore } from "@/components/GameDetails";
import NFLGameEvents from "@/components/NFL/NFLGameEvents";

export default function NFLGameDetailsScreen() {
  const params = useLocalSearchParams();
  const isDark = useColorScheme() === "dark";
  const navigation = useNavigation();
  const [parsedGame, setParsedGame] = useState<any>(null);

  useEffect(() => {
    if (!params?.game) return;
    try {
      const data = JSON.parse(params.game as string);
      if (!data?.game?.id) return;
      setParsedGame(data);
    } catch (e) {
      console.warn("Failed to parse game:", params.game);
    }
  }, [params?.game]);

  const headerTitle = useMemo(() => {
    if (!parsedGame) return "";
    const homeTeam = getTeamInfo(parsedGame.teams.home.id);
    const awayTeam = getTeamInfo(parsedGame.teams.away.id);
    if (!homeTeam || !awayTeam) return "";
    return `${awayTeam.code} @ ${homeTeam.code}`;
  }, [parsedGame]);

  useLayoutEffect(() => {
    if (!headerTitle) return;
    navigation.setOptions({
      header: () => (
        <CustomHeaderTitle title={headerTitle} tabName="Game" onBack={goBack} />
      ),
    });
  }, [headerTitle, navigation]);

  const colors = useMemo(
    () => ({
      background: isDark ? "#1d1d1d" : "#ffffff",
      text: isDark ? "#ffffff" : "#000000",
      record: isDark ? "#ccc" : "#555",
      score: isDark ? "#aaa" : "rgba(0,0,0,0.4)",
      winnerScore: isDark ? "#fff" : "#000",
      border: isDark ? "#333" : "#ccc",
      secondaryText: isDark ? "#ccc" : "#555",
      finalText: isDark ? "#fff" : "#000",
    }),
    [isDark]
  );

  const { game: gameInfo, teams: teamsData, scores } = parsedGame || {};
  const home = teamsData?.home;
  const away = teamsData?.away;

  const homeTeam = home ? getTeamInfo(home.id) : null;
  const awayTeam = away ? getTeamInfo(away.id) : null;

  const awayIsWinner =
    gameInfo?.status?.long === "Finished" &&
    (scores?.away?.total ?? 0) > (scores?.home?.total ?? 0);
  const homeIsWinner =
    gameInfo?.status?.long === "Finished" &&
    (scores?.home?.total ?? 0) > (scores?.away?.total ?? 0);

  const statusMap: Record<
    string,
    "Scheduled" | "In Progress" | "Final" | "Canceled" | "Postponed" | "Delayed"
  > = {
    NS: "Scheduled",
    Q1: "In Progress",
    Q2: "In Progress",
    Q3: "In Progress",
    Q4: "In Progress",
    OT: "In Progress",
    HT: "In Progress",
    FT: "Final",
    AOT: "Final",
    CANC: "Canceled",
    PST: "Postponed",
    DELAYED: "Delayed",
  };

  const rawStatus = (gameInfo?.status?.short || gameInfo?.status?.long || "").toUpperCase();
  const gameStatus = statusMap[rawStatus] || "Scheduled";

  const gameDateObj = useMemo(() => {
    if (!gameInfo?.date) return null;

    let raw: string | number | null = null;

    if (typeof gameInfo.date === "object") {
      if (gameInfo.date.timestamp) {
        raw = gameInfo.date.timestamp * 1000;
      } else if (gameInfo.date.date) {
        raw = gameInfo.date.date;
      }
    } else if (typeof gameInfo.date === "string") {
      raw = gameInfo.date;
    }

    const date = raw ? new Date(raw) : null;
    return date && !isNaN(date.getTime()) ? date : null;
  }, [gameInfo?.date]);

  const formattedDate = gameDateObj
    ? gameDateObj.toLocaleDateString("en-US", { month: "numeric", day: "numeric" })
    : "";

  const formattedTime = gameDateObj
    ? gameDateObj.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    : "";

  const linescore = useMemo(() => {
    if (!scores) return { home: [], away: [] };

    const homePeriods = [
      scores.home?.quarter_1,
      scores.home?.quarter_2,
      scores.home?.quarter_3,
      scores.home?.quarter_4,
    ];

    const awayPeriods = [
      scores.away?.quarter_1,
      scores.away?.quarter_2,
      scores.away?.quarter_3,
      scores.away?.quarter_4,
    ];

    if (scores.home?.overtime != null) homePeriods.push(scores.home.overtime);
    if (scores.away?.overtime != null) awayPeriods.push(scores.away.overtime);

    return {
      home: homePeriods.map((val) => (val != null ? String(val) : "0")),
      away: awayPeriods.map((val) => (val != null ? String(val) : "0")),
    };
  }, [scores]);

  if (!parsedGame || !homeTeam || !awayTeam) return <View />;

  return (
    <ScrollView
      contentContainerStyle={[styles.container, { paddingBottom: 140 }]}
      style={{ backgroundColor: colors.background }}
    >
      <View style={[styles.teamsContainer, { borderColor: colors.border }]}>
        <NFLTeamRow
          team={{
            id: String(awayTeam.id),
            name: getTeamName(away.id, away.nickname),
            logo: getNFLTeamsLogo(away.id, isDark),
            record: away.record ?? "0-0",
          }}
          isDark={isDark}
          isHome={false}
          score={scores?.away?.total}
          isWinner={awayIsWinner}
          colors={colors}
        />

        <NFLGameCenterInfo
          status={gameStatus}
          date={formattedDate}
          time={formattedTime}
          period={gameInfo?.status?.short}
          clock={gameInfo?.status?.timer}
          colors={colors}
          isDark={isDark}
          playoffInfo={gameInfo?.playoffInfo}
          homeTeam={homeTeam}
          awayTeam={awayTeam}
        />

        <NFLTeamRow
          team={{
            id: String(homeTeam.id),
            name: getTeamName(home.id, home.nickname),
            logo: getNFLTeamsLogo(home.id, isDark),
            record: home.record ?? "0-0",
          }}
          isDark={isDark}
          isHome
          score={scores?.home?.total}
          isWinner={homeIsWinner}
          colors={colors}
        />
      </View>

  <View style={{ gap: 20, marginTop: 20 }}>
      <LineScore
        linescore={linescore}
        homeCode={homeTeam?.code ?? ""}
        awayCode={awayTeam?.code ?? ""}
      />

      {/* NFLGameEvents inside ScrollView */}
      <NFLGameEvents gameId={gameInfo?.id}  />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
    paddingHorizontal: 12,
  },
  teamsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderBottomWidth: 1,
    paddingBottom: 12,
    position: "relative",
  },
});
