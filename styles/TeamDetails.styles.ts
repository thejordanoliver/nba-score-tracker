// TeamDetailScreen.styles.ts
import { StyleSheet } from "react-native";

export const style = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? "#1d1d1d" : "#fff",
    },
    header: {
      alignItems: "center",
      justifyContent: "center",
      height: 80,
    },
    imagecontainer: {
      position: "absolute",
      flexDirection: "row",
      alignSelf: "center",
      overflow: "hidden",
      zIndex: -1,
      top: 0,
      width: "100%",
      height: 80,
    },

    tabBarContainer: {
      position: "absolute",
      top: 10,
      left: 0,
      right: 0,
      alignItems: "center",
      zIndex: 2, // ensure it renders on top of background
    },

    monthSelector: {
      flexDirection: "row",
      paddingHorizontal: 0,
      backgroundColor: isDark ? "#1d1d1d" : "#fff",
    },
    monthButton: {
      paddingVertical: 12,
      paddingHorizontal: 16,
      marginHorizontal: 6,
    },
    monthButtonSelected: {
      backgroundColor: "transparent",
    },
    monthText: {
      fontFamily: "Oswald_400Regular",
      fontSize: 20,
      color: isDark ? "#aaa" : "#777",
    },
    monthTextSelected: {
      fontFamily: "Oswald_700Bold",
      color: isDark ? "#fff" : "#000",
    },
    logo: {
      width: "50%",
      height: "100%",
      resizeMode: "cover",
      alignItems: "center",
      opacity: 0.5,
    },
    teamName: {
      fontSize: 28,
      fontFamily: "Oswald_500Medium",
    },
    sectionHeader: {
      fontSize: 22,
      fontWeight: "600",
      marginTop: 20,
      marginHorizontal: 16,
    },
    text: {
      fontSize: 16,
      marginHorizontal: 16,
      marginVertical: 4,
      color: isDark ? "#fff" : "#000",
    },
    gamesContainer: {
      marginHorizontal: 16,
      marginVertical: 8,
    },
    newsContainer: {
      marginHorizontal: 16,
      marginVertical: 8,
    },
    dateSelectorContainer: {
      flexDirection: "row",
      justifyContent: "center",
      marginVertical: 8,
    },
    arrowButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      backgroundColor: isDark ? "#333" : "black",
      borderRadius: 6,
      marginHorizontal: 12,
    },
    arrowIcon: {
      width: 20,
      height: 20,
      tintColor: "white",
    },
    dateButton: {
      paddingHorizontal: 24,
      paddingVertical: 8,
      borderRadius: 6,
      backgroundColor: isDark ? "#444" : "#222",
      justifyContent: "center",
      alignItems: "center",
    },
    dateText: {
      color: "white",
      fontWeight: "600",
      fontSize: 18,
    },
  });
