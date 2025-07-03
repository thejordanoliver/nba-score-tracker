import { useState } from "react";
import { FlatList, Image, StyleSheet, Text, View } from "react-native";
import FixedWidthTabBar from "./FixexWidthTabBar";

type Props = {
  isDark: boolean;
  home: {
    teamCode: string;
    teamLogoLight: any;
    teamLogo: any;
    games: any[];
  };
  away: {
    teamCode: string;
    teamLogoLight: any;
    teamLogo: any;
    games: any[];
  };
};

export default function LastFiveGamesSwitcher({ isDark, home, away }: Props) {
  const [selected, setSelected] = useState<"home" | "away">("home");
  const team = selected === "home" ? home : away;

  const renderRow = ({ item, index }: { item: any; index: number }) => {
    const matchupSymbol = item.isHome ? "vs" : "@";
    const resultSymbol = item.won ? "W" : "L";
    const resultColor = item.won ? "#4caf50" : "#f44336";
    const opponentLogoSource = isDark
      ? item.opponentLogoLight || item.opponentLogo
      : item.opponentLogo;
    const rowBackground =
      index % 2 === 0 ? "transparent" : isDark ? "#2a2a2a" : "#f2f2f2";

    return (
      <View style={[styles.row, { backgroundColor: rowBackground }]}>
        <Text
          style={[
            styles.cell,
            styles.date,
            { color: isDark ? "#fff" : "#1d1d1d" },
          ]}
        >
          {item.date}
        </Text>

        <View style={[styles.cell, styles.team, styles.teamWithLogo]}>
          <Text
            style={{
              fontFamily: "Oswald_400Regular",
              color: isDark ? "#fff" : "#1d1d1d",
            }}
          >
            {matchupSymbol} {item.opponent}
          </Text>
          <Image
            source={opponentLogoSource}
            style={{
              width: 18,
              height: 18,
              resizeMode: "contain",
              marginRight: 6,
              marginTop: 1,
            }}
          />
        </View>

        <Text style={[styles.cell, { color: resultColor }]}>
          {resultSymbol} {item.isHome ? item.homeScore : item.awayScore} -{" "}
          {item.isHome ? item.awayScore : item.homeScore}
        </Text>
      </View>
    );
  };

  const tabs: readonly ("away" | "home")[] = ["away", "home"];

  return (
    <View style={styles.container}>
      <View style={{ marginTop: 20, width: "100%" }}>
        <Text
          style={{
            fontSize: 24,
            fontFamily: "Oswald_500Medium",
         
            paddingBottom: 4,
            borderBottomWidth: 1,
            borderBottomColor: isDark ? "#444" : "#ccc",
            color: isDark ? "#fff" : "#1d1d1d",
          }}
        >
          Last Five Games
        </Text>

        <View style={{ alignSelf: "center", marginVertical: 10 }}>
          <FixedWidthTabBar
            tabs={tabs}
            selected={selected}
            onTabPress={setSelected}
            tabWidth={200}
            renderLabel={(tab, isSelected) => {
              const teamData = tab === "home" ? home : away;
              const logoSource = isDark
                ? teamData.teamLogoLight || teamData.teamLogo
                : teamData.teamLogo;

              return (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <Image
                    source={logoSource}
                    style={{
                      width: 20,
                      height: 20,
                      resizeMode: "contain",
                      opacity: isSelected ? 1 : 0.5,
                    }}
                  />
                  <Text
                    style={{
                      fontSize: 16,
                      color: isSelected
                        ? isDark
                          ? "#fff"
                          : "#1d1d1d"
                        : isDark
                        ? "#888"
                        : "rgba(0,0,0,0.5)",
                      fontFamily: "Oswald_500Medium",
                    }}
                  >
                    {teamData.teamCode}
                  </Text>
                </View>
              );
            }}
          />
        </View>

        <FlatList
          data={team.games}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderRow}
          scrollEnabled={false}
          ListEmptyComponent={
            <Text style={styles.empty}>No recent games.</Text>
          }
          ListHeaderComponent={
            <View style={styles.headerRow}>
              <Text
                style={[
                  styles.cell,
                  styles.date,
                  { color: isDark ? "#fff" : "#1d1d1d" },
                ]}
              >
                Date
              </Text>
              <Text
                style={[
                  styles.cell,
                  styles.team,
                  { color: isDark ? "#fff" : "#1d1d1d" },
                ]}
              >
                Matchup
              </Text>
              <Text
                style={[styles.cell, { color: isDark ? "#fff" : "#1d1d1d" }]}
              >
                Result
              </Text>
            </View>
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderColor: "#aaa",
    marginBottom: 6,
  },
  cell: {
    fontSize: 14,
    fontWeight: "500",
    flex: 1,
    textAlign: "center",
    fontFamily: "Oswald_400Regular",
  },
  date: { flex: 1.2 },
  team: { flex: 2 },
  teamWithLogo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  empty: {
    textAlign: "center",
    color: "#999",
    marginTop: 12,
  },
});
