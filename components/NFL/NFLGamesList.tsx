import NFLGameCard from "@/components/NFL/NFLGameCard";
import { Fonts } from "@/constants/fonts";
import { useNFLWeeklyGames } from "@/hooks/useWeeklyNFLGames";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  useColorScheme,
} from "react-native";
import { useState, useCallback,  } from "react";

export default function NFLGamesList() {
  const { games, loading, error, refetch } = useNFLWeeklyGames(); // make sure your hook exposes a refetch function
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch(); // refetch the weekly games
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  if (loading && !refreshing) return <ActivityIndicator />;
  if (error) return <Text>Error: {error}</Text>;
  if (!loading && games.length === 0) {
    return <Text>No games scheduled for this date</Text>;
  }

  return (
    <FlatList
      data={games}
      keyExtractor={(item) => item.game.id.toString()}
      contentContainerStyle={styles.contentContainer}
      renderItem={({ item }) => <NFLGameCard game={item} isDark={isDark} />}
      refreshing={refreshing}
      onRefresh={onRefresh}
    />
  );
}

const styles = StyleSheet.create({
  skeletonWrapper: {
    paddingTop: 10,
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  skeletonGridWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingTop: 10,
    paddingHorizontal: 12,
    paddingBottom: 100,
    gap: 12,
  },
  contentContainer: {
    paddingTop: 10,
    paddingBottom: 100,
    paddingHorizontal: 12,
    gap: 12,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 20,
    fontFamily: Fonts.OSLIGHT,
  },
  gridItem: {
    width: "48%",
  },
  stackedItem: {
    width: "100%",
  },
});
