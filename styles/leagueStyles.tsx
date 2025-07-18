// scoresStyles.ts
import { StyleSheet } from "react-native";

const OSEXTRALIGHT = "Oswald_200ExtraLight";
const OSLIGHT = "Oswald_300Light";
const OSREGULAR = "Oswald_400Regular";
const OSMEDIUM = "Oswald_500Medium";
const OSBOLD = "Oswald_700Bold";
const OSSEMIBOLD = "Oswald_600SemiBold";

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

    sectionHeading: {
      fontSize: 18,
      fontWeight: "600",
      marginLeft: 12,
      marginTop: 16,
      marginBottom: 8,
      color: isDark ? "#fff" : "#000",
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
      fontFamily: OSMEDIUM,
    },
    emptyText: {
      textAlign: "center",
      color: isDark ? "#aaa" : "#999",
      marginTop: 20,
      fontSize: 20,
      fontFamily: OSLIGHT,
    },
  });
