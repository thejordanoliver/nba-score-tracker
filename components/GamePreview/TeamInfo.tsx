import { Image, Text, View } from "react-native";
import { teams } from "@/constants/teams"; // adjust the path as needed



const OSEXTRALIGHT = "Oswald_200ExtraLight";
const OSLIGHT = "Oswald_300Light";
const OSMEDIUM = "Oswald_500Medium";
const OSREGULAR = "Oswald_400Regular";
const OSBOLD = "Oswald_700Bold";

type TeamInfoProps = {
  team?: typeof teams[number];
  teamName: string;
  scoreOrRecord: string | number;
  isWinner: boolean;
  isDark: boolean;
};

export default function TeamInfo({
  team,
  teamName,
  scoreOrRecord,
  isWinner,
  isDark,
}: TeamInfoProps) {
  const winnerStyle = isWinner
    ? {
        color: isDark ? "#fff" : "#000",
      }
    : {};

  return (
    <View style={{ alignItems: "center" }}>
      <Image
        source={isDark && team?.logoLight ? team.logoLight : team?.logo}
        style={{ width: 80, height: 80, resizeMode: "contain" }}
      />
      <Text
        style={[
          {
            fontSize: 14,
            fontFamily: OSREGULAR,
            color: isDark ? "#aaa" : "rgba(0, 0, 0, 0.4)",
            marginTop: 6,
          },
          winnerStyle,
        ]}
      >
        {teamName}
      </Text>
      <Text
        style={[
          {
            fontSize: 20,
            fontFamily: OSBOLD,
            color: isDark ? "#aaa" : "rgba(0, 0, 0, 0.4)",
          },
          winnerStyle,
        ]}
      >
        {scoreOrRecord}
      </Text>
    </View>
  );
}
