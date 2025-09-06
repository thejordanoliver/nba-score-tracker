import { Fonts } from "@/constants/fonts";
import { StyleSheet, Text, useColorScheme, View } from "react-native";
import HeadingTwo from "../Headings/HeadingTwo";

type Props = {
  linescore: {
    home: (string | null | undefined)[];
    away: (string | null | undefined)[];
  };
  homeCode: string;
  awayCode: string;
  lighter?: boolean; // new prop to force lighter colors
};

export default function LineScore({
  linescore,
  homeCode,
  awayCode,
  lighter,
}: Props) {
  if (!linescore || !linescore.home || !linescore.away) return null;

  const isDark = useColorScheme() === "dark";
  const textColor = lighter ? "#ccc" : isDark ? "#fff" : "#000";
  const borderColor = lighter ? "#aaa" : isDark ? "#333" : "#888";
  const dividerColor = lighter ? "#bbb" : isDark ? "#888" : "#888";

  const total = (scores: (string | null | undefined)[]) =>
    scores.reduce((acc, val) => acc + parseInt(val ?? "0", 10), 0);

  const homeTotal = total(linescore.home);
  const awayTotal = total(linescore.away);
  const maxQuarters = Math.max(linescore.home.length, linescore.away.length);

  const getQuarterLabel = (i: number) => {
    if (i < 4) return `Q${i + 1}`;
    if (i === 4) return "OT"; // First overtime
    return `OT${i - 3}`; // OT2 for index 5, OT3 for 6, etc.
  };

  const renderScore = (score: string | null | undefined) => score ?? "0";

  return (
    <>
      <HeadingTwo lighter={lighter}>Score Summary</HeadingTwo>
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
                {renderScore(score)}
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
                {renderScore(score)}
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
    marginTop: -20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  teamCode: {
    width: 40,
    fontFamily: Fonts.OSMEDIUM,
    fontSize: 14,
    paddingLeft: 8,
  },
  scoresWrapper: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "space-between",
  },
  header: {
    fontFamily: Fonts.OSMEDIUM,
    fontSize: 10,
    opacity: 0.8,
    textAlign: "center",
    flex: 1,
  },
  score: {
    fontFamily: Fonts.OSREGULAR,
    fontSize: 14,
    textAlign: "center",
    flex: 1,
  },
  totalScore: {
    fontFamily: Fonts.OSMEDIUM,
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
