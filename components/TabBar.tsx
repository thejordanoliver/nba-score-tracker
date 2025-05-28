import React, { useRef, useEffect } from "react";
import {
  Animated,
  LayoutChangeEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
  useColorScheme, TextStyle
} from "react-native";

export interface TabBarProps<T extends string> {
  tabs: readonly T[];
  selected: T;
  onTabPress: (tab: T) => void;
}


export default function TabBar<T extends string>({
  tabs,
  selected,
  onTabPress,
}: TabBarProps<T>) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const underlineX = useRef(new Animated.Value(0)).current;
  const underlineWidth = useRef(new Animated.Value(0)).current;
  const tabMeasurements = useRef<{ x: number; width: number }[]>([]);
  const isInitialized = useRef(false);

  const onTabLayout = (index: number) => (event: LayoutChangeEvent) => {
    const { x, width } = event.nativeEvent.layout;
    tabMeasurements.current[index] = { x, width };

    if (
      tabMeasurements.current.length === tabs.length &&
      tabMeasurements.current.every((m) => m !== undefined) &&
      !isInitialized.current
    ) {
      underlineX.setValue(tabMeasurements.current[0].x);
      underlineWidth.setValue(tabMeasurements.current[0].width);
      isInitialized.current = true;
    }
  };

  useEffect(() => {
    const index = tabs.indexOf(selected);
    if (tabMeasurements.current[index]) {
      Animated.parallel([
        Animated.timing(underlineX, {
          toValue: tabMeasurements.current[index].x,
          duration: 200,
          useNativeDriver: false,
        }),
        Animated.timing(underlineWidth, {
          toValue: tabMeasurements.current[index].width,
          duration: 200,
          useNativeDriver: false,
        }),
      ]).start();
    }
  }, [selected, tabs, underlineX, underlineWidth]);

const getTabStyle = (isSelected: boolean): TextStyle => ({
  fontSize: 20,
  fontWeight: isSelected ? "700" : "400",
  color: isSelected ? (isDark ? "#fff" : "#1d1d1d") : isDark ? "#888" : "#aaa",
  fontFamily: "Oswald_400Regular",
});


  const underlineStyle = {
    width: underlineWidth,
    transform: [{ translateX: underlineX }],
    height: 2,
    backgroundColor: isDark ? "#fff" : "#1d1d1d",
    position: "absolute" as const,
    bottom: 0,
    left: 0,
  };

  return (
    <View style={styles.tabs}>
      {tabs.map((tab, i) => (
        <Pressable
          key={tab}
          onPress={() => onTabPress(tab)}
          onLayout={onTabLayout(i)}
          style={styles.tabPressable}
          accessibilityRole="tab"
          accessibilityState={{ selected: selected === tab }}
          accessibilityLabel={`Switch to ${tab} tab`}
        >
          <Text style={getTabStyle(selected === tab)}>{tab.toUpperCase()}</Text>
        </Pressable>
      ))}
      <Animated.View style={underlineStyle} />
    </View>
  );
}

const styles = StyleSheet.create({
  tabs: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
    position: "relative",
  },
  tabPressable: {
    marginHorizontal: 40,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
});
