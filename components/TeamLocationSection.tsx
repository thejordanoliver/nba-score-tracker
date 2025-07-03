import { WeatherData } from "@/hooks/useWeather";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, Text, useColorScheme, View } from "react-native";
const OSLIGHT = "Oswald_300Light";
const OSREGULAR = "Oswald_400Regular";
const OSBOLD = "Oswald_700Bold";

type Props = {
  arenaImage?: any;
  arenaName?: string;
  location?: string;
  weather: WeatherData | null;
  loading: boolean;
  error: string | null;
  address: string;
  arenaCapacity: string;
};

const TeamLocationSection: React.FC<Props> = ({
  arenaImage,
  arenaName,
  location,
  address,
  arenaCapacity,
  weather,
  loading,
  error,
}) => {
  const isDark = useColorScheme() === "dark";
  const textColor = isDark ? "#fff" : "#1d1d1d";

  return (
    <View style={{ marginTop: 20 }}>
      <Text
        style={{
          fontSize: 24,
          fontFamily: "Oswald_500Medium",
          marginBottom: 16,
          marginTop: 8,
          paddingBottom: 4,
          borderBottomWidth: 1,
          borderBottomColor: isDark ? "#444" : "#ccc",
          color: textColor,
        }}
      >
        Location
      </Text>

      {arenaImage && (
        <View style={{ width: "100%", alignItems: "center" }}>
          <Image
            source={arenaImage}
            style={{ width: "100%", height: 200, borderRadius: 8 }}
            resizeMode="cover"
          />
        </View>
      )}
      <View style={styles.textContainer}>
        {location && (
          <Text style={[styles.arenaTitle, { color: textColor }]}>
            {arenaName}
          </Text>
        )}

        {/* Weather section */}
        {loading ? (
          <Text style={[styles.text, { color: textColor }]}>
            Loading weather...
          </Text>
        ) : error ? (
          <Text style={[styles.text, { color: textColor }]}>
            Error loading weather: {error}
          </Text>
        ) : weather ? (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image
              source={{ uri: weather.icon }}
              style={[styles.icon, { tintColor: isDark ? "#fff" : "#1d1d1d" }]}
            />
            <Text style={[styles.arenaTitle, { color: textColor }]}>
              {weather.tempFahrenheit.toFixed(0)}°F{" "}
            </Text>
          </View>
        ) : null}
      </View>
      <View style={styles.addressContainer}>
        <Ionicons
          name="location"
          size={20}
          color={isDark ? "#fff" : "#1d1d1d"} // 👈 Add dark mode color logic
        />
        {location && (
<Text style={[styles.subText, { color: textColor, marginLeft: 8 }]}>{address}</Text>
        )}
      </View>
      <View style={styles.addressContainer}>
        <Ionicons
          name="person"
          size={20}
          color={isDark ? "#fff" : "#1d1d1d"} // 👈 Add dark mode color logic
        />
        {location && (
<Text style={[styles.subText, { color: textColor, marginLeft: 8 }]}>Capcity: {arenaCapacity}</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontFamily: OSREGULAR,
    fontSize: 20,
  },
  subText: {
    fontFamily: OSREGULAR,
    fontSize: 16,
    opacity: 0.5,
  },
  arenaTitle: {
    fontFamily: OSBOLD,
    fontSize: 24,
  },
  icon: {
    width: 60,
    height: 60,
  },
  textContainer: {
    paddingHorizontal: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

  },
  addressContainer: {
    paddingHorizontal: 0,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 12,
  },
});

export default TeamLocationSection;
