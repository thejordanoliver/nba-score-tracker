// components/NFLPlayerCard.tsx
import { Fonts } from "@/constants/fonts";
import { teams } from "@/constants/teamsNFL";
import { useRouter } from "expo-router";
import React from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";

export interface NFLPlayerCardProps {
  id: number;
  name: string;

  position?: string | null;
  team: string;
  avatarUrl?: string | null;
  number?: string | number | null;
}

export const NFLPlayerCard: React.FC<NFLPlayerCardProps> = ({
  id,
  name,
  position,
  team,
  avatarUrl,
  number,
}) => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const styles = getStyles(isDark);

  const teamObj = teams.find((t) => t.name === team);
  const initial = name?.[0]?.toUpperCase() ?? "?";
  return (
    <Pressable
      style={styles.card}
      onPress={() =>
        router.push({
          pathname: "/player/[id]",
          params: {
            id: id.toString(),
            teamId: teamObj?.id?.toString() ?? "0",
          },
        })
      }
    >
      {avatarUrl ? (
        <Image
          source={{ uri: avatarUrl }}
          style={[styles.avatar, { backgroundColor: isDark ? "#444" : "#ddd" }]}
          accessibilityLabel={`Avatar for ${name}`}
        />
      ) : (
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.initial}>{initial}</Text>
        </View>
      )}
      <View style={styles.info}>
        <View style={styles.nameContainer}>
          <Text
            style={[
              styles.name,
              { color: isDark ? "#fff" : (teamObj?.color ?? "#000") },
            ]}
          >
            {name}
          </Text>
        </View>
        {number != null && (
          <Text
            style={[
              styles.number,
              { color: isDark ? "#fff" : (teamObj?.color ?? "#000") },
            ]}
          >
            #{number}
          </Text>
        )}
      </View>
    </Pressable>
  );
};

const getStyles = (isDark: boolean) =>
  StyleSheet.create({
    card: {
      backgroundColor: isDark ? "#2e2e2e" : "#eee",
      borderRadius: 8,
      paddingHorizontal: 20,
      paddingVertical: 12,
      flexDirection: "row",
      alignItems: "center",
    },
    avatar: {
      width: 50,
      height: 50,
      borderRadius: 30,
    },
    avatarPlaceholder: {
      width: 50,
      height: 50,
      borderRadius: 30,
      backgroundColor: isDark ? "#444" : "#888",
      justifyContent: "center",
      alignItems: "center",
    },
    initial: {
      fontSize: 24,
      color: "#fff",
      fontFamily: Fonts.OSBOLD,
    },
    info: {
      flexDirection: "row", // stack name & position vertically
      marginLeft: 12,
      justifyContent: "space-between",
      alignItems: "flex-start",
      flex: 1,
    },
    nameContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    name: {
      fontSize: 16,
      fontFamily: Fonts.OSBOLD,
      color: isDark ? "red" : "#1d1d1d",
    },
    number: {
      fontSize: 16,
      marginLeft: 6,
      fontFamily: Fonts.OSBOLD,
      color: isDark ? "#fff" : "#1d1d1d",
    },
    position: {
      fontSize: 16,
      color: isDark ? "#fff" : "#1d1d1d",
      fontFamily: Fonts.OSBOLD,
    },
  });

export default NFLPlayerCard;
