import { useRouter } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

const OSREGULAR = "Oswald_400Regular";
const OSBOLD = "Oswald_700Bold";

type Props = {
  team: {
    name: string;
    record?: string; // pass record string like "42-30" from parent
    logo: any;
    code?: string; // for routing
    id?: string; // optional fallback
  };
  isDark: boolean;
  isHome?: boolean;
  score?: number;
  isWinner?: boolean;
  colors: any;
};

export const TeamRow = ({
  team,
  isDark,
  isHome = false,
  score,
  isWinner,
  colors,
}: Props) => {
  const router = useRouter();

  const handleTeamPress = () => {
    const teamParam = team.id?.toString();

    if (!teamParam) {
      console.error("No valid team code or ID to navigate to team screen");
      return;
    }
    console.log("Navigating to team:", teamParam);
    router.push(`/team/${teamParam}`);
  };

  return (
    <View style={styles.row}>
      {isHome && (
        <Text
          style={[
            styles.score,
            { color: isWinner ? colors.winnerScore : colors.score },
          ]}
        >
          {score ?? ""}
        </Text>
      )}

      <View style={styles.teamInfoContainer}>
        <Pressable onPress={handleTeamPress}>
          <Image source={team.logo} style={styles.logo} />
        </Pressable>
        <View style={styles.teamInfo}>
          <Text style={[styles.teamName, { color: colors.text }]}>
            {team.name}
          </Text>
          <Text style={[styles.record, { color: colors.record }]}>
            {team.record ?? ""}
          </Text>
        </View>
      </View>

      {!isHome && (
        <Text
          style={[
            styles.score,
            { color: isWinner ? colors.winnerScore : colors.score },
          ]}
        >
          {score ?? ""}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  teamInfoContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  teamInfo: {
    justifyContent: "center",
  },
  teamName: {
    fontSize: 12,
    fontFamily: OSREGULAR,
    textAlign: "center",
  },
  record: {
    fontSize: 12,
    fontFamily: OSREGULAR,
    textAlign: "center",
  },
  logo: {
    width: 50,
    height: 50,
    resizeMode: "contain",
  },
  score: {
    fontSize: 24,
    fontFamily: OSBOLD,
    width: 60,
    textAlign: "center",
    marginHorizontal: 16,
  },
});
