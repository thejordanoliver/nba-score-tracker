import React from "react";
import { TextStyle, useColorScheme } from "react-native";
import { HeaderTitle } from "@react-navigation/elements";

type CustomHeaderTitleProps = {
  title: string;
};

export function CustomHeaderTitle({ title }: CustomHeaderTitleProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const style: TextStyle = {
    fontFamily: "Oswald_400Regular",
    fontSize: 20,
    color: isDark ? "#fff" : "#1d1d1d",
  };

  return <HeaderTitle style={style}>{title}</HeaderTitle>;
}
