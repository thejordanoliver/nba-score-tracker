import NFLGameCard from "@/components/NFL/NFLGameCard";
import { teams } from "@/constants/teamsNFL";
import { useNFLTeamGames } from "@/hooks/useNFLTeamGames";
import { Game } from "@/types/nfl";
import { User } from "@/types/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { goBack } from "expo-router/build/global-state/routing";
import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  View,
  useColorScheme,
  StyleSheet,
} from "react-native";
import { CustomHeaderTitle } from "../../../components/CustomHeaderTitle";
import TabBar from "../../../components/TabBar";
import { style } from "../../../styles/TeamDetails.styles";
import HeadingTwo from "@/components/Headings/HeadingTwo";

export default function TeamDetailScreen() {
  const navigation = useNavigation();
  const { teamId } = useLocalSearchParams();
  const teamIdNum = teamId ? parseInt(teamId as string, 10) : null;

  const [refreshing, setRefreshing] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);

  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const styles = style(isDark);

  const tabs = ["schedule", "news", "roster", "forum", "stats"] as const;
  const [selectedTab, setSelectedTab] =
    useState<(typeof tabs)[number]>("schedule");

  const team = useMemo(
    () => (teamIdNum ? teams.find((t) => Number(t.id) === teamIdNum) : null),
    [teamIdNum]
  );

  const {
    games: rawTeamGames = [],
    loading: gamesLoading,
    error: gamesError,
    refreshGames: refreshTeamGames,
  } = useNFLTeamGames(teamIdNum ? teamIdNum.toString() : "");

  // only valid games
  const teamGames = useMemo(
    () => rawTeamGames.filter((g: Game) => g?.game?.date?.date),
    [rawTeamGames]
  );

  // --- Flatten games with headers (only here) ---
  const flattenedGames = useMemo(() => {
    const grouped: { [stage: string]: Game[] } = {};
    teamGames.forEach((g) => {
      const stage = g.game.stage || "Unknown";
      if (!grouped[stage]) grouped[stage] = [];
      grouped[stage].push(g);
    });

    const flat: any[] = [];
    Object.keys(grouped).forEach((stage) => {
      flat.push({ type: "header", title: stage });
      grouped[stage].forEach((game) => flat.push({ type: "game", game }));
    });

    return flat;
  }, [teamGames]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      if (selectedTab === "schedule") {
        await refreshTeamGames?.();
      }
    } catch (err) {
      console.error("Refresh failed:", err);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const loadUser = async () => {
      try {
        const jsonUser = await AsyncStorage.getItem("loggedInUser");
        if (jsonUser) setLoggedInUser(JSON.parse(jsonUser));
      } catch (e) {
        console.error("Failed to load user:", e);
      }
    };
    loadUser();
  }, []);

  useEffect(() => {
    const checkFavorites = async () => {
      if (!teamIdNum) return;
      const stored = await AsyncStorage.getItem("favorites");
      if (stored) {
        const favorites = JSON.parse(stored);
        setIsFavorite(favorites.includes(teamIdNum.toString()));
      }
    };
    checkFavorites();
  }, [teamIdNum]);

  const toggleFavorite = async () => {
    if (!teamIdNum) return;
    try {
      const stored = await AsyncStorage.getItem("favorites");
      const favorites: string[] = stored ? JSON.parse(stored) : [];
      const updatedFavorites = favorites.includes(teamIdNum.toString())
        ? favorites.filter((id) => id !== teamIdNum.toString())
        : [...favorites, teamIdNum.toString()];
      await AsyncStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      setIsFavorite(updatedFavorites.includes(teamIdNum.toString()));
    } catch (err) {
      console.error("Failed to update favorites:", err);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () =>
        team && (
          <CustomHeaderTitle
            logo={team.logo}
            logoLight={team.logoLight}
            teamColor={team.color}
            onBack={goBack}
            isTeamScreen
            teamCode={team.code}
            isFavorite={isFavorite}
            onToggleFavorite={toggleFavorite}
          />
        ),
    });
  }, [navigation, isDark, team, isFavorite]);

  if (!teamIdNum || !team) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" style={{ marginTop: 40 }} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TabBar tabs={tabs} selected={selectedTab} onTabPress={setSelectedTab} />

      {/* Schedule Page */}
      {selectedTab === "schedule" && (
   <FlatList
  data={flattenedGames}
  keyExtractor={(item, index) =>
    item.type === "header"
      ? `header-${item.title}`
      : `game-${item.game.game.id}-${index}`
  }
  renderItem={({ item }) => {
    if (item.type === "header") {
      return (
        <View style={{ marginTop: 4, paddingHorizontal: 12 }}>
          <HeadingTwo>{item.title}</HeadingTwo>
        </View>
      );
    } else {
      return (
        <View style={{ paddingHorizontal: 12 }}>
          <NFLGameCard game={item.game} isDark={isDark} />
        </View>
      );
    }
  }}
  contentContainerStyle={{ paddingBottom: 100, gap: 12 }}
  refreshing={refreshing}
  onRefresh={handleRefresh}
/>

      )}
    </View>
  );
}
