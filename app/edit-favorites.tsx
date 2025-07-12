import { CustomHeaderTitle } from "@/components/CustomHeaderTitle";
import FavoriteTeamsSelector from "@/components/FavoriteTeamsSelector";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  Animated,
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
import { useMemo } from "react";

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
  const [search, setSearch] = useState("");
  const router = useRouter();
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [isLoading, setIsLoading] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [username, setUsername] = useState<string | null>(null);
  const [isGridView, setIsGridView] = useState(true);

  const fadeAnim = useRef(new Animated.Value(1)).current;
const filteredTeams = useMemo(() => {
  return teams.filter((team) =>
    team.fullName.toLowerCase().includes(search.toLowerCase())
  );
}, [search]);
  // Load username & favorites from AsyncStorage on mount
  useEffect(() => {
    const loadUserData = async () => {
      setIsLoading(true);
      try {
        const storedUsername = await AsyncStorage.getItem("username");
        if (storedUsername) {
          setUsername(storedUsername);

          const storedFavorites = await AsyncStorage.getItem("favorites");
          if (storedFavorites) {
            try {
              const parsedFavorites = JSON.parse(storedFavorites);
              setFavorites(parsedFavorites);
            } catch (parseError) {
              console.error("Failed to parse favorites JSON", parseError);
              setFavorites([]); // fallback to empty array if parsing fails
            }
          } else {
            setFavorites([]); // no favorites found, initialize empty
          }
        } else {
          // username not found, reset username and favorites
          setUsername(null);
          setFavorites([]);
        }
      } catch (error) {
        console.error("Failed to load user data from AsyncStorage", error);
      } finally {
        setIsLoading(false);
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
        <FavoriteTeamsSelector
          teams={teams}
          favorites={favorites}
          toggleFavorite={toggleFavorite}
          isGridView={isGridView}
          fadeAnim={fadeAnim}
          search={search}
          itemWidth={itemWidth}
          loading={isLoading} // your loading state
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
