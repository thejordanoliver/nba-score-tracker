import { useFollowers } from "@/hooks/useFollowers";
import { useFollowersModalStore } from "@/store/followersModalStore";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from "react-native";
import FollowingButton from "./FollowingButton";

const OSREGULAR = "Oswald_400Regular";
const OSMEDIUM = "Oswald_500Medium";
const OSLIGHT = "Oswald_300Light";
const OSBOLD = "Oswald_700Bold";

type Props = {
  visible: boolean;
  onClose: () => void;
  type: "followers" | "following";
  currentUserId: string;
  targetUserId: string; // user whose followers/following we want to show
};

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function FollowersModal({
  visible,
  onClose,
  type,
  currentUserId,
  targetUserId,
}: Props) {
  const {
    markForRestore,
  } = useFollowersModalStore();

  const router = useRouter();

  const handleUserPress = (userId: string) => {
    markForRestore(); // mark modal for restore on back
    onClose(); // close modal immediately before navigating
    router.push(`/user/${userId}`);
  };
  const isDark = useColorScheme() === "dark";
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const [search, setSearch] = useState("");
  const [loadingIds, setLoadingIds] = useState<string[]>([]);

  // Use custom hook to fetch users and toggle follow
  const { users, loading, error, toggleFollow } = useFollowers(
    currentUserId,
    targetUserId,
    type
  );

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: SCREEN_HEIGHT,
        duration: 300,
        useNativeDriver: true,
      }).start();
      setSearch("");
    }
  }, [visible]);

  const handleToggleFollow = async (targetId: string) => {
    setLoadingIds((prev) => [...prev, targetId]);
    await toggleFollow(targetId);
    setLoadingIds((prev) => prev.filter((id) => id !== targetId));
  };

  const filteredUsers = useMemo(() => {
    return users.filter((u) =>
      u.username.toLowerCase().includes(search.toLowerCase())
    );
  }, [users, search]);

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="none">
      <BlurView
        intensity={100}
        tint={isDark ? "dark" : "light"}
        style={styles.blurContainer}
      >
        <Animated.View
          style={[
            styles.modalContainer,
            { transform: [{ translateY: slideAnim }] },
          ]}
        >
          <Text style={[styles.title, { color: isDark ? "#fff" : "#1d1d1d" }]}>
            {type === "followers" ? "Followers" : "Following"}
          </Text>

          <TextInput
            placeholder="Search..."
            placeholderTextColor={isDark ? "#aaa" : "#1d1d1d"}
            value={search}
            onChangeText={setSearch}
            style={[
              styles.searchInput,
              {
                borderColor: isDark ? "#aaa" : "#1d1d1d",
                color: isDark ? "#fff" : "#1d1d1d",
              },
            ]}
          />

          {error && (
            <Text
              style={{
                color: "red",
                textAlign: "center",
                marginVertical: 8,
                fontFamily: OSREGULAR,
              }}
            >
              {error}
            </Text>
          )}

          <FlatList
            data={filteredUsers}
            keyExtractor={(item) => item.id}
            style={{ marginTop: 10 }}
            ListEmptyComponent={() =>
              !loading ? (
                <Text
                  style={{
                    textAlign: "center",
                    marginTop: 20,
                    fontFamily: OSREGULAR,
                    color: isDark ? "#fff" : "#1d1d1d",
                  }}
                >
                  No users found.
                </Text>
              ) : null
            }
            renderItem={({ item }) => {
              const imageUri = item.profile_image.startsWith("http")
                ? item.profile_image
                : `${process.env.EXPO_PUBLIC_API_URL}${item.profile_image}`;

              return (
                <Pressable onPress={() => handleUserPress(item.id)}>
                  <View
                    style={[
                      styles.userItem,
                      {
                        borderBottomColor: isDark
                          ? "rgba(255,255,255,0.2)"
                          : "rgba(120, 120, 120, 0.5)",
                      },
                    ]}
                  >
                    <Image source={{ uri: imageUri }} style={styles.avatar} />
                    <Text
                      style={[
                        styles.username,
                        { color: isDark ? "#fff" : "#1d1d1d" },
                      ]}
                    >
                      {item.username}
                    </Text>
                    <FollowingButton
                      isFollowing={item.isFollowing}
                      loading={loadingIds.includes(item.id)}
                      onToggle={() => handleToggleFollow(item.id)}
                    />
                  </View>
                </Pressable>
              );
            }}
          />

          <Pressable style={styles.closeButton} onPress={onClose}>
            <Ionicons
              name="close"
              size={28}
              color={isDark ? "#fff" : "#1d1d1d"}
            />
          </Pressable>
        </Animated.View>
      </BlurView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  blurContainer: {
    flex: 1,
    paddingTop: 50,
    justifyContent: "flex-start",
  },
  modalContainer: {
    maxHeight: "80%",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 22,
    fontFamily: OSBOLD,
    textAlign: "center",
    marginBottom: 12,
  },
  searchInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    color: "#1d1d1d",
    fontFamily: OSLIGHT,
  },
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 100,
    marginRight: 12,
  },
  username: {
    flex: 1,
    fontSize: 16,
    fontFamily: OSREGULAR,
  },
  closeButton: {
    position: "absolute",
    top: 15,
    right: 20,
  },
});
