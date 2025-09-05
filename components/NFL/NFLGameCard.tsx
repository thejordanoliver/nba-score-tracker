// components/NFLGameCard.tsx
import { getNFLTeamsLogo, getTeamName } from "@/constants/teamsNFL";
import { useNFLStandings } from "@/hooks/useNFLStandings";
import { getStyles } from "@/styles/GameCard.styles";
import { useRouter } from "expo-router";
import { memo, useMemo } from "react";
import {
  Image,
  Text,
  TextStyle,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

type Props = {
  game: any; // replace with proper type later
  isDark?: boolean;
};

function NFLGameCard({ game, isDark }: Props) {
  const colorScheme = useColorScheme();
  const dark = isDark ?? colorScheme === "dark";
  const styles = getStyles(dark);
  const router = useRouter();
  const { standings } = useNFLStandings();

  // Memoize team info
  const awayTeam = useMemo(() => {
    const id = game.teams?.away?.id ?? "";
    return {
      logo: getNFLTeamsLogo(id, dark),
      name: getTeamName(id),
      record:
        standings.find((t) => t.id === id)?.won !== undefined
          ? `${standings.find((t) => t.id === id)?.won}-${standings.find((t) => t.id === id)?.lost}`
          : "0-0",
    };
  }, [game.teams?.away?.id, standings, dark]);

  const homeTeam = useMemo(() => {
    const id = game.teams?.home?.id ?? "";
    return {
      logo: getNFLTeamsLogo(id, dark),
      name: getTeamName(id),
      record:
        standings.find((t) => t.id === id)?.won !== undefined
          ? `${standings.find((t) => t.id === id)?.won}-${standings.find((t) => t.id === id)?.lost}`
          : "0-0",
    };
  }, [game.teams?.home?.id, standings, dark]);

  // Memoize game status
  const status = useMemo(() => {
    const long = game.game.status.long;
    const live =
      long !== "Not Started" &&
      long !== "Finished" &&
      long !== "Canceled" &&
      long !== "Delayed" &&
      long !== "Postponed" &&
      long !== "Halftime";
    return {
      isScheduled: long === "Not Started",
      isFinal: long === "Finished",
      isCanceled: long === "Canceled",
      isDelayed: long === "Delayed",
      isPostponed: long === "Postponed",
      isHalftime: long === "Halftime",
      isLive: live,
      short: game.game.status.short,
      timer: game.game.status.timer,
    };
  }, [game.game.status]);

  const gameDate = useMemo(
    () => new Date(game.game.date.date),
    [game.game.date.date]
  );

  const formattedDate = useMemo(
    () =>
      gameDate.toLocaleDateString("en-US", {
        month: "numeric",
        day: "numeric",
      }),
    [gameDate]
  );

  const formattedTime = useMemo(
    () =>
      gameDate.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
    [gameDate]
  );

  // Winner/loser style logic
  const getTeamStyle = useMemo(
    () =>
      (isHome: boolean): TextStyle => {
        const homeScore = game.scores.home?.total ?? 0;
        const awayScore = game.scores.away?.total ?? 0;

        let isWinner = false;

        if (status.isFinal) {
          if (homeScore === awayScore) {
            // Tie → both full opacity
            isWinner = true;
          } else {
            isWinner = isHome ? homeScore > awayScore : awayScore > homeScore;
          }
        } else if (status.isLive) {
          if (homeScore === awayScore) {
            // Tie in-progress → both full opacity
            isWinner = true;
          } else {
            isWinner = isHome ? homeScore > awayScore : awayScore > homeScore;
          }
        }

        return {
          color: dark ? "#fff" : "#1d1d1d",
          opacity: isWinner ? 1 : 0.5,
        };
      },
    [dark, status, game.scores]
  );

  const formatQuarter = useMemo(
    () => (short: string) => {
      switch (short) {
        case "Q1":
          return "1st";
        case "Q2":
          return "2nd";
        case "Q3":
          return "3rd";
        case "Q4":
          return "4th";
        case "OT":
          return "OT";
        default:
          return short;
      }
    },
    []
  );

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() =>
        router.push({
          pathname: "/game/nfl/[game]",
          params: { game: JSON.stringify(game) },
        })
      }
    >
      <View style={styles.card}>
        {/* Away Team */}
        <View style={styles.teamSection}>
          <Image source={awayTeam.logo} style={styles.logo} />
          <Text style={styles.teamName}>{awayTeam.name}</Text>
        </View>

        {/* Away record or score */}
        <Text
          style={[
            status.isScheduled || status.isCanceled || status.isPostponed
              ? styles.teamRecord
              : styles.teamScore,
            getTeamStyle(false), // away
          ]}
        >
          {status.isScheduled || status.isCanceled || status.isPostponed
            ? awayTeam.record
            : game.scores.away?.total}
        </Text>

        {/* Game Info */}
        <View style={styles.info}>
          {status.isScheduled && (
            <>
              <Text style={styles.date}>{formattedDate}</Text>
              <Text style={styles.time}>{formattedTime}</Text>
            </>
          )}
          {status.isLive && (
            <>
              <Text style={styles.date}>{formatQuarter(status.short)}</Text>
              <Text style={styles.clock}>{status.timer}</Text>
            </>
          )}
          {status.isHalftime && (
            <Text style={styles.date}>{formatQuarter(status.short)}</Text>
          )}
          {status.isFinal && (
            <>
              <Text style={styles.finalText}>Final</Text>
              <Text style={styles.dateFinal}>{formattedDate}</Text>
            </>
          )}
          {status.isCanceled && <Text style={styles.finalText}>Cancelled</Text>}
          {status.isDelayed && <Text style={styles.finalText}>Delayed</Text>}
        </View>

        {/* Home record or score */}
        <Text
          style={[
            status.isScheduled || status.isCanceled || status.isPostponed
              ? styles.teamRecord
              : styles.teamScore,
            getTeamStyle(true), // home
          ]}
        >
          {status.isScheduled || status.isCanceled || status.isPostponed
            ? homeTeam.record
            : game.scores.home?.total}
        </Text>

        {/* Home Team */}
        <View style={styles.teamSection}>
          <Image source={homeTeam.logo} style={styles.logo} />
          <Text style={styles.teamName}>{homeTeam.name}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

// Memoize the entire component
export default memo(NFLGameCard);
