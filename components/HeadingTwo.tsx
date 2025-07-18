// components/Heading.tsx
import React from "react";
import { Text, StyleSheet, useColorScheme } from "react-native";

type Props = {
  children: React.ReactNode;
};

const HeadingTwo: React.FC<Props> = ({ children }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return <Text style={[styles.heading, { color: isDark ? "#fff" : "#1d1d1d", borderBottomColor: isDark ? "#444" : "#ccc" }]}>{children}</Text>;
};

const styles = StyleSheet.create({
  heading: {
    fontSize: 24,
    fontFamily: "Oswald_500Medium",
    paddingBottom: 4,
    marginBottom: 8,
    borderBottomWidth: 1,
  },
});

export default HeadingTwo;
