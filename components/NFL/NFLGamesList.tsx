import NFLGameCard from "@/components/NFL/NFLGameCard";
import { Fonts } from "@/constants/fonts";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  useColorScheme,
} from "react-native";
type Props = {
  games: any[];
  loading: boolean;
  refreshing: boolean;
  onRefresh: () => void;
  error?: string | null;
  expectedCount?: number;
};
export default function NFLGamesList({
  games,
  loading,
  refreshing,
  onRefresh,
  error,
  expectedCount,
}: Props) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  if (loading && !refreshing) return <ActivityIndicator />;
  if (error) return <Text style={styles.emptyText}>Error: {error}</Text>;
  if (!loading && games.length === 0) {
    return (
      <Text style={styles.emptyText}>
        {" "}
        {expectedCount === 0
          ? "No games scheduled for this date"
          : "No games found"}{" "}
      </Text>
    );
  }
  return (
    <FlatList
      data={games}
      keyExtractor={(item) => (item?.game?.id ?? Math.random()).toString()}
      contentContainerStyle={styles.contentContainer}
      renderItem={({ item }) => <NFLGameCard game={item} isDark={isDark} />}
      refreshing={refreshing}
      onRefresh={onRefresh}
    />
  );
}
const styles = StyleSheet.create({
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
});
