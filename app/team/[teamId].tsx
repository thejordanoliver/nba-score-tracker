import GamesList from "@/components/GamesList";
import RosterStats from "@/components/RosterStats";
import { useTeamRosterStats } from "@/hooks/useTeamRosterStats";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { goBack } from "expo-router/build/global-state/routing";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { CustomHeaderTitle } from "../../components/CustomHeaderTitle";
import NewsCard from "../../components/NewsCard";
import PlayerCard from "../../components/PlayerCard";
import TabBar from "../../components/TabBar";
import { teams } from "../../constants/teams";
import { useNewsStore } from "../../hooks/newsStore";
import useDbPlayersByTeam from "../../hooks/useDbPlayersByTeam";
import { useTeamGames } from "../../hooks/useTeamGames";
import { useTeamNews } from "../../hooks/useTeamNews";
import { style } from "../../styles/TeamDetails.styles";

export default function TeamDetailScreen() {
  const navigation = useNavigation();
  const { teamId } = useLocalSearchParams();
  const [refreshing, setRefreshing] = useState(false);
  const teamIdNum = parseInt(teamId as string, 10);
  const [isFavorite, setIsFavorite] = useState(false);

  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const styles = style(isDark);
  const tabs = ["schedule", "news", "roster", "stats"] as const;
  const [selectedTab, setSelectedTab] =
    useState<(typeof tabs)[number]>("schedule");
  const underlineX = useRef(new Animated.Value(0)).current;
  const underlineWidth = useRef(new Animated.Value(0)).current;
  const tabMeasurements = useRef<{ x: number; width: number }[]>([]);
  const team = useMemo(
    () => teams.find((t) => t.id === teamIdNum.toString()),
    [teamIdNum]
  );

  const handleRefresh = async () => {
    setRefreshing(true);

    try {
      if (selectedTab === "schedule") {
        await new Promise((resolve) => setTimeout(resolve, 300)); // Optional short delay
      }

      if (selectedTab === "news") {
        await refreshNews();
      }

      if (selectedTab === "roster") {
        await refreshPlayers();
      }
    } catch (err) {
      console.error("Refresh failed:", err);
    } finally {
      setRefreshing(false);
    }
  };

  const {
    games: teamGames,
    loading: gamesLoading,
    error: gamesError,
  } = useTeamGames(teamIdNum.toString());

  const {
    articles: newsArticles,
    loading: newsLoading,
    error: newsError,
    refreshNews, // <- now available
  } = useTeamNews(team?.fullName ?? "");

  const setArticles = useNewsStore((state) => state.setArticles);

  useEffect(() => {
    if (!newsLoading && newsArticles.length > 0) {
      setArticles(newsArticles);
    }
  }, [newsLoading, newsArticles, setArticles]);

  useEffect(() => {
    const checkFavorites = async () => {
      const stored = await AsyncStorage.getItem("favorites");
      if (stored) {
        const favorites = JSON.parse(stored);
        setIsFavorite(favorites.includes(teamIdNum.toString()));
      }
    };
    checkFavorites();
  }, [teamIdNum]);

  const {
    rosterStats,
    loading: rosterStatsLoading,
    error: rosterStatsError,
  } = useTeamRosterStats(teamIdNum);

  const toggleFavorite = async () => {
    try {
      const stored = await AsyncStorage.getItem("favorites");
      const favorites: string[] = stored ? JSON.parse(stored) : [];

      let updatedFavorites: string[];
      if (favorites.includes(teamIdNum.toString())) {
        updatedFavorites = favorites.filter(
          (id) => id !== teamIdNum.toString()
        );
      } else {
        updatedFavorites = [...favorites, teamIdNum.toString()];
      }

      await AsyncStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      setIsFavorite(updatedFavorites.includes(teamIdNum.toString()));
    } catch (err) {
      console.error("Failed to update favorites:", err);
    }
  };

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const rawMonths = [
    { label: "Oct", month: 9, year: 2024 },
    { label: "Nov", month: 10, year: 2024 },
    { label: "Dec", month: 11, year: 2024 },
    { label: "Jan", month: 0, year: 2025 },
    { label: "Feb", month: 1, year: 2025 },
    { label: "Mar", month: 2, year: 2025 },
    { label: "Apr", month: 3, year: 2025 },
    { label: "May", month: 4, year: 2025 },
    { label: "Jun", month: 5, year: 2025 },
  ];

  const monthsToShow = rawMonths.filter(({ month, year }) => {
    return teamGames.some((game: any) => {
      const gameDate = new Date(game.date);
      return gameDate.getFullYear() === year && gameDate.getMonth() === month;
    });
  });

  useEffect(() => {
    if (!gamesLoading && teamGames.length > 0 && !selectedDate) {
      const sortedGames = [...teamGames].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      const latestGameDate = new Date(sortedGames[0].date);
      const latestMonth = latestGameDate.getMonth();
      const latestYear = latestGameDate.getFullYear();
      setSelectedDate(new Date(latestYear, latestMonth, 1));

      setTimeout(() => {
        const index = monthsToShow.findIndex(
          (m) => m.month === latestMonth && m.year === latestYear
        );
        if (index >= 0 && scrollViewRef.current) {
          scrollViewRef.current.scrollTo({
            x: index * 70, // match snap interval
            animated: true,
          });
        }
      }, 150);
    }
  }, [gamesLoading, teamGames, selectedDate, monthsToShow]);

  const handleSelectMonth = (month: number, year: number) => {
    setSelectedDate(new Date(year, month, 1));
  };

  const {
    players,
    loading: playersLoading,
    error: playersError,
    refreshPlayers, // <- now available
  } = useDbPlayersByTeam(teamIdNum.toString());

  const handleConfirmDate = (date: Date) => {
    setShowDatePicker(false);
    setSelectedDate(date);
  };

  const handleCancelDate = () => {
    setShowDatePicker(false);
  };

  const filteredGames = useMemo(() => {
    if (!selectedDate) return [];
    return teamGames.filter((game: any) => {
      const gameDate = new Date(game.date);
      return (
        gameDate.getFullYear() === selectedDate.getFullYear() &&
        gameDate.getMonth() === selectedDate.getMonth()
      );
    });
  }, [selectedDate, teamGames]);

  const hasFutureGames = teamGames.some((game: any) => {
    const gameDate = new Date(game.date);
    return (
      gameDate.getFullYear() > (selectedDate?.getFullYear() ?? 0) ||
      (gameDate.getFullYear() === (selectedDate?.getFullYear() ?? 0) &&
        gameDate.getMonth() > (selectedDate?.getMonth() ?? 0))
    );
  });

  const changeDateByMonths = (months: number) => {
    if (!selectedDate) return;
    setSelectedDate((prevDate) => {
      if (!prevDate || (months > 0 && !hasFutureGames)) return prevDate;
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() + months);
      return newDate;
    });
  };

  const playersForRosterStats = players.map((p) => {
    const [first_name, ...rest] = p.name.split(" ");
    const last_name = rest.join(" ");
    return {
      player_id: p.id, // <-- add this here
      first_name,
      last_name,
      jersey_number: p.jersey_number,
      headshot_url: p.avatarUrl ?? undefined,
    };
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <CustomHeaderTitle
          logo={team?.logo}
          logoLight={team?.logoLight}
          teamColor={team?.color}
          onBack={goBack}
          isTeamScreen={true}
          teamCode={team?.code}
          isFavorite={isFavorite}
          onToggleFavorite={toggleFavorite}
        />
      ),
    });
  }, [navigation, isDark, team, isFavorite]);

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

  if (!team || selectedDate === null) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" style={{ marginTop: 40 }} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TabBar tabs={tabs} selected={selectedTab} onTabPress={handleTabPress} />

      {selectedTab === "schedule" && (
        <>
          <View style={styles.monthSelector}>
            <ScrollView
              ref={scrollViewRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              snapToInterval={70}
              decelerationRate="fast"
              scrollEventThrottle={16}
              contentContainerStyle={{ paddingHorizontal: 10 }}
            >
              {monthsToShow.map(({ label, month, year }) => {
                const isSelected =
                  selectedDate.getMonth() === month &&
                  selectedDate.getFullYear() === year;

                return (
                  <TouchableOpacity
                    key={`${label}-${year}`}
                    onPress={() => handleSelectMonth(month, year)}
                    style={[
                      styles.monthButton,
                      { width: 70 },
                      isSelected && styles.monthButtonSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.monthText,
                        isSelected && styles.monthTextSelected,
                      ]}
                    >
                      {label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          <DateTimePickerModal
            isVisible={showDatePicker}
            mode="date"
            date={selectedDate}
            onConfirm={handleConfirmDate}
            onCancel={handleCancelDate}
            maximumDate={new Date(2100, 11, 31)}
            minimumDate={new Date(2000, 0, 1)}
          />

          <GamesList
            games={filteredGames}
            loading={gamesLoading}
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        </>
      )}

      {selectedTab === "news" && (
        <ScrollView
          contentContainerStyle={{ paddingBottom: 100 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={team.color}
            />
          }
        >
          {newsLoading ? (
            <ActivityIndicator size="large" style={{ marginTop: 20 }} />
          ) : newsError ? (
            <Text style={[styles.text, { textAlign: "center", marginTop: 20 }]}>
              {newsError}
            </Text>
          ) : newsArticles.length === 0 ? (
            <Text
              style={[
                styles.text,
                {
                  textAlign: "center",
                  marginTop: 20,
                  fontFamily: "Oswald_300Light",
                  fontSize: 20,
                },
              ]}
            >
              No news articles available.
            </Text>
          ) : (
            <View style={styles.newsContainer}>
              {newsArticles.map((article) => (
                <NewsCard
                  key={article.id}
                  id={article.id}
                  title={article.title}
                  source={article.source}
                  url={article.url}
                  thumbnail={article.thumbnail}
                />
              ))}
            </View>
          )}
        </ScrollView>
      )}

      {selectedTab === "roster" && (
        <ScrollView
          contentContainerStyle={{ paddingBottom: 100 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={team.color}
            />
          }
        >
          {playersLoading ? (
            <ActivityIndicator size="large" style={{ marginTop: 20 }} />
          ) : playersError ? (
            <Text style={[styles.text, { textAlign: "center", marginTop: 20 }]}>
              {playersError}
            </Text>
          ) : players.length === 0 ? (
            <Text style={[styles.text, { textAlign: "center", marginTop: 20 }]}>
              No players found.
            </Text>
          ) : (
            [...players]
              .sort((a, b) => {
                const jerseyA = parseInt(a.jersey_number ?? "0", 10);
                const jerseyB = parseInt(b.jersey_number ?? "0", 10);
                return jerseyA - jerseyB;
              })
              .map((player) => (
                <PlayerCard
                  key={player.id}
                  id={player.id}
                  playerId={player.player_id}
                  name={player.name}
                  position={player.position}
                  team={team.fullName}
                  avatarUrl={player.avatarUrl}
                  jerseyNumber={player.jersey_number}
                />
              ))
          )}
        </ScrollView>
      )}

      {selectedTab === "stats" && (
        <ScrollView
          contentContainerStyle={{ paddingBottom: 100 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={team.color}
            />
          }
        >
          <View style={{ marginTop: 16 }}>
            {rosterStatsLoading ? (
              <ActivityIndicator size="large" style={{ marginTop: 20 }} />
            ) : rosterStatsError ? (
              <Text
                style={[styles.text, { textAlign: "center", marginTop: 20 }]}
              >
                {rosterStatsError.message}
              </Text>
            ) : rosterStats.length === 0 ? (
              <Text
                style={[styles.text, { textAlign: "center", marginTop: 20 }]}
              >
                No player stats available.
              </Text>
            ) : (
              <RosterStats
                rosterStats={rosterStats}
                playersDb={playersForRosterStats}
                teamId={teamId as string} // ✅ must be provided here
              />
            )}
          </View>
        </ScrollView>
      )}

      {/* Your bottom navigation tab bar */}
    </View>
  );
}
