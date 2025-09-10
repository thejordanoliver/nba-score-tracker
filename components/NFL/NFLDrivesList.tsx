// components/NFL/NFLDrivesList.tsx
import { Fonts } from "@/constants/fonts";
import { getNFLTeamsLogo } from "@/constants/teamsNFL";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";

export type Drive = {
  id: string;
  description: string;
  result: string;
  shortDisplayResult: string;
  offensivePlays: number;
  yards: number;
  team: {
    displayName: string;
    shortDisplayName: string;
    abbreviation: string;
  };
};

type Props = {
  previousDrives: Drive[];
  currentDrives: Drive[];
  loading?: boolean;
  error?: string | null;
};

export default function NFLDrivesList({
  previousDrives,
  currentDrives,
  loading,
  error,
}: Props) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const styles = getStyles(isDark);

  const drives = [...currentDrives, ...previousDrives]; // current first, then history

  // If loading, show loading text
  if (loading) return <Text style={styles.emptyText}>Loading drives...</Text>;

  // If error, show error text
  if (error) return <Text style={styles.emptyText}>{error}</Text>;

  // If no drives, render nothing
  if (!drives || drives.length === 0) return null;

  return (
    <ScrollView style={{ height: 400 }}>
      <FlatList
        data={drives}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        scrollEnabled={false}
   renderItem={({ item }) => {
  const teamLogo = getNFLTeamsLogo(item.team.abbreviation, isDark);

  // Safely handle missing result
  const resultUpper = (item.result ?? "").toUpperCase();

  let resultColor = isDark ? "#aaa" : "#444"; // default
  if (resultUpper.includes("PUNT")) resultColor = isDark ? "#ff9100ff" : "#de7e00ff";
  else if (
    resultUpper.includes("INT") ||
    resultUpper.includes("FUMBLE") ||
    resultUpper.includes("MISSED FG") ||
    resultUpper.includes("DOWNS")
  )
    resultColor = isDark ? "#ff4444" : "#cc0000";
  else if (resultUpper.includes("TD") || resultUpper.includes("FG"))
    resultColor = isDark ? "#00ff00" : "#008800";

  return (
    <View style={styles.driveCard}>
      <View style={styles.headerRow}>
        <Image style={styles.teamLogo} source={teamLogo} />
        <Text style={styles.driveTeam}>{item.team.shortDisplayName}</Text>
      </View>
      <Text style={styles.driveDescription}>{item.description}</Text>
      <Text style={[styles.driveDetail, { color: resultColor }]}>
        Result: {item.result ?? "N/A"}
      </Text>
    </View>
  );
}}

      />
    </ScrollView>
  );
}

const getStyles = (isDark: boolean) =>
  StyleSheet.create({
    listContainer: {
      paddingVertical: 8,
      gap: 12,
    },
    driveCard: {
      backgroundColor: isDark ? "#2e2e2e" : "#eee",
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 8,
    },
    headerRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 6,
    },
    teamLogo: {
      width: 28,
      height: 28,
      marginRight: 8,
    },
    driveDescription: {
      fontSize: 12,
      fontFamily: Fonts.OSREGULAR,
      color: isDark ? "#fff" : "#1d1d1d",
    },
    driveDetail: {
      fontSize: 12,
      color: isDark ? "#aaa" : "#444",
      marginTop: 2,
      fontFamily: Fonts.OSREGULAR,
    },
    driveTeam: {
      fontSize: 15,
      fontFamily: Fonts.OSBOLD,
      color: isDark ? "#fff" : "#1d1d1d",
    },
    emptyText: {
      fontSize: 16,
      color: "#888",
      textAlign: "center",
      marginTop: 20,
      fontFamily: Fonts.OSBOLD,
    },
  });
