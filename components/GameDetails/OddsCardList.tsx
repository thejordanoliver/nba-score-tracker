import React from "react";
import { Text, View } from "react-native";
import HistoricalOddsCard from "./HistoricalOddsCard";
import { useOddsWithFallback } from "@/hooks/useOddsWithFallback";

interface Props {
  date: string;
  team1?: string;
  team2?: string;
}

const OddsCardsList: React.FC<Props> = ({ date, team1, team2 }) => {
  const { data, loading, error } = useOddsWithFallback({ date, team1, team2 });

  if (loading) return <Text>Loading odds...</Text>;
  if (error) return <Text>Error loading odds: {error}</Text>;
  if (data.length === 0) return <Text>No odds data available.</Text>;

  return (
    <View>
      {data.map((game) => (
        <HistoricalOddsCard key={game.id} game={game} />
      ))}
    </View>
  );
};

export default OddsCardsList;
