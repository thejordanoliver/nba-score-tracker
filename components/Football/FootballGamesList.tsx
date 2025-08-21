// components/FootballGamesList.tsx
import React from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Image,
  useColorScheme,
} from "react-native";
import { useFootballGames, Game } from "@/hooks/useFootballGames";
import { getStyles } from "@/styles/GameCard.styles"; // ✅ import your shared styles

type Props = {
  date: string; // YYYY-MM-DD
};

export default function FootballGamesList({ date }: Props) {
  const { games, loading, error } = useFootballGames(date);
  const isDark = useColorScheme() === "dark";
  const styles = getStyles(isDark);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={isDark ? "#fff" : "#000"} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: isDark ? "#ff6b6b" : "red" }}>{error}</Text>
      </View>
    );
  }

  if (!games.length) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: isDark ? "#fff" : "#000" }}>
          No games found for {date}
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={games}
      keyExtractor={(item: Game) => item.id.toString()}
      contentContainerStyle={{ padding: 16 }}
      renderItem={({ item }) => {
        const gameDate =
          typeof item.date === "string" ? item.date : item.date ?? "Unknown";
        const gameTime =
          typeof item.time === "string" ? item.time : item.time ?? "TBD";

        return (
          <View style={[styles.card, { marginBottom: 16 }]}>
            {/* Away Team */}
            <View style={styles.teamSection}>
              <Image source={{ uri: item.teams.away.logo }} style={styles.logo} />
              <Text style={styles.teamName} numberOfLines={1}>
                {item.teams.away.name}
              </Text>
              <Text style={styles.teamScore}>-</Text>
            </View>

            {/* Game Info */}
            <View style={styles.info}>
              <Text
                style={item.status.short === "FT" ? styles.dateFinal : styles.date}
              >
                {gameDate}
              </Text>
              <Text style={styles.time}>{gameTime}</Text>
              <Text style={item.status.short === "FT" ? styles.finalText : styles.clock}>
                {item.status.long}
              </Text>
            </View>

            {/* Home Team */}
            <View style={styles.teamSection}>
              <Image source={{ uri: item.teams.home.logo }} style={styles.logo} />
              <Text style={styles.teamName} numberOfLines={1}>
                {item.teams.home.name}
              </Text>
              <Text style={styles.teamScore}>-</Text>
            </View>
          </View>
        );
      }}
    />
  );
}
