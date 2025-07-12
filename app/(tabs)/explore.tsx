import players from "@/constants/players";
import { teamsById } from "@/constants/teams";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { useRouter } from "expo-router";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import {
  ActivityIndicator,
  Animated,
  Easing,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from "react-native";
import { CustomHeaderTitle } from "../../components/CustomHeaderTitle";
import TabBar from "../../components/TabBar"; // Adjust path if needed



const API_URL = process.env.EXPO_PUBLIC_API_URL;

const OSEXTRALIGHT = "Oswald_200ExtraLight";
const OSLIGHT = "Oswald_300Light";
const OSREGULAR = "Oswald_400Regular";
const OSMEDIUM = "Oswald_500Medium";
const OSBOLD = "Oswald_700Bold";
const OSSEMIBOLD = "Oswald_600SemiBold";

const RAPIDAPI_KEY = "5ce63285f3msh422b3ebd5978062p13acf6jsn31927b93628c";
const currentSeason = 2024;

type PlayerResult = {
  id: number;
  player_id: number;
  name: string;
  avatarUrl: string;
  position: string;
  team_id: number;
  type: "player";
};

type TeamResult = {
  id: number;
  name: string;
  nickname: string;
  city: string;
  logo_filename: string;
  type: "team";
};

type UserResult = {
  id: number;
  username: string;
  profileImageUrl: string;
  type: "user";
};

type ResultItem = PlayerResult | TeamResult | UserResult;

interface ApiResponse<T> {
  response: T[];
}

const tabs = ["All", "Teams", "Players", "Accounts"] as const;

export default function ExplorePage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<ResultItem[]>([]);
  const [searchVisible, setSearchVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedTab, setSelectedTab] = useState<(typeof tabs)[number]>("All");
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  const navigation = useNavigation();
  const router = useRouter();
  const isDark = useColorScheme() === "dark";
  const inputAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loadUserId = async () => {
      const id = await AsyncStorage.getItem("userId");
      if (id) setCurrentUserId(Number(id));
    };
    loadUserId();
  }, []);

  useEffect(() => {
    Animated.timing(inputAnim, {
      toValue: searchVisible ? 1 : 0,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [searchVisible]);

  useEffect(() => {
    if (query.trim().length === 0) {
      setResults([]);
      setError(null);
      setSelectedTab("All"); // reset tab when query clears
      return;
    }

    const fetchFromDb = async () => {
      setLoading(true);
      setError(null);

      try {
        const playerRes = await axios.get<{
          players: PlayerResult[];
          teams: TeamResult[];
          users: UserResult[];
        }>(`${API_URL}/api/search`, { params: { query } });

        const data = playerRes.data;

        const combinedResults: ResultItem[] = [];

        if (data.teams?.length) {
          combinedResults.push(
            ...data.teams.map((team) => ({
              ...team,
              type: "team" as const,
            }))
          );
        }

      if (data.players?.length) {
  combinedResults.push(
    ...data.players
      .filter((p) => p.team_id !== null && p.team_id !== undefined)
      .map((p) => ({
        ...p,
        type: "player" as const,
      }))
  );
}


        if (data.users?.length) {
          combinedResults.push(
            ...data.users.map((u) => ({
              ...u,
              type: "user" as const,
            }))
          );
        }

        setResults(combinedResults);
      } catch (err: any) {
        setError(err.message || "Failed to fetch data");
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchFromDb, 400);
    return () => clearTimeout(debounce);
  }, [query]);

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <CustomHeaderTitle
          tabName="Explore"
          title="Explore"
          onSearchToggle={() => setSearchVisible((prev) => !prev)}
        />
      ),
    });
  }, [navigation]);

  // Filter results based on selected tab
  const filteredResults = results.filter((item) => {
    if (selectedTab === "All") return true;
    if (selectedTab === "Teams") return item.type === "team";
    if (selectedTab === "Players") return item.type === "player";
    if (selectedTab === "Accounts") return item.type === "user";
    return true;
  });

  const getItemKey = (item: ResultItem): string => {
    switch (item.type) {
      case "team":
        return `team-${item.id}`;
      case "player":
        return `player-${item.id}`;
      case "user":
        return `user-${item.id}`;
      default:
        return Math.random().toString(); // fallback
    }
  };

  const renderItem = ({ item }: { item: ResultItem }) => {
    if (item.type === "team") {
      const localTeam =
        item?.id != null ? teamsById[item.id.toString()] : undefined;

      // localTeam.logo is a local image import (not a URL string)
      const logoSource = isDark
        ? localTeam?.logoLight || localTeam?.logo
        : localTeam?.logo;

      return (
        <Pressable
          onPress={() => {
            router.push(`/team/${item.id}`);
          }}
          style={[styles.itemContainer, isDark && styles.itemContainerDark]}
        >
          <View style={styles.teamRow}>
            {logoSource && (
              <Image
                source={logoSource} // <-- Directly use the imported image, no 'uri:'
                style={styles.teamLogo}
                resizeMode="contain"
              />
            )}
            <Text style={[styles.teamName, isDark && styles.textDark]}>
              {localTeam?.fullName}
            </Text>
          </View>
        </Pressable>
      );
    }

    if (item.type === "player") {
      const fullName = item.name;
      const avatarUrl = item.avatarUrl?.trim()
        ? item.avatarUrl
        : players[fullName];

      const localTeam =
        item?.team_id != null ? teamsById[item.team_id.toString()] : undefined;

      return (
        <Pressable
          onPress={() => {
            router.push({
              pathname: "/player/[id]",
              params: {
                id: item.player_id.toString(),
                teamId: item.team_id.toString(),
              },
            });
          }}
          style={[styles.itemContainer, isDark && styles.itemContainerDark]}
        >
          <View style={styles.playerRow}>
            <Image
              source={{ uri: avatarUrl }}
              style={styles.avatar}
              resizeMode="cover"
            />
            <View style={styles.playerInfo}>
              <Text style={[styles.playerName, isDark && styles.textDark]}>
                {item.name}
              </Text>
              <Text style={[styles.playerTeam, isDark && styles.textDark]}>
                {localTeam?.fullName}
              </Text>
            </View>
          </View>
        </Pressable>
      );
    }

    if (item.type === "user") {
      // Make sure profileImageUrl is a full URL
      const profileImageFullUrl = item.profileImageUrl.startsWith("http")
        ? item.profileImageUrl
        : `${API_URL}${item.profileImageUrl}`;

      return (
        <Pressable
          onPress={() => {
            router.push({
              pathname: "/user/[id]",
              params: { id: item.id.toString() },
            });
          }}
          style={[styles.itemContainer, isDark && styles.itemContainerDark]}
        >
          <View style={styles.userRow}>
            <Image
              source={{ uri: profileImageFullUrl }}
              style={styles.avatar}
              resizeMode="cover"
            />
            <View style={styles.userInfo}>
              <Text style={[styles.userName, isDark && styles.textDark]}>
                {item.username}
              </Text>
            </View>
          </View>
        </Pressable>
      );
    }

    return null;
  };

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <Animated.View
        style={[
          styles.searchBarWrapper,
          {
            width: inputAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ["0%", "100%"],
            }),
            height: inputAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 50],
            }),
            opacity: inputAnim,
            marginBottom: inputAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 8],
            }),
          },
        ]}
      >
        <TextInput
          placeholder="Search..."
          placeholderTextColor={isDark ? "#888" : "#aaa"}
          style={[styles.searchInput, isDark && styles.searchInputDark]}
          value={query}
          onChangeText={setQuery}
          autoCapitalize="none"
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            if (query.trim().length === 0) setIsFocused(false);
          }}
        />
      </Animated.View>

      {searchVisible && (
        <TabBar
          tabs={tabs}
          selected={selectedTab}
          onTabPress={setSelectedTab}
          style={{ marginBottom: 12}}
        />
      )}

      {query.length === 0 && !loading && !error && (
        <View style={styles.centerPrompt}>
          <Image
            source={require("../../assets/Logos/NBA.png")}
            style={styles.nbaLogo}
            resizeMode="contain"
          />
          <Text style={[styles.promptText, isDark && styles.textDark]}>
            Search for players and teams
          </Text>
        </View>
      )}

      {loading && (
        <ActivityIndicator size="large" color={isDark ? "white" : "black"} />
      )}

      {error && (
        <Text style={[styles.errorText, isDark && styles.errorTextDark]}>
          {error}
        </Text>
      )}

      {!loading && query.length > 0 && filteredResults.length === 0 && (
        <Text style={[styles.emptyText, isDark && styles.textDark]}>
          No results found.
        </Text>
      )}

      {!loading && !error && filteredResults.length > 0 && (
        <FlatList<ResultItem>
          data={filteredResults}
          keyExtractor={getItemKey}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  containerDark: {
    backgroundColor: "#1d1d1d",
  },
  searchBarWrapper: {
    overflow: "hidden",
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#888",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    color: "#000",
    fontFamily: OSLIGHT,
  },
  searchInputDark: {
    borderColor: "#555",
    color: "#fff",
  },
  itemContainer: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  itemContainerDark: {
    borderBottomColor: "#333",
  },
  teamName: {
    fontSize: 18,
    fontFamily: OSSEMIBOLD,
  },
  playerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
    backgroundColor: "#888",
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: 18,
    fontFamily: OSSEMIBOLD,
  },
  playerTeam: {
    fontSize: 14,
    color: "#555",
    fontFamily: OSLIGHT,
    opacity: 0.5,
  },
  textDark: {
    color: "#eee",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#888",
  },
  errorText: {
    color: "red",
    textAlign: "center",
  },
  errorTextDark: {
    color: "#ff6666",
  },
  centerPrompt: {
    flex: 1,
    marginTop: 80,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  nbaLogo: {
    width: 100,
    height: 100,
    marginBottom: 12,
  },
  promptText: {
    fontSize: 24,
    fontFamily: OSREGULAR,
    color: "#555",
  },

  teamRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  teamLogo: {
    width: 40,
    height: 40,
    marginRight: 12,
  },

  userRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
  },
  userName: {
    fontSize: 18,
    fontFamily: OSSEMIBOLD,
  },
});
