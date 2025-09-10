import { Fonts } from "@/constants/fonts";
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
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
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
              style={styles.arenaImage}
              resizeMode="cover"
            />

            <View></View>

            <View>
              <View style={styles.textContainer}>
                {location && (
                  <Text style={[styles.arenaTitle, { color: textColor }]}>
                    {arenaName}
                  </Text>
                )}
              </View>
            </View>
            <View style={styles.addressContainer}>
              <Ionicons name="location" size={20} color={textColor} />
              {location && (
                <TouchableOpacity
                  onPress={openInMaps}
                  activeOpacity={0.7}
                  style={{ flexShrink: 1 }}
                >
                  <Text
                    style={[
                      styles.subText,
                      {
                        color: textColor,
                        marginLeft: 8,
                        borderBottomWidth: 1,
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
  container: {},

  arenaImage: { width: "100%", height: 200, borderRadius: 8 },

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
    fontSize: 24,
    paddingVertical: 10,
  },
  icon: {
    width: 54,
    height: 54,
  },
  textContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  addressContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
});

export default TeamLocationSection;
