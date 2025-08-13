import { Fonts } from "@/constants/fonts";
import { usePreferences } from "@/contexts/PreferencesContext";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import { FlatList, StyleSheet, Text, useColorScheme, View } from "react-native";
import { LongPressGestureHandler, State } from "react-native-gesture-handler";
import type { Game } from "../../types/types";
import GamePreviewModal from "../GamePreview/GamePreviewModal";
import GameCard from "./GameCard";
import GameCardSkeleton from "./GameCardSkeleton";
import GameSquareCard from "./GameSquareCard"; // import square card
import GameSquareCardSkeleton from "./GameSquareCardSkeleton";

type GamesListProps = {
  games: Game[];
  loading: boolean;
  refreshing: boolean;
  onRefresh: () => void;
  expectedCount?: number; // Optional for fallback
};

const GamesList: React.FC<GamesListProps> = ({
  games,
  loading,
  refreshing,
  onRefresh,
  expectedCount,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [previewGame, setPreviewGame] = useState<Game | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // New state for view mode
  const { viewMode, toggleViewMode } = usePreferences(); // use global

  const handleLongPress = (game: Game) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setPreviewGame(game);
    setModalVisible(true);
  };

  const renderGameCard = (item: Game) => (
    <LongPressGestureHandler
      key={item.id}
      minDurationMs={300}
      onHandlerStateChange={({ nativeEvent }) => {
        if (nativeEvent.state === State.ACTIVE) {
          handleLongPress(item);
        }
      }}
    >
      <View style={viewMode === "grid" ? styles.gridItem : undefined}>
        {viewMode === "list" ? (
          <GameCard game={item} isDark={isDark} />
        ) : (
          <GameSquareCard game={item} isDark={isDark} />
        )}
      </View>
    </LongPressGestureHandler>
  );

  if (loading) {
    const skeletonCount =
      games.length > 0 ? games.length : (expectedCount ?? 4);
    if (viewMode === "list") {
      return (
        <View style={styles.skeletonWrapper}>
          {Array.from({ length: skeletonCount }).map((_, index) => (
            <GameCardSkeleton key={index} />
          ))}
        </View>
      );
    } else {
      // grid mode
      return (
        <View style={styles.skeletonGridWrapper}>
          {Array.from({ length: skeletonCount }).map((_, index) => (
            <GameSquareCardSkeleton key={index} style={styles.gridItem} />
          ))}
        </View>
      );
    }
  }

  return (
    <>
      <FlatList
        data={games}
        keyExtractor={(item) => item.id.toString()}
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
          <Text style={[styles.emptyText, { color: isDark ? "#aaa" : "#888" }]}>
            No games found for this date.
          </Text>
        }
      />

      {modalVisible && previewGame && (
        <GamePreviewModal
          visible={modalVisible}
          game={previewGame}
          onClose={() => setModalVisible(false)}
        />
      )}
    </>
  );
};

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
    width: "48%", // Same as your actual grid items
  },
});

export default GamesList;
