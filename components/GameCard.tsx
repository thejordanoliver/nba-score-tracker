import { Image, StyleSheet, Text, View, useColorScheme } from "react-native";

type Team = {
  name: string;
  logo: string;
  record: string;
};

type Game = {
  home: Team;
  away: Team;
  date: string;
  time: string;
  channel: string;
};

export default function GameCard({
  game,
  isDark,
}: {
  game: Game;
  isDark?: boolean;
}) {
  // If you want, you can get dark mode from system if no prop passed
  const colorScheme = useColorScheme();
  const dark = isDark ?? colorScheme === "dark";

  const styles = getStyles(dark);

  return (
    <View style={styles.card}>
      <View style={styles.teamSection}>
        <Image source={{ uri: game.home.logo }} style={styles.logo} />
        <Text style={styles.teamName}>{game.home.name}</Text>
      </View>
      <Text style={styles.teamRecord}>{game.home.record}</Text>

      <View style={styles.info}>
        <Text style={styles.date}>{game.date}</Text>
        <Text style={styles.time}>{game.time}</Text>
      </View>

      <Text style={styles.teamRecord}>{game.away.record}</Text>
      <View style={styles.teamSection}>
        <Image source={{ uri: game.away.logo }} style={styles.logo} />
        <Text style={styles.teamName}>{game.away.name}</Text>
      </View>
    </View>
  );
}

const getStyles = (isDark: boolean) =>
  StyleSheet.create({
    card: {
      flexDirection: "row",
      backgroundColor: isDark ? "#2e2e2e" : "#eee",
      borderRadius: 10,
      paddingVertical: 14,
      paddingHorizontal: 20,
      marginVertical: 12,
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
      marginTop: 4,
      fontFamily: "Oswald_400Regular",
      fontSize: 12,
      color: isDark ? "#fff" : "#000",
      textAlign: "center",
    },

    teamRecord: {
      fontSize: 12,
      fontFamily: "Oswald_400Regular",
      color: isDark ? "#aaa" : "#444",
      width: 40,
      textAlign: "center",
    },

    info: {
      alignItems: "center",
      justifyContent: "center",
      width: 70,
    },

    date: {
      fontFamily: "Oswald_500Medium",
      color: isDark ? "#fff" : "#000",
      fontSize: 14,
    },

    time: {
      fontFamily: "Oswald_500Medium",
      color: isDark ? "#aaa" : "#555",
      fontSize: 12,
      marginTop: 2,
    },
  });
