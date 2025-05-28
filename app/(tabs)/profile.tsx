import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useNavigation, useRouter } from "expo-router";
import React, { useCallback, useLayoutEffect, useState } from "react";
import {
  Image,
  ImageSourcePropType,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";
import { CustomHeaderTitle } from "../../components/CustomHeaderTitle";
import { teams } from "../../constants/teams";
const bannerDefault = { uri: "https://via.placeholder.com/800x200.png" };
const profileDefault = { uri: "https://via.placeholder.com/120.png" };
const BANNER_HEIGHT = 180;
const PROFILE_PIC_SIZE = 120;

export default function ProfileScreen() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [username, setUsername] = useState<string | null>(null);
  const [fullName, setFullName] = useState<string | null>(null);
  const [bio, setBio] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [bannerImage, setBannerImage] = useState<string | null>(null);
  const navigation = useNavigation();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  useFocusEffect(
    useCallback(() => {
      const loadProfileData = async () => {
        try {
          const stored = await AsyncStorage.getItem("favorites");
          if (stored) setFavorites(JSON.parse(stored));

          const name = await AsyncStorage.getItem("username");
          const fullName = await AsyncStorage.getItem("fullName");
          const bioText = await AsyncStorage.getItem("bio");
          const pfp = await AsyncStorage.getItem("profileImage");
          const banner = await AsyncStorage.getItem("bannerImage");

          setUsername(name);
          setFullName(fullName);
          setBio(bioText);
          setProfileImage(pfp);
          setBannerImage(banner);
        } catch (error) {
          console.warn("Failed to load profile data:", error);
        }
      };

      loadProfileData();
    }, [])
  );

  useLayoutEffect(() => {
    if (username) {
      navigation.setOptions({
        headerTitle: () => <CustomHeaderTitle title={`@${username}`} />,
      });
    }
  }, [navigation, username, isDark]);

  const favoriteTeams = teams.filter((team) => favorites.includes(team.id));
  const styles = getStyles(isDark);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 30 }}
      contentInsetAdjustmentBehavior="never"
    >
      <View style={styles.title}></View>
      {/* Banner */}
      <View style={styles.bannerContainer}>
        <Image
          source={
            bannerImage
              ? ({ uri: bannerImage } as ImageSourcePropType)
              : bannerDefault
          }
          style={styles.banner}
        />

        {/* Profile Picture */}
        <View style={styles.profilePicWrapper}>
          <Image
            source={
              profileImage
                ? ({ uri: profileImage } as ImageSourcePropType)
                : profileDefault
            }
            style={styles.profilePic}
          />
        </View>
      </View>

      {/* Username */}
      <View style={styles.bioContainer}>
        <View style={styles.wrapper}>
          <View style={styles.nameContainer}>
            <Text style={styles.fullNameText}>{fullName}</Text>
            <Text style={styles.usernameText}>
              {"@" + username || "Your Username"}
            </Text>
          </View>

          {/* Edit Profile */}
          <Pressable
            style={styles.editProfileBtn}
            onPress={() => router.push("/edit-profile")}
          >
            <Ionicons
              style={styles.editIcon}
              name="create"
              size={18}
              color={isDark ? "#000" : "#fff"}
            />
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </Pressable>
        </View>
        <Text style={styles.bioText}>{bio || ""}</Text>
      </View>

      {/* Favorite Teams */}
      <View style={styles.favoritesContainer}>
        <Text style={styles.heading}>Favorite Teams</Text>
        {favoriteTeams.length === 0 ? (
          <Text style={styles.noFavoritesText}>
            No favorite teams selected.
          </Text>
        ) : (
          <View style={styles.teamGrid}>
            {favoriteTeams.map((team) => (
              <View key={team.id} style={{ width: "100%" }}>
                <View
                  style={[
                    styles.teamItem,
                    { backgroundColor: team.color, borderRadius: 12 },
                  ]}
                >
                  <Image source={{ uri: team.logo }} style={styles.teamLogo} />
                  <Text style={styles.teamName}>{team.fullName}</Text>
                </View>
              </View>
            ))}
            <View style={{ width: "100%" }}>
              <Pressable
                onPress={() => router.push("/edit-favorites")}
                accessibilityRole="button"
                accessibilityLabel="Edit favorite teams"
              >
                <View style={[styles.teamItem, styles.editButton]}>
                  <Text style={styles.editText}>Edit Teams</Text>
                  <Ionicons
                    style={styles.editIcon}
                    name="create"
                    size={20}
                    color={isDark ? "#000" : "#fff"}
                  />
                </View>
              </Pressable>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const getStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      paddingTop: 0,
      flex: 1,
      backgroundColor: isDark ? "#1d1d1d" : "#fff",
    },

    title: {
      padding: 0,
    },

    bannerContainer: {
      position: "relative",
      top: 0,
      width: "100%",
      height: BANNER_HEIGHT,
      backgroundColor: isDark ? "#333" : "#ccc",
    },
    banner: {
      width: "100%",
      height: BANNER_HEIGHT,
    },
    profilePicWrapper: {
      position: "absolute",
      bottom: -PROFILE_PIC_SIZE / 2,
      left: "50%",
      marginLeft: -PROFILE_PIC_SIZE / 2,
      borderRadius: PROFILE_PIC_SIZE / 2,
      borderWidth: 4,
      borderColor: isDark ? "#222" : "#fff",
      overflow: "hidden",
      width: PROFILE_PIC_SIZE,
      height: PROFILE_PIC_SIZE,
      backgroundColor: isDark ? "#444" : "#eee",
    },
    profilePic: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
    },

    bioContainer: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "wrap",
      marginTop: PROFILE_PIC_SIZE / 2 + 48,
      paddingHorizontal: 24,
    },

    nameContainer: {
      display: "flex",
      flexDirection: "column",
    },

    fullNameText: {
      fontSize: 20,
      fontFamily: "Oswald_500Medium",
      color: isDark ? "#fff" : "#1d1d1d",
      textAlign: "left",
    },

    wrapper: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 40,
      width: "100%",
    },

    usernameText: {
      fontSize: 16,
      fontFamily: "Oswald_400Regular",
      color: isDark ? "gray" : "gray",
      textAlign: "left",
    },
    bioText: {
      fontSize: 16,
      color: isDark ? "#ddd" : "#333",
      textAlign: "left",
      lineHeight: 22,
      fontFamily: "Oswald_300Light",
    },
    editProfileBtn: {
      backgroundColor: isDark ? "#fff" : "#000",
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 10,
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      alignSelf: "flex-start",
    },
    editProfileText: {
      color: isDark ? "#000" : "#fff",
      fontSize: 16,
      fontFamily: "Oswald_400Regular",
    },

    favoritesContainer: {
      marginTop: 32,
      paddingHorizontal: 24,
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
      fontStyle: "italic",
      color: isDark ? "#888" : "#666",
      textAlign: "center",
    },

    teamGrid: {
      flexDirection: "column",
      alignItems: "stretch",
      alignContent: "center",
      width: "100%",
    },
    teamItem: {
      width: "100%",
      alignItems: "center",
      flexDirection: "row",
      marginVertical: 8,
      paddingHorizontal: 20,
      paddingVertical: 10,
      fontFamily: "Oswald_500Medium",
    },
    teamLogo: {
      width: 60,
      height: 60,
      borderRadius: 30,
    },
    teamName: {
      marginTop: 6,
      marginLeft: 10,
      fontSize: 16,
      textAlign: "center",
      color: "white",
      fontFamily: "Oswald_400Regular",
    },

    editButton: {
      width: "100%",
      alignSelf: "stretch",
      backgroundColor: isDark ? "#fff" : "#000",
      alignItems: "center",
      flexDirection: "row",
      marginVertical: 8,
      paddingHorizontal: 20,
      paddingVertical: 20,
      borderRadius: 12,
      justifyContent: "center",
    },
    editText: {
      color: isDark ? "#000" : "#fff",
      fontSize: 20,
      textAlign: "center",
      fontFamily: "Oswald_400Regular",
    },
    editIcon: {
      marginLeft: 4,
      color: isDark ? "#000" : "#fff",
    },
  });
