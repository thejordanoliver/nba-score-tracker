// components/NFLTeamRow.tsx
import { Fonts } from "@/constants/fonts";
import { useRouter } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useNFLStandings } from "@/hooks/useNFLStandings";
import { getTeamInfo } from "@/constants/teamsNFL";

type Props = {
  team: {
    id: string;
    name: string;
    logo: any;
    record?: string;
  };
  isDark: boolean;
  isHome?: boolean;
  score?: number;
  isWinner?: boolean;
  colors: {
    text: string;
    record: string;
    score: string;
    winnerScore: string;
  };
};

export const NFLTeamRow = ({
  team,
  isDark,
  isHome = false,
  score,
  isWinner,
  colors,
}: Props) => {
  const router = useRouter();
  const { standings } = useNFLStandings();

const teamInfo = getTeamInfo(team.id);

// Compare names instead of codes
const teamRecord = standings.find(
  (t) => t.name.toLowerCase().trim() === teamInfo?.name.toLowerCase().trim()
);

const record = teamRecord ? `${teamRecord.won}-${teamRecord.lost}` : "0-0";

console.log("Matching", teamInfo?.name, "| API:", teamRecord?.name);


  const handleTeamPress = () => {
    if (!team.id) return;
    router.push(`/team/nfl/${team.id}`);
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
            {record}
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
    marginVertical: 4,
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
    fontFamily: Fonts.OSREGULAR,
    textAlign: "center",
  },
  record: {
    fontSize: 12,
    fontFamily: Fonts.OSREGULAR,
    textAlign: "center",
  },
  logo: {
    width: 50,
    height: 50,
    resizeMode: "contain",
  },
  score: {
    fontSize: 24,
    fontFamily: Fonts.OSBOLD,
    width: 60,
    textAlign: "center",
    marginHorizontal: 16,
  },
});
