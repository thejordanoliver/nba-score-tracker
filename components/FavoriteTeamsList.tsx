// components/FavoriteTeamsList.tsx
import type { Team } from "@/types/types"; // adjust the import path as needed
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Image, Pressable, Text, useColorScheme, View } from "react-native";
import { LongPressGestureHandler, State } from "react-native-gesture-handler";
import TeamPreviewModal from "./TeamPreviewModal";

const API_URL = process.env.EXPO_PUBLIC_URL;

type Props = {
  favoriteTeams: Team[];
  isGridView: boolean;
  styles: any;
  itemWidth?: number;
  isCurrentUser: boolean;
  username?: string; // add username prop
};

const FavoriteTeamsList = ({
  favoriteTeams,
  isGridView,
  styles,
  isCurrentUser,
  username, // <-- new prop
}: Props) => {
  const router = useRouter();
  const isDark = useColorScheme() === "dark";
  const [favorites, setFavorites] = useState<Team[]>(favoriteTeams);

  const [previewTeam, setPreviewTeam] = useState<Team | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleLongPress = (team: Team) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setPreviewTeam(team);
    setModalVisible(true);
  };

  const handleGoToTeam = () => {
    if (previewTeam) {
      router.push(`/team/${previewTeam.id}`);
      setModalVisible(false);
    }
  };

  const handleRemoveFavorite = async (teamId: string) => {
    if (username == null) {
      console.log("Username is null or undefined");
    } else {
      console.log("Username:", username);
    }

    const updated = favorites.filter((team) => team.id !== teamId);
    setFavorites(updated);
    const idsOnly = updated.map((team) => team.id);
    await AsyncStorage.setItem("favorites", JSON.stringify(idsOnly));
    if (username) {
      await axios.patch(`${API_URL}/api/users/${username}/favorites`, {
        favorites: idsOnly,
      });
    }
  };

  useEffect(() => {
    setFavorites(favoriteTeams);
  }, [favoriteTeams]);

  return (
    <>
      <TeamPreviewModal
        visible={modalVisible}
        team={previewTeam}
        onClose={() => setModalVisible(false)}
        onGo={handleGoToTeam}
        onRemove={handleRemoveFavorite}
      />

      <View
        style={[
          isGridView ? styles.teamGrid : {},
          { columnGap: isGridView ? 6 : 0 },
          { rowGap: isGridView ? 8 : 0 },
          { justifyContent: "flex-start" },
        ]}
      >
        {favorites.map((team) => {
          const split = team.fullName.split(" ");
          const city = split.slice(0, -1).join(" ");
          const nickname = split.at(-1) || "";

          return (
            <LongPressGestureHandler
              key={team.id}
              minDurationMs={300}
              onHandlerStateChange={({ nativeEvent }) => {
                if (nativeEvent.state === State.ACTIVE) {
                  handleLongPress(team);
                }
              }}
            >
              <Pressable
                onPress={() => router.push(`/team/${team.id}`)}
                style={({ pressed }) => [
                  pressed && { opacity: 0.6 },
                  isGridView ? { width: "32%" } : { width: "100%" },
                ]}
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
                        marginBottom: isGridView ? 0 : 8,
                        paddingHorizontal: 12,
                        paddingVertical: isGridView ? 20 : 12,
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
                            { fontSize: 12, textAlign: "center" },
                          ]}
                        >
                          {city}
                        </Text>
                        <Text
                          style={[
                            styles.teamName,
                            {
                              fontSize: 12,
                              textAlign: "center",
                              marginTop: 2,
                            },
                          ]}
                        >
                          {nickname}
                        </Text>
                      </View>
                    ) : (
                      <Text
                        style={[
                          styles.teamName,
                          {
                            textAlign: "left",
                            fontSize: 14,
                            marginLeft: 10,
                          },
                        ]}
                      >
                        {team.fullName}
                      </Text>
                    )}
                  </View>
                </View>
              </Pressable>
            </LongPressGestureHandler>
          );
        })}
      </View>

      {isCurrentUser && (
        <View style={{ width: "100%" }}>
          <Pressable onPress={() => router.push("/edit-favorites")}>
            <View
              style={[
                styles.editButton,
                {
                  flexDirection: "row",
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
