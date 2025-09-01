import { Fonts } from "@/constants/fonts";
import { teams } from "@/constants/teams";
import { Image, Text, View } from "react-native";

type TeamInfoProps = {
  team?: (typeof teams)[number];
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
  const scoreOpacity = !isGameOver // game in progress → full opacity
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
          color: "#fff",
          marginTop: 6,
        }}
      >
        {teamName}
      </Text>
      <Text
        style={{
          fontSize: 30,
          fontFamily: Fonts.OSBOLD,
            color: "#fff",
          opacity: scoreOpacity, // ✅ apply opacity rule
        }}
      >
        {scoreOrRecord}
      </Text>
    </View>
  );
}
