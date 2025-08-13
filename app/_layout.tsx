import { CustomHeaderTitle } from "@/components/CustomHeaderTitle";
import FollowersModal from "@/components/Profile/FollowersModal";
import { useFollowersModalStore } from "@/store/followersModalStore";
import {
  Oswald_200ExtraLight,
  Oswald_300Light,
  Oswald_400Regular,
  Oswald_500Medium,
  Oswald_600SemiBold,
  Oswald_700Bold,
  useFonts,
} from "@expo-google-fonts/oswald";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
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
import CustomTabBar from "../components/CustomTabBar";
import { PreferencesProvider } from "@/contexts/PreferencesContext";

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
    text: "#1d1d1d",
  },
};

// Routes where tab bar should be hidden
const hiddenRoutes = [
  "/news/article",
  "/highlights/video",
  "/edit-profile",
  "/edit-favorites",
  "/signup/success",
  "/player/",
];

export default function RootLayout() {
  const pathname = usePathname();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [fontsLoaded] = useFonts({
    Oswald_200ExtraLight,
    Oswald_300Light,
    Oswald_400Regular,
    Oswald_500Medium,
    Oswald_600SemiBold,
    Oswald_700Bold,
  });

  const [visibleTabBar, setVisibleTabBar] = useState(true);
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const shouldHide = hiddenRoutes.some((r) => pathname.startsWith(r));
    setVisibleTabBar(!shouldHide);
    opacity.setValue(shouldHide ? 0 : 1);
  }, [pathname]);

  // Followers modal (Zustand)
  const { isVisible, type, targetUserId, closeModal, currentUserId } =
    useFollowersModalStore();

  if (!fontsLoaded) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: isDark ? "#1d1d1d" : "#ffffff",
          }}
        >
          <ActivityIndicator size="large" color={isDark ? "#fff" : "#000"} />
        </View>
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <ThemeProvider value={isDark ? CustomDarkTheme : CustomLightTheme}>
              <PreferencesProvider>

          <Stack
            screenOptions={({ route, navigation }) => {
              const isTabScreen = route.name === "(tabs)";
              const isSplashScreen = route.name === "signup/success";
              const isProfileScreen = route.name === "profile";

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
                animation: isProfileScreen
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

          <StatusBar style={isDark ? "light" : "dark"} />

          {/* Tab Bar */}
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
            currentUserId={currentUserId ?? ""}
            targetUserId={targetUserId ?? ""}
          />
              </PreferencesProvider>

        </ThemeProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
