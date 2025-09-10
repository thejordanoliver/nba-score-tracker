import { Fonts } from "@/constants/fonts";
import { useRouter } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type Props = {
  team: {
    id: string;
    name: string;
    logo: any;
    record?: string; // 👈 record comes from parent
  };
  isDark: boolean;
  isHome?: boolean;
  score?: number;
  isWinner?: boolean;
  status?: string; // "Live", "Final", etc.
  colors: {
    text: string;
    record: string;
    score: string;
    winnerScore: string;
  };
  possessionTeamId?: string;
  size?: number; // 👈 new prop (default 50)
};

export const NFLTeamRow = ({
  team,
  isDark,
  isHome = false,
  score,
  isWinner,
  status,
  colors,
  possessionTeamId,
  size = 50,
}: Props) => {
  const router = useRouter();

  const handleTeamPress = () => {
    if (!team.id) return;
    router.push(`/team/nfl/${team.id}`);
  };

  const isLive =
    status && ["Q1", "Q2", "Q3", "Q4", "OT", "HT"].includes(status);

  const isFinal = status === "Final";
  const isNotStarted = status === "Scheduled";

  const getScoreStyle = () => {
    if (!score && score !== 0) return { color: colors.score };

    if (isLive) {
      return { color: isDark ? "#fff" : "#000" };
    }

    if (isFinal && !isWinner) {
      return { color: colors.score, opacity: 0.5 };
    }

    return { color: isWinner ? colors.winnerScore : colors.score };
  };

  return (
    <View style={styles.row}>
      {isHome && (
        <Text
          style={
            isNotStarted
              ? [
                  styles.preGameRecord,
                  { color: colors.record, fontSize: size * 0.5, width: size + 10 },
                ]
              : [
                  styles.score,
                  getScoreStyle(),
                  { fontSize: size * 0.64, width: size + 10 },
                ]
          }
        >
          {isNotStarted ? team.record ?? "0-0" : score ?? "0-0"}
        </Text>
      )}

      <View style={styles.teamInfoContainer}>
        <Pressable onPress={handleTeamPress}>
          <Image source={team.logo} style={{ width: size, height: size, resizeMode: "contain" }} />
        </Pressable>
        <View style={styles.teamInfo}>
          <View style={styles.nameRow}>
            <Text style={[styles.teamName, { color: colors.text, fontSize: size * 0.25 }]}>
              {team.name}
            </Text>
            {isLive && possessionTeamId === team.id && (
              <MaterialCommunityIcons
                name="football"
                size={size * 0.3}
                color={isDark ? "#fff" : "#000"}
                style={{ marginLeft: 4 }}
              />
            )}
          </View>
          {isFinal && (
            <Text
              style={[
                styles.record,
                { color: colors.record, fontSize: size * 0.24 },
              ]}
            >
              {team.record ?? "0-0"}
            </Text>
          )}
        </View>
      </View>

      {!isHome && (
        <Text
          style={
            isNotStarted
              ? [
                  styles.preGameRecord,
                  { color: colors.record, fontSize: size * 0.5, width: size + 10 },
                ]
              : [
                  styles.score,
                  getScoreStyle(),
                  { fontSize: size * 0.64, width: size + 10 },
                ]
          }
        >
          {isNotStarted ? team.record ?? "0-0" : score ?? "0-0"}
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
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  teamName: {
    fontFamily: Fonts.OSREGULAR,
    textAlign: "center",
  },
  record: {
    fontFamily: Fonts.OSREGULAR,
    textAlign: "center",
  },
  score: {
    fontFamily: Fonts.OSBOLD,
    textAlign: "center",
    marginHorizontal: 16,
  },
  preGameRecord: {
    fontFamily: Fonts.OSBOLD,
    textAlign: "center",
    marginHorizontal: 16,
  },
});
