import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import { FlatList, StyleSheet, Text, useColorScheme, View } from "react-native";
import { LongPressGestureHandler, State } from "react-native-gesture-handler";
import type { Game } from "../types/types";
import GameCard from "./GameCard";
import GameCardSkeleton from "./GameCardSkeleton";
import GamePreviewModal from "./GamePreview/GamePreviewModal";

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

  const [previewGame, setPreviewGame] = useState<Game | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleLongPress = (game: Game) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setPreviewGame(game);
    setModalVisible(true);
  };

  const renderGameCard = (item: Game) => (
    <LongPressGestureHandler
      minDurationMs={300}
      onHandlerStateChange={({ nativeEvent }) => {
        if (nativeEvent.state === State.ACTIVE) {
          handleLongPress(item);
        }
      }}
    >
      <View>
        <GameCard game={item} isDark={isDark} />
      </View>
    </LongPressGestureHandler>
  );

  if (loading) {
    return (
      <View style={styles.skeletonWrapper}>
        <GameCardSkeleton />
        <GameCardSkeleton />
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
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: isDark ? "#aaa" : "#999" }]}>
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
});

export default GamesList;
