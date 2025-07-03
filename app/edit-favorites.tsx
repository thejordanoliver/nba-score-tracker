import { CustomHeaderTitle } from "@/components/CustomHeaderTitle";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  Animated,
  FlatList,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  UIManager,
  View,
  useColorScheme,
  useWindowDimensions,
} from "react-native";
import { teams } from "../constants/teams";

const OSEXTRALIGHT = "Oswald_200ExtraLight";
const OSLIGHT = "Oswald_300Light";
const OSREGULAR = "Oswald_400Regular";
const OSMEDIUM = "Oswald_500Medium";
const OSBOLD = "Oswald_700Bold";
const OSSEMIBOLD = "Oswald_600SemiBold";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL!;

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function EditFavoritesScreen() {
  const { width: screenWidth } = useWindowDimensions();

  const numColumns = 3;
  const containerPadding = 40; // 20 left + 20 right
  const columnGap = 12;
  const totalSpacing = columnGap * (numColumns - 1);
  const availableWidth = screenWidth - containerPadding - totalSpacing;
  const itemWidth = availableWidth / numColumns;
  const [favorites, setFavorites] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const router = useRouter();
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [username, setUsername] = useState<string | null>(null);
  const [isGridView, setIsGridView] = useState(true);

  const fadeAnim = useRef(new Animated.Value(1)).current;

  // Load username & favorites from AsyncStorage on mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedUsername = await AsyncStorage.getItem("username");
        if (storedUsername) {
          setUsername(storedUsername);

          // Try loading favorites from 'favorites' key
          const storedFavorites = await AsyncStorage.getItem("favorites");
          if (storedFavorites) {
            setFavorites(JSON.parse(storedFavorites));
          }
        }
      } catch (error) {
        console.error("Failed to load user data from AsyncStorage", error);
      }
    };
    loadUserData();
  }, []);

  // Toggle favorite team selection
  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  // Toggle between grid and list layout with fade animation
  const toggleLayout = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setIsGridView((prev) => !prev);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  };

  // Set custom header with back and layout toggle buttons
  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <CustomHeaderTitle
          title="Edit Favorites"
          onBack={() => router.back()}
          onToggleLayout={toggleLayout}
          isGrid={isGridView}
        />
      ),
    });
  }, [navigation, isGridView]);

  // Save favorites to server and AsyncStorage
  const saveFavorites = async () => {
    if (!username) {
      console.warn("Username not loaded, cannot save favorites");
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/api/users/${username}/favorites`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ favorites }),
      });

      if (!res.ok) {
        throw new Error("Failed to update favorites on server");
      }

      // Save favorites locally in AsyncStorage under 'favorites' and keep username
      await AsyncStorage.setItem("favorites", JSON.stringify(favorites));

      router.back();
    } catch (error) {
      console.error("Error saving favorites:", error);
    }
  };

  // Filter teams by search string
  const filteredTeams = teams.filter((team) =>
    team.fullName.toLowerCase().includes(search.toLowerCase())
  );

  // Styles
  const styles = getStyles(isDark);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search teams..."
        placeholderTextColor={isDark ? "#888" : "#999"}
        value={search}
        onChangeText={setSearch}
        autoCapitalize="none"
      />

      <Animated.View style={{ flex: 1, opacity: fadeAnim, marginTop: 12 }}>
        <FlatList
          key={isGridView ? "grid" : "list"}
          data={filteredTeams}
          keyExtractor={(item) => item.id}
          numColumns={isGridView ? numColumns : 1}
          columnWrapperStyle={
            isGridView
              ? { justifyContent: "space-between"}
              : undefined
          }
          renderItem={({ item }) => {
            const isSelected = favorites.includes(item.id);
            const isJazz = item.id === "40";
            const isRockets = item.id === "14";

            // City and Nickname split for nicer grid display
            const [city, nickname] = (() => {
              if (item.fullName === "Oklahoma City Thunder")
                return ["OKC", "Thunder"];
              const parts = item.fullName.split(" ");
              return [parts.slice(0, -1).join(" "), parts.slice(-1).join(" ")];
            })();

            return (
              <Pressable
                onPress={() => toggleFavorite(item.id)}
                style={({ pressed }) => [
                  {
                    opacity: pressed ? 0.6 : 1,
                    width: isGridView ? itemWidth : "100%",
                    marginBottom: 12,
                  },
                ]}
              >
<View
  style={[
    styles.teamCard,
    {
      backgroundColor: isSelected
        ? isDark && isJazz
          ? item.color || "#007AFF" // Jazz selected dark mode: use regular color bg
          : isDark && isRockets
          ? item.color || "#007AFF" // Rockets selected dark mode: use regular color bg
          : item.color || "#007AFF" // general selected bg
        : isDark
        ? "#222"
        : "#f5f5f5",

      flexDirection: isGridView ? "column" : "row",
      justifyContent: isGridView ? "center" : "flex-start",
      alignItems: "center",
      paddingHorizontal: isGridView ? 20 : 12,
      height: isGridView ? 130 : "auto",
      borderRadius: 8,
    },
  ]}
>
  <Image
    source={
      isRockets
        ? isDark
          ? item.logoLight
          : isSelected
          ? item.logoLight
          : item.logo
        : isJazz
        ? isDark
          ? item.logoLight
          : isSelected
          ? item.logoLight
          : item.logo
        : isDark && ["27", "38"].includes(item.id) // 76ers & Raptors
        ? item.logoLight
        : !isDark && isSelected && item.logoLight
        ? item.logoLight
        : item.logo
    }
    style={[
      styles.logo,
      isGridView ? { marginBottom: 8 } : { marginRight: 12 },
    ]}
  />

                  {isGridView ? (
                    <View style={{ alignItems: "center" }}>
<Text
  style={[
    styles.teamName,
    {
      color: isSelected
        ? isDark && item.id === "40"
          ? "#fff" // change from #000 to #fff here
          : "#fff"
        : isDark
        ? "#fff"
        : "#333",
    },
  ]}
>
  {city}
</Text>
<Text
  style={[
    styles.teamName,
    {
      fontWeight: "bold",
      marginTop: 2,
      color: isSelected
        ? isDark && item.id === "40"
          ? "#fff" // change from #000 to #fff here
          : "#fff"
        : isDark
        ? "#fff"
        : "#333",
    },
  ]}
>
  {nickname}
</Text>


                    </View>
                  ) : (
                    <Text
                      style={[
                        styles.teamName,
                        {
                         color:
  isSelected && isDark && item.id === "40"
    ? "#fff"  // <-- white now
    : isSelected
    ? isDark
      ? "#fff"
      : "#fff"
    : isDark
    ? "#fff"
    : "#333",

                        },
                      ]}
                    >
                      {item.fullName}
                    </Text>
                  )}
                </View>
              </Pressable>
            );
          }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 16 }}
        />
      </Animated.View>

      <Pressable
        onPress={saveFavorites}
        disabled={!username}
        style={[styles.saveButton, !username && { opacity: 0.5 }]}
      >
        <Text style={styles.saveText}>Save</Text>
      </Pressable>
    </View>
  );
}

const getStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: isDark ? "#1d1d1d" : "#fff",
    },
    input: {
        borderWidth: 1,
    borderColor: "#888",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    color: "#000",
    fontFamily: OSLIGHT,
    },
    teamCard: {
      flexDirection: "row",
      flex: 1,
      alignItems: "center",
      marginVertical: 4,
      marginHorizontal: 4,
      padding: 12,
      borderRadius: 8,
    },
    teamName: {
      fontFamily: OSREGULAR,
      fontSize: 12,
      textAlign: "center",
    },
    logo: {
      width: 50,
      height: 50,
      resizeMode: "contain",
    },
    saveButton: {
      backgroundColor: isDark ? "#fff" : "#1d1d1d",
      padding: 16,
      borderRadius: 8,
      alignItems: "center",
      marginTop: 16,
      marginBottom: 20,
    },
    saveText: {
      color: isDark ? "#000" : "#fff",
      fontSize: 16,
      fontFamily: OSMEDIUM,
    },
  });
