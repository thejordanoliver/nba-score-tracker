// components/SignupSteps.tsx
import FavoriteTeamsSelector from "@/components/FavoriteTeamsSelector";
import { getSignupStepsStyles } from "@/styles/signupStepStyles";
import { useRef, useState } from "react";
import {
  Animated,
  Image,
  Pressable,
  Text,
  TextInput,
  useColorScheme,
  useWindowDimensions,
  View,
} from "react-native";
import {
  PanGestureHandler,
  ScrollView as RNGHScrollView,
  ScrollView,
} from "react-native-gesture-handler";
import {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { teams } from "../constants/teams";

type SignupData = {
  fullName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  favorites: string[];
  profileImage: string | null;
  bannerImage: string | null;
};

export type SignupStepsProps = {
  signupData: SignupData;
  signupStep: number;
  onChangeSignupData: (data: Partial<SignupData>) => void;
  onNextStep: () => void;
  onPreviousStep: () => void; // ← NEW
  onToggleFavorite: (id: string) => void;
  onOpenImagePickerFor: (target: "profile" | "banner") => void;
  toggleLayout: () => void;
  isGridView: boolean;
  fadeAnim: Animated.Value;
};

export default function SignupSteps({
  signupStep,
  signupData,
  onChangeSignupData,
  onNextStep,
  onPreviousStep,
  onToggleFavorite,
  onOpenImagePickerFor,
  toggleLayout,
  isGridView,
  fadeAnim,
}: SignupStepsProps) {
  const isDark = useColorScheme() === "dark";
  const styles = getSignupStepsStyles(isDark);
  const { width: screenWidth } = useWindowDimensions();
  const numColumns = 3;
  const containerPadding = 40;
  const columnGap = 12;
  const totalSpacing = columnGap * (numColumns - 1);
  const itemWidth =
    (screenWidth - containerPadding - totalSpacing) / numColumns;

  const [search, setSearch] = useState("");

  const filteredTeams = teams.filter((team) =>
    team.fullName.toLowerCase().includes(search.toLowerCase())
  );

  const translateX = useSharedValue(0);
  const scrollRef = useRef(null);

  const gestureHandler = useAnimatedGestureHandler({
    onActive: (event) => {
      translateX.value = event.translationX;
    },
    onEnd: (event) => {
      if (event.translationX > 100) {
        translateX.value = withTiming(0);
        runOnJS(onPreviousStep)();
      } else if (event.translationX < -100) {
        translateX.value = withTiming(0);
        runOnJS(onNextStep)();
      } else {
        translateX.value = withTiming(0);
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  switch (signupStep) {
    case 0:
      return (
        <PanGestureHandler
          onGestureEvent={gestureHandler}
          simultaneousHandlers={scrollRef}
        >
          {/* Just a regular View now, no Animated.View or animatedStyle */}
          <View style={{ flex: 1 }}>
            <RNGHScrollView
              ref={scrollRef}
              contentContainerStyle={{ flexGrow: 1 }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              simultaneousHandlers={scrollRef}
            >
              <View style={styles.inputContainer}>
                <TextInput
                  placeholder="Name"
                  value={signupData.fullName}
                  onChangeText={(val) => onChangeSignupData({ fullName: val })}
                  style={styles.input}
                  placeholderTextColor={isDark ? "#888" : "#aaa"}
                />
                <TextInput
                  placeholder="Username"
                  value={signupData.username}
                  onChangeText={(val) =>
                    onChangeSignupData({ username: val.toLowerCase() })
                  }
                  style={styles.input}
                  placeholderTextColor={isDark ? "#888" : "#aaa"}
                  autoCapitalize="none"
                />
                <TextInput
                  placeholder="Email"
                  keyboardType="email-address"
                  value={signupData.email}
                  onChangeText={(val) => onChangeSignupData({ email: val })}
                  style={styles.input}
                  placeholderTextColor={isDark ? "#888" : "#aaa"}
                  autoCapitalize="none"
                />
                <TextInput
                  placeholder="Password"
                  secureTextEntry
                  value={signupData.password}
                  onChangeText={(val) => onChangeSignupData({ password: val })}
                  style={styles.input}
                  placeholderTextColor={isDark ? "#888" : "#aaa"}
                />
                <TextInput
                  placeholder="Confirm Password"
                  secureTextEntry
                  value={signupData.confirmPassword}
                  onChangeText={(val) =>
                    onChangeSignupData({ confirmPassword: val })
                  }
                  style={styles.input}
                  placeholderTextColor={isDark ? "#888" : "#aaa"}
                />
              </View>
            </RNGHScrollView>
          </View>
        </PanGestureHandler>
      );

    case 1:
      return (
        <View style={{ flex: 1 }}>
          <View style={styles.titleRow}>
            <View style={{ flex: 1 }} />
            <Text style={styles.titleCentered}>Select Favorite Teams</Text>
            <Pressable onPress={onNextStep}>
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

          <Animated.View style={{ flex: 1, opacity: fadeAnim, marginTop: 12 }}>
            <FavoriteTeamsSelector
              teams={teams}
              favorites={signupData.favorites} // ✅ fix: use data from signupData
              toggleFavorite={onToggleFavorite} // ✅ fix: use the passed-in prop
              isGridView={isGridView}
              fadeAnim={fadeAnim}
              search={search}
              itemWidth={itemWidth}
            />
          </Animated.View>
        </View>
      );

    case 2:
      return (
        <RNGHScrollView contentContainerStyle={{ paddingBottom: 40 }}>
          <Text style={styles.title}>Upload Images</Text>
          <Text
            style={[styles.reviewText, { textAlign: "center", marginTop: 24 }]}
          >
            Banner Image
          </Text>
          <Pressable
            onPress={() => onOpenImagePickerFor("banner")}
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
          <Text style={[styles.reviewText, { textAlign: "center" }]}>
            Profile Picture
          </Text>
          <Pressable
            onPress={() => onOpenImagePickerFor("profile")}
            style={styles.profileImageUploadBox}
          >
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
        </RNGHScrollView>
      );

    case 3:
      return (
        <ScrollView>
          <View style={styles.reviewContainer}>
            <Text style={styles.title}>Review Details</Text>
            <Text
              style={[
                styles.reviewText,
                { textAlign: "center", marginTop: 24 },
              ]}
            >
              Banner Image
            </Text>
            <View style={[styles.imageUploadBox]}>
              {signupData.bannerImage && (
                <Image
                  source={{ uri: signupData.bannerImage }}
                  style={{ width: "100%", height: "100%", borderRadius: 10 }}
                />
              )}
            </View>
            <Text style={[styles.reviewText, { textAlign: "center" }]}>
              Profile Picture
            </Text>
            <View style={[styles.profileImageUploadBox]}>
              {signupData.profileImage && (
                <Image
                  source={{ uri: signupData.profileImage }}
                  style={styles.imagePreview}
                />
              )}
            </View>
            <Text style={styles.heading}>Name</Text>
            <View style={styles.reviewInput}>
              <Text style={styles.reviewText}>{signupData.fullName}</Text>
            </View>
            <Text style={styles.heading}>Username</Text>
            <View style={styles.reviewInput}>
              <Text style={styles.reviewText}>{signupData.username}</Text>
            </View>
            <Text style={styles.heading}>Email</Text>
            <View style={styles.reviewInput}>
              <Text style={styles.reviewText}>{signupData.email}</Text>
            </View>
            <Text style={styles.heading}>Password</Text>
            <View style={styles.reviewInput}>
              <Text style={styles.reviewText}>
                {signupData.password.replace(/./g, "*")}
              </Text>
            </View>

            <Text style={[styles.heading, { marginTop: 16 }]}>Favorites</Text>
            {signupData.favorites.length > 0 ? (
              <RNGHScrollView horizontal={false} style={styles.favoritesScroll}>
                {signupData.favorites.map((favId) => {
                  const team = teams.find((t) => t.id === favId);
                  if (!team) return null;
                  return (
                    <View
                      key={team.id}
                      style={[
                        styles.teamCardList,
                        { backgroundColor: team.color || "#007AFF" },
                      ]}
                    >
                      <Image
                        source={team.logoLight ? team.logoLight : team.logo}
                        style={styles.logo}
                      />
                      <Text style={[styles.teamName, { color: "#fff" }]}>
                        {team.fullName}
                      </Text>
                    </View>
                  );
                })}
              </RNGHScrollView>
            ) : (
              <Text style={styles.reviewText}>None</Text>
            )}
          </View>
        </ScrollView>
      );

    default:
      return null;
  }
}
