// HomeScreen.styles.ts
import { StyleSheet } from "react-native";

const OSEXTRALIGHT = "Oswald_200ExtraLight";
const OSLIGHT = "Oswald_300Light";
const OSREGULAR = "Oswald_400Regular";
const OSMEDIUM = "Oswald_500Medium";
const OSBOLD = "Oswald_700Bold";
const OSSEMIBOLD = "Oswald_600SemiBold";

export const getStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? "#1d1d1d" : "#fff",
      paddingTop: 16,
    },

    tabBarWrapper: {
      paddingHorizontal: 80,
    },

    contentArea: {
      flex: 1,
    },
    favorites: {
      flexDirection: "row",
      marginBottom: 20,
      paddingBottom: 0,
      paddingTop: 24,
    },
    teamIcon: {
      alignItems: "center",
      marginRight: 16,
      marginBottom: 0,
    },
    logoWrapper: {
      width: 80,
      height: 80,
      borderRadius: 40,
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      borderWidth: 0.5,
      borderColor: "black",
    },
    logo: {
      width: 50,
      height: 50,
      resizeMode: "contain",
    },
    editIcon: {
      backgroundColor: isDark ? "#fff" : "#1d1d1d",
      width: 80,
      height: 80,
      borderRadius: 100,
      justifyContent: "center",
      alignItems: "center",
    },
    teamLabel: {
      marginTop: 4,
      fontSize: 12,
      color: isDark ? "#ccc" : "#1d1d1d",
      fontFamily: OSREGULAR,
    },
    heading: {
      fontSize: 24,
      fontFamily: OSMEDIUM,
      marginBottom: 8,
      marginTop: 8,
      paddingBottom: 4,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? "#444" : "#ccc",
      color: isDark ? "#fff" : "#1d1d1d",
    },
    emptyText: {
      textAlign: "center",
      color: isDark ? "#aaa" : "#999",
      marginTop: 20,
      fontSize: 20,
      fontFamily: OSLIGHT,
    },
  });
