import { Fonts } from "@/constants/fonts";
import { usePreferences } from "@/contexts/PreferencesContext";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { LongPressGestureHandler, State } from "react-native-gesture-handler";
import NFLGameCard from "@/components/NFL/Games/NFLGameCard";
import NFLGameSquareCard from "@/components/NFL/Games/NFLGameSquareCard";
import GameSquareCardSkeleton from "@/components/Games/GameSquareCardSkeleton";
import StackedGameCardSkeleton from "@/components/Games/StackedGameCardSkeleton";
import NFLStackedGameCard from "@/components/NFL/Games/NFLStackedGameCard";
import GameCardSkeleton from "@/components/Games/GameCardSkeleton";
import NFLGamePreviewModal from "@/components/NFL/Games/NFLGamePreviewModal";

type Props = {
  games: any[]; // TODO: replace with proper NFLGame type
  loading: boolean;
  refreshing: boolean;
  onRefresh: () => void;
  error?: string | null;
  expectedCount?: number;
  day?: "todayTomorrow";
};

export default function NFLGamesList({
  games,
  loading,
  refreshing,
  onRefresh,
  error,
  expectedCount,
  day,
}: Props) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const { viewMode } = usePreferences();

  const [previewGame, setPreviewGame] = useState<any | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleLongPress = (game: any) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setPreviewGame(game);
    setModalVisible(true);
  };

  const renderGameCard = (item: any) => (
    <LongPressGestureHandler
      key={item?.game?.id}
      minDurationMs={300}
      onHandlerStateChange={({ nativeEvent }) => {
        if (nativeEvent.state === State.ACTIVE) handleLongPress(item);
      }}
    >
      <View
        style={
          viewMode === "grid"
            ? styles.gridItem
            : viewMode === "stacked"
            ? styles.stackedItem
            : undefined
        }
      >
        {viewMode === "list" ? (
          <NFLGameCard game={item} isDark={isDark} />
        ) : viewMode === "grid" ? (
          <NFLGameSquareCard game={item} isDark={isDark} />
        ) : (
          <NFLStackedGameCard game={item} isDark={isDark} />
        )}
      </View>
    </LongPressGestureHandler>
  );

  if (loading) {
    const skeletonCount = games.length > 0 ? games.length : expectedCount ?? 4;

    if (viewMode === "list") {
      return (
        <View style={styles.skeletonWrapper}>
          {Array.from({ length: skeletonCount }).map((_, i) => (
            <GameCardSkeleton key={i} />
          ))}
        </View>
      );
    } else if (viewMode === "grid") {
      return (
        <View style={styles.skeletonGridWrapper}>
          {Array.from({ length: skeletonCount }).map((_, i) => (
            <GameSquareCardSkeleton key={i} style={styles.gridItem} />
          ))}
        </View>
      );
    } else {
      return (
        <View style={styles.skeletonWrapper}>
          {Array.from({ length: skeletonCount }).map((_, i) => (
            <StackedGameCardSkeleton key={i} />
          ))}
        </View>
      );
    }
  }

  if (error) return <Text style={styles.emptyText}>Error: {error}</Text>;

  return (
    <>
      <FlatList
        data={games}
        keyExtractor={(item) => (item?.game?.id ?? Math.random()).toString()}
        renderItem={({ item }) => renderGameCard(item)}
        refreshing={refreshing}
        onRefresh={onRefresh}
        numColumns={viewMode === "grid" ? 2 : 1}
        key={viewMode}
        columnWrapperStyle={
          viewMode === "grid" ? { justifyContent: "space-between" } : undefined
        }
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={{ marginTop: 10 }}>
            <Text
              style={[
                styles.emptyText,
                { color: isDark ? "#aaa" : "#888" },
              ]}
            >
              {day === "todayTomorrow"
                ? "No NFL games found for today or tomorrow."
                : "No NFL games found on this date."}
            </Text>
          </View>
        }
      />
      {modalVisible && previewGame && (
      <NFLGamePreviewModal
  game={previewGame}
  visible={modalVisible} // still mount it
  onClose={() => setModalVisible(false)}
/>

      )}
    </>
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
