import { Image, Text, View, Animated } from "react-native";
import { useEffect, useRef } from "react";
import FinalsLogo from "../../assets/Logos/TheNBAFinals.png";
import FinalsLogoLight from "../../assets/Logos/TheNBAFinalsLight.png";
import PlayoffsLogo from "../../assets/Logos/NBAPlayoffs.png"
import PlayoffsLogoLight from "../../assets/Logos/NBAPlayoffsLight.png"

const OSEXTRALIGHT = "Oswald_200ExtraLight";
const OSLIGHT = "Oswald_300Light";
const OSMEDIUM = "Oswald_500Medium";
const OSREGULAR = "Oswald_400Regular";
const OSBOLD = "Oswald_700Bold";

type CenterInfoProps = {
  isNBAFinals: boolean;
  isFinal: boolean;
  broadcastNetworks?: string;
  showLiveInfo: boolean;
  period: number | string;
  clock?: string | null;
  formattedDate: string;
  isDark: boolean;
  gameNumberLabel?: string;
  seriesSummary?: string;
  isPlayoffs?: boolean
};

export default function CenterInfo({
  isNBAFinals,
  isFinal,
  broadcastNetworks,
  showLiveInfo,
  period,
  clock,
  formattedDate,
  isDark,
  gameNumberLabel,
  seriesSummary,
  isPlayoffs
}: CenterInfoProps) {
  const lightOpacity = useRef(new Animated.Value(isDark ? 0 : 1)).current;
  const darkOpacity = useRef(new Animated.Value(isDark ? 1 : 0)).current;

useEffect(() => {
  if (isNBAFinals || isPlayoffs) {
    Animated.parallel([
      Animated.timing(lightOpacity, {
        toValue: isDark ? 0 : 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(darkOpacity, {
        toValue: isDark ? 1 : 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }
}, [isDark, isNBAFinals, isPlayoffs, lightOpacity, darkOpacity]);

  return (
    <View style={{ alignItems: "center" }}>

  {isNBAFinals ? (
  <View style={{ width: 100, height: 60, position: "relative" }}>
    <Animated.Image
      source={FinalsLogo}
      style={{
        width: 100,
        height: 60,
        resizeMode: "contain",
        position: "absolute",
        top: 0,
        left: 0,
        opacity: lightOpacity,
      }}
    />
    <Animated.Image
      source={FinalsLogoLight}
      style={{
        width: 100,
        height: 60,
        resizeMode: "contain",
        position: "absolute",
        top: 0,
        left: 0,
        opacity: darkOpacity,
      }}
    />
  </View>
) : isPlayoffs ? (
  <View style={{ width: 100, height: 60, position: "relative" }}>
    <Animated.Image
      source={PlayoffsLogo}
      style={{
        width: 100,
        height: 60,
        resizeMode: "contain",
        position: "absolute",
        top: 0,
        left: 0,
        opacity: lightOpacity,
      }}
    />
    <Animated.Image
      source={PlayoffsLogoLight}
      style={{
        width: 100,
        height: 60,
        resizeMode: "contain",
        position: "absolute",
        top: 0,
        left: 0,
        opacity: darkOpacity,
      }}
    />
  </View>
) : null}


      {(gameNumberLabel || seriesSummary) && (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 6,
          }}
        >
          {gameNumberLabel && (
            <Text
              style={{
                fontSize: 12,
                fontFamily: OSLIGHT,
                color: isDark ? "#ccc" : "#333",
              }}
            >
              {gameNumberLabel}
            </Text>
          )}

          {gameNumberLabel && seriesSummary && (
            <View
              style={{
                height: 12,
                width: 0.5,
                backgroundColor: isDark ? "#ccc" : "#444",
                marginHorizontal: 8,
              }}
            />
          )}

          {seriesSummary && (
            <Text
              style={{
                fontSize: 12,
                fontFamily: OSLIGHT,
                color: isDark ? "#ccc" : "#333",
              }}
            >
              {seriesSummary}
            </Text>
          )}
        </View>
      )}

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

  
      {showLiveInfo && clock ? (
        <>
          <Text
            style={{
              fontSize: 18,
              fontFamily: "Oswald_500Medium",
              color: isDark ? "#fff" : "#000",
              marginTop: 4,
            }}
          >
            {typeof period === "number" ? `Q${period}` : period}
          </Text>
          <Text
            style={{
              fontSize: 16,
              fontFamily: "Oswald_500Medium",
              color: isDark ? "#fff" : "#000",
            }}
          >
            {clock}
          </Text>
        </>
      ) : (
        !showLiveInfo && (
          <Text
            style={{
              fontSize: 16,
              fontFamily: OSREGULAR,
              color: isDark ? "#fff" : "#000",
              marginTop: 6,
            }}
          >
            {formattedDate}
          </Text>
        )
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

    </View>
  );
}
