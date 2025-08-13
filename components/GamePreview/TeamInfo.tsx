import { Image, Text, View } from "react-native";
import { teams } from "@/constants/teams";
import { Fonts } from "@/constants/fonts";

type TeamInfoProps = {
  team?: typeof teams[number];
  teamName: string;
  scoreOrRecord: string | number;
  isWinner: boolean;
  isDark: boolean;
  isGameOver: boolean; // ✅ new prop
};

export default function TeamInfo({
  team,
  teamName,
  scoreOrRecord,
  isWinner,
  isDark,
  isGameOver,
}: TeamInfoProps) {
  // Score opacity logic
  const scoreOpacity =
    !isGameOver // game in progress → full opacity
      ? 1
      : isWinner
      ? 1
      : 0.5; // game over → loser gets 0.5 opacity

  return (
    <View style={{ alignItems: "center" }}>
      <Image
        source={isDark && team?.logoLight ? team.logoLight : team?.logo}
        style={{ width: 80, height: 80, resizeMode: "contain" }}
      />
      <Text
        style={{
          fontSize: 14,
          fontFamily: Fonts.OSREGULAR,
          color: isDark ? "#fff" : "#1d1d1d",
          marginTop: 6,
        }}
      >
        {teamName}
      </Text>
      <Text
        style={{
          fontSize: 30,
          fontFamily: Fonts.OSBOLD,
          color: isDark ? "#fff" : "#000", // solid colors for clarity
          opacity: scoreOpacity, // ✅ apply opacity rule
        }}
      >
        {scoreOrRecord}
      </Text>
    </View>
  );
}
