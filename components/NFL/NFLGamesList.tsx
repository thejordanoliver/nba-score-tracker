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

export default function NFLGamesList() {
  const { games, loading, error } = useNFLWeeklyGames();
  const colorScheme = useColorScheme();

  const isDark = colorScheme === "dark";

  if (loading) return <ActivityIndicator />;
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
    width: "100%", // full width for stacked layout
  },
});
