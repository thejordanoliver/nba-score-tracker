import { Fonts } from "@/constants/fonts";
import { NFLTeam } from "@/constants/teamsNFL";

import { useNFLGameBroadcasts } from "@/hooks/useNFLGameBroadcasts";
import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

type NFLGameCenterInfoProps = {
  status:
    | "Scheduled"
    | "In Progress"
    | "Final"
    | "Canceled"
    | "Postponed"
    | "Delayed"
    | "Halftime";
  date: string;
  time: string;
  period?: string;
  clock?: string;
  colors: Record<string, string>;
  isDark: boolean;
  playoffInfo?: string | string[];
  homeTeam: NFLTeam;
  awayTeam: NFLTeam
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
  const { broadcasts, loading, error } = useNFLGameBroadcasts(
    homeTeam.code,
    awayTeam.code,
    date
  );

  const formatQuarter = useMemo(
    () => (short: string) => {
      switch (short) {
        case "Q1":
          return "1st";
        case "Q2":
          return "2nd";
        case "Q3":
          return "3rd";
        case "Q4":
          return "4th";
        case "OT":
          return "OT";
        default:
          return short;
      }
    },
    []
  );

  const styles = getStyles(isDark);

  return (
    <View style={styles.container}>
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
          <Text style={styles.date}>{period ? formatQuarter(period) : ""}</Text>
          {clock && <Text style={styles.clock}>{clock}</Text>}
        </>
      )}
      {/* Halftime */}
      {status === "Halftime" && <Text style={styles.date}>Halftime</Text>}
      {/* Final */}
      {status === "Final" && (
        <>
          <Text style={styles.dateFinal}>{date || ""}</Text>
          <Text style={styles.finalText}>Final</Text>
        </>
      )}
      {/* Canceled, Postponed, Delayed */}
      {(status === "Canceled" ||
        status === "Postponed" ||
        status === "Delayed") && <Text style={styles.finalText}>{status}</Text>}
      {!loading && broadcasts.length > 0 && (
        <View>
          {broadcasts.map((b, i) => (
            <Text key={i} style={styles.broadcasts}>
              {b.names.join("/")}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
}

export const getStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      justifyContent: "center",
      alignItems: "center",
      marginHorizontal: 8,
      marginBottom: 8,
    },
    date: {
       fontFamily: Fonts.OSMEDIUM,
      color: isDark ? "#fff" : "#1d1d1d",
      fontSize: 14,
    },
    time: {
      fontSize: 14,
      fontFamily: Fonts.OSREGULAR,
      color: isDark ? "#fff" : "#444",
    },
    broadcasts: {
      fontSize: 10,
      fontFamily: Fonts.OSREGULAR,
      color: isDark ? "#aaa" : "#444",
    },
    period: {
      fontFamily: Fonts.OSMEDIUM,
      fontSize: 14,
    },
   clock: {
      fontFamily: Fonts.OSMEDIUM,
      fontSize: 14,
      color: isDark ? "#ff4444" : "#cc0000",
      marginTop: 4,
      textAlign: "center",
    },

    final: {
      fontSize: 14,
      fontFamily: Fonts.OSBOLD,
    },

    dateFinal: {
      fontFamily: Fonts.OSREGULAR,
      color: isDark ? "rgba(255,255,255, 1)" : "rgba(0, 0, 0, .5)",
      fontSize: 14,
    },
    finalText: {
      fontFamily: Fonts.OSMEDIUM,
      fontSize: 16,
      color: isDark ? "#ff4444" : "#cc0000",
      textAlign: "center",
    },
  });
