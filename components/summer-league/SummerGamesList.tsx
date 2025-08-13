import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { LongPressGestureHandler, State } from "react-native-gesture-handler";
import SummerLeagueGameCard from "../summer-league/SummerLeagueGameCard";
import GameCardSkeleton from "../Games/GameCardSkeleton";
import GameSquareCardSkeleton from "../Games/GameSquareCardSkeleton";  // Import your square skeleton
import SummerLeagueGamePreviewModal from "../summer-league/SummerLeagueGamePreviewModal";
import type { summerGame } from "../../types/types";
import SummerLeagueGameSquareCard from "../../components/summer-league/SummerGameSquareCard";
import { usePreferences } from "@/contexts/PreferencesContext";

type Props = {
  games: summerGame[];
  loading: boolean;
  refreshing: boolean;
  onRefresh: () => void;
  expectedCount?: number;
};

const SummerGamesList: React.FC<Props> = ({
  games,
  loading,
  refreshing,
  onRefresh,
  expectedCount,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [previewGame, setPreviewGame] = useState<summerGame | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const { viewMode } = usePreferences();

  const handleLongPress = (game: summerGame) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setPreviewGame(game);
    setModalVisible(true);
  };

  const renderGameCard = (item: summerGame) => (
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
          <SummerLeagueGameCard game={item} isDark={isDark} />
        ) : (
          <SummerLeagueGameSquareCard game={item} isDark={isDark} />
        )}
      </View>
    </LongPressGestureHandler>
  );

  if (loading) {
    const skeletonCount = games.length > 0 ? games.length : expectedCount ?? 4;
    return (
      <View style={styles.skeletonWrapper}>
        {Array.from({ length: skeletonCount }).map((_, index) =>
          viewMode === "list" ? (
            <GameCardSkeleton key={index} />
          ) : (
            <GameSquareCardSkeleton key={index} />
          )
        )}
      </View>
    );
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
        <SummerLeagueGamePreviewModal
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
  contentContainer: {
    paddingBottom: 100,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 20,
    fontFamily: "Oswald_300Light",
  },
  gridItem: {
    width: "48%", // Not 50% to account for margin space between items
    marginBottom: 16,
  },
});

export default SummerGamesList;
