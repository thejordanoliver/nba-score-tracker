// login.tsx
import { CustomHeaderTitle } from "@/components/CustomHeaderTitle";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { useNavigation, useRouter } from "expo-router";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Easing,
  FlatList,
  GestureResponderEvent,
  Image,
  KeyboardAvoidingView,
  PanResponder,
  PanResponderGestureState,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useColorScheme,
} from "react-native";
import TabBar from "../components/TabBar";
import { teams } from "../constants/teams";
import { User } from "../types/types"; // adjust path if needed
import { goBack } from "expo-router/build/global-state/routing";

const OSEXTRALIGHT = "Oswald_200ExtraLight";
const OSLIGHT = "Oswald_300Light";
const OSREGULAR = "Oswald_400Regular";
const OSMEDIUM = "Oswald_500Medium";
const OSSEMIBOLD = "Oswald_600SemiBold";
const OSBOLD = "Oswald_700Bold";

export default function LoginScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  const tabs = ["sign in", "sign up"] as const;
  const [selectedTab, setSelectedTab] =
    useState<(typeof tabs)[number]>("sign in");
  const isDark = useColorScheme() === "dark";

  // Sign In State
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Base API URL (adjust for your environment)
  const BASE_URL = process.env.EXPO_PUBLIC_API_URL!;

  // Helper: safe AsyncStorage set (remove key if value is null/undefined)
  const safeSetItem = async (key: string, value: string | null | undefined) => {
    if (value === null || value === undefined) {
      await AsyncStorage.removeItem(key);
    } else {
      await AsyncStorage.setItem(key, value);
    }
  };

  // Sign In handler
  const handleLogin = async () => {
    const trimmedUsername = username.trim().toLowerCase();
    if (!trimmedUsername || password.length < 8) {
      Alert.alert(
        "Invalid credentials",
        "Please enter a valid username and password (min 8 chars)."
      );
      return;
    }
    try {
      const res = await axios.post<User>(`${BASE_URL}/api/login`, {
        username: trimmedUsername,
        password,
      });
      const user = res.data;

      // Save to AsyncStorage safely
      await safeSetItem("userId", user.id?.toString() || null);
      await safeSetItem("username", user.username);
      await safeSetItem("fullName", user.full_name);
      await safeSetItem("email", user.email);
      await safeSetItem(
        "profileImage",
        user.profile_image ? `${BASE_URL}${user.profile_image}` : null
      );
      await safeSetItem(
        "bannerImage",
        user.banner_image ? `${BASE_URL}${user.banner_image}` : null
      ); // ✅ THIS LINE FIXES IT
      await safeSetItem("favorites", JSON.stringify(user.favorites || []));
      await safeSetItem("bio", user.bio ?? "");

      router.replace("/(tabs)/profile");
    } catch (err: any) {
      Alert.alert("Login failed", err.response?.data?.error || err.message);
    }
  };

  const [signupStep, setSignupStep] = useState(0);
  // Setup header title
useLayoutEffect(() => {
  navigation.setOptions({
    header: () => (
      <CustomHeaderTitle
        title="The Logo"
        tabName="Login"
        onBack={() => {
          if (selectedTab === "sign up" && signupStep > 0) {
            setSignupStep((s) => Math.max(0, s - 1));
          } else {
            goBack();
          }
        }}
      />
    ),
  });
}, [navigation, isDark, selectedTab, signupStep]);

  // Sign Up State & Steps
  const [signupData, setSignupData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    favorites: [] as string[],
    profileImage: null as string | null,
    bannerImage: null as string | null, // <-- add this line
  });

  const [search, setSearch] = useState("");

  // Toggle team favorites for sign up
  const toggleFavorite = (id: string) => {
    setSignupData((prev) => ({
      ...prev,
      favorites: prev.favorites.includes(id)
        ? prev.favorites.filter((f) => f !== id)
        : [...prev.favorites, id],
    }));
  };

  // Pick profile image from device
  const pickImage = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      allowsEditing: true,
      aspect: [1, 1],
    });
    if (!res.canceled) {
      setSignupData((prev) => ({ ...prev, profileImage: res.assets[0].uri }));
    }
  };

  // Submit sign up data
  const handleSignupSubmit = async () => {
    const {
      fullName,
      username,
      email,
      password,
      confirmPassword,
      favorites,
      profileImage,
      bannerImage, // <-- add this
    } = signupData;

    if (!fullName || !username || !email || password !== confirmPassword) {
      Alert.alert(
        "Please check your details",
        "Make sure all fields are filled and passwords match."
      );
      return;
    }

    try {
      const formData = new FormData();
      formData.append("fullName", fullName);
      formData.append("username", username.trim().toLowerCase());
      formData.append("email", email);
      formData.append("password", password);
      formData.append("favorites", JSON.stringify(favorites));

      if (profileImage) {
        const filename = profileImage.split("/").pop()!;
        const match = /\.(\w+)$/.exec(filename);
        const ext = match?.[1];
        const mimeType = ext === "png" ? "image/png" : "image/jpeg";

        formData.append("profileImage", {
          uri: profileImage,
          name: filename,
          type: mimeType,
        } as any);
      }

      if (bannerImage) {
        const filename = bannerImage.split("/").pop()!;
        const match = /\.(\w+)$/.exec(filename);
        const ext = match?.[1];
        const mimeType = ext === "png" ? "image/png" : "image/jpeg";

        formData.append("bannerImage", {
          uri: bannerImage,
          name: filename,
          type: mimeType,
        } as any);
      }

      const res = await axios.post<User>(`${BASE_URL}/api/signup`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const user = res.data;

      // Save all user info to AsyncStorage
      await safeSetItem("userId", user.id?.toString() || null);
      await safeSetItem("username", user.username);
      await safeSetItem("fullName", user.full_name); // camelCase key
      await safeSetItem("email", user.email); // used in settings
      await safeSetItem(
        "profileImage",
        user.profile_image ? `${BASE_URL}${user.profile_image}` : null
      );
      await safeSetItem(
        "bannerImage",
        user.banner_image ? `${BASE_URL}${user.banner_image}` : null
      );
      await safeSetItem("bio", user.bio ?? null);
      await safeSetItem("favorites", JSON.stringify(user.favorites || []));

      router.replace("/(tabs)/profile");
    } catch (err: any) {
      console.error("Signup error:", err);
      Alert.alert("Signup failed", err.response?.data?.error || err.message);
    }
  };

  // Filter teams by search string
  const filteredTeams = teams.filter((team) =>
    team.fullName.toLowerCase().includes(search.toLowerCase())
  );

  const styles = getStyles(isDark);

  // Progress bar animation
  const progress = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(progress, {
      toValue: signupStep / 3,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [signupStep]);

  const progressInterpolate = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  // Crossfade animation for step transitions
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const animateTransition = () => {
    fadeAnim.setValue(0);
    scaleAnim.setValue(0.9);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start();
  };

  useEffect(() => {
    animateTransition();
  }, [signupStep]);

  // PanResponder for swipe-back gesture on signup steps
  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (
          _evt: GestureResponderEvent,
          gestureState: PanResponderGestureState
        ) => gestureState.dx > 20 && Math.abs(gestureState.dy) < 20,
        onPanResponderRelease: (
          _evt: GestureResponderEvent,
          gestureState: PanResponderGestureState
        ) => {
          if (gestureState.dx > 50 && signupStep > 0) {
            setSignupStep((s) => Math.max(0, s - 1));
          }
        },
      }),
    [signupStep]
  );

  // Render Sign In form
  const renderSignIn = () => (
    <View style={styles.signInContainer}>
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
        placeholderTextColor={isDark ? "#888" : "#aaa"}
        autoCapitalize="none"
      />
      <View style={styles.passwordRow}>
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          style={styles.passwordInput}
          placeholderTextColor={isDark ? "#888" : "#aaa"}
        />
        <Pressable
          onPress={() => setShowPassword((prev) => !prev)}
          style={styles.iconButton}
          accessibilityLabel={showPassword ? "Hide password" : "Show password"}
        >
          <Ionicons
            name={showPassword ? "eye-off" : "eye"}
            size={20}
            color={isDark ? "#fff" : "#000"}
          />
        </Pressable>
      </View>
      <Pressable onPress={handleLogin} style={styles.button}>
        <Text style={styles.buttonText}>Sign In</Text>
      </Pressable>
    </View>
  );

  // Render each signup step
  const renderSignupStep = () => {
    switch (signupStep) {
      case 0:
        return (
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Name"
                value={signupData.fullName}
                onChangeText={(val) =>
                  setSignupData({ ...signupData, fullName: val })
                }
                style={styles.input}
                placeholderTextColor={isDark ? "#888" : "#aaa"}
              />
              <TextInput
                placeholder="Username"
                value={signupData.username}
                onChangeText={(val) =>
                  setSignupData({ ...signupData, username: val.toLowerCase() })
                }
                style={styles.input}
                placeholderTextColor={isDark ? "#888" : "#aaa"}
                autoCapitalize="none"
              />
              <TextInput
                placeholder="Email"
                keyboardType="email-address"
                value={signupData.email}
                onChangeText={(val) =>
                  setSignupData({ ...signupData, email: val })
                }
                style={styles.input}
                placeholderTextColor={isDark ? "#888" : "#aaa"}
                autoCapitalize="none"
              />
              <TextInput
                placeholder="Password"
                secureTextEntry
                value={signupData.password}
                onChangeText={(val) =>
                  setSignupData({ ...signupData, password: val })
                }
                style={styles.input}
                placeholderTextColor={isDark ? "#888" : "#aaa"}
              />
              <TextInput
                placeholder="Confirm Password"
                secureTextEntry
                value={signupData.confirmPassword}
                onChangeText={(val) =>
                  setSignupData({ ...signupData, confirmPassword: val })
                }
                style={styles.input}
                placeholderTextColor={isDark ? "#888" : "#aaa"}
              />
            </View>
          </ScrollView>
        );
      case 1:
        return (
          <View style={{ flex: 1 }}>
            <View style={styles.titleRow}>
              <View style={{ flex: 1 }} />
              <Text style={styles.titleCentered}>Select Favorite Teams</Text>
              <Pressable onPress={() => setSignupStep((s) => s + 1)}>
                <Text style={styles.skipText}>Skip</Text>
              </Pressable>
            </View>
            <TextInput
              placeholder="Search teams..."
              value={search}
              onChangeText={setSearch}
              style={styles.searchBar}
              placeholderTextColor={isDark ? "#888" : "#aaa"}
            />
            <FlatList
              data={filteredTeams}
              keyExtractor={(item) => item.name}
              numColumns={2}
              columnWrapperStyle={styles.row}
              renderItem={({ item }) => {
                const isSelected = signupData.favorites.includes(item.id);
                return (
                  <Pressable
                    onPress={() => toggleFavorite(item.id)}
                    style={[
                      styles.teamCard,
                      isSelected && {
                        backgroundColor: isDark
                          ? item.color
                          : item.constantLight || item.color || "#007AFF",
                      },
                    ]}
                  >
                    <Image source={item.logo} style={styles.logo} />
                    <Text
                      style={[
                        styles.teamName,
                        isSelected
                          ? { color: "#fff" }
                          : { color: isDark ? "#ddd" : "#333" },
                      ]}
                    >
                      {item.fullName}
                    </Text>
                  </Pressable>
                );
              }}
              contentContainerStyle={{ paddingBottom: 12 }}
              showsVerticalScrollIndicator={false}
            />
          </View>
        );
      case 2:
        return (
          <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
            <Text style={styles.title}>Upload Images</Text>

            <Text style={[styles.reviewText, { textAlign: "center" }]}>
              Profile Picture
            </Text>
            <Pressable onPress={pickImage} style={styles.imageUploadBox}>
              {signupData.profileImage ? (
                <Image
                  source={{ uri: signupData.profileImage }}
                  style={styles.imagePreview}
                />
              ) : (
                <Text style={styles.imagePlaceholder}>
                  Tap to select profile image
                </Text>
              )}
            </Pressable>

            <Text
              style={[
                styles.reviewText,
                { textAlign: "center", marginTop: 24 },
              ]}
            >
              Banner Image
            </Text>
            <Pressable
              onPress={async () => {
                const res = await ImagePicker.launchImageLibraryAsync({
                  mediaTypes: ImagePicker.MediaTypeOptions.Images,
                  quality: 0.7,
                  allowsEditing: true,
                  aspect: [3, 1],
                });
                if (!res.canceled) {
                  setSignupData((prev) => ({
                    ...prev,
                    bannerImage: res.assets[0].uri,
                  }));
                }
              }}
              style={[styles.imageUploadBox, { height: 100 }]}
            >
              {signupData.bannerImage ? (
                <Image
                  source={{ uri: signupData.bannerImage }}
                  style={{ width: "100%", height: "100%", borderRadius: 10 }}
                />
              ) : (
                <Text style={styles.imagePlaceholder}>
                  Tap to select banner image
                </Text>
              )}
            </Pressable>
          </ScrollView>
        );

      case 3:
        return (
          <View style={styles.reviewContainer}>
            <Text style={styles.title}>Review Details</Text>

            {signupData.profileImage && (
              <Image
                source={{ uri: signupData.profileImage }}
                style={styles.imagePreview}
              />
            )}

            <Text style={styles.reviewText}>Name: {signupData.fullName}</Text>
            <Text style={styles.reviewText}>
              Username: {signupData.username}
            </Text>
            <Text style={styles.reviewText}>Email: {signupData.email}</Text>
            <Text style={styles.reviewText}>
              Password: {signupData.password.replace(/./g, "*")}
            </Text>

            <Text style={[styles.reviewText, { marginTop: 16 }]}>
              Favorites:
            </Text>
            {signupData.favorites.length > 0 ? (
              <ScrollView horizontal={false} style={styles.favoritesScroll}>
                {signupData.favorites.map((favId) => {
                  const team = teams.find((t) => t.id === favId);
                  if (!team) return null;
                  return (
                    <View
                      key={team.id}
                      style={[
                        styles.teamCard,
                        { backgroundColor: team.color || "#007AFF" },
                      ]}
                    >
                      <Image source={team.logo} style={styles.logo} />
                      <Text style={[styles.teamName, { color: "#fff" }]}>
                        {team.fullName}
                      </Text>
                    </View>
                  );
                })}
              </ScrollView>
            ) : (
              <Text style={styles.reviewText}>None</Text>
            )}
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.container}>
        <TabBar
          tabs={tabs}
          selected={selectedTab}
          onTabPress={(tab) => {
            setSelectedTab(tab);
            setSignupStep(0);
          }}
        />

        {selectedTab === "sign in" ? (
          renderSignIn()
        ) : (
          <>
           
            <Animated.View
              {...panResponder.panHandlers}
              style={{
                flex: 1,
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              }}
            >
              {signupStep === 0 && (
                <Text style={styles.title}>Create Account</Text>
              )}
              {renderSignupStep()}
            </Animated.View>
          </>
        )}

        {selectedTab === "sign up" && (
          <>
            <View style={styles.progressBarBackground}>
              <Animated.View
                style={[styles.progressBarFill, { width: progressInterpolate }]}
              />
            </View>

            <Pressable
              onPress={() => {
                if (signupStep === 3) {
                  handleSignupSubmit();
                } else {
                  setSignupStep((s) => s + 1);
                }
              }}
              style={styles.button}
            >
              <Text style={styles.buttonText}>
                {signupStep === 3 ? "Sign Up" : "Next"}
              </Text>
            </Pressable>
          </>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const getStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: isDark ? "#1d1d1d" : "#fff",
    },
    signInContainer: {
      flex: 1,
      justifyContent: "center",
    },
    inputContainer: {
      flex: 1,
      justifyContent: "space-around",
      paddingVertical: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      marginTop: 10,
      marginBottom: 20,
      color: isDark ? "#fff" : "#000",
      textAlign: "center",
    },
    titleRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginVertical: 16,
    },
    titleCentered: {
      position: "absolute",
      left: 0,
      right: 0,
      textAlign: "center",
      fontSize: 24,
      fontWeight: "bold",
      color: isDark ? "#fff" : "#000",
    },
    input: {
      color: isDark ? "#fff" : "#000",
      backgroundColor: isDark ? "#222" : "#eee",
      padding: 20,
      borderRadius: 8,
      fontSize: 16,
      marginVertical: 20,
      fontFamily: OSLIGHT,
    },
    searchBar: {
      borderWidth: 1,
      borderColor: "#888",
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 8,
      fontSize: 16,
      color: "#000",
      fontFamily: OSLIGHT,
    },
    passwordRow: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: isDark ? "#222" : "#eee",
      borderRadius: 8,
      marginBottom: 12,
    },
    passwordInput: {
      fontFamily: OSLIGHT,
      flex: 1,
      fontSize: 16,
      padding: 20,
      color: isDark ? "#fff" : "#000",
    },
    iconButton: { padding: 20 },
    button: {
      backgroundColor: isDark ? "#fff" : "#1d1d1d",
      padding: 14,
      borderRadius: 8,
      alignItems: "center",
      marginTop: 10,
    },
    buttonText: {
      color: isDark ? "#000" : "#fff",
      fontFamily: OSREGULAR,
      fontSize: 16,
    },
    row: {
      flexDirection: "column",
      justifyContent: "space-between",
    },
    teamCard: {
      flexDirection: "row",
      flex: 1,
      alignItems: "center",
      marginTop: 12,
      padding: 12,
      backgroundColor: isDark ? "#222" : "#f5f5f5",
      borderRadius: 8,
    },
    teamName: {
      marginLeft: 16,
      fontSize: 16,
      fontFamily: OSREGULAR,
    },
    logo: { width: 50, height: 50, resizeMode: "contain" },
    imageUploadBox: {
      borderWidth: 1,
      borderColor: "#888",
      borderRadius: 10,
      height: 150,
      justifyContent: "center",
      alignItems: "center",
    },
    reviewContainer: {
      justifyContent: "center",
      alignContent: "center",
      paddingHorizontal: 8,
      paddingBottom: 24,
    },
    favoritesScroll: {
      maxHeight: 280,
      marginTop: 8,
    },
    imagePreview: {
      width: 100,
      height: 100,
      borderRadius: 50,
      marginBottom: 10,
      alignSelf: "center",
    },
    imagePlaceholder: { color: isDark ? "#aaa" : "#666" },
    reviewText: {
      marginVertical: 8,
      color: isDark ? "#eee" : "#333",
      fontFamily: OSREGULAR,
    },
    progressBarBackground: {
      height: 2,
      width: "100%",
      backgroundColor: "#ccc",
      borderRadius: 5,
      overflow: "hidden",
      marginVertical: 8,
    },
    progressBarFill: {
      height: "100%",
      backgroundColor: "#007AFF",
    },
    skipText: {
      color: isDark ? "#aaa" : "#555",
      fontSize: 16,
      fontFamily: OSREGULAR,
    },
  });
