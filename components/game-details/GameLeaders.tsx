import GameLeadersSkeleton from "@/components/game-details/GameLeadersSkeleton";
import FixedWidthTabBar from "@/components/game-details/GameLeadersTabBar"; // adjust path as needed
import { teamsById } from "@/constants/teams";
import { useGameLeaders } from "@/hooks/useGameLeaders";
import React, { useMemo, useState } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import HeadingTwo from "../HeadingTwo";
const SCREEN_WIDTH = Dimensions.get("window").width;

const OSBOLD = "Oswald_700Bold";
const OSREGULAR = "Oswald_400Regular";
const OSMEDIUM = "Oswald_500Medium";

const STAT_CATEGORIES = ["points", "rebounds", "assists"] as const;
type Category = (typeof STAT_CATEGORIES)[number];

type Props = {
  gameId: string;
};

export default React.memo(function GameLeaders({ gameId }: Props) {
  const { data, isLoading, isError } = useGameLeaders(gameId);
  
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [selectedCategory, setSelectedCategory] = useState<Category>("points");
  const tabWidth = SCREEN_WIDTH / STAT_CATEGORIES.length;

  // Move useMemo here, always called
  const topPlayers = useMemo(() => {
    if (!data) return [];
    const getTopPlayerPerTeam = (category: Category) => {
      const validPlayers = data.filter((p) => p.player && p[category] !== null);
      const teams = [...new Set(validPlayers.map((p) => p.team.id))];
      return teams.map((teamId) => {
        const playersFromTeam = validPlayers.filter(
          (p) => p.team.id === teamId
        );
        return playersFromTeam.sort((a, b) => b[category]! - a[category]!)[0];
      });
    };
    return getTopPlayerPerTeam(selectedCategory);
  }, [data, selectedCategory]);

if (isLoading) {
  return (
    <View style={styles.container}>
      <HeadingTwo>Game Leaders</HeadingTwo>
      <GameLeadersSkeleton />
    </View>
  );
}

  return (
    <View style={styles.container}>
      <HeadingTwo>Game Leaders</HeadingTwo>
      {/* Use FixedWidthTabBar instead of manual tabs */}
      <View style={{ paddingHorizontal: 12 }}>
        <FixedWidthTabBar
          tabs={STAT_CATEGORIES}
          selected={selectedCategory}
          onTabPress={setSelectedCategory}
          containerStyle={{
            width: tabWidth * STAT_CATEGORIES.length,
            alignSelf: "center",
          }}
          renderLabel={(tab, isSelected) => (
            <Text
              style={{
                fontFamily: OSMEDIUM,
                fontSize: 14,
                color: isSelected
                  ? isDark
                    ? "#fff"
                    : "#000"
                  : isDark
                    ? "#888"
                    : "#555",
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          )}
        />
      </View>

      {/* Player Cards */}
      {topPlayers.map((player, idx) => {
        const p = player.localPlayer;
        const team = teamsById[player.team.id];
        console.log("team logo URL:", team?.logo); // <-- here inside the map

        return (
          <View
            key={idx}
            style={[styles.card, isDark && { backgroundColor: "#333" }]}
          >
            <Image source={{ uri: p?.headshot_url }} style={styles.avatar} />
            <View style={styles.infoSection}>
              <View style={styles.nameRow}>
                <Text style={[styles.playerName, isDark && { color: "#fff" }]}>
                  {p?.first_name} {p?.last_name}
                </Text>
                <Text
                  style={[styles.jersey, { color: isDark ? "#888" : "#888" }]}
                >
                  {" "}
                  #{player.localPlayer.jersey_number ?? "(NA)"}
                </Text>
              </View>

              <View style={styles.statRow}>
                <View style={styles.statBlock}>
                  <Text
                    style={[
                      styles.statLabel,
                      { color: isDark ? "#888" : "#888" },
                    ]}
                  >
                    PTS
                  </Text>
                  <Text
                    style={[
                      styles.statText,
                      { color: isDark ? "#fff" : "#1d1d1d" },
                    ]}
                  >
                    {player.points ?? "-"}
                  </Text>
                </View>
                <View style={styles.statBlock}>
                  <Text
                    style={[
                      styles.statLabel,
                      { color: isDark ? "#ccc" : "#888" },
                    ]}
                  >
                    REB
                  </Text>
                  <Text
                    style={[
                      styles.statText,
                      { color: isDark ? "#fff" : "#1d1d1d" },
                    ]}
                  >
                    {player.totReb ?? "-"}
                  </Text>
                </View>
                <View style={styles.statBlock}>
                  <Text
                    style={[
                      styles.statLabel,
                      { color: isDark ? "#ccc" : "#888" },
                    ]}
                  >
                    AST
                  </Text>
                  <Text
                    style={[
                      styles.statText,
                      { color: isDark ? "#fff" : "#1d1d1d" },
                    ]}
                  >
                    {player.assists ?? "-"}
                  </Text>
                </View>
              </View>
            </View>
            <Image
              source={team?.logo}
              style={styles.teamLogo}
              resizeMode="contain"
            />
          </View>
        );
      })}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
    overflow: "hidden",
  },
  loading: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f1f1",
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 10,
    borderRadius: 8,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#ccc",
  },
  infoSection: {
    flex: 1,
    marginLeft: 10,
    justifyContent: "flex-end",
  },
  playerName: {
    fontFamily: OSBOLD,
    fontSize: 14,
    color: "#000",
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "flex-end", // Align text on the same baseline
  },
  jersey: {
    fontFamily: OSREGULAR,
    fontSize: 12,
    marginLeft: 4,
  },
  statRow: {
    flexDirection: "row",
    marginTop: 4,
    justifyContent: "space-between",
    paddingRight: 12,
  },
  statText: {
    fontFamily: OSREGULAR,
    fontSize: 16,
    color: "#fff",
  },
  teamLogo: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 28,
    height: 28,
  },
  statBlock: {
    alignItems: "flex-start",
    flex: 1,
  },
  statLabel: {
    fontFamily: OSMEDIUM,
    fontSize: 10,
  },
});
