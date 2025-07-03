// StandingsList.tsx

import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";
import { TeamStanding, useStandings } from "../hooks/useStandings";

export function StandingsList() {
  const { standings, loading, error } = useStandings(2024);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  if (loading)
    return (
      <View
        style={[
          styles.center,
          { backgroundColor: isDark ? "#1d1d1d" : "#fff" },
        ]}
      >
        <Text style={{ color: isDark ? "#fff" : "#000" }}>
          Loading standings...
        </Text>
      </View>
    );

  if (error)
    return (
      <View
        style={[
          styles.center,
          { backgroundColor: isDark ? "#1d1d1d" : "#fff" },
        ]}
      >
        <Text style={{ color: "red" }}>{error}</Text>
      </View>
    );

  const eastStandings = standings
    .filter((team) => team.conference.name.toLowerCase() === "east")
    .sort((a, b) => a.conference.rank - b.conference.rank);

  const westStandings = standings
    .filter((team) => team.conference.name.toLowerCase() === "west")
    .sort((a, b) => a.conference.rank - b.conference.rank);

  const renderStandingItem = ({ item }: { item: TeamStanding }) => {
    const { team, conference, gamesBehind, streak, winStreak } = item;
    return (
      <View
        style={[styles.row, { borderBottomColor: isDark ? "#333" : "#ccc" }]}
      >
        <Text style={[styles.rank, { color: isDark ? "#fff" : "#000" }]}>
          {conference.rank}
        </Text>

        <View style={styles.teamInfo}>
          <Image
            source={isDark && team.logoLight ? team.logoLight : team.logo}
            style={styles.logo}
            resizeMode="contain"
          />

          <Text style={[styles.teamName, { color: isDark ? "#fff" : "#000" }]}>
            {team.code}
          </Text>
        </View>

        <Text style={[styles.winsLosses, { color: isDark ? "#fff" : "#000" }]}>
          {conference.win} - {conference.loss}
        </Text>

        <Text style={[styles.gamesBehind, { color: isDark ? "#aaa" : "#555" }]}>
          GB: {gamesBehind || "0"}
        </Text>

        <Text
          style={[styles.streak, { color: winStreak ? "limegreen" : "tomato" }]}
        >
          {winStreak ? `W${streak}` : `L${streak}`}
        </Text>
      </View>
    );
  };

  const renderHeaderRow = () => (
    <View
      style={[
        styles.row,
        {
          borderBottomWidth: 1,
          borderBottomColor: isDark ? "#444" : "#ccc",
          backgroundColor: isDark ? "#2a2a2a" : "#f2f2f2",
        },
      ]}
    >
      <Text
        style={[
          styles.rank,
          { fontSize: 12, fontWeight: "600", color: isDark ? "#fff" : "#000" },
        ]}
      >
        #
      </Text>
      <Text style={[styles.headerTeam, { color: isDark ? "#fff" : "#000" }]}>
        Team
      </Text>
      <Text
        style={[
          styles.winsLosses,
          { fontSize: 12, fontWeight: "600", color: isDark ? "#fff" : "#000" },
        ]}
      >
        W-L
      </Text>
      <Text
        style={[
          styles.gamesBehind,
          { fontSize: 12, fontWeight: "600", color: isDark ? "#fff" : "#000" },
        ]}
      >
        GB
      </Text>
      <Text
        style={[
          styles.streak,
          { fontSize: 12, fontWeight: "600", color: isDark ? "#fff" : "#000" },
        ]}
      >
        Streak
      </Text>
    </View>
  );

  return (
    <ScrollView
      style={{ backgroundColor: isDark ? "#1d1d1d" : "#fff" }}
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      {/* Eastern Conference */}
      <Text
        style={[
          styles.heading,
          {
            color: isDark ? "#fff" : "#1d1d1d",
            borderBottomColor: isDark ? "#444" : "#ccc",
          },
        ]}
      >
        Eastern Conference
      </Text>
      {renderHeaderRow()}
      <FlatList
        data={eastStandings}
        keyExtractor={(item) => item.team.id.toString()}
        renderItem={renderStandingItem}
        scrollEnabled={false}
      />

      {/* Western Conference */}
      <Text
        style={[
          styles.heading,
          {
            color: isDark ? "#fff" : "#1d1d1d",
            borderBottomColor: isDark ? "#444" : "#ccc",
            marginTop: 24,
          },
        ]}
      >
        Western Conference
      </Text>
      {renderHeaderRow()}
      <FlatList
        data={westStandings}
        keyExtractor={(item) => item.team.id.toString()}
        renderItem={renderStandingItem}
        scrollEnabled={false}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 0,
    paddingBottom: 6,
    borderBottomWidth: 1,
    fontFamily: "Oswald_500Medium",
    marginTop: 12,
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    borderBottomWidth: 1,
  },
  rank: {
    width: 30, // Match header and data row
    fontWeight: "600",
    fontSize: 16,
    textAlign: "left",
    fontFamily: "Oswald_500Medium",
  },
  teamInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  logo: {
    width: 36,
    height: 36,
  },
  teamName: {
    fontWeight: "500",
    fontSize: 12,
    fontFamily: "Oswald_500Medium",
  },
  winsLosses: {
    width: 70,
    textAlign: "center",
    fontFamily: "Oswald_500Medium",
  },
  gamesBehind: {
    width: 70,
    textAlign: "center",
    fontSize: 12,
    fontFamily: "Oswald_400Regular",
  },
  streak: {
    width: 50,
    textAlign: "center",
    fontFamily: "Oswald_500Medium",
  },
  headerTeam: {
    flex: 1,
    fontFamily: "Oswald_500Medium",
    fontSize: 12,
    marginLeft: 42, // aligns with logo spacing
  },
});
