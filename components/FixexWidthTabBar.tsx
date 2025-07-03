// FixedWidthTabBar.tsx
import React, { useRef, useEffect } from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
  useColorScheme,
  ViewStyle,
  TextStyle,
} from "react-native";

export interface FixedWidthTabBarProps<T extends string> {
  tabs: readonly T[];
  selected: T;
  onTabPress: (tab: T) => void;
  renderLabel?: (tab: T, isSelected: boolean) => React.ReactNode;
  tabWidth?: number; // optional fixed width override
}

export default function FixedWidthTabBar<T extends string>({
  tabs,
  selected,
  onTabPress,
  renderLabel,
  tabWidth = 120, // default width per tab
}: FixedWidthTabBarProps<T>) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const underlineX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const index = tabs.indexOf(selected);
    Animated.timing(underlineX, {
      toValue: index * tabWidth,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [selected, tabWidth, tabs]);

  const defaultLabelStyle = (isSelected: boolean): TextStyle => ({
    fontSize: 16,
    color: isSelected ? (isDark ? "#fff" : "#1d1d1d") : isDark ? "#888" : "rgba(0, 0, 0, 0.5)",
    fontFamily: "Oswald_500Medium",
  });

  const underlineStyle: ViewStyle = {
    width: tabWidth,
    transform: [{ translateX: underlineX }],
    height: 2,
    backgroundColor: isDark ? "#fff" : "#1d1d1d",
    position: "absolute",
    bottom: 0,
    left: 0,
    borderRadius: 50,
  };

  return (
    <View style={[styles.tabs, { width: tabWidth * tabs.length }]}>
      {tabs.map((tab) => {
        const isSelected = selected === tab;
        return (
          <Pressable
            key={tab}
            onPress={() => onTabPress(tab)}
            style={[styles.tabPressable, { width: tabWidth }]}
            accessibilityRole="tab"
            accessibilityState={{ selected: isSelected }}
            accessibilityLabel={`Switch to ${tab} tab`}
          >
            {renderLabel ? renderLabel(tab, isSelected) : (
              <Text style={defaultLabelStyle(isSelected)}>{tab.toUpperCase()}</Text>
            )}
          </Pressable>
        );
      })}
      <Animated.View style={underlineStyle} />
    </View>
  );
}

const styles = StyleSheet.create({
  tabs: {
    flexDirection: "row",
    justifyContent: "space-between",
    position: "relative",
    marginBottom: 10,
  },
  tabPressable: {
    alignItems: "center",
    paddingVertical: 10,
  },
});
