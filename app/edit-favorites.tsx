import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  useColorScheme,
} from "react-native";
import { teams } from "../constants/teams";

export default function EditFavoritesScreen() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  useEffect(() => {
    AsyncStorage.getItem("favorites").then((stored) => {
      if (stored) setFavorites(JSON.parse(stored));
    });
  }, []);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const saveFavorites = async () => {
    await AsyncStorage.setItem("favorites", JSON.stringify(favorites));
    router.back(); // or router.push('/')
  };

  const filteredTeams = teams.filter((team) =>
    team.name.toLowerCase().includes(search.toLowerCase())
  );

  const styles = getStyles(isDark);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Favorite Teams</Text>

      <TextInput
        style={styles.input}
        placeholder="Search teams..."
        placeholderTextColor={isDark ? "#888" : "#999"}
        value={search}
        onChangeText={setSearch}
      />

      <FlatList
        data={filteredTeams}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => {
          const isSelected = favorites.includes(item.id);
          return (
            <Pressable
              onPress={() => toggleFavorite(item.id)}
              style={[
                styles.teamCard,
                isSelected && { backgroundColor: item.color || "#000" },
              ]}
            >
              <Image source={{ uri: item.logo }} style={styles.logo} />
              <Text
                style={[
                  styles.teamName,
                  isSelected && { color: "white" },
                  !isSelected && { color: isDark ? "#ddd" : "#333" },
                ]}
              >
                {item.fullName}
              </Text>
            </Pressable>
          );
        }}
      />

      <Pressable onPress={saveFavorites} style={styles.saveButton}>
        <Text style={styles.saveText}>Save</Text>
      </Pressable>
    </View>
  );
}

const getStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 12,
      backgroundColor: isDark ? "#121212" : "white",
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 10,
      color: isDark ? "#fff" : "#000",
    },
    input: {
      borderWidth: 1,
      borderColor: isDark ? "#555" : "#ccc",
      borderRadius: 10,
      paddingHorizontal: 12,
      paddingVertical: 8,
      marginBottom: 12,
      color: isDark ? "#eee" : "#000",
    },
    row: {
      flexDirection: "column",
      justifyContent: "space-between",
    },
    teamCard: {
      flexDirection: "row",
      flex: 1,
      alignItems: "center",
      margin: 8,
      padding: 12,
      backgroundColor: isDark ? "#222" : "#f5f5f5",
      borderRadius: 12,
    },
    teamName: {
      marginTop: 8,
      marginLeft: 16,
      fontSize: 16,
      fontFamily: "Oswald_400Regular",
    },
    logo: { width: 50, height: 50, resizeMode: "contain" },
    saveButton: {
      backgroundColor: "black",
      padding: 12,
      borderRadius: 8,
      alignItems: "center",
      marginTop: 16,
    },
    saveText: {
      color: "white",
      fontSize: 16,
      fontWeight: "bold",
    },
  });
