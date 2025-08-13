// components/GameDetails/Gameuniformss.tsx
import { Fonts } from "@/constants/fonts";
import { teams } from "@/constants/teams";
import { Image } from "expo-image";
import { StyleSheet, Text, useColorScheme, View } from "react-native";
import HeadingTwo from "../Headings/HeadingTwo";
type GameuniformssProps = {
  homeTeamId: string;
  awayTeamId: string;
};

export default function Gameuniformss({
  homeTeamId,
  awayTeamId,
}: GameuniformssProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const homeTeam = teams.find((t) => t.id === homeTeamId);
  const awayTeam = teams.find((t) => t.id === awayTeamId);

  if (!homeTeam || !awayTeam) {
    return (
      <View style={styles.center}>
        <Text style={[styles.errorText, { color: isDark ? "#fff" : "#000" }]}>
          Team data not found
        </Text>
      </View>
    );
  }

  return (
    <>
      <HeadingTwo>Uniform Matchup</HeadingTwo>
      <View style={styles.container}>
        {/* Away Team Away uniforms */}
        <View style={styles.uniformsContainer}>
          <Image
            source={awayTeam.uniforms?.away}
            style={styles.uniformsImage}
          />
          <Text style={[styles.teamName, { color: isDark ? "#fff" : "#000" }]}>
            {awayTeam.name} Away
          </Text>
        </View>

        {/* VS Separator */}
          <Text style={[styles.vs, { color: isDark ? "#fff" : "#000" }]}>vs</Text>

        {/* Home Team Home uniforms */}
        <View style={styles.uniformsContainer}>
          <Image
            source={homeTeam.uniforms?.home}
            style={styles.uniformsImage}
          />
          <Text style={[styles.teamName, { color: isDark ? "#fff" : "#000" }]}>
            {homeTeam.name} Home
          </Text>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    
  },
  uniformsContainer: {
    alignItems: "center",
  },
  uniformsImage: {
    width: 200,
    height: 200,
    resizeMode: "contain",
  },
  teamName: {
    fontFamily: Fonts.OSMEDIUM,
    fontSize: 14,
    marginTop: 6,
  },
  divider: {
    height: "100%",
    width: 1,
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  errorText: {
    fontFamily: Fonts.OSREGULAR,
    fontSize: 14,
  },
    vs: {
    fontFamily: Fonts.OSBOLD,
    fontSize: 24,
    marginHorizontal: 8,
  },
});
