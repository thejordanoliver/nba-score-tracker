// profile.tsx
import ConfirmModal from "@/components/ConfirmModal";
import BioSection from "@/components/profile/BioSection";
import FavoriteTeamsSection from "@/components/profile/FavoriteTeamsSection";
import FollowStats from "@/components/profile/FollowStats";
import ProfileBanner from "@/components/profile/ProfileBanner";
import ProfileHeader from "@/components/profile/ProfileHeader";
import FollowersModal from "@/components/profile/FollowersModal"; // ✅ NEW
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import {
  Animated,
  ScrollView,
  View,
  useColorScheme,
  useWindowDimensions,
} from "react-native";
import { CustomHeaderTitle } from "../../components/CustomHeaderTitle";
import SettingsModal from "../../components/SettingsModal";
import { SkeletonProfileScreen } from "../../components/SkeletonProfileScreen";
import { teams } from "../../constants/teams";
import { getStyles } from "../../styles/ProfileScreen.styles";
import { useFollowersModalStore } from "@/store/followersModalStore";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, "") ?? "";

function parseImageUrl(url: string | null | undefined): string | null {
  if (!url || url === "null") return null;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${BASE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
}

export default function ProfileScreen() {
  const { width: screenWidth } = useWindowDimensions();
  const numColumns = 3;
  const horizontalPadding = 40;
  const columnGap = 12;
  const totalGap = columnGap * (numColumns - 1);
  const availableWidth = screenWidth - horizontalPadding - totalGap;
  const itemWidth = availableWidth / numColumns;

  const { id } = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(true);
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
  const [followersCount, setFollowersCount] = useState<number>(0);
  const [followingCount, setFollowingCount] = useState<number>(0);
  const [isGridView, setIsGridView] = useState(true);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const navigation = useNavigation();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const viewedUserId = currentUserId;

  // Followers Modal Store
  const {
    isVisible,
    type,
    targetUserId,
    openModal,
    closeModal,
    shouldRestore,
    clearRestore,
  } = useFollowersModalStore();

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

  const handleNavigateSettings = (
    screen: "accountdetails" | "appearance" | "preferences"
  ) => {
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

  const loadFollowCounts = async (userId: string) => {
    try {
      const res = await fetch(`${BASE_URL}/api/users/${userId}`);
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

  const loadProfileData = async () => {
    try {
      const keys = [
        "userId", // add this to fetch user ID from async storage
        "username",
        "fullName",
        "bio",
        "profileImage",
        "bannerImage",
        "favorites",
      ];
      const result = await AsyncStorage.multiGet(keys);
      const data = Object.fromEntries(result);

      setUsername(data.username ?? null);
      setFullName(data.fullName ?? null);
      setBio(data.bio ?? null);
      setProfileImage(parseImageUrl(data.profileImage));
      setBannerImage(parseImageUrl(data.bannerImage));
      setFavorites(data.favorites ? JSON.parse(data.favorites) : []);

      const userId = data.userId;
      if (userId) {
        setCurrentUserId(Number(userId));
        await loadFollowCounts(userId); // pass the numeric ID here
      }
    } catch (error) {
      console.warn("Failed to load profile data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // On screen focus, restore modal if needed and load profile data if modal hidden
  useFocusEffect(
    useCallback(() => {
      if (shouldRestore && targetUserId) {
        openModal(type, targetUserId, currentUserId ? String(currentUserId) : undefined);
        clearRestore();
      }

      if (!isVisible) {
        setIsLoading(true);
        loadProfileData();
        loadCurrentUserId();
      }
    }, [
      shouldRestore,
      targetUserId,
      type,
      isVisible,
      currentUserId,
      openModal,
      clearRestore,
    ])
  );

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

  if (isLoading) return <SkeletonProfileScreen isDark={isDark} />;

  const signOut = async () => {
    try {
      await AsyncStorage.clear();
      router.replace("/login");
    } catch (error) {
      console.warn("Failed to sign out:", error);
    }
  };

  const onFollowersPress = () => {
    if (currentUserId) {
      openModal("followers", String(currentUserId), String(currentUserId));
    }
  };

  const onFollowingPress = () => {
    if (currentUserId) {
      openModal("following", String(currentUserId), String(currentUserId));
    }
  };

  return (
    <>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 30 }}
        contentInsetAdjustmentBehavior="never"
      >
        <ProfileBanner
          bannerImage={bannerImage}
          profileImage={profileImage}
          isDark={isDark}
        />

        <FollowStats
          followersCount={followersCount}
          followingCount={followingCount}
          isDark={isDark}
          currentUserId={currentUserId ? String(currentUserId) : ""}
          targetUserId={currentUserId ? String(currentUserId) : ""}
          onFollowersPress={onFollowersPress}
          onFollowingPress={onFollowingPress}
        />

        <ProfileHeader
          fullName={fullName}
          username={username}
          isDark={isDark}
          onEditPress={() => router.push("/edit-profile")}
        />

        <BioSection bio={bio} isDark={isDark} />

        <View style={styles.favoritesContainer}>
          <FavoriteTeamsSection
            favoriteTeams={favoriteTeams}
            isGridView={isGridView}
            fadeAnim={fadeAnim}
            toggleFavoriteTeamsView={toggleFavoriteTeamsView}
            styles={styles}
            itemWidth={itemWidth}
            isCurrentUser={currentUserId === viewedUserId}
            username={username ?? undefined}
          />
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

      {/* FollowersModal: make sure to pass needed props if any */}
{targetUserId && currentUserId && (
  <FollowersModal
    visible={isVisible}
    onClose={closeModal}
    type={type}
    targetUserId={String(targetUserId)}
    currentUserId={String(currentUserId)}
  />
)}

    </>
  );
}
