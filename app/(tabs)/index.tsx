import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import * as React from "react";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Animated, FlatList, Text, View, useColorScheme } from "react-native";
import { CustomHeaderTitle } from "../../components/CustomHeaderTitle";
import FavoritesScroll from "../../components/FavoritesScroll";
import FavoritesScrollSkeleton from "../../components/FavoritesScrollSkeleton";
import GameCard from "../../components/GameCard";
import GameCardSkeleton from "../../components/GameCardSkeleton";
import HighlightCard from "../../components/HighlightCard";
import NewsCard from "../../components/NewsCard";
import NewsCardSkeleton from "../../components/NewsCardSkeleton";
import TabBar from "../../components/TabBar";
import { useNewsStore } from "../../hooks/newsStore";
import { useHighlights } from "../../hooks/useHighlights";
import type { TransformedGame } from "../../hooks/useLiveGames";
import { useLiveGames } from "../../hooks/useLiveGames";
import { useNews } from "../../hooks/useNews";
import { useWeeklyGames } from "../../hooks/useWeeklyGames";
import { getStyles } from "../../styles/HomeScreen.styles";

type Tab = "scores" | "news";

type NewsItem = {
  id: string;
  title: string;
  source: string;
  url: string;
  thumbnail?: string;
  publishedAt?: string;
};

type HighlightItem = {
  videoId: string;
  title: string;
  publishedAt: string;
  thumbnail: string;
};

type CombinedItem =
  | (NewsItem & { itemType: "news" })
  | (HighlightItem & { itemType: "highlight" });

export default function HomeScreen() {
  const {
    games: weeklyGames,
    loading: weeklyGamesLoading,
    refreshGames: refreshWeeklyGames,
  } = useWeeklyGames();

  const {
    games: liveGames,
    loading: liveGamesLoading,
    error: liveGamesError,
    refreshGames: refreshLiveGames,
  } = useLiveGames();

  const {
    news,
    loading: newsLoading,
    error: newsError,
    refreshNews,
  } = useNews();

  const {
    highlights,
    loading: highlightsLoading,
    error: highlightsError,
  } = useHighlights("NBA highlights", 50);

  const navigation = useNavigation();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const setArticles = useNewsStore((state) => state.setArticles);

  const tabs: Tab[] = ["scores", "news"];
  const [selectedTab, setSelectedTab] = useState<Tab>("scores");
  const underlineX = useRef(new Animated.Value(0)).current;
  const underlineWidth = useRef(new Animated.Value(0)).current;
  const tabMeasurements = useRef<{ x: number; width: number }[]>([]);

  const [favorites, setFavorites] = useState<string[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  React.useEffect(() => {
    if (news && news.length > 0) {
      setArticles(news);
    }
  }, [news, setArticles]);

  useFocusEffect(
    useCallback(() => {
      const loadFavorites = async () => {
        try {
          const stored = await AsyncStorage.getItem("favorites");
          if (stored) {
            setFavorites(JSON.parse(stored));
          }
        } catch (error) {
          console.warn("Failed to load favorites:", error);
        }
      };
      loadFavorites();
    }, [])
  );

  useEffect(() => {
    useNewsStore.getState().loadCachedArticles();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <CustomHeaderTitle title="Home" tabName="Home" isTeamScreen={false} />
      ),
    });
  }, [navigation, isDark]);

  const handleTabPress = (tab: Tab) => {
    setSelectedTab(tab);
    const index = tabs.indexOf(tab);
    if (tabMeasurements.current[index]) {
      Animated.parallel([
        Animated.timing(underlineX, {
          toValue: tabMeasurements.current[index].x,
          duration: 200,
          useNativeDriver: false,
        }),
        Animated.timing(underlineWidth, {
          toValue: tabMeasurements.current[index].width,
          duration: 200,
          useNativeDriver: false,
        }),
      ]).start();
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      if (selectedTab === "scores") {
        await Promise.all([refreshLiveGames?.(), refreshWeeklyGames?.()]);
      } else if (selectedTab === "news") {
        await refreshNews?.();
        // You might add a way to refresh highlights if your hook supports it
      }
    } catch (err) {
      console.warn("Refresh failed:", err);
    } finally {
      setRefreshing(false);
    }
  };

  const styles = getStyles(isDark);

  const combinedGames: TransformedGame[] = React.useMemo(() => {
    if (!liveGames.length) return weeklyGames;
    const weeklyFiltered = weeklyGames.filter(
      (wg) => !liveGames.some((lg) => lg.id === wg.id)
    );
    return [...liveGames, ...weeklyFiltered];
  }, [liveGames, weeklyGames]);

  // Combine news and highlights for the "news" tab and sort by publishedAt descending
  const combinedNewsAndHighlights: CombinedItem[] = React.useMemo(() => {
    const taggedNews: CombinedItem[] = news.map((item) => ({
      ...item,
      itemType: "news",
      publishedAt: item.publishedAt ?? item.date ?? new Date().toISOString(),
    }));
    const taggedHighlights: CombinedItem[] = highlights.map((item) => ({
      ...item,
      itemType: "highlight",
    }));

    const combined = [...taggedNews, ...taggedHighlights];

    // Sort by publishedAt descending, fallback to 0 if no date for highlight (put highlights last)
    combined.sort((a, b) => {
      const aDate = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
      const bDate = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
      return bDate - aDate;
    });

    return combined;
  }, [news, highlights]);

  return (
    <View style={styles.container}>
      <TabBar tabs={tabs} selected={selectedTab} onTabPress={handleTabPress} />
      {(weeklyGamesLoading || liveGamesLoading) && !favorites.length ? (
        <FavoritesScrollSkeleton />
      ) : (
        <FavoritesScroll favoriteTeamIds={favorites} />
      )}

      <View style={styles.contentArea}>
        {selectedTab === "scores" ? (
          <>
            <Text style={styles.heading}>Latest Games</Text>

            {(weeklyGamesLoading || liveGamesLoading) &&
            combinedGames.length === 0 &&
            !refreshing ? (
              <>
                <GameCardSkeleton />
                <GameCardSkeleton />
                <GameCardSkeleton />
              </>
            ) : combinedGames.length === 0 &&
              !weeklyGamesLoading &&
              !liveGamesLoading ? (
              <Text style={styles.emptyText}>No games today.</Text>
            ) : (
              <FlatList
                data={combinedGames}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => <GameCard game={item} />}
                refreshing={refreshing}
                onRefresh={handleRefresh}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 20 }}
                style={{ flex: 1 }}
              />
            )}
          </>
        ) : (
          <>
            <Text style={styles.heading}>Latest News & Highlights</Text>

            {(newsLoading || (highlightsLoading && !newsLoading)) &&
            !refreshing ? (
              <>
                <NewsCardSkeleton />
                <NewsCardSkeleton />
                <NewsCardSkeleton />
              </>
            ) : newsError ? (
              <Text style={styles.emptyText}>{newsError}</Text>
            ) : combinedNewsAndHighlights.length === 0 ? (
              <Text style={styles.emptyText}>
                No news or highlights available.
              </Text>
            ) : (
              <FlatList
                data={combinedNewsAndHighlights}
                keyExtractor={(item) =>
                  item.itemType === "news" ? item.id : item.videoId
                }
                refreshing={refreshing}
                onRefresh={handleRefresh}
                contentContainerStyle={{ paddingBottom: 100 }}
                renderItem={({ item }) =>
                  item.itemType === "news" ? (
                    <NewsCard
                      id={item.id}
                      title={item.title}
                      source={item.source}
                      url={item.url}
                      thumbnail={item.thumbnail}
                    />
                  ) : (
                    <HighlightCard
                      videoId={item.videoId}
                      title={item.title}
                      publishedAt={item.publishedAt}
                      thumbnail={item.thumbnail}
                    />
                  )
                }
              />
            )}
          </>
        )}
      </View>
    </View>
  );
}
