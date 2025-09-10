import { Fonts } from "@/constants/fonts";
import { getNFLTeamsLogo } from "@/constants/teamsNFL";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";
import HeadingTwo from "../Headings/HeadingTwo";

type Injury = {
  status: string;
  date: string;
  athlete: {
    id: string;
    displayName: string;
    position?: { displayName: string; abbreviation: string };
    headshot?: { href: string };
    jersey?: string;
  };
  details?: {
    type?: string;
    location?: string;
    returnDate?: string;
  };
};

type TeamInjuries = {
  team: {
    id: string;
    displayName: string;
    abbreviation: string;
    logo?: string;
  };
  injuries: Injury[];
};

type Props = {
  injuries: TeamInjuries[];
  loading: boolean;
  error: any;
};

export default function NFLInjuries({ injuries, loading, error }: Props) {
  const isDark = useColorScheme() === "dark";
  const styles = getStyles(isDark);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="small" />
        <Text style={styles.loadingText}>Loading injuries...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Failed to load injuries</Text>
      </View>
    );
  }

  if (!injuries || injuries.length === 0) return null;

  const renderInjury = ({ item }: { item: Injury }) => {
    const player = item.athlete;
    return (
      <View style={styles.card}>
        <View style={styles.row}>
          {player?.headshot?.href ? (
            <Image
              source={{ uri: player.headshot.href }}
              style={styles.headshot}
            />
          ) : (
            <View style={styles.placeholder} />
          )}
          <View style={{ flex: 1 }}>
            <View style={styles.playerInfo}>
              <Text style={styles.name}>
                {player?.displayName ?? "Unknown Player"}{" "}
              </Text>
              <Text style={styles.jersey}>
                {player?.jersey ? `#${player.jersey}` : ""}
              </Text>
            </View>
            <Text style={styles.position}>
              {player?.position?.displayName ?? "—"}
            </Text>
            {item.details?.type && (
              <View style={styles.bottom}>
                <Text style={styles.status}>{item.status}</Text>
                <View style={styles.divder}></View>
                <Text style={styles.detail}>
                  {item.details.type} — {item.details.location ?? "N/A"}
                </Text>
              </View>
            )}
          </View>
          {item.details?.returnDate && (
            <View style={styles.bottom}>
              <Text style={styles.returnDate}>
                Return: {new Date(item.details.returnDate).toLocaleDateString()}
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  const renderTeam = ({ item }: { item: TeamInjuries }) => {
    const teamLogo = getNFLTeamsLogo(item.team.abbreviation, isDark);

    return (
      <View style={styles.teamBlock}>
        <View style={styles.teamHeader}>
          {teamLogo && <Image source={teamLogo} style={styles.teamLogo} />}
          <Text style={styles.teamName}>{item.team.displayName}</Text>
        </View>

        <FlatList
          data={item.injuries}
          renderItem={renderInjury}
          keyExtractor={(inj) => inj.athlete.id}
          scrollEnabled={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={injuries}
        renderItem={renderTeam}
        ListHeaderComponent={<HeadingTwo>Injuries</HeadingTwo>}
        keyExtractor={(team) => team.team.id}
        scrollEnabled={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

const getStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: { marginTop: 20, borderRadius: 8 },
    card: {
      paddingHorizontal: 12,
      borderRadius: 8,
      backgroundColor: isDark ? "#2e2e2e" : "#eee",
      height: 88,
      justifyContent: "center",
    },
    row: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
    headshot: {
      width: 50,
      height: 50,
      borderRadius: 25,
      marginRight: 10,
      backgroundColor: isDark ? "#444" : "#ccc",
    },
    placeholder: {
      width: 50,
      height: 50,
      borderRadius: 25,
      marginRight: 10,
      backgroundColor: "#ccc",
    },
    playerInfo: {
      flexDirection: "row",
      alignItems: "flex-end",
    },
    name: {
      fontSize: 16,
      fontFamily: Fonts.OSMEDIUM,
      color: isDark ? "#fff" : "#000",
    },
    jersey: {
      fontSize: 12,
      fontFamily: Fonts.OSMEDIUM,
      color: isDark ? "#aaa" : "#555",
    },
    position: {
      fontSize: 14,
      fontFamily: Fonts.OSREGULAR,
      color: isDark ? "#aaa" : "#555",
      marginBottom: 4,
    },
    status: { fontSize: 14, fontFamily: Fonts.OSSEMIBOLD, color: "#d9534f" },
    detail: {
      fontSize: 13,
      fontFamily: Fonts.OSREGULAR,
      color: isDark ? "#ccc" : "#444",
    },
    returnDate: {
      marginTop: 2,
      fontSize: 13,
      fontFamily: Fonts.OSREGULAR,
      color: "#888",
    },
    separator: { height: 10 },
    loadingText: { marginTop: 8, fontSize: 14, color: "#333" },
    errorText: { fontSize: 14, color: "red" },
    teamBlock: { marginTop: 16 },
    teamHeader: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
    teamLogo: { width: 28, height: 28, marginRight: 8 },
    teamName: {
      fontSize: 16,
      fontFamily: Fonts.OSSEMIBOLD,
      color: isDark ? "#fff" : "#000",
    },
    bottom: { flexDirection: "row", alignItems: "center" },
    divder: {
      width: 1,
      height: 16,
      backgroundColor: isDark ? "#888" : "#aaa",
      marginHorizontal: 4,
    },
  });
