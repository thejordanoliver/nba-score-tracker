// components/GamesList.tsx
import React from "react";
import { FlatList, StyleSheet, Text, useColorScheme, View } from "react-native";
import type { Game } from "./GameCard"; // use this Game type only
import GameCard from "./GameCard";
import GameCardSkeleton from "./GameCardSkeleton";

type GamesListProps = {
  games: Game[];
  loading: boolean;
  refreshing: boolean;
  onRefresh: () => void;
};

const GamesList: React.FC<GamesListProps> = ({
  games,
  loading,
  refreshing,
  onRefresh,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  if (loading) {
    return (
      <View
        style={{
          paddingTop: 10,
          paddingHorizontal: 16,
          paddingBottom: 100,
        }}
      >
        <GameCardSkeleton />
        <GameCardSkeleton />
      </View>
    );
  }

  return (
    <FlatList
      data={games}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => <GameCard game={item} />}
      refreshing={refreshing}
      onRefresh={onRefresh}
      contentContainerStyle={{
        paddingBottom: 100,
        paddingHorizontal: 16,
        paddingTop: 10,
      }}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={
        <Text style={[styles.emptyText, { color: isDark ? "#aaa" : "#999" }]}>
          No games found for this date.
        </Text>
      }
    />
  );
};

const styles = StyleSheet.create({
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 20,
    fontFamily: "Oswald_300Light",
  },
});

export default GamesList;
