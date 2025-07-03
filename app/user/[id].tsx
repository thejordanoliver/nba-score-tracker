import FavoriteTeamsList from "@/components/FavoriteTeamsList";
import FollowButton from "@/components/FollowButton";
import { Team, teamsById } from "@/constants/teams";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native"; // <-- useNavigation for setOptions
import { useLocalSearchParams, useRouter } from "expo-router";
import { goBack } from "expo-router/build/global-state/routing";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
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
import { getStyles } from "../../styles/ProfileScreen.styles";

const bannerDefault = { uri: "https://via.placeholder.com/800x200.png" };
const profileDefault = { uri: "https://via.placeholder.com/120.png" };

export default function UserProfileScreen() {
  const { width: screenWidth } = useWindowDimensions();

  const params = useLocalSearchParams();
  const userId = params.id as string | undefined;
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const viewedUserId = userId ? Number(userId) : null;
  const [isFollowing, setIsFollowing] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [isGridView, setIsGridView] = useState(true);
  const numColumns = 3;
  const horizontalPadding = 40; // Assuming padding: 20 on both sides
  const columnGap = 12;
  const totalGap = columnGap * (numColumns - 1);
  const availableWidth = screenWidth - horizontalPadding - totalGap;
  const itemWidth = availableWidth / numColumns;

  const [user, setUser] = useState<{
    username: string;
    fullName: string;
    bio: string;
    profileImage: string | null;
    bannerImage: string | null;
    followersCount: number;
    followingCount: number;
    favorites: number[];
  } | null>(null);

  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const router = useRouter();
  const navigation = useNavigation();
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

  //   useEffect(() => {

  //     const debugAsyncStorage = async () => {
  //       const allKeys = await AsyncStorage.getAllKeys();
  //       console.log("All AsyncStorage keys:", allKeys);
  //     };
  //     debugAsyncStorage();
  //   }, []);
  // Load current user ID from AsyncStorage once on mount

  useEffect(() => {
    const loadCurrentUserId = async () => {
      try {
        const storedId = await AsyncStorage.getItem("userId");
        console.log("Loaded currentUserId from AsyncStorage:", storedId);
        if (storedId) setCurrentUserId(Number(storedId));
      } catch (err) {
        console.error("Error loading userId from AsyncStorage:", err);
      }
    };
    loadCurrentUserId();
  }, []);

  // Fetch user profile data with full URLs for images
  const fetchUserData = useCallback(async () => {
    if (!userId) return;
    try {
      setProfileLoading(true);
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/users/${userId}`
      );
      if (!res.ok) throw new Error("Failed to fetch user");
      const data = await res.json();
      console.log("User data fetched:", data);
      // Make sure base URL has no trailing slash
      const baseUrl =
        process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, "") ||
        "https://your-api-domain.com";

      setUser({
        username: data.username,
        fullName: data.full_name,
        bio: data.bio || "",
        profileImage: data.profile_image ? baseUrl + data.profile_image : null,
        bannerImage: data.banner_image ? baseUrl + data.banner_image : null,
        followersCount:
          typeof data.followers_count === "number" ? data.followers_count : 0,
        followingCount:
          typeof data.following_count === "number" ? data.following_count : 0,
        favorites: Array.isArray(data.favorites) ? data.favorites : [],
      });
    } catch (err) {
      console.error("Failed to load user profile:", err);
      setUser(null);
    } finally {
      setProfileLoading(false);
    }
  }, [userId]);

  // Fetch user data on mount and whenever userId changes
  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  // Update navigation header
  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <CustomHeaderTitle
          title={user ? `@${user.username}` : "User"}
          onBack={goBack}
        />
      ),
    });
  }, [navigation, user]);

  useEffect(() => {
    const fetchFollowStatus = async () => {
      if (!userId || currentUserId === null) return;

      try {
        const res = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}/api/follows/check?followerId=${currentUserId}&followeeId=${userId}`
        );
        if (!res.ok) throw new Error("Failed to fetch follow status");
        const data = await res.json();
        setIsFollowing(data.isFollowing);
      } catch (err) {
        console.error("Error checking follow status:", err);
        setIsFollowing(false);
      }
    };

    fetchFollowStatus();
  }, [userId, currentUserId]); // <-- Depend on both

  // Callback to refresh profile data after follow/unfollow
  const handleToggleFollow = async () => {
    if (followLoading) return;
    setFollowLoading(true);
    const endpoint = isFollowing ? "unfollow" : "follow";

    try {
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/${endpoint}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            followerId: currentUserId,
            followeeId: userId,
          }),
        }
      );

      if (!res.ok) throw new Error("Failed to toggle follow");
      setIsFollowing((prev) => !prev);

      // Refetch the user profile to get updated counts
      await fetchUserData();
    } catch (err) {
      console.error("Toggle follow error:", err);
    } finally {
      setFollowLoading(false);
    }
  };

  if (profileLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={isDark ? "white" : "black"} />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: isDark ? "#eee" : "#111" }}>User not found.</Text>
      </View>
    );
  }
  const favoriteTeams = user.favorites
    .map((id) => teamsById[id.toString()])
    .filter(Boolean) as Team[]; // type assertion

  const styles = getStyles(isDark);

  console.log("Rendering profile for user:", user.username);
  console.log("currentUserId:", currentUserId, "viewedUserId:", viewedUserId);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 30 }}
      contentInsetAdjustmentBehavior="never"
    >
      <View style={styles.bannerContainer}>
        <Image
          source={user.bannerImage ? { uri: user.bannerImage } : bannerDefault}
          style={styles.banner}
          resizeMode="cover"
        />

        <View style={styles.profilePicWrapper}>
          <Image
            source={
              user.profileImage ? { uri: user.profileImage } : profileDefault
            }
            style={styles.profilePic}
            resizeMode="cover"
          />
        </View>
      </View>

      <View style={styles.followContainer}>
        <View style={styles.followItem}>
          <Text style={styles.followCount}>{user.followersCount}</Text>
          <Text style={styles.followLabel}>Followers</Text>
        </View>
        <View style={styles.followItem}>
          <Text style={styles.followCount}>{user.followingCount}</Text>
          <Text style={styles.followLabel}>Following</Text>
        </View>
      </View>

      <View style={styles.bioContainer}>
        <View style={styles.wrapper}>
          <View style={styles.nameContainer}>
            <Text style={styles.fullNameText}>{user.fullName}</Text>
            <Text style={styles.usernameText}>@{user.username}</Text>
          </View>

          {/* Show Follow Button if viewing other user */}
          {currentUserId !== null &&
            viewedUserId !== null &&
            currentUserId !== viewedUserId && (
              <FollowButton
                isFollowing={isFollowing}
                loading={followLoading}
                onToggle={handleToggleFollow}
              />
            )}
        </View>

        <Text style={styles.bioText}>{user.bio}</Text>
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
  );
}
