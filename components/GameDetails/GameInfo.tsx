// components/GameDetails/GameInfo.tsx
import { useESPNBroadcasts } from "@/hooks/useESPNBroadcasts";
import { matchBroadcastToGame } from "@/utils/matchBroadcast";
import { StyleSheet, Text, View } from "react-native";
import { Fonts } from "@/constants/fonts";


type GameInfoProps = {
  status: "Scheduled" | "In Progress" | "Final" | "Canceled" | "Postponed"; // ← added "Canceled"
  date: string;
  time: string;
  period?: string;
  clock?: string;
  colors: Record<string, string>;
  isDark: boolean;
  playoffInfo?: string | string[];
  homeTeam: string;
  awayTeam: string;
};

export function GameInfo({
  status,
  date,
  time,
  period,
  clock,
  colors,
  isDark,
  playoffInfo,
  homeTeam,
  awayTeam,
}: GameInfoProps) {
  const renderPlayoffInfo = () => {
    if (!playoffInfo) return null;

    if (Array.isArray(playoffInfo)) {
      return playoffInfo.map((line, index) => (
        <Text key={index} style={[styles.playoffText, { color: colors.text }]}>
          {line}
        </Text>
      ));
    }

    return (
      <Text style={[styles.playoffText, { color: colors.text }]}>
        {playoffInfo}
      </Text>
    );
  };

  const { broadcasts } = useESPNBroadcasts();

  // Match broadcast info for this game using utility function
  const matched = matchBroadcastToGame(
    {
      date,
      home: { name: homeTeam },
      away: { name: awayTeam },
    },
    broadcasts
  );

  const networkString = matched?.broadcasts
    ?.map((b) => b.network)
    .filter(Boolean)
    .join(", ");

  // Optional: Debug log to confirm broadcast networks found

  return (
    <View style={styles.container}>
      {status === "Scheduled" && (
        <>
          <Text style={[styles.date, { color: colors.secondaryText }]}>
            {date}
          </Text>
          <Text style={[styles.time, { color: colors.secondaryText }]}>
            {time}
          </Text>
        </>
      )}

      {status === "In Progress" && (
        <>
          <Text style={[styles.period, { color: isDark ? "#fff" : "#000" }]}>
            {period}
          </Text>
          {clock && (
            <Text
              style={[
                styles.clock,
                {
                  color: isDark ? "#ff6b00" : "#d35400",
                },
              ]}
            >
              {clock}
            </Text>
          )}
        </>
      )}

      {status === "Final" && (
        <>
          <Text style={[styles.final, { color: colors.finalText }]}>Final</Text>
          <Text style={[styles.date, { color: colors.secondaryText }]}>
            {new Date(date).toLocaleDateString("en-US", {
              month: "numeric",
              day: "numeric",
            })}
          </Text>

          {networkString && (
            <Text
              style={{
                fontSize: 10,
                fontFamily: Fonts.OSREGULAR,

                color: colors.secondaryText,
                textAlign: "center",
              }}
              accessibilityLabel="Broadcast Networks"
            >
              {networkString}
            </Text>
          )}
        </>
      )}
      {status === "Canceled" && (
  <>
    <Text style={[styles.final, { color: colors.finalText }]}>Canceled</Text>
    <Text style={[styles.date, { color: colors.secondaryText }]}>
      {new Date(date).toLocaleDateString("en-US", {
        month: "numeric",
        day: "numeric",
      })}
    </Text>
  </>
)}
      {status === "Postponed" && (
  <>
    <Text style={[styles.final, { color: colors.finalText }]}>Postponed</Text>
    <Text style={[styles.date, { color: colors.secondaryText }]}>
      {new Date(date).toLocaleDateString("en-US", {
        month: "numeric",
        day: "numeric",
      })}
    </Text>
  </>
)}


      {renderPlayoffInfo()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 8,
    marginBottom: 8,
  },
  date: {
    fontSize: 14,
    fontFamily: Fonts.OSREGULAR,
  },
  time: {
    fontSize: 14,
    fontFamily: Fonts.OSREGULAR,
  },
  period: {
    fontFamily: "Oswald_500Medium",
    fontSize: 14,
  },
  clock: {
    fontSize: 14,
    fontFamily: "Oswald_500Medium",
    fontWeight: "bold",
    marginTop: 4,
    textAlign: "center",
  },
  final: {
    fontSize: 14,
    fontWeight: "bold",
    fontFamily: Fonts.OSBOLD,
  },
  playoffText: {
    marginTop: 6,
    fontSize: 13,
    fontFamily: Fonts.OSSEMIBOLD,
    textAlign: "center",
  },
});
