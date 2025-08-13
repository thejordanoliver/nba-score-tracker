import GameLeadersSkeleton from "@/components/GameDetails/GameLeadersSkeleton";
import FixedWidthTabBar from "@/components/GameDetails/GameLeadersTabBar"; // adjust path as needed
import { Fonts } from "@/constants/fonts";
import { teamsById } from "@/constants/teams";
import { useGameLeaders } from "@/hooks/useGameLeaders";
import { useMemo, useState } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import HeadingTwo from "../Headings/HeadingTwo";
const SCREEN_WIDTH = Dimensions.get("window").width;

const STAT_CATEGORIES = ["points", "rebounds", "assists"] as const;
type Category = (typeof STAT_CATEGORIES)[number];

type Props = {
  gameId: string;
  awayTeamId: number;
  homeTeamId: number;
};

export default function GameLeaders({ gameId, awayTeamId, homeTeamId  }: Props) {
  const { data, isLoading, isError } = useGameLeaders(
    gameId,
    awayTeamId,
    homeTeamId,
  );

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
      const playersFromTeam = validPlayers.filter((p) => p.team.id === teamId);
      return playersFromTeam.sort((a, b) => b[category]! - a[category]!)[0];
    });
  };

  const players = getTopPlayerPerTeam(selectedCategory);

  // Sort so away team players first, then home team players
  return players.sort((a, b) => {
    if (a.team.id === awayTeamId) return -1;
    if (b.team.id === awayTeamId) return 1;
    if (a.team.id === homeTeamId) return -1;
    if (b.team.id === homeTeamId) return 1;
    return 0;
  });
}, [data, selectedCategory, awayTeamId, homeTeamId]);


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
                fontFamily: Fonts.OSMEDIUM,
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

        return (
          <View
            key={idx}
            style={[
              styles.card,
              {
                borderBottomWidth: 1,
                borderBottomColor: isDark ? "#888" : "#888",
              },
            ]}
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
                {selectedCategory === "points" && (
                  <>
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
                          { color: isDark ? "#888" : "#888" },
                        ]}
                      >
                        FG
                      </Text>
                      <Text
                        style={[
                          styles.statText,
                          { color: isDark ? "#fff" : "#1d1d1d" },
                        ]}
                      >
                        {player.fgm ?? "-"}/{player.fga ?? "-"}
                      </Text>
                    </View>
                    <View style={styles.statBlock}>
                      <Text
                        style={[
                          styles.statLabel,
                          { color: isDark ? "#888" : "#888" },
                        ]}
                      >
                        3PT
                      </Text>
                      <Text
                        style={[
                          styles.statText,
                          { color: isDark ? "#fff" : "#1d1d1d" },
                        ]}
                      >
                        {player.tpm ?? "-"}/{player.tpa ?? "-"}
                      </Text>
                    </View>
                  </>
                )}

                {selectedCategory === "rebounds" && (
                  <>
                    <View style={styles.statBlock}>
                      <Text
                        style={[
                          styles.statLabel,
                          { color: isDark ? "#888" : "#888" },
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
                          { color: isDark ? "#888" : "#888" },
                        ]}
                      >
                        DREB
                      </Text>
                      <Text
                        style={[
                          styles.statText,
                          { color: isDark ? "#fff" : "#1d1d1d" },
                        ]}
                      >
                        {player.defReb ?? "-"}
                      </Text>
                    </View>
                    <View style={styles.statBlock}>
                      <Text
                        style={[
                          styles.statLabel,
                          { color: isDark ? "#888" : "#888" },
                        ]}
                      >
                        OREB
                      </Text>
                      <Text
                        style={[
                          styles.statText,
                          { color: isDark ? "#fff" : "#1d1d1d" },
                        ]}
                      >
                        {player.offReb ?? "-"}
                      </Text>
                    </View>
                  </>
                )}

                {selectedCategory === "assists" && (
                  <>
                    <View style={styles.statBlock}>
                      <Text
                        style={[
                          styles.statLabel,
                          { color: isDark ? "#888" : "#888" },
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
                    <View style={styles.statBlock}>
                      <Text
                        style={[
                          styles.statLabel,
                          { color: isDark ? "#888" : "#888" },
                        ]}
                      >
                        TO
                      </Text>
                      <Text
                        style={[
                          styles.statText,
                          { color: isDark ? "#fff" : "#1d1d1d" },
                        ]}
                      >
                        {player.turnovers ?? "-"}
                      </Text>
                    </View>
                    <View style={styles.statBlock}>
                      <Text
                        style={[
                          styles.statLabel,
                          { color: isDark ? "#888" : "#888" },
                        ]}
                      >
                        MIN
                      </Text>
                      <Text
                        style={[
                          styles.statText,
                          { color: isDark ? "#fff" : "#1d1d1d" },
                        ]}
                      >
                        {player.min ?? "-"}
                      </Text>
                    </View>
                  </>
                )}
              </View>
            </View>
            <Image
              source={isDark ? team.logoLight || team.logo : team?.logo}
              style={styles.teamLogo}
              resizeMode="contain"
            />
          </View>
        );
      })}
    </View>
  );
}

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
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 10,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#ccc",
    paddingTop: 4
  },
  infoSection: {
    flex: 1,
    marginLeft: 10,
    justifyContent: "flex-end",
  },
  playerName: {
    fontFamily: Fonts.OSBOLD,
    fontSize: 14,
    color: "#000",
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "flex-end", // Align text on the same baseline
  },
  jersey: {
    fontFamily: Fonts.OSREGULAR,
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
    fontFamily: Fonts.OSREGULAR,
    fontSize: 12,
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
    fontFamily: Fonts.OSMEDIUM,
    fontSize: 10,
  },
});
