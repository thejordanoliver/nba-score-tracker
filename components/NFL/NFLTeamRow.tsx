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
  status?: string; // 👈 NEW: "Live", "Final", etc.
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
  status,
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

  const handleTeamPress = () => {
    if (!team.id) return;
    router.push(`/team/nfl/${team.id}`);
  };

// 🎯 Replace your current live check + score color logic with this

// Is the game live? (anything that's not final/not started/etc.)
const isLive =
  status &&
  status !== "Not Started" &&
  status !== "Finished" &&
  status !== "Canceled" &&
  status !== "Delayed" &&
  status !== "Postponed" &&
  status !== "Halftime";

// 🎨 Score color logic
const getScoreStyle = () => {
  if (!score && score !== 0) return { color: colors.score };

  // If live → both scores should be pure text colors
  if (isLive) {
    return { color: isDark ? "#fff" : "#1d1d1d" };
  }

  // If final → losing score gets opacity
  if (status === "Final" && !isWinner) {
    return { color: colors.score, opacity: 0.5 };
  }

  // Otherwise → normal styling
  return { color: isWinner ? colors.winnerScore : colors.score };
};

  return (
    <View style={styles.row}>
      {isHome && (
        <Text style={[styles.score, getScoreStyle()]}>{score ?? ""}</Text>
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
        <Text style={[styles.score, getScoreStyle()]}>{score ?? ""}</Text>
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
    fontSize: 32,
    fontFamily: Fonts.OSBOLD,
    width: 60,
    textAlign: "center",
    marginHorizontal: 16,
  },
});
