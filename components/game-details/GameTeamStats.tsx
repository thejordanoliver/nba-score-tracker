import { teamsById } from "@/constants/teams";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import HeadingTwo from "../HeadingTwo";

const OSEXTRALIGHT = "Oswald_200ExtraLight";
const OSLIGHT = "Oswald_300Light";
const OSMEDIUM = "Oswald_500Medium";
const OSREGULAR = "Oswald_400Regular";
const OSBOLD = "Oswald_700Bold";
const OSSEMIBOLD = "Oswald_600SemiBold";

const STAT_KEYS = [
  { key: "assists", label: "Assists" },
  { key: "totReb", label: "Rebounds" },
  { key: "offReb", label: "Offensive Rebounds" },
  { key: "defReb", label: "Defensive Rebounds" },
  { key: "steals", label: "Steals" },
  { key: "blocks", label: "Blocks" },
  { key: "turnovers", label: "Turnovers" },
  { key: "biggestLead", label: "Biggest Lead" },
  { key: "pointsInPaint", label: "Points in Paint" },
  { key: "secondChancePoints", label: "Second Chance Points" },
  { key: "longestRun", label: "Longest Run" },
  { key: "pFouls", label: "Personal Fouls" },
  { key: "fgm", label: "Field Goals Made" },
  { key: "fga", label: "Field Goals Attempted" },
  { key: "fgp", label: "Field Goals Percentage" },
  { key: "ftm", label: "Free Throws Made" },
  { key: "fta", label: "Free Throws Attempted" },
  { key: "ftp", label: "Free Throws Percentage" },
  { key: "tpm", label: "Three Points Made" },
  { key: "tpa", label: "Three Points Attempted" },
  { key: "plusMinus", label: "Plus/Minus" },
];

export default function GameTeamStats({ stats }: { stats: any[] }) {
  const isDark = useColorScheme() === "dark";
  if (!stats || stats.length < 2) return null;

  const teamA = stats[0];
  const teamB = stats[1];
  const statA = teamA.statistics?.[0];
  const statB = teamB.statistics?.[0];
  if (!statA || !statB) return null;

  const teamDataA = teamsById[teamA.team.id];
  const teamDataB = teamsById[teamB.team.id];
  const dividerColor = isDark ? "#444" : "#ccc";

  const getTeamBarColor = (team: any) => {
    const darkTeams = [
      "MEM",
      "BKN",
      "NOP",
      "MIN",
      "DEN",
      "PHI",
      "PHX",
      "MIL",
      "SAS",
      "CLE",
      "WAS",
      "IND",
      "LAL",
      "UTA",
    ]; // Grizzlies & Nets
    const isDarkTeam = darkTeams.includes(team?.code);
    if (isDark && isDarkTeam && team?.secondaryColor) {
      return team.secondaryColor;
    }
    return team?.color;
  };

  return (
    <>
      {/* Logos / Sticky Header */}
      <View style={{ marginTop: 16 }}>
        <HeadingTwo>Game Stats</HeadingTwo>
        <View style={styles.logosRow}>
          <View style={styles.teamContainer}>
            <Image
              source={
                isDark ? teamDataB.logoLight || teamDataB.logo : teamDataB.logo
              }
              style={styles.logo}
            />
            <Text
              style={[
                styles.teamLabel,
                { color: isDark ? "#fff" : "#1d1d1d", marginLeft: 4 },
              ]}
            >
              {teamDataB.code}
            </Text>
          </View>

          <View style={styles.teamContainer}>
            <Image
              source={
                isDark ? teamDataA.logoLight || teamDataA.logo : teamDataA.logo
              }
              style={styles.logo}
            />
            <Text
              style={[
                styles.teamLabel,
                { color: isDark ? "#fff" : "#1d1d1d", marginLeft: 4 },
              ]}
            >
              {teamDataA.code}
            </Text>
          </View>
        </View>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Stats */}
          {STAT_KEYS.map(({ key, label }) => {
            const rawValueA = statA[key];
            const rawValueB = statB[key];

            if (rawValueA == null && rawValueB == null) return null;

            const valueA = rawValueA ?? 0;
            const valueB = rawValueB ?? 0;
            const max = Math.max(valueA, valueB, 1);
            const isTeamALower = valueA < valueB;
            const isTeamBLower = valueB < valueA;

            return (
              <View key={key} style={styles.statSection}>
                {/* Divider */}
                <View
                  style={[
                    styles.dividerLine,
                    { backgroundColor: dividerColor },
                  ]}
                />

                {/* Label under divider */}
                <Text
                  style={[
                    styles.statLabel,
                    { color: isDark ? "#fff" : "#000" },
                  ]}
                >
                  {label}
                </Text>

                {/* Bars row */}

                <View style={[styles.row, {}]}>
                  <Text
                    style={[
                      styles.barText,
                      { color: isDark ? "#fff" : "#000" },
                    ]}
                  >
                    {["fgp", "ftp", "tpp"].includes(key)
                      ? `${valueB}%`
                      : valueB}
                  </Text>
                  {/* Team B (left) */}
                  <View style={styles.barContainerLeft}>
                    <View
                      style={[
                        styles.bar,
                        {
                          backgroundColor: getTeamBarColor(teamDataB),

                          width: `${(valueB / max) * 100}%`,
                          borderRadius: 100,
                          opacity: isTeamBLower ? 0.5 : 1,
                        },
                      ]}
                    ></View>
                  </View>

                  {/* Team A (right) */}
                  <View style={styles.barContainerRight}>
                    <View
                      style={[
                        styles.bar,
                        {
                          backgroundColor: getTeamBarColor(teamDataA),

                          width: `${(valueA / max) * 100}%`,
                          borderRadius: 100,
                          opacity: isTeamALower ? 0.5 : 1,
                        },
                      ]}
                    ></View>
                  </View>
                  <Text
                    style={[
                      styles.barText,
                      { color: isDark ? "#fff" : "#000" },
                    ]}
                  >
                    {["fgp", "ftp", "tpp"].includes(key)
                      ? `${valueA}%`
                      : valueA}
                  </Text>
                </View>
              </View>
            );
          })}
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    maxHeight: 400,
  },
  scrollContent: {
    paddingBottom: 12,
    marginTop: 12,
  },
  logosRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",

    paddingHorizontal: 16,
    alignItems: "center",
    zIndex: 1,
    elevation: 3,
  },

  teamContainer: {
    flexDirection: "row", // logo and text side-by-side horizontally
    alignItems: "center", // vertical align center for logo + text
  },
  logo: {
    width: 20,
    height: 20,
    resizeMode: "contain",
  },
  teamLabel: {
    fontFamily: OSMEDIUM,
    fontSize: 16,
  },
  statSection: {
    marginBottom: 24,
  },
  dividerLine: {
    height: 1,
    width: "100%",
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: OSREGULAR,
    fontSize: 12,
    textAlign: "center",
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 100,
  },
  barContainerLeft: {
    flex: 1,
    alignItems: "flex-start",
    marginLeft: 12,
  },
  barContainerRight: {
    flex: 1,
    alignItems: "flex-end",
    marginRight: 12,
  },
  bar: {
    height: 8,
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  barText: {
    fontFamily: OSSEMIBOLD,
    fontSize: 14,
    color: "#fff",
    textAlign: "center",
  },
});
