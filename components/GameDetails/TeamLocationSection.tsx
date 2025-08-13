import { Fonts } from "@/constants/fonts";
import { WeatherData } from "@/hooks/useWeather";
import { Ionicons } from "@expo/vector-icons";
import {
  Alert,
  Image,
  Linking,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import TeamLocationSkeleton from "../GameDetails/TeamLocationSkeleton";
import HeadingTwo from "../Headings/HeadingTwo";

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

  const openInMaps = async () => {
    if (!address) return;
    const encodedAddress = encodeURIComponent(address);
    const url = Platform.select({
      ios: `http://maps.apple.com/?q=${encodedAddress}`,
      android: `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`,
    });

    if (!url) return;

    Alert.alert(
      "Open in Maps?",
      `Do you want to open this location in your Maps app?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Open",
          onPress: async () => {
            try {
              const supported = await Linking.canOpenURL(url);
              if (supported) {
                await Linking.openURL(url);
              } else {
                console.warn("Maps app is not available.");
              }
            } catch (err) {
              console.error("Failed to open maps:", err);
            }
          },
        },
      ]
    );
  };


const titleCase = (str: string) =>
  str
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");


  return (
    <>
      <View style={{ marginTop: 20 }}>
        <HeadingTwo>Location</HeadingTwo>

        {loading && !error ? (
          <TeamLocationSkeleton />
        ) : (
          <View style={styles.container}>
            <Image
              source={arenaImage}
              style={ styles.arenaImage }
              resizeMode="cover"
            />

            <View>
              
            </View>

              <View>
            <View style={styles.textContainer}>
              {location && (
                <Text style={[styles.arenaTitle, { color: textColor }]}>
                  {arenaName}
                </Text>
              )}

              {error ? (
                <Text style={[styles.text, { color: textColor }]}>
                  Error loading weather: {error}
                </Text>
              ) : weather ? (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Image
                    source={{ uri: weather.icon }}
                    style={styles.icon}
                  />
                  <Text style={[styles.arenaTitle, { color: textColor }]}>
                    {weather.tempFahrenheit.toFixed(0)}°F
                  </Text>
                </View>
              ) : null}
            </View>
                         <View style={styles.description}>
            
                <Text
                  style={[styles.subText, { color: textColor, textAlign: "right" }]}
                >
               {titleCase(weather?.description ?? "No description available")}

                </Text>
       </View>
            </View>


      

            <View style={styles.addressContainer}>
              <Ionicons name="location" size={20} color={textColor} />
              {location && (
                <TouchableOpacity onPress={openInMaps}>
                  <Text
                    style={[
                      styles.subText,
                      {
                        color: textColor,
                        marginLeft: 8,
                        borderBottomWidth: 1,
                        paddingBottom: 1,
                        borderBottomColor: textColor,
                      },
                    ]}
                  >
                    {address}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
       


            <View style={styles.addressContainer}>
              <Ionicons name="person" size={20} color={textColor} />
              {location && (
                <Text
                  style={[styles.subText, { color: textColor, marginLeft: 8 }]}
                >
                  Capacity: {arenaCapacity || "N/A"}
                </Text>
              )}
            </View>
          </View>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {  },


arenaImage : {width: "100%", height: 200, borderRadius: 8},


  text: {
    fontFamily: Fonts.OSREGULAR,
    fontSize: 20,
  },
  subText: {
    fontFamily: Fonts.OSREGULAR,
    fontSize: 16,
    opacity: 0.5,
  },
  arenaTitle: {
    fontFamily: Fonts.OSBOLD,
    fontSize: 20,
  },
  icon: {
    width: 54,
    height: 54,
  },
  textContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    
  },
  addressContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
  description : {
    flex: 1,
    justifyContent: "flex-end",
    textAlign: "right"
  }
});

export default TeamLocationSection;
