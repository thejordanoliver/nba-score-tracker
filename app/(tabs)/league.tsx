import CalendarModal from "@/components/CalendarModal";
import GamesList from "@/components/GamesList"; // import GamesList component
import NewsHighlightsList from "@/components/NewsHighlightsList";
import { StandingsList } from "@/components/StandingsList";
import { getScoresStyles } from "@/styles/leagueStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import * as React from "react";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { Animated, Text, View, useColorScheme } from "react-native";
import DateNavigator from "@/components/DateNavigator";
import { CustomHeaderTitle } from "../../components/CustomHeaderTitle";
import TabBar from "../../components/TabBar";
import { useHighlights } from "../../hooks/useHighlights";
import { useNews } from "../../hooks/useNews";
import { useSeasonGames } from "../../hooks/useSeasonGames";

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

export default function ScoresScreen() {
  const currentYear = "2024";
  const {
    games,
    loading: gamesLoading,
    refreshGames,
  } = useSeasonGames(currentYear);

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
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const styles = getScoresStyles(isDark);

  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const tabs = ["scores", "news", "standings", "stats"] as const;
  type TabType = (typeof tabs)[number];
  const [selectedTab, setSelectedTab] = useState<TabType>("scores");

  const underlineX = useRef(new Animated.Value(0)).current;
  const underlineWidth = useRef(new Animated.Value(0)).current;
  const tabMeasurements = useRef<{ x: number; width: number }[]>([]);
  const router = useRouter();

  const [favorites, setFavorites] = useState<string[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const loadFavorites = async () => {
        try {
          const stored = await AsyncStorage.getItem("favorites");
          if (stored) setFavorites(JSON.parse(stored));
        } catch (error) {
          console.warn("Failed to load favorites:", error);
        }
      };
      loadFavorites();
    }, [])
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <CustomHeaderTitle
          title="League"
          tabName="League"
          onCalendarPress={() => setShowCalendarModal(true)}
        />
      ),
    });
  }, [navigation]);

  const handleTabPress = (tab: TabType) => {
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
      await Promise.all([refreshGames(), refreshNews()]);
    } catch (error) {
      console.warn("Failed to refresh:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const changeDateByDays = (days: number) => {
    setSelectedDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setDate(newDate.getDate() + days);
      return newDate;
    });
  };

  const filteredGames = games.filter((game) => {
    const gameDate = new Date(game.date);
    return (
      gameDate.getFullYear() === selectedDate.getFullYear() &&
      gameDate.getMonth() === selectedDate.getMonth() &&
      gameDate.getDate() === selectedDate.getDate()
    );
  });

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

    combined.sort((a, b) => {
      const aDate = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
      const bDate = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
      return bDate - aDate;
    });

    return combined;
  }, [news, highlights]);

  return (
    <>
      <View style={styles.container}>
        <TabBar
          tabs={tabs}
          selected={selectedTab}
          onTabPress={handleTabPress}
        />

        <View style={styles.contentArea}>
          {selectedTab === "scores" && (
            <>
              <DateNavigator
                selectedDate={selectedDate}
                onChangeDate={changeDateByDays}
                onOpenCalendar={() => setShowCalendarModal(true)}
                isDark={isDark}
              />
              {/* Use GamesList here instead of inline FlatList */}
              <GamesList
                games={filteredGames}
                loading={gamesLoading}
                refreshing={refreshing}
                onRefresh={handleRefresh}
              />
            </>
          )}

          {selectedTab === "news" && (
            <NewsHighlightsList
              items={combinedNewsAndHighlights}
              loading={newsLoading}
              refreshing={refreshing}
              onRefresh={handleRefresh}
            />
          )}

          {selectedTab === "standings" && <StandingsList />}
          {selectedTab === "stats" && <StatsList />}
        </View>
      </View>

      <CalendarModal
        visible={showCalendarModal}
        onClose={() => setShowCalendarModal(false)}
        onSelectDate={(dateString) => {
          const [year, month, day] = dateString.split("-").map(Number);
          setSelectedDate(new Date(year, month - 1, day));
          setShowCalendarModal(false);
        }}
        markedDates={games.reduce(
          (acc, game) => {
            const localDate = new Date(game.date);
            const localISODate = `${localDate.getFullYear()}-${String(
              localDate.getMonth() + 1
            ).padStart(
              2,
              "0"
            )}-${String(localDate.getDate()).padStart(2, "0")}`;
            acc[localISODate] = {
              marked: true,
              dotColor: isDark ? "#fff" : "#1d1d1d",
            };
            return acc;
          },
          {} as Record<string, { marked: boolean; dotColor: string }>
        )}
      />
    </>
  );
}

const StatsList = () => (
  <View style={{ paddingTop: 16 }}>
    <Text style={{ textAlign: "center", color: "#888" }}>
      Stats coming soon...
    </Text>
  </View>
);
