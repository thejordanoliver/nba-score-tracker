import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  Animated,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";
import { CustomHeaderTitle } from "../../components/CustomHeaderTitle";
import GameCard from "../../components/GameCard";
import TabBar from "../../components/TabBar";

import { teams } from "../../constants/teams";

export default function HomeScreen() {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  // Tabs and selected tab state
  const tabs = ["scores", "news"] as const;
  const [selectedTab, setSelectedTab] =
    useState<(typeof tabs)[number]>("scores");

  // Animated values for underline position and width
  const underlineX = useRef(new Animated.Value(0)).current;
  const underlineWidth = useRef(new Animated.Value(0)).current;

  // Store layout measurements for tabs
  const tabMeasurements = useRef<{ x: number; width: number }[]>([]);

  const router = useRouter();

  // State for games, news and favorites
  const [games, setGames] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);

  // Dummy news data
  const [news, setNews] = useState<
    { id: string; title: string; summary: string; source: string }[]
  >([]);

  // Load favorites on screen focus with error handling
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

  // Load dummy games & news once
  useEffect(() => {
    setGames([
      {
        id: "1",
        home: {
          name: "Pacers",
          logo: "https://cdn.nba.com/logos/nba/1610612754/global/L/logo.svg",
          record: "50-32",
        },
        away: {
          name: "Knicks",
          logo: "https://cdn.nba.com/logos/nba/1610612752/global/L/logo.svg",
          record: "51-31",
        },
        date: "5/23",
        time: "8:00 PM",
        channel: "TNT",
      },
      {
        id: "2",
        home: {
          name: "Thunder",
          logo: "https://cdn.nba.com/logos/nba/1610612760/global/L/logo.svg",
          record: "68-14",
        },
        away: {
          name: "Timberwolves",
          logo: "https://cdn.nba.com/logos/nba/1610612750/global/L/logo.svg",
          record: "49-33",
        },
        date: "5/24",
        time: "8:30 PM",
        channel: "ABC",
      },
    ]);

    setNews([
      {
        id: "n1",
        title: "Lakers clinch playoff spot",
        summary:
          "The Lakers secured their place in the playoffs with a thrilling win over the Clippers.",
        source: "ESPN",
      },
      {
        id: "n2",
        title: "Injury update: Durant out 2 weeks",
        summary:
          "Kevin Durant is expected to miss the next two weeks due to a hamstring strain.",
        source: "NBA.com",
      },
      {
        id: "n3",
        title: "Rookie sensation shines",
        summary:
          "The rookie of the year candidate scored 30 points to lead his team to victory.",
        source: "Bleacher Report",
      },
    ]);
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => <CustomHeaderTitle title={`Home`} />, // Use your custom header here
    });
  }, [navigation, isDark]);

  // Filter favorite teams from all teams
  const favoriteTeams = teams.filter((team) => favorites.includes(team.id));

  // Animate underline on tab press
  const handleTabPress = (tab: (typeof tabs)[number]) => {
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

  // Render news item
  const renderNewsItem = ({
    item,
  }: {
    item: { id: string; title: string; summary: string; source: string };
  }) => (
    <View key={item.id} style={styles.newsCard}>
      <Text style={styles.newsTitle}>{item.title}</Text>
      <Text style={styles.newsSummary}>{item.summary}</Text>
      <Text style={styles.newsSource}>Source: {item.source}</Text>
    </View>
  );

  const styles = getStyles(isDark);
  return (
    <View style={styles.container}>
      {/* Tabs */}
      <TabBar
        tabs={tabs}
        selected={selectedTab} // ← change from selectedTab to selected
        onTabPress={handleTabPress}
      />

      {/* Favorites scroll */}
      <View style={styles.wrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.favorites}
        >
          {favoriteTeams.length === 0 && (
            <Text style={styles.noFavoritesText}>
              Add favorites to get started
            </Text>
          )}
          {favoriteTeams.map((team) => (
            <View key={team.id} style={styles.teamIcon}>
              <Image source={{ uri: team.logo }} style={styles.logo} />
              <Text style={styles.teamLabel}>{team.name}</Text>
            </View>
          ))}
          <Pressable
            onPress={() => router.push("/edit-favorites")}
            accessibilityRole="button"
            accessibilityLabel="Edit favorite teams"
          >
            <View style={[styles.teamIcon]}>
              <View style={styles.editIcon}>
                <Ionicons
                  name="create"
                  size={28}
                  color={isDark ? "#000" : "#fff"}
                />
              </View>
              <Text style={styles.teamLabel}>Edit</Text>
            </View>
          </Pressable>
        </ScrollView>

        {/* Scores or News */}
        {selectedTab === "scores" ? (
          <>
            <Text style={styles.heading}>Upcoming Games</Text>
            <FlatList
              data={games}
              renderItem={({ item }) => (
                <GameCard game={item} isDark={isDark} />
              )}
              keyExtractor={(item) => item.id}
              ListEmptyComponent={
                <Text style={styles.emptyText}>
                  No games available right now.
                </Text>
              }
              initialNumToRender={5}
              removeClippedSubviews={true}
            />
          </>
        ) : (
          <>
            <Text style={styles.heading}>Latest News</Text>
            {news.length === 0 ? (
              <Text style={styles.emptyText}>No news available yet.</Text>
            ) : (
              <FlatList
                data={news}
                renderItem={renderNewsItem}
                keyExtractor={(item) => item.id}
                initialNumToRender={3}
                removeClippedSubviews={true}
                contentContainerStyle={{ paddingBottom: 20 }}
              />
            )}
          </>
        )}
      </View>
    </View>
  );
}

const getStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? "#1d1d1d" : "#fff",
      padding: 16,
    },
    tabs: {
      flexDirection: "row",
      justifyContent: "center",
      marginBottom: 10,
      position: "relative",
    },
    tabPressable: {
      marginHorizontal: 40,
      paddingHorizontal: 20,
      paddingVertical: 10,
    },
    tab: {
      fontSize: 20,
      color: isDark ? "#888" : "#aaa",
      fontFamily: "Oswald_400Regular",
    },
    tabSelected: {
      fontSize: 20,
      fontWeight: "bold",
      color: isDark ? "#fff" : "#1d1d1d",
      fontFamily: "Oswald_400Regular",
    },
    underline: {
      position: "absolute",
      height: 2,
      backgroundColor: isDark ? "#fff" : "#1d1d1d",
      bottom: 0,
      left: 0,
    },

    wrapper: {
      marginTop: 12,
    },

    favorites: {
      flexDirection: "row",
      marginBottom: 20,
      paddingBottom: 0,
      paddingTop: 24,
    },
    teamIcon: {
      alignItems: "center",
      marginRight: 16,
      marginBottom: 0,
    },
    logo: { width: 50, height: 50, borderRadius: 25 },
    editIcon: {
      backgroundColor: isDark ? "#fff" : "#1d1d1d",
      width: 50,
      height: 50,
      borderRadius: 25,
      justifyContent: "center",
      alignItems: "center",
    },

    teamLabel: {
      marginTop: 4,
      fontSize: 12,
      color: isDark ? "#ccc" : "#1d1d1d",
      fontFamily: "Oswald_400Regular",
    },
    heading: {
      fontSize: 24,
      fontFamily: "Oswald_500Medium",
      marginBottom: 8,
      marginTop: 8,
      paddingBottom: 4,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? "#444" : "#ccc",
      color: isDark ? "#fff" : "#1d1d1d",
    },
    noFavoritesText: {
      marginLeft: 10,
      marginRight: 10,
      color: isDark ? "#aaa" : "#666",
      fontStyle: "italic",
      alignSelf: "center",
      fontSize: 14,
    },
    emptyText: {
      textAlign: "center",
      color: isDark ? "#aaa" : "#999",
      marginTop: 20,
      fontSize: 14,
    },
    newsCard: {
      backgroundColor: isDark ? "#2e2e2e" : "#f9f9f9",
      padding: 12,
      marginTop: 12,

      borderRadius: 8,
    },
    newsTitle: {
      fontWeight: "bold",
      fontSize: 16,
      marginBottom: 4,
      color: isDark ? "#fff" : "#1d1d1d",
    },
    newsSummary: {
      fontSize: 14,
      marginBottom: 6,
      color: isDark ? "#ddd" : "#333",
    },
    newsSource: {
      fontSize: 12,
      color: isDark ? "#aaa" : "#666",
      fontStyle: "italic",
    },
  });
