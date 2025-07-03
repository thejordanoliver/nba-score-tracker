// components/FavoriteTeamsList.tsx

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image, Pressable, Text, useColorScheme, View } from "react-native";

type Team = {
  id: string;
  fullName: string;
  logo: any;
  logoLight?: any;
  inverse?: any;
  constantBlack?: string;
  constantLogoLight?: any;
  color?: string;
};

type Props = {
  favoriteTeams: Team[];
  isGridView: boolean;
  styles: any;
    itemWidth?: number; // optional if in list mode
  isCurrentUser: boolean; // NEW

};

const FavoriteTeamsList = ({ favoriteTeams, isGridView, styles, isCurrentUser }: Props) => {
  const router = useRouter();
  const isDark = useColorScheme() === "dark";

  if (favoriteTeams.length === 0) {
    return (
      <Text style={styles.noFavoritesText}>No favorite teams selected.</Text>
    );
  }

  return (
    <>
      <View
        style={[
          isGridView ? styles.teamGrid : {},
          { columnGap: isGridView ? 6 : 0 },
          { rowGap: isGridView ? 8 : 0 },
          { justifyContent: "flex-start" },
        ]}
      >
        {favoriteTeams.map((team) => {
          let city = "";
          let nickname = "";

          if (team.fullName === "Oklahoma City Thunder") {
            city = "OKC";
            nickname = "Thunder";
          } else {
            const splitName = team.fullName.split(" ");
            city = splitName.slice(0, -1).join(" ");
            nickname = splitName.slice(-1).join(" ");
          }

          return (
            <Pressable
              key={team.id}
              style={({ pressed }) => [
                pressed && { opacity: 0.6 },
                isGridView ? { width: "32%" } : { width: "100%" },
              ]}
              onPress={() => router.push(`/team/${team.id}`)}
            >
              <View style={{ width: "100%" }}>
                <View
                  style={[
                    styles.teamItem,
                    {
                      backgroundColor: team.color,
                      flexDirection: isGridView ? "column" : "row",
                      justifyContent: isGridView ? "center" : "flex-start",
                      alignItems: "center",
                      height: isGridView ? 130 : "auto",
                      marginBottom: isGridView ? 4 : 12,
                      paddingHorizontal: isGridView ? 2 : 12,
                      paddingVertical: isGridView ? 20 : 12,
                      borderRadius: 8,
                    },
                  ]}
                >
                  <Image
                    source={
                      isDark && team.logoLight
                        ? team.logoLight
                        : team.logoLight || team.logo
                    }
                    style={[
                      styles.teamLogo,
                      isGridView ? { marginBottom: 8 } : { marginRight: 10 },
                    ]}
                  />
                  {isGridView ? (
                    <View style={{ alignItems: "center" }}>
                      <Text
                        style={[
                          styles.teamName,
                          { fontSize: 14, textAlign: "center" },
                        ]}
                      >
                        {city}
                      </Text>
                      <Text
                        style={[
                          styles.teamName,
                          { fontSize: 14, textAlign: "center", marginTop: 2 },
                        ]}
                      >
                        {nickname}
                      </Text>
                    </View>
                  ) : (
                    <Text
                      style={[
                        styles.teamName,
                        { textAlign: "left", fontSize: 16, marginLeft: 10 },
                      ]}
                    >
                      {team.fullName}
                    </Text>
                  )}
                </View>
              </View>
            </Pressable>
          );
        })}
      </View>

{isCurrentUser && (
  <View style={{ width: "100%" }}>
    <Pressable
      onPress={() => router.push("/edit-favorites")}
      accessibilityRole="button"
      accessibilityLabel="Edit favorite teams"
    >
      <View
        style={[
          styles.editButton,
          {
            flexDirection: isGridView ? "row" : "row",
            justifyContent: "center",
            alignItems: "center",
          },
        ]}
      >
        <Text style={styles.editText}>Edit Teams</Text>
        <Ionicons
          style={styles.editIcon}
          name="create"
          size={20}
          color={isDark ? "#000" : "#fff"}
        />
      </View>
    </Pressable>
  </View>
)}

    </>
  );
};

export default FavoriteTeamsList;
