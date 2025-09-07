import { FlatList, StyleSheet, Text, useColorScheme, View } from "react-native";
import HeadingTwo from "../Headings/HeadingTwo";

const OSMEDIUM = "Oswald_500Medium";
const OSREGULAR = "Oswald_400Regular";

type Props = {
  linescore: {
    home: string[];
    away: string[];
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

  const total = (scores: string[]) =>
    scores.reduce((acc, val) => acc + parseInt(val || "0", 10), 0);

  const homeTotal = total(linescore.home);
  const awayTotal = total(linescore.away);
  const maxQuarters = Math.max(linescore.home.length, linescore.away.length);

  const getQuarterLabel = (i: number) => {
    if (i < 4) return `Q${i + 1}`;
    if (i === 4) return "OT"; // First overtime
    return `OT${i - 3}`; // OT2 for index 5, OT3 for 6, etc.
  };

  const quarters = [...Array(maxQuarters)].map((_, i) => getQuarterLabel(i));

  return (
    <>
      <View style={[styles.container, { borderColor }]}>
        <HeadingTwo lighter={lighter}>Score Summary</HeadingTwo>
        {/* Header */}
        <View style={styles.row}>
          <Text style={[styles.teamCode, { color: "transparent" }]}>-</Text>
          <FlatList
            data={[...quarters, "Total"]}
            keyExtractor={(item, index) => `header-${index}`}
            horizontal
            scrollEnabled={false}
            renderItem={({ item }) => (
              <Text style={[styles.header, { color: textColor }]}>{item}</Text>
            )}
            contentContainerStyle={styles.scoresWrapper} // 👈 FIXED
          />
        </View>

        {/* Away Row */}
        <View style={styles.row}>
          <Text style={[styles.teamCode, { color: textColor }]}>
            {awayCode}
          </Text>
          <FlatList
            data={[...linescore.away, awayTotal.toString()]}
            keyExtractor={(item, index) => `away-${index}`}
            horizontal
            scrollEnabled={false}
            renderItem={({ item }) => (
              <Text style={[styles.score, { color: textColor }]}>{item}</Text>
            )}
            contentContainerStyle={styles.scoresWrapper} // 👈 FIXED
          />
        </View>

        {/* Divider */}
        <View style={[styles.divider, { backgroundColor: dividerColor }]} />

        {/* Home Row */}
        <View style={styles.row}>
          <Text style={[styles.teamCode, { color: textColor }]}>
            {homeCode}
          </Text>
          <FlatList
            data={[...linescore.home, homeTotal.toString()]}
            keyExtractor={(item, index) => `home-${index}`}
            horizontal
            scrollEnabled={false}
            renderItem={({ item }) => (
              <Text style={[styles.score, { color: textColor }]}>{item}</Text>
            )}
            contentContainerStyle={styles.scoresWrapper} // 👈 FIXED
          />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
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
    paddingLeft: 8,
  },
  scoresWrapper: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-evenly", // 👈 evenly space columns
  },
  header: {
    fontFamily: OSMEDIUM,
    fontSize: 10,
    opacity: 0.8,
    textAlign: "center",
  },
  score: {
    fontFamily: OSREGULAR,
    fontSize: 14,
    textAlign: "center",
  },
  totalScore: {
    fontFamily: OSMEDIUM,
    fontSize: 14,
    textAlign: "center",
  },
  divider: {
    height: 1,
    width: "100%",
    marginVertical: 4,
  },
});
