import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function GameCardSkeleton() {
  const isDark = useColorScheme() === "dark";
  const styles = getStyles(isDark);

  // Animated value for shimmer translation
  const shimmerTranslate = useRef(new Animated.Value(-SCREEN_WIDTH)).current;

  useEffect(() => {
    // Loop shimmer animation from left to right
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerTranslate, {
          toValue: SCREEN_WIDTH,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerTranslate, {
          toValue: -SCREEN_WIDTH,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [shimmerTranslate]);

  return (
    <View style={styles.card}>
      {/* Skeleton shapes */}
      <View style={styles.teamSection}>
        <View style={styles.logoSkeleton} />
        <View style={styles.nameSkeleton} />
      </View>

      <View style={styles.scoreSkeleton} />

      <View style={styles.info}>
        <View style={styles.dateSkeleton} />
        <View style={styles.timeSkeleton} />
      </View>

      <View style={styles.scoreSkeleton} />

      <View style={styles.teamSection}>
        <View style={styles.logoSkeleton} />
        <View style={styles.nameSkeleton} />
      </View>

      {/* Shimmer overlay */}
      <Animated.View
        style={[
          styles.shimmer,
          {
            transform: [{ translateX: shimmerTranslate }],
          },
        ]}
      />
    </View>
  );
}

const getStyles = (isDark: boolean) =>
  StyleSheet.create({
    card: {
      flexDirection: "row",
      backgroundColor: isDark ? "#444" : "#ddd",
      borderRadius: 10,
      paddingVertical: 14,
      paddingHorizontal: 20,
      marginVertical: 8,
      alignItems: "center",
      justifyContent: "space-between",
      overflow: "hidden", // important for shimmer clipping
    },
    teamSection: {
      alignItems: "center",
      width: 60,
    },
    logoSkeleton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: isDark ? "#666" : "#bbb",
      marginBottom: 6,
    },
    nameSkeleton: {
      width: 40,
      height: 12,
      borderRadius: 4,
      backgroundColor: isDark ? "#666" : "#bbb",
    },
    scoreSkeleton: {
      width: 40,
      height: 24,
      borderRadius: 6,
      backgroundColor: isDark ? "#666" : "#bbb",
    },
    info: {
      alignItems: "center",
      justifyContent: "center",
      width: 70,
    },
    dateSkeleton: {
      width: 50,
      height: 14,
      borderRadius: 6,
      backgroundColor: isDark ? "#666" : "#bbb",
      marginBottom: 6,
    },
    timeSkeleton: {
      width: 80,
      height: 12,
      borderRadius: 6,
      backgroundColor: isDark ? "#666" : "#bbb",
    },
    shimmer: {
      position: "absolute",
      top: 0,
      bottom: 0,
      width: 80, // width of the shimmer highlight
      backgroundColor: isDark
        ? "rgba(255,255,255,0.15)"
        : "rgba(255,255,255,0.4)", // light translucent white
      opacity: 0.7,
      borderRadius: 10,
      // Adding some rotation to the shimmer for a nice angle effect
      transform: [{ rotate: "45deg" }],
    },
  });
