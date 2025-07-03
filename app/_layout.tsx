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
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, View, useColorScheme } from "react-native";

// 1. Custom Light/Dark themes with your background/text colors
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

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [fontsLoaded] = useFonts({
    Oswald_200ExtraLight,
    Oswald_300Light,
    Oswald_400Regular,
    Oswald_500Medium,
    Oswald_600SemiBold,
    Oswald_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colorScheme === "dark" ? "#1d1d1d" : "#ffffff",
        }}
      >
        <ActivityIndicator size="large" color={colorScheme === "dark" ? "#fff" : "#000"} />
      </View>
    );
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? CustomDarkTheme : CustomLightTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
    </ThemeProvider>
  );
}
