import {
  Oswald_200ExtraLight,
  Oswald_300Light,
  Oswald_400Regular,
  Oswald_500Medium,
  Oswald_600SemiBold,
  Oswald_700Bold,
  useFonts,
} from "@expo-google-fonts/oswald";
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationLightTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack, usePathname } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  View,
  useColorScheme,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { CustomHeaderTitle } from "@/components/CustomHeaderTitle";
import CustomTabBar from "../components/CustomTabBar";

import FollowersModal from "@/components/profile/FollowersModal"; // <-- Import modal
import { useFollowersModalStore } from "@/store/followersModalStore"; // <-- Zustand store

// Custom themes
const CustomDarkTheme = {
  ...NavigationDarkTheme,
  colors: {
    ...NavigationDarkTheme.colors,
    background: "#1d1d1d",
    text: "#ffffff",
  },
};

const CustomLightTheme = {
  ...NavigationLightTheme,
  colors: {
    ...NavigationLightTheme.colors,
    background: "#ffffff",
    text: "#000000",
  },
};

// Routes where tab bar should be hidden
const hiddenRoutes = [
  "/news/article",
  "/highlights/video",
  "/edit-profile",
  "/edit-favorites",
  "/signup/success", // hide tab bar on splash screen
  "/player/",
];

export default function RootLayout() {
  const pathname = usePathname();
  const colorScheme = useColorScheme();

  const [fontsLoaded] = useFonts({
    Oswald_200ExtraLight,
    Oswald_300Light,
    Oswald_400Regular,
    Oswald_500Medium,
    Oswald_600SemiBold,
    Oswald_700Bold,
  });

  // Tab bar visibility and fade animation
  const [visibleTabBar, setVisibleTabBar] = useState(true);
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const shouldHide = hiddenRoutes.some((r) => pathname.startsWith(r));
    setVisibleTabBar(!shouldHide);
    opacity.setValue(shouldHide ? 0 : 1);
  }, [pathname]);

  // Zustand modal state
  const {
    isVisible,
    type,
    targetUserId,
    closeModal,
    currentUserId, // You may want to store or pass currentUserId here globally
  } = useFollowersModalStore();

  if (!fontsLoaded) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: colorScheme === "dark" ? "#1d1d1d" : "#ffffff",
          }}
        >
          <ActivityIndicator
            size="large"
            color={colorScheme === "dark" ? "#fff" : "#000"}
          />
        </View>
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider
        value={colorScheme === "dark" ? CustomDarkTheme : CustomLightTheme}
      >
        <Stack
          screenOptions={({ route, navigation }) => {
            const isTabScreen = route.name === "(tabs)";
            const isSplashScreen = route.name === "signup/success";
            const isProfileScreen = route.name === "profile"; // Adjust if your profile route differs

            return {
              headerShown: !isSplashScreen && !isTabScreen,
              header: !isSplashScreen
                ? () => (
                    <CustomHeaderTitle
                      title={route.name}
                      onBack={
                        navigation.canGoBack() ? navigation.goBack : undefined
                      }
                    />
                  )
                : undefined,
              gestureEnabled: !isTabScreen,
              animation:
                isProfileScreen
                  ? "fade"
                  : isSplashScreen
                  ? "fade"
                  : isTabScreen
                  ? "none"
                  : "default",
              gestureDirection: "horizontal",
            };
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="+not-found"
            options={{ title: "Page Not Found" }}
          />
          <Stack.Screen name="signup/success" />
        </Stack>

        <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />

        {/* Tab bar always mounted, instantly hidden or shown */}
        <Animated.View
          style={{
            opacity,
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            pointerEvents: visibleTabBar ? "auto" : "none",
          }}
        >
          <CustomTabBar />
        </Animated.View>

        {/* Global Followers Modal */}
        <FollowersModal
          visible={isVisible}
          onClose={closeModal}
          type={type}
          currentUserId={currentUserId ?? ""} // Make sure currentUserId is set in store or pass via props/state
          targetUserId={targetUserId ?? ""}
        />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
