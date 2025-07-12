import { Image, StyleSheet, Text, View } from "react-native";


const OSEXTRALIGHT = "Oswald_200ExtraLight";
const OSLIGHT = "Oswald_300Light";
const OSREGULAR = "Oswald_400Regular";
const OSMEDIUM = "Oswald_500Medium";
const OSBOLD = "Oswald_700Bold";
const OSSEMIBOLD = "Oswald_600SemiBold";

type Props = {
  player: {
    first_name: string;
    last_name: string;
    college?: string;
    height?: string;
    weight?: string;
    birth_date?: string;
    position?: string;
    jersey_number?: string;
  };
  avatarUrl?: string;
  isDark: boolean;
  teamColor?: string;
  calculateAge: (birthDateString?: string) => number | null;
};

export default function PlayerHeader({
  player,
  avatarUrl,
  isDark,
  teamColor,
  calculateAge,
}: Props) {
  const initial = player?.first_name?.[0]?.toUpperCase() || "?";

  return (
    <View style={styles.playerHeader}>
      <View style={[styles.avatarContainer, { borderRightColor: isDark ? "#444" : "#ddd" }]}>
        {avatarUrl ? (
          <Image
            source={{ uri: avatarUrl }}
            style={[styles.avatar, { backgroundColor: isDark ? "#444" : "#ddd" }]}
            accessibilityLabel={`${player.first_name} ${player.last_name} photo`}
          />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.initial}>{initial}</Text>
          </View>
        )}
        <View style={styles.jerseyNumber}>
          <Text style={[styles.jersey, { color: isDark ? "#fff" : teamColor }]}>
            {player.position?.charAt(0) ?? "N"} #{player.jersey_number ?? "?"}
          </Text>
        </View>
      </View>

      <View style={styles.infoContainer}>
        <Text style={[styles.name, { color: isDark ? "#fff" : teamColor }]}>
          {player.first_name}
        </Text>
        <Text style={[styles.name, { color: isDark ? "#fff" : teamColor }]}>
          {player.last_name}
        </Text>

        <Text style={[styles.playerInfo, { color: isDark ? "#fff" : "#000" }]}>
          <Text style={{ fontFamily: OSMEDIUM, color: isDark ? "#fff" :  teamColor }}>School: </Text>
          {player.college || "Unknown"}
        </Text>

        <Text style={[styles.playerInfo, { color: isDark ? "#fff" : "#000" }]}>
          <Text style={{ fontFamily: OSMEDIUM, color: isDark ? "#fff" :  teamColor }}>Height: </Text>
          {player.height ?? "?"}
        </Text>

        <Text style={[styles.playerInfo, { color: isDark ? "#fff" : "#000" }]}>
          <Text style={{ fontFamily: OSMEDIUM, color: isDark ? "#fff" :  teamColor }}>Weight: </Text>
          {player.weight ?? "?"} lbs
        </Text>

        <Text style={[styles.playerInfo, { color: isDark ? "#fff" : "#000" }]}>
          <Text style={{ fontFamily: OSMEDIUM, color: isDark ? "#fff" :  teamColor }}>Birth: </Text>
          {player.birth_date
            ? `${new Date(player.birth_date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })} (${calculateAge(player.birth_date) ?? "?"} years old)`
            : "Unknown"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  playerHeader: {
    marginTop: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  avatarContainer: {
    marginRight: 20,
    paddingRight: 20,
    borderRightWidth: 1,
    alignItems: "center",
  },
  avatar: {
    width: 140,
    height: 140,
    borderRadius: 70,
  },
  avatarPlaceholder: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#888",
    justifyContent: "center",
    alignItems: "center",
  },
  initial: {
    fontSize: 48,
    color: "#fff",
    fontWeight: "bold",
  },
  jerseyNumber: {
    flexDirection: "row",
    justifyContent: "center",
  },
  jersey: {
    fontSize: 36,
    fontFamily: OSBOLD,
    textAlign: "center",
  },
  infoContainer: {
    justifyContent: "center",
  },
  name: {
    fontSize: 24,
    fontFamily: OSBOLD,
  },
  playerInfo: {
    fontFamily: OSLIGHT,
  },
});
