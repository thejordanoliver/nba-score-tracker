import { Fonts } from "@/constants/fonts";
import { WeatherData } from "@/hooks/useWeather";
import { ResizeMode, Video } from "expo-av";
import { BlurView } from "expo-blur";
import {
  Alert,
  Image,
  Linking,
  Platform,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import TeamLocationSkeleton from "../GameDetails/TeamLocationSkeleton";
import HeadingTwo from "../Headings/HeadingTwo";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  arenaImage?: any;
  arenaName?: string;
  weather: WeatherData | null;
  loading: boolean;
  error: string | null;
  address: string;
};

const weatherVideos: Record<string, any> = {
  sunny: require("@/assets/Weather/sunny.mp4"),
  rain: require("@/assets/Weather/rainythree.mp4"),
  cloudy: require("@/assets/Weather/cloudy.mp4"),
  clear: require("@/assets/Weather/clearsky.mp4"),
};

const Weather: React.FC<Props> = ({ address, weather, loading, error }) => {
  const isDark = useColorScheme() === "dark";
  const textColor = isDark ? "#fff" : "#1d1d1d";

const weatherKeywords: Record<string, keyof typeof weatherVideos> = {
  sun: "sunny",
  rain: "rain",
  cloud: "cloudy",
  clear: "clear",
};

const getBackgroundVideo = () => {
  if (!weather?.description) return null;
  const desc = weather.description.toLowerCase();

  for (const keyword in weatherKeywords) {
    if (desc.includes(keyword)) {
      return weatherVideos[weatherKeywords[keyword]];
    }
  }

  return null;
};

const weatherIcons: Record<string, keyof typeof Ionicons.glyphMap> = {
  sun: "sunny",
  clear: "sunny",
  rain: "rainy",
  cloud: "cloud",
  thunder: "thunderstorm",
  snow: "snow",
  mist: "cloudy",
  fog: "cloudy",
};

const getWeatherIcon = () => {
  if (!weather?.description) return "help-outline"; // fallback icon
  const desc = weather.description.toLowerCase();

  for (const keyword in weatherIcons) {
    if (desc.includes(keyword)) {
      return weatherIcons[keyword];
    }
  }

  return "help-outline"; // fallback if no match
};




  const titleCase = (str: string) =>
    str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  return (
    <>
      <View style={{ marginTop: 20 }}>
        <HeadingTwo>Weather</HeadingTwo>

        {loading && !error ? (
          <TeamLocationSkeleton />
        ) : (
          <View style={{ flex: 1, borderRadius: 10, overflow: "hidden" }}>
            <Video
              source={getBackgroundVideo()}
              style={StyleSheet.absoluteFill}
              resizeMode={ResizeMode.COVER}
              shouldPlay
              isLooping
              isMuted // keeps weather silent
              rate={0.5}
            />

            <BlurView
              intensity={30}
              tint="systemMaterial"
              style={StyleSheet.absoluteFill}
            />

            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                height: 200,
              }}
            >
              {error ? (
                <Text style={[styles.text, { color: textColor }]}>
                  Error loading weather: {error}
                </Text>
              ) : weather ? (
                <>
<Ionicons name={getWeatherIcon()} size={64} color={textColor} />

                  <Text style={[styles.cityName, { color: textColor }]}>
                    {weather.cityName}
                  </Text>

                  <Text style={[styles.temperature, { color: textColor }]}>
                    {weather.tempFahrenheit.toFixed(0)}°F
                  </Text>

                  <Text style={[styles.subText, { color: textColor }]}>
                    {titleCase(weather.description)}
                  </Text>
                </>
              ) : null}
            </View>
          </View>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#eee",
    height: 260,
    borderRadius: 10,
  },

  text: {
    fontFamily: Fonts.OSREGULAR,
    fontSize: 20,
  },
  subText: {
    fontFamily: Fonts.OSREGULAR,
    fontSize: 16,
  },
  temperature: {
    fontFamily: Fonts.OSBOLD,
    fontSize: 28,
    textAlign: "center",
  },
  cityName: {
    fontFamily: Fonts.OSREGULAR,
    fontSize: 28,
    textAlign: "center",
  },
  icon: {
    width: 80,
    height: 80,
  },
  textContainer: {
    alignItems: "center",
  },

  description: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },
});

export default Weather;
