import { Fonts } from "@/constants/fonts";
import { Image, ImageSourcePropType, Text, View } from "react-native";
import { teams } from "@/constants/teamsNFL";
import NFLLogo from "@/assets/Football/NFL_Logos/NFL.png";

type TeamInfoProps = {
  team?: (typeof teams)[number];
  teamName: string;
  scoreOrRecord: string | number;
  isWinner: boolean;
  isDark: boolean;
  isGameOver: boolean;
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
  const scoreOpacity = !isGameOver
    ? 1
    : isWinner
      ? 1
      : 0.5;

  // Ensure we always pass a valid ImageSourcePropType
  const logo: ImageSourcePropType =
    (isDark && team?.logoLight ? team.logoLight : team?.logo) || NFLLogo;


    
  return (
    <View style={{ alignItems: "center" }}>
      <Image
        source={logo}
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
          opacity: scoreOpacity,
        }}
      >
        {scoreOrRecord}
      </Text>
    </View>
  );
}
