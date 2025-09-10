// components/NFL/FixedWidthTabBar.tsx
import { Fonts } from "@/constants/fonts";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  LayoutChangeEvent,
  Pressable,
  StyleSheet,
  Text,
  TextStyle,
  View,
  useColorScheme,
} from "react-native";

export interface FixedWidthTabBarProps {
  tabs: readonly string[];
  selected: string;
  onTabPress: (tab: string) => void;
  renderLabel?: (tab: string, isSelected: boolean) => React.ReactNode;
}

// 🔑 exported helper so you can reuse it in NFLTeamDrives
export const getLabelStyle = (
  isDark: boolean,
  isSelected: boolean,
  extra?: TextStyle
): TextStyle => ({
  fontSize: 16,
  color: isSelected
    ? isDark
      ? "#fff"
      : "#1d1d1d"
    : isDark
      ? "#888"
      : "rgba(0, 0, 0, 0.5)",
  fontFamily: Fonts.OSMEDIUM,
  ...extra,
});

export default function FixedWidthTabBar({
  tabs,
  selected,
  onTabPress,
  renderLabel,
}: FixedWidthTabBarProps) {
  const isDark = useColorScheme() === "dark";

  const underlineX = useRef(new Animated.Value(0)).current;
  const [containerWidth, setContainerWidth] = useState(0);

  const safeTabs = (tabs ?? []).filter(
    (t): t is string => typeof t === "string" && t.trim().length > 0
  );

  const tabWidth = containerWidth / (safeTabs.length || 1);

  useEffect(() => {
    const index = safeTabs.indexOf(selected);
    if (index >= 0) {
      Animated.timing(underlineX, {
        toValue: index * tabWidth,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  }, [selected, tabWidth, safeTabs]);

  const handleLayout = (e: LayoutChangeEvent) => {
    setContainerWidth(e.nativeEvent.layout.width);
  };

  return (
    <View onLayout={handleLayout} style={styles.tabContainer}>
      <View style={styles.tabs}>
        {safeTabs.map((tab) => {
          if (!tab || typeof tab !== "string") return null;
          const isSelected = selected === tab;
          return (
            <Pressable
              key={tab}
              onPress={() => onTabPress(tab)}
              style={[
                styles.tabPressable,
                { width: `${100 / safeTabs.length}%` },
              ]}
            >
              {renderLabel ? (
                renderLabel(tab, isSelected)
              ) : (
                <Text style={getLabelStyle(isDark, isSelected)}>
                  {tab.toUpperCase()}
                </Text>
              )}
            </Pressable>
          );
        })}
      </View>

      {containerWidth > 0 && safeTabs.length > 0 && (
        <Animated.View
          style={[
            styles.underline,
            {
              width: tabWidth,
              backgroundColor: isDark ? "#fff" : "#1d1d1d",
              transform: [{ translateX: underlineX }],
            },
          ]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    position: "relative",
    width: "100%",
  },
  tabs: {
    flexDirection: "row",
  },
  tabPressable: {
    alignItems: "center",
    paddingBottom: 10,
  },
  underline: {
    position: "absolute",
    bottom: 0,
    left: 0,
    height: 2,
    borderRadius: 50,
  },
});
