import { ReactNode } from "react";
import { Image, Text, View } from "react-native";
import { teams, teamsById } from "../constants/teams";
const OSMEDIUM = "Oswald_500Medium";
const OSREGULAR = "Oswald_400Regular";

type TeamColors = {
  id?: string | number;
  fullName?: string;
  color?: string;
  secondaryColor?: string;
  constantLight?: string;
  constantTextLight?: string;
  constantBlack?: string;
};

type Props = {
  label: string;
  value: string | number | ReactNode;
  image?: any;
  isDark: boolean;
  team: TeamColors;
  teamId?: string;
  teamName?: string;
  backgroundColor?: string; // add this
};

export default function InfoCard({
  label,
  value,
  image,
  isDark,
  team,
  teamId,
  teamName,
  backgroundColor,
}: Props) {
  // Look up full team object if needed
  let teamObj: TeamColors | undefined;

  if (teamId && teamsById[teamId]) {
    teamObj = teamsById[teamId];
  }

  if (!teamObj && teamName) {
    teamObj = teams.find(
      (t) => t.fullName.toLowerCase() === teamName.toLowerCase()
    );
  }

  if (!teamObj && team.fullName) {
    teamObj = teams.find(
      (t) => t.fullName.toLowerCase() === team.fullName?.toLowerCase()
    );
  }

  if (!teamObj) {
    teamObj = team; // fallback
  }

  const textColor = "#fff";

  const isConferenceChampionships = label === "Conference Championships";

  return (
    <>
      <Text
        style={{
          color: isDark ? "#fff" : "#1d1d1d",
          fontFamily: OSMEDIUM,
          fontSize: 20,
          paddingBottom: 4,
          marginBottom: 8,
          borderBottomWidth: 0.5,
          borderBottomColor: isDark
            ? "#ccc"
            : "#444",
        }}
      >
        {label}
      </Text>

      <View
        style={{
          flexDirection: "row",
          alignItems: isConferenceChampionships ? "flex-start" : "center",
          backgroundColor,
          borderRadius: 8,
          paddingHorizontal: 16,
          paddingVertical: 12,
          marginBottom: 12,
          width: "100%",
          minHeight: 80,
          flexWrap: isConferenceChampionships ? "wrap" : "nowrap",
        }}
      >
        {image && (
          <View
            style={{
              borderRadius: 100,
              justifyContent: "center",
              alignItems: "center",
              marginRight: 12,
              overflow: "hidden",
            }}
          >
            <Image
              source={image}
              style={{
                width: 50,
                height: 50,
                resizeMode: "contain",
                backgroundColor: isDark ? "#fff" : "#fff", // fallback background color or pass a prop
              }}
            />
          </View>
        )}
        <Text
          style={{
            fontFamily: OSREGULAR,
            fontSize: 16,
            color: textColor,
            flexShrink: 1,
            flex: 1,
            flexWrap: isConferenceChampionships ? "wrap" : "nowrap",
          }}
        >
          {value}
        </Text>
      </View>
    </>
  );
}
