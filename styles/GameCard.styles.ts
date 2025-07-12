// GameCard.styles.ts
import { StyleSheet } from "react-native";

export const getStyles = (isDark: boolean) =>
  StyleSheet.create({
    card: {
      flexDirection: "row",
      backgroundColor: isDark ? "#2e2e2e" : "#eee",
      borderRadius: 8,
      paddingVertical: 14,
      paddingHorizontal: 20,
      marginVertical: 8,
      alignItems: "center",
      justifyContent: "space-between",
    },
    teamSection: {
      alignItems: "center",
      width: 60,
    },
    logo: {
      width: 40,
      height: 40,
      resizeMode: "contain",
    },
    teamName: {
      marginVertical: 4,
      fontFamily: "Oswald_400Regular",
      fontSize: 12,
      color: isDark ? "#fff" : "#1d1d1d",
      textAlign: "center",
    },
    teamScore: {
      fontSize: 24,
      fontFamily: "Oswald_500Medium",
      color: isDark ? "#aaa" : "rgba(0, 0, 0, 0.4)",
      width: 40,
      textAlign: "center",
    },
    teamRecord: {
      fontSize: 12,
      fontFamily: "Oswald_400Regular",
      color: isDark ? "#ccc" : "#777",
      textAlign: "center",
      width: 40,
    },
    info: {
      alignItems: "center",
      justifyContent: "center",
      width: 120,
    },
    date: {
      fontFamily: "Oswald_500Medium",
      color: isDark ? "#fff" : "#1d1d1d",
      fontSize: 14,
    },
    dateFinal: {
      fontFamily: "Oswald_400Regular",
      color: isDark ? "rgba(255,255,255, 1)" : "rgba(0, 0, 0, .5)",
      fontSize: 14,
    },
    time: {
      fontFamily: "Oswald_400Regular",
      color: isDark ? "#aaa" : "#555",
      fontSize: 12,
      marginTop: 2,
    },
    finalText: {
      fontFamily: "Oswald_500Medium",
      fontSize: 16,
      color: isDark ? "#ff4444" : "#cc0000",
      fontWeight: "bold",
      textAlign: "center",
    },
    clock: {
      fontFamily: "Oswald_500Medium",
      fontSize: 14,
      color: isDark ? "#ff6b00" : "#d35400",
      fontWeight: "bold",
      marginTop: 4,
      textAlign: "center",
    },

    broadcast: {
      position: "absolute",
      bottom: -16,
      fontFamily: "Oswald_400Regular",
      color: isDark ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, .5)",
      fontSize: 10,
    },

    seriesStatus: {
      fontSize: 12,
      color: "gray",
      marginTop: 2,
      fontWeight: "500",
      textAlign: "center",
    },
  });
