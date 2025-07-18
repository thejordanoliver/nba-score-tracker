import { StyleSheet, Text, useColorScheme, View } from "react-native";
import HeadingTwo from "../HeadingTwo";
const OSMEDIUM = "Oswald_500Medium";
const OSREGULAR = "Oswald_400Regular";

type Props = {
  linescore: {
    home: string[];
    away: string[];
  };
  homeCode: string;
  awayCode: string;
};

export default function LineScore({ linescore, homeCode, awayCode }: Props) {
  const isDark = useColorScheme() === "dark";
  const textColor = isDark ? "#fff" : "#000";
  const borderColor = isDark ? "#333" : "#ccc";
  const dividerColor = isDark ? "#444" : "#ccc";

  const total = (scores: string[]) =>
    scores.reduce((acc, val) => acc + parseInt(val || "0", 10), 0);

  const homeTotal = total(linescore.home);
  const awayTotal = total(linescore.away);
  const maxQuarters = Math.max(linescore.home.length, linescore.away.length);

const getQuarterLabel = (i: number) => {
  if (i < 4) return `Q${i + 1}`;
  if (i === 4) return "OT";      // First overtime
  return `OT${i - 3}`;           // OT2 for index 5, OT3 for 6, etc.
};

  return (
    <>
      <HeadingTwo>Box Score</HeadingTwo>
      <View style={[styles.container, { borderColor }]}>
        {/* Header */}
        <View style={styles.row}>
          <Text style={[styles.teamCode, { color: "transparent" }]}>-</Text>
          <View style={styles.scoresWrapper}>
            {[...Array(maxQuarters)].map((_, i) => (
              <Text
                key={`q-${i}`}
                style={[styles.header, { color: textColor }]}
              >
                {getQuarterLabel(i)}
              </Text>
            ))}
            <Text style={[styles.header, { color: textColor }]}>Total</Text>
          </View>
        </View>

        {/* Away Row */}
        <View style={styles.row}>
          <Text style={[styles.teamCode, { color: textColor }]}>
            {awayCode}
          </Text>
          <View style={styles.scoresWrapper}>
            {linescore.away.map((score, index) => (
              <Text
                key={`away-${index}`}
                style={[styles.score, { color: textColor }]}
              >
                {score}
              </Text>
            ))}
            <Text style={[styles.totalScore, { color: textColor }]}>
              {awayTotal}
            </Text>
          </View>
        </View>

        {/* Divider */}
        <View style={[styles.divider, { backgroundColor: dividerColor }]} />

        {/* Home Row */}
        <View style={styles.row}>
          <Text style={[styles.teamCode, { color: textColor }]}>
            {homeCode}
          </Text>
          <View style={styles.scoresWrapper}>
            {linescore.home.map((score, index) => (
              <Text
                key={`home-${index}`}
                style={[styles.score, { color: textColor }]}
              >
                {score}
              </Text>
            ))}
            <Text style={[styles.totalScore, { color: textColor }]}>
              {homeTotal}
            </Text>
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    padding: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  teamCode: {
    width: 40,
    fontFamily: OSMEDIUM,
    fontSize: 14,
  },
  scoresWrapper: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "space-between",
  },
  header: {
    fontFamily: OSMEDIUM,
    fontSize: 10,
    opacity: 0.8,
    textAlign: "center",
    flex: 1,
  },
  score: {
    fontFamily: OSREGULAR,
    fontSize: 14,
    textAlign: "center",
    flex: 1,
  },
  totalScore: {
    fontFamily: OSMEDIUM,
    fontSize: 14,
    textAlign: "center",
    flex: 1,
  },
  divider: {
    height: 1,
    width: "100%",
    marginVertical: 4,
  },
});
