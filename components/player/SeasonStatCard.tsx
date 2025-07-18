import { usePlayerStats } from "@/hooks/usePlayerStats";
import { useLocalSearchParams } from "expo-router";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { teams } from "../../constants/teams";

const OSEXTRALIGHT = "Oswald_200ExtraLight";
const OSREGULAR = "Oswald_400Regular";
const OSMEDIUM = "Oswald_500Medium";
const OSSEMIBOLD = "Oswald_600SemiBold";
const OSBOLD = "Oswald_700Bold";

type Props = {
  playerId: number;
  teamColor?: string;
  teamColorDark?: string;
};

export default function SeasonStatCard({
  playerId,
  teamColor,
  teamColorDark,
}: Props) {
  const { aggregatedStats, loading, error } = usePlayerStats(playerId, "2024");
  const isDark = useColorScheme() === "dark";

  if (loading) return <ActivityIndicator style={{ marginVertical: 20 }} />;
  if (error || !aggregatedStats)
    return <Text style={styles.error}>Failed to load stats</Text>;

  const {
    gamesPlayed,
    totalPoints,
    totalAssists,
    totalRebounds,
    totalFGM,
    totalFGA,
  } = aggregatedStats;

  const safeFixed = (val: number) =>
    isNaN(val) || val == null ? "0.0" : val.toFixed(1);

  const ppg = safeFixed(totalPoints / gamesPlayed);
  const apg = safeFixed(totalAssists / gamesPlayed);
  const rpg = safeFixed(totalRebounds / gamesPlayed);
  const fgPercent =
    totalFGA > 0 ? safeFixed((totalFGM / totalFGA) * 100) : "0.0";

  const activeColor = isDark ? teamColorDark || teamColor : teamColor;
  const { id, teamId } = useLocalSearchParams<{ id: string; teamId: string }>();

  const sanitizedTeamId = String(teamId).replace(/"/g, "").trim();

  const teamObj = teams.find((t) => String(t.id) === sanitizedTeamId);
const forceWhiteTextTeams = [
  "Timberwolves",
  "Heat",
  "Clippers",
  "Rockets",
  "Pistons",
  "Bulls",
  "Hornets",
  "Trail Blazers",
  "Kings",
];

  return (
    <>
      <Text
        style={{
          fontSize: 24,
          fontFamily: OSMEDIUM,
          marginBottom: 16,
          marginTop: 16,
          paddingBottom: 4,
          borderBottomWidth: 1,
          borderBottomColor: isDark ? "#444" : "#ccc",
          color: isDark ? "#fff" : "#1d1d1d",
          textAlign: "center",
        }}
      >
        2024 Season
      </Text>
      <View
        style={[styles.card, { backgroundColor: isDark ? "#2e2e2e" : "#eee" }]}
      >
        <View style={styles.statsRow}>
          <StatItem
            label="PTS"
            value={ppg}
color={
  isDark && teamObj && forceWhiteTextTeams.includes(teamObj.name)
    ? "#fff"
    : isDark
    ? teamObj?.secondaryColor
    : teamObj?.color
}
          />
          <StatItem
            label="AST"
            value={apg}
color={
  isDark && teamObj && forceWhiteTextTeams.includes(teamObj.name)
    ? "#fff"
    : isDark
    ? teamObj?.secondaryColor
    : teamObj?.color
}
          />
          <StatItem
            label="REB"
            value={rpg}
color={
  isDark && teamObj && forceWhiteTextTeams.includes(teamObj.name)
    ? "#fff"
    : isDark
    ? teamObj?.secondaryColor
    : teamObj?.color
}
          />
          <StatItem
            label="FG%"
            value={fgPercent}
color={
  isDark && teamObj && forceWhiteTextTeams.includes(teamObj.name)
    ? "#fff"
    : isDark
    ? teamObj?.secondaryColor
    : teamObj?.color
}
          />
        </View>
      </View>
    </>
  );
}

function StatItem({
  label,
  value,
  color,
}: {
  label: string;
  value: string | number;
  color?: string;
}) {
  return (
    <View style={styles.statItem}>
      <Text style={[styles.statValue, { color: color || "#000" }]}>
        {value}
      </Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    padding: 16,
  },
  title: {
    fontSize: 14,
    fontFamily: OSSEMIBOLD,
    marginBottom: 12,
    textAlign: "center",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 18,
    fontFamily: OSBOLD,
    color: "#000",
  },
  statLabel: {
    fontSize: 12,
    fontFamily: OSREGULAR,
    color: "#666",
    marginTop: 2,
  },
  error: {
    color: "red",
    textAlign: "center",
    marginVertical: 20,
  },
});
