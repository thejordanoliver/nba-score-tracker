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
import GameCardSkeleton from "../GameCardSkeleton";
// Import the summer league modal instead of the regular one
import SummerLeagueGamePreviewModal from "../summer-league/SummerLeagueGamePreviewModal";
import type { Game, summerGame } from "../../types/types";

type SummerGamesListProps = {
  games: summerGame[];
  loading: boolean;
  refreshing: boolean;
  onRefresh: () => void;
};

/** Helper to convert summerGame → Game to satisfy modal props */


const SummerGamesList: React.FC<SummerGamesListProps> = ({
  games,
  loading,
  refreshing,
  onRefresh,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [previewGame, setPreviewGame] = useState<summerGame | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleLongPress = (game: summerGame) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setPreviewGame(game);
    setModalVisible(true);
  };

  const renderGameCard = (item: summerGame) => (
    <LongPressGestureHandler
      minDurationMs={300}
      onHandlerStateChange={({ nativeEvent }) => {
        if (nativeEvent.state === State.ACTIVE) {
          handleLongPress(item);
        }
      }}
    >
      <View>
        <SummerLeagueGameCard game={item} isDark={isDark} />
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
            No summer league games found for this date.
          </Text>
        }
      />

      {modalVisible && previewGame && (
     <SummerLeagueGamePreviewModal
  visible={modalVisible}
  game={previewGame} // ✅ already the correct summerGame type
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

export default SummerGamesList;
