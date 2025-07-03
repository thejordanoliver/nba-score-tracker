import ConfirmModal from "@/components/ConfirmModal";
import FavoriteTeamsList from "@/components/FavoriteTeamsList";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useNavigation, useRouter } from "expo-router";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
  useColorScheme,
  useWindowDimensions,
} from "react-native";
import { CustomHeaderTitle } from "../../components/CustomHeaderTitle";
import SettingsModal from "../../components/SettingsModal";
import { teams } from "../../constants/teams";
import { getStyles } from "../../styles/ProfileScreen.styles";

// Import the SkeletonProfileScreen (the shimmer loading screen)
import { SkeletonProfileScreen } from "../../components/SkeletonProfileScreen";

const bannerDefault = { uri: "https://via.placeholder.com/800x200.png" };
const profileDefault = { uri: "https://via.placeholder.com/120.png" };
const BASE_URL = process.env.EXPO_PUBLIC_API_URL!;

export default function ProfileScreen() {
  const { width: screenWidth } = useWindowDimensions();
  const numColumns = 3;
  const horizontalPadding = 40; // Assuming padding: 20 on both sides
  const columnGap = 12;
  const totalGap = columnGap * (numColumns - 1);
  const availableWidth = screenWidth - horizontalPadding - totalGap;
  const itemWidth = availableWidth / numColumns;

  const [isLoading, setIsLoading] = useState(true); // NEW loading state

  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [username, setUsername] = useState<string | null>(null);
  const [fullName, setFullName] = useState<string | null>(null);
  const [bio, setBio] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [bannerImage, setBannerImage] = useState<string | null>(null);
  const [followersCount, setFollowersCount] = useState<number>(123);
  const [followingCount, setFollowingCount] = useState<number>(456);
  const [isGridView, setIsGridView] = useState(true);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const navigation = useNavigation();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  // Toggle favorite teams view with fade animation
  const toggleFavoriteTeamsView = () => {
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

  type SettingScreen = "accountdetails" | "appearance" | "preferences";

  const handleNavigateSettings = (screen: SettingScreen) => {
    setShowSettingsModal(false);
    router.push(`/settings/${screen}`);
  };

  const handleLogout = () => {
    setShowSettingsModal(false);
    setShowSignOutModal(true);
  };

  const handleDeleteAccount = () => {
    setShowSettingsModal(false);
    setShowDeleteModal(true);
  };

  const confirmDeleteAccount = async () => {
    try {
      const storedUsername = await AsyncStorage.getItem("username");
      if (!storedUsername) {
        alert("No user found to delete.");
        return;
      }

      await fetch(`${BASE_URL}/api/delete-account`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: storedUsername }),
      });

      await AsyncStorage.clear();
      router.replace("/login");
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete account.");
    } finally {
      setShowDeleteModal(false);
    }
  };

  const loadFollowCounts = async (username: string) => {
    try {
      console.log(
        "Fetching from:",
        `${BASE_URL}/api/users/${username}/follow-stats`
      );

      const res = await fetch(`${BASE_URL}/api/users/${username}/follow-stats`);
      if (!res.ok) throw new Error("Failed to fetch follow stats");
      const data = await res.json();
      setFollowersCount(data.followersCount ?? 0);
      setFollowingCount(data.followingCount ?? 0);
    } catch (error) {
      console.warn("Failed to load follow counts:", error);
    }
  };

  const loadCurrentUserId = async () => {
    try {
      const storedId = await AsyncStorage.getItem("userId");
      if (storedId) setCurrentUserId(Number(storedId));
    } catch (error) {
      console.warn("Failed to load current user ID:", error);
    }
  };

  // Load profile data and then set loading to false
  const loadProfileData = async () => {
    try {
      const [
        storedUsername,
        storedFullName,
        storedBio,
        storedProfileImage,
        storedBannerImage,
        storedFavorites,
      ] = await AsyncStorage.multiGet([
        "username",
        "fullName",
        "bio",
        "profileImage",
        "bannerImage",
        "favorites",
      ]);

      setUsername(storedUsername[1] ?? null);
      setFullName(storedFullName[1] ?? null);
      setBio(storedBio[1] ?? null);
      setProfileImage(storedProfileImage[1] ?? null);
      setBannerImage(
        storedBannerImage[1] && storedBannerImage[1] !== "null"
          ? storedBannerImage[1]
          : null
      );

      setFavorites(storedFavorites[1] ? JSON.parse(storedFavorites[1]) : []);

      if (storedUsername[1]) {
        await loadFollowCounts(storedUsername[1]);
      }
    } catch (error) {
      console.warn("Failed to load profile data:", error);
    } finally {
      setIsLoading(false); // <-- finished loading here
    }
  };

  useFocusEffect(
    useCallback(() => {
      setIsLoading(true); // Start loading on focus
      loadProfileData();
      loadCurrentUserId();
    }, [])
  );
  const viewedUserId = currentUserId;

  const signOut = async () => {
    try {
      await AsyncStorage.clear();
      router.replace("/login");
    } catch (error) {
      console.warn("Failed to sign out:", error);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <CustomHeaderTitle
          title={`@${username}`}
          tabName="Profile"
          onLogout={() => setShowSignOutModal(true)}
          onSettings={() => setShowSettingsModal(true)}
        />
      ),
    });
  }, [navigation, username, isDark]);

  const favoriteTeams = teams.filter((team) => favorites.includes(team.id));
  const styles = getStyles(isDark);

  if (isLoading) {
    // Show skeleton shimmer loading screen while loading
    return <SkeletonProfileScreen isDark={isDark} />;
  }

  // Otherwise show full profile UI
  return (
    <>
    
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 30 }}
        contentInsetAdjustmentBehavior="never"
      >
        <View style={styles.bannerContainer}>
          <Image
            source={bannerImage ? { uri: bannerImage } : bannerDefault}
            style={styles.banner}
          />

          <View style={styles.profilePicWrapper}>
            <Image
              source={profileImage ? { uri: profileImage } : profileDefault}
              style={styles.profilePic}
            />
          </View>
        </View>

        <View style={styles.followContainer}>
          <View style={styles.followItem}>
            <Text style={styles.followCount}>{followersCount}</Text>
            <Text style={styles.followLabel}>Followers</Text>
          </View>
          <View style={styles.followItem}>
            <Text style={styles.followCount}>{followingCount}</Text>
            <Text style={styles.followLabel}>Following</Text>
          </View>
        </View>

        <View style={styles.bioContainer}>
          <View style={styles.wrapper}>
            <View style={styles.nameContainer}>
              <Text style={styles.fullNameText}>{fullName}</Text>
              <Text style={styles.usernameText}>
                {"@" + username || "Your Username"}
              </Text>
            </View>
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

        <View style={styles.favoritesContainer}>
          <View style={styles.favoritesHeader}>
            <Text style={styles.heading}>Favorite Teams</Text>
            <Pressable
              onPress={toggleFavoriteTeamsView}
              accessibilityRole="button"
              accessibilityLabel="Toggle view"
              style={styles.toggleIcon}
            >
              <Ionicons
                name={isGridView ? "list" : "grid"}
                size={22}
                color={isDark ? "#fff" : "#000"}
              />
            </Pressable>
          </View>

          <Animated.View style={{ opacity: fadeAnim, flex: 1 }}>
            <FavoriteTeamsList
              favoriteTeams={favoriteTeams}
              isGridView={isGridView}
              styles={styles}
              itemWidth={itemWidth}
              key={isGridView ? "grid" : "list"}
              isCurrentUser={currentUserId === viewedUserId}
            />
          </Animated.View>
        </View>
      </ScrollView>

      <SettingsModal
        visible={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        onLogout={handleLogout}
        onDeleteAccount={handleDeleteAccount}
        onNavigate={handleNavigateSettings}
      />

      <ConfirmModal
        visible={showSignOutModal}
        title="Confirm Sign Out"
        message="Are you sure you want to sign out?"
        confirmText="Sign Out"
        cancelText="Cancel"
        onConfirm={() => {
          setShowSignOutModal(false);
          signOut();
        }}
        onCancel={() => setShowSignOutModal(false)}
      />

      <ConfirmModal
        visible={showDeleteModal}
        title="Delete Account"
        message="This action cannot be undone. Are you sure you want to delete your account?"
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDeleteAccount}
        onCancel={() => setShowDeleteModal(false)}
      />
    </>
  );
}
