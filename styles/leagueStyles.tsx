// scoresStyles.ts
import { StyleSheet } from "react-native";

export const getScoresStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? "#1d1d1d" : "#fff",
      paddingTop: 16,
    },
    contentArea: {
      flex: 1,
    },
    dateNavContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginVertical: 8,
    },
    dateNavButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      marginHorizontal: 12,
      backgroundColor: isDark ? "white" : "black",
      borderRadius: 6,
    },
    dateNavText: {
      color: isDark ? "black" : "white",
      fontWeight: "normal",
      fontSize: 18,
      fontFamily: "Oswald_500Medium",
    },
    emptyText: {
      textAlign: "center",
      color: isDark ? "#aaa" : "#999",
      marginTop: 20,
      fontSize: 20,
      fontFamily: "Oswald_300Light",
    },
  });
