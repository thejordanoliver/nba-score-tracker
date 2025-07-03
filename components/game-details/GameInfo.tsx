// components/game-details/GameInfo.tsx
import { StyleSheet, Text, View } from "react-native";

const OSEXTRALIGHT = "Oswald_200ExtraLight";
const OSREGULAR = "Oswald_400Regular";
const OSBOLD = "Oswald_700Bold";
const OSSEMIBOLD = "Oswald_600SemiBold";

type GameInfoProps = {
  status: "Scheduled" | "In Progress" | "Final";
  date: string;
  time: string;
  period?: string;
  clock?: string;
  colors: Record<string, string>;
  isDark: boolean;
  playoffInfo?: string | string[];
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
        <Text style={[styles.final, { color: colors.finalText }]}>Final</Text>
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
    fontFamily: OSREGULAR,
  },
  time: {
    fontSize: 14,
    fontFamily: OSREGULAR,
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
    fontFamily: OSBOLD,
  },
  playoffText: {
    marginTop: 6,
    fontSize: 13,
    fontFamily: OSSEMIBOLD,
    textAlign: "center",
  },
});
