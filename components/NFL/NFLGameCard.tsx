// components/NFLGameCard.tsx
import { getNFLTeamsLogo, getTeamName } from "@/constants/teamsNFL";
import { useNFLStandings } from "@/hooks/useNFLStandings";
import { getStyles } from "@/styles/GameCard.styles";
import { useRouter } from "expo-router";
import { Image, Text, TextStyle, useColorScheme, View } from "react-native";

type Props = {
  game: any; // replace with proper type later
  isDark?: boolean;
};

export default function NFLGameCard({ game, isDark }: Props) {
  const colorScheme = useColorScheme();
  const dark = isDark ?? colorScheme === "dark";
  const styles = getStyles(dark);
  const router = useRouter();

  // Fetch standings
  const { standings } = useNFLStandings();

  // Team logos and names
  const awayLogo = getNFLTeamsLogo(game.teams.away.id, dark);
  const homeLogo = getNFLTeamsLogo(game.teams.home.id, dark);

  const awayNickname = getTeamName(game.teams.away.id);
  const homeNickname = getTeamName(game.teams.home.id);

  // Get team records from standings
  const awayRecord =
    standings.find((t) => t.id === game.teams.away.id)?.won !== undefined
      ? `${standings.find((t) => t.id === game.teams.away.id)?.won}-${standings.find((t) => t.id === game.teams.away.id)?.lost}`
      : "0-0";

  const homeRecord =
    standings.find((t) => t.id === game.teams.home.id)?.won !== undefined
      ? `${standings.find((t) => t.id === game.teams.home.id)?.won}-${standings.find((t) => t.id === game.teams.home.id)?.lost}`
      : "0-0";

  // Game status
  const isScheduled = game.game.status.long === "Not Started";
  const isLive = game.game.status.long === "Game Started";
  const isFinal = game.game.status.long === "Finished";
  const isCanceled = game.game.status.long === "Canceled";
  const isDelayed = game.game.status.long === "Delayed";
  const isPostponed = game.game.status.long === "Postponed";

  const homeWins = isFinal && (game.scores.home ?? 0) > (game.scores.away ?? 0);
  const awayWins = isFinal && (game.scores.away ?? 0) > (game.scores.home ?? 0);

  const winnerStyle = (teamWins: boolean): TextStyle => ({
    color: dark ? "#fff" : "#1d1d1d",
    opacity: isLive ? 1 : teamWins ? 1 : 0.5, // no fade when in progress
  });

  // Format date and time
  const gameDate = new Date(game.game.date.date);
  const formattedDate = gameDate.toLocaleDateString("en-US", {
    month: "numeric",
    day: "numeric",
  });
  const formattedTime = gameDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <View style={styles.card}>
      {/* Away Team */}
      <View style={styles.teamSection}>
        <Image source={awayLogo} style={styles.logo} />
        <Text style={styles.teamName}>{awayNickname}</Text>
      </View>

      {/* Away record or score */}
      <Text
        style={[
          isScheduled || isCanceled || isDelayed || isPostponed
            ? styles.teamRecord
            : styles.teamScore,
          winnerStyle(awayWins),
        ]}
      >
        {isScheduled || isCanceled || isDelayed || isPostponed
          ? awayRecord
          : game.scores.away.total}
      </Text>

      {/* Game Info */}
      <View style={styles.info}>
        {isScheduled && (
          <>
            <Text style={styles.date}>{formattedDate}</Text>
            <Text style={styles.time}>{formattedTime}</Text>
          </>
        )}
        {isLive && (
            <>
          <Text style={styles.clock}>
            {game.game.status.timer} 
          </Text>
          <Text style={styles.clock}>
            {game.game.status.timer} 
          </Text>
          </>
        )}
        {isFinal && (
          <Text style={styles.finalText}>
            Final
          </Text>
        )}
        {isCanceled && <Text style={styles.clock}>Game Cancelled</Text>}
      </View>

      {/* Home record or score */}
      <Text
        style={[
          isScheduled || isCanceled || isDelayed || isPostponed
            ? styles.teamRecord
            : styles.teamScore,
          winnerStyle(homeWins),
        ]}
      >
        {isScheduled || isCanceled || isDelayed || isPostponed
          ? homeRecord
          : game.scores.home.total}
      </Text>

      {/* Home Team */}
      <View style={styles.teamSection}>
        <Image source={homeLogo} style={styles.logo} />
        <Text style={styles.teamName}>{homeNickname}</Text>
      </View>
    </View>
  );
}
