import { Image, Text, View, Animated } from "react-native";
import { useEffect, useRef } from "react";
import FinalsLogo from "../../assets/Logos/TheNBAFinals.png";
import FinalsLogoLight from "../../assets/Logos/TheNBAFinalsLight.png";
import { getStyles } from "../../styles/SLGameCard.styles";
import { useColorScheme } from "react-native";
const OSEXTRALIGHT = "Oswald_200ExtraLight";
const OSLIGHT = "Oswald_300Light";
const OSMEDIUM = "Oswald_500Medium";
const OSREGULAR = "Oswald_400Regular";
const OSBOLD = "Oswald_700Bold";

type CenterInfoProps = {
  isFinal: boolean;
  broadcastNetworks?: string;
  showLiveInfo: boolean;
  period: number | string;
  clock?: string | null;
  formattedDate: string;
  isDark: boolean;
  startTime?: string; // ← New prop
  gameNumberLabel?: string;
  seriesSummary?: string;
};

export default function CenterInfo({
  isFinal,
  broadcastNetworks,
  showLiveInfo,
  period,
  clock,
  formattedDate,
  isDark,
  startTime, // ← use new prop
}: CenterInfoProps) {
  const lightOpacity = useRef(new Animated.Value(isDark ? 0 : 1)).current;
  const darkOpacity = useRef(new Animated.Value(isDark ? 1 : 0)).current;
  const colorScheme = useColorScheme();
  const dark = isDark ?? colorScheme === "dark";
  const styles = getStyles(dark);
  return (
    <View style={{ alignItems: "center" }}>
      {isFinal && (
        <Text
          style={{
            fontSize: 20,
            fontFamily: OSBOLD,
            color: isDark ? "#ff5555" : "#cc0000",
            marginTop: 6,
          }}
        >
          Final
        </Text>
      )}

      {broadcastNetworks && (
        <Text
          style={{
            fontSize: 12,
            fontFamily: OSREGULAR,
            color: isDark ? "#aaa" : "#444",
            marginTop: 4,
            textAlign: "center",
          }}
        >
          {broadcastNetworks}
        </Text>
      )}

      {showLiveInfo && clock ? (
        <>
          <Text
            style={{
              fontSize: 18,
              fontFamily: OSMEDIUM,
              color: isDark ? "#fff" : "#000",
              marginTop: 4,
            }}
          >
            {typeof period === "number" ? `Q${period}` : period}
          </Text>
          <Text
            style={{
              fontSize: 16,
              fontFamily: OSMEDIUM,
              color: isDark ? "#fff" : "#000",
            }}
          >
            {clock}
          </Text>
        </>
      ) : (
        <>
          <Text
            style={styles.date}
          >
            {formattedDate}
          </Text>

          {/* ✅ Show start time if available and game hasn't started */}
          {startTime && (
            <Text
              style={
              styles.time}
            >
            {startTime}
            </Text>
          )}
        </>
      )}
    </View>
  );
}
