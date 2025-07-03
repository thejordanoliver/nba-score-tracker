import React from "react";
import { SafeAreaView, ScrollView } from "react-native";
import GameCard, { Game } from "./GameCard";

export default function DummyGameCard() {
  const dummyGame: Game = {
    id: 1,
    home: {
      name: "Los Angeles Lakers",
      logo: require("../assets/Logos/lakers.png"),
      record: "25-18",
    },
    away: {
      name: "Golden State Warriors",
      logo: require("../assets/Logos/warriors.png"),
      record: "20-22",
    },
    date: new Date().toISOString(),
    time: "9:00 PM",
    status: "In Progress",
    clock: "", // leave empty if at halftime
    period: "Q2",
    homeScore: 58,
    awayScore: 61,
    isHalftime: true, // this is the key test!
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <GameCard game={dummyGame} isDark={false} />
      </ScrollView>
    </SafeAreaView>
  );
}
