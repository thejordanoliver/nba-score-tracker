import { Fonts } from "@/constants/fonts";
import { NFLTeam } from "@/constants/teamsNFL";
import { getStyles } from "@/styles/GameCard.styles";
import { StyleSheet, Text, View } from "react-native";
type NFLGameCenterInfoProps = {
  status:
    | "Scheduled"
    | "In Progress"
    | "Final"
    | "Canceled"
    | "Postponed"
    | "Delayed"; // <-- added "Delayed"
  date: string;
  time: string;
  period?: string;
  clock?: string;
  colors: Record<string, string>;
  isDark: boolean;
  playoffInfo?: string | string[];
  homeTeam: NFLTeam;
  awayTeam: NFLTeam;
};

export function NFLGameCenterInfo({
  status,
  date,
  time,
  period,
  clock,
  colors,
  isDark,
  homeTeam,
  awayTeam,
}: NFLGameCenterInfoProps) {
  const styles = getStyles(isDark);

  return (
    <View
      style={[
        {
          justifyContent: "center",
          alignItems: "center",
          marginHorizontal: 8,
          marginBottom: 8,
          backgroundColor: "rgba(0,0,0,0.05)", // debug highlight
        },
      ]}
    >
      {/* Scheduled */}
      {status === "Scheduled" && (
        <>
          <Text style={styles.date}>{date || "TBD"}</Text>
          <Text style={styles.time}>{time || ""}</Text>
        </>
      )}

      {/* In Progress */}
      {status === "In Progress" && (
        <>
          <Text style={styles.date}>{period}</Text>
          {clock && <Text style={styles.clock}>{clock}</Text>}
        </>
      )}

      {/* Final */}
      {status === "Final" && (
        <>
          <Text style={styles.finalText}>Final</Text>
          <Text style={styles.dateFinal}>{date || ""}</Text>
        </>
      )}

      {/* Canceled, Postponed, or Delayed */}
      {(status === "Canceled" ||
        status === "Postponed" ||
        status === "Delayed") && (
        <Text style={[styles.finalText]}>{status}</Text>
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 8,
    marginBottom: 8,
    backgroundColor: "rgba(0,0,0,0.05)", // temporary highlight to see the box
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
    fontFamily: Fonts.OSMEDIUM,
    fontSize: 14,
  },
  clock: {
    fontSize: 14,
    fontFamily: Fonts.OSMEDIUM,
    marginTop: 4,
    textAlign: "center",
  },
  final: {
    fontSize: 14,
    fontFamily: Fonts.OSBOLD,
  },
});
