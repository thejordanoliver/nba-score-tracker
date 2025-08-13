import { Fonts } from "@/constants/fonts";
import { useEffect, useRef } from "react";
import { Animated, Text, View } from "react-native";
import PlayoffsLogo from "../../assets/Logos/NBAPlayoffs.png";
import PlayoffsLogoLight from "../../assets/Logos/NBAPlayoffsLight.png";
import FinalsLogo from "../../assets/Logos/TheNBAFinals.png";
import FinalsLogoLight from "../../assets/Logos/TheNBAFinalsLight.png";
type CenterInfoProps = {
  isNBAFinals: boolean;
  isFinal: boolean;
  isCanceled?: boolean;
  isHalftime?: boolean;
  broadcastNetworks?: string;
  showLiveInfo: boolean;
  period: number | string;
  time: string;
  clock?: string | null;
  endOfPeriod?: boolean;
  formattedDate: string;
  isDark: boolean;
  gameNumberLabel?: string;
  seriesSummary?: string;
  isPlayoffs?: boolean;
  totalPeriodsPlayed?: number;
};

function getLivePeriodLabel(period?: number) {
  if (!period) return "Live";

  if (period <= 4) {
    switch (period) {
      case 1:
        return "1st";
      case 2:
        return "2nd";
      case 3:
        return "3rd";
      case 4:
        return "4th";
    }
  }

  const overtimeNumber = period - 4;
  return overtimeNumber === 1 ? "OT" : `OT${overtimeNumber}`;
}

export default function CenterInfo({
  isNBAFinals,
  isFinal,
  isCanceled,
  isHalftime,
  broadcastNetworks,
  showLiveInfo,
  period,
  clock,
  endOfPeriod,
  time,
  formattedDate,
  isDark,
  gameNumberLabel,
  seriesSummary,
  isPlayoffs,
  totalPeriodsPlayed,
}: CenterInfoProps) {
  // Animated opacity for logos based on theme
  const lightOpacity = useRef(new Animated.Value(isDark ? 0 : 1)).current;
  const darkOpacity = useRef(new Animated.Value(isDark ? 1 : 0)).current;

  // Determine finalPeriod label logic:
  // Use totalPeriodsPlayed if game is final and available, else fall back to period number
  const finalPeriod =
    isFinal && totalPeriodsPlayed
      ? totalPeriodsPlayed
      : typeof period === "number"
        ? period
        : undefined;

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

  // Ordinal suffix for quarter labels in live games
  function getOrdinalQuarter(period?: number) {
    switch (period) {
      case 1:
        return "1st";
      case 2:
        return "2nd";
      case 3:
        return "3rd";
      case 4:
        return "4th";
      default:
        return period ? `${period}th` : "Live";
    }
  }

  console.log(
    "finalPeriod:",
    finalPeriod,
    "period:",
    period,
    "totalPeriodsPlayed:",
    totalPeriodsPlayed
  );

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
                fontFamily: Fonts.OSLIGHT,
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
                fontFamily: Fonts.OSLIGHT,
                color: isDark ? "#ccc" : "#333",
              }}
            >
              {seriesSummary}
            </Text>
          )}
        </View>
      )}

      {isCanceled ? (
        <Text
          style={{
            fontSize: 20,
            fontFamily: Fonts.OSBOLD,
            color: isDark ? "#ff5555" : "#cc0000",
            marginTop: 6,
          }}
        >
          Cancelled
        </Text>
      ) : isFinal ? (
        <Text
          style={{
            fontSize: 20,
            fontFamily: Fonts.OSBOLD,
            color: isDark ? "#ff5555" : "#cc0000",
            marginTop: 6,
          }}
        >
          Final
        </Text>
      ) : null}

      {showLiveInfo && clock ? (
        <>
          <Text
            style={{
              fontSize: 18,
              fontFamily: Fonts.OSMEDIUM,
              color: isDark ? "#fff" : "#000",
              marginTop: 4,
            }}
          >
            {isHalftime
              ? "Halftime"
              : endOfPeriod && typeof period === "number"
                ? `End of ${getLivePeriodLabel(period)}`
                : typeof period === "number"
                  ? getLivePeriodLabel(period)
                  : period}
          </Text>

          {!endOfPeriod && (
            <Text
              style={{
                fontSize: 20,
                fontFamily: Fonts.OSMEDIUM,
                color: isDark ? "#ff4444" : "#cc0000",
              }}
            >
              {clock}
            </Text>
          )}
        </>
      ) : (
        !showLiveInfo && (
          <>
            <Text
              style={{
                fontSize: 16,
                fontFamily: Fonts.OSREGULAR,
                color: isDark ? "#fff" : "#000",
                marginTop: 6,
              }}
            >
              {formattedDate}
            </Text>

            {!isFinal && !isCanceled && time && (
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: Fonts.OSLIGHT,
                  color: isDark ? "#ccc" : "#555",
                  marginTop: 2,
                }}
              >
                {time}
              </Text>
            )}
          </>
        )
      )}

      {broadcastNetworks && (
        <Text
          style={{
            fontSize: 12,
            fontFamily: Fonts.OSREGULAR,
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
