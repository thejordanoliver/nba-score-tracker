import React from "react";
import { View, StyleSheet, useColorScheme } from "react-native";
import ShimmerPlaceholder from "react-native-shimmer-placeholder";

export default function NewsCardSkeleton() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const styles = getStyles(isDark);

  return (
    <View style={styles.card}>
      <ShimmerPlaceholder
        shimmerStyle={styles.titlePlaceholder}
        isInteraction={false}
        shimmerColors={
          isDark ? ["#3a3a3a", "#4a4a4a", "#3a3a3a"] : ["#ccc", "#ddd", "#ccc"]
        }
      />
      <ShimmerPlaceholder
        shimmerStyle={styles.sourcePlaceholder}
        isInteraction={false}
        shimmerColors={
          isDark ? ["#3a3a3a", "#4a4a4a", "#3a3a3a"] : ["#ccc", "#ddd", "#ccc"]
        }
      />
    </View>
  );
}

const getStyles = (isDark: boolean) =>
  StyleSheet.create({
    card: {
      backgroundColor: isDark ? "#2e2e2e" : "#eee",
      padding: 12,
      marginTop: 12,
      borderRadius: 8,
    },
    titlePlaceholder: {
      width: "90%",
      height: 20,
      borderRadius: 4,
      marginBottom: 8,
    },
    sourcePlaceholder: {
      width: "40%",
      height: 14,
      borderRadius: 4,
    },
  });
