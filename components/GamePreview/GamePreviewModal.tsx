import GameTeamStats from "@/components/game-details/GameTeamStats";
import { teams } from "@/constants/teams";
import { useESPNBroadcasts } from "@/hooks/useESPNBroadcasts";
import { useGameStatistics } from "@/hooks/useGameStatistics";
import { useFetchPlayoffGames } from "@/hooks/usePlayoffSeries";
import { useSummerLeagueStandings } from "@/hooks/useSummerLeagueStandings";
import { Game } from "@/types/types";
import { matchBroadcastToGame } from "@/utils/matchBroadcast";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useMemo, useRef } from "react";
import { StyleSheet, View, useColorScheme } from "react-native";
import LineScore from "../game-details/LineScore";
import CenterInfo from "./CenterInfo";
import TeamInfo from "./TeamInfo";

type Props = {
  visible: boolean;
  game: Game;
  onClose: () => void;
};

export default function GamePreviewModal({ visible, game, onClose }: Props) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const dark = isDark ?? colorScheme === "dark";
  const sheetRef = useRef<BottomSheetModal>(null);

  const { broadcasts } = useESPNBroadcasts();
  const { standings } = useSummerLeagueStandings();

  const getTeamData = (name: string) =>
    teams.find(
      (t) =>
        t.name === name ||
        t.code === name ||
        t.fullName.includes(name) ||
        name.includes(t.name)
    );

  const home = getTeamData(game?.home?.name ?? "");
  const away = getTeamData(game?.away?.name ?? "");

  const homeId = Number(home?.id) || 0;
  const awayId = Number(away?.id) || 0;

  const { games: playoffGames } = useFetchPlayoffGames(homeId, awayId, 2024);

  const currentPlayoffGame = useMemo(() => {
    if (!playoffGames || !game) return undefined;
    return playoffGames.find((g) => g.id === game.id);
  }, [playoffGames, game]);
  const seriesSummary = currentPlayoffGame?.seriesSummary;

  const gameNumberLabel = currentPlayoffGame?.gameNumber
    ? `Game ${currentPlayoffGame.gameNumber}`
    : undefined;
  const { data: gameStats, loading: statsLoading } = useGameStatistics(
    game?.id ?? 0
  );

  useEffect(() => {
    if (visible) {
      sheetRef.current?.present();
    } else {
      sheetRef.current?.dismiss();
    }
  }, [visible]);

  const matchedBroadcast = matchBroadcastToGame(game, broadcasts);
  const broadcastNetworks = matchedBroadcast?.broadcasts
    ?.map((b) => b.network)
    .filter(Boolean)
    .join(", ");

  const getRecordForTeam = (teamName: string) => {
    if (!standings || !teamName) return "";
    const lower = teamName.toLowerCase().replace(/\s+/g, "");
    for (const [key, value] of standings.entries()) {
      const cleanedKey = key.toLowerCase().replace(/\s+/g, "");
      if (
        cleanedKey === lower ||
        cleanedKey.includes(lower) ||
        lower.includes(cleanedKey)
      ) {
        return value;
      }
    }
    return "";
  };

  const homeRecord = getRecordForTeam(game.home.name);
  const awayRecord = getRecordForTeam(game.away.name);

  const getTeamColor = (team?: (typeof teams)[number]) => {
    if (!team) return "#444";
    if (isDark && team.code === "BKN" && team.secondaryColor) {
      return team.secondaryColor;
    }
    return team.color || "#444";
  };

  const homeColor = getTeamColor(home);
  const awayColor = getTeamColor(away);

  const isFinal = game.status === "Final";
  const homeWins = isFinal && (game.homeScore ?? 0) > (game.awayScore ?? 0);
  const awayWins = isFinal && (game.awayScore ?? 0) > (game.homeScore ?? 0);
const isPlayoffs = game.stage === 4 || !!seriesSummary; // adjust logic based on your API

  const winnerStyle = (teamWins: boolean) =>
    teamWins
      ? {
          color: isDark ? "#fff" : "#000",
          fontFamily: "Oswald_700Bold" as const,
        }
      : {};

  const dateObj = new Date(game.date);
  const formattedDate = `${dateObj.getMonth() + 1}/${dateObj.getDate()}`;
  const isNBAFinals =
    dateObj.getMonth() === 5 &&
    dateObj.getDate() >= 5 &&
    dateObj.getDate() <= 22;

  const showLiveInfo = game.status !== "Scheduled" && game.status !== "Final";
  const snapPoints = useMemo(() => ["40%", "50%", "90%", "92%"], []);
  const homeCode = home?.code ?? game.home.code ?? "";
  const awayCode = away?.code ?? game.away.code ?? "";

  return (
 <BottomSheetModal
  ref={sheetRef}
  index={1}
  snapPoints={snapPoints}
  onDismiss={onClose}
    enableContentPanningGesture={false}
  enableHandlePanningGesture={true} 
  backdropComponent={(props) => (
    <BottomSheetBackdrop
      {...props}
      appearsOnIndex={0}
      disappearsOnIndex={-1}
    />
  )}
  // ✅ keep gestures working
  handleStyle={{
    backgroundColor: "transparent",
    paddingTop: 12,
    paddingBottom: 4,
    alignItems: "center",
    position: "absolute",
    left: 8,
    right: 8,
  }}
  handleIndicatorStyle={{
    backgroundColor: isDark ? "#888" : "#ccc",
    width: 36,
    height: 4,
    borderRadius: 2,
  }}
  backgroundStyle={{ backgroundColor: "transparent" }}
>


      <View
        style={{
          flex: 1,
          overflow: "hidden",
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        }}
      >
        {/* Background gradients */}
        <LinearGradient
          colors={
            isNBAFinals
              ? ["#DFBD69", "#CDA765"]
              : [awayColor, awayColor, homeColor, homeColor]
          }
          locations={isNBAFinals ? undefined : [0, 0.4, 0.6, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
        <LinearGradient
          colors={
            isDark
              ? ["rgba(0,0,0,0)", "rgba(0,0,0,0.8)"]
              : ["rgba(255,255,255,0)", "rgba(255,255,255,0.9)"]
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={StyleSheet.absoluteFill}
        />

        <BlurView
          intensity={100}
          tint={isDark ? "dark" : "light"}
          style={{
            flex: 1,
            padding: 20,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          }}
        >


          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <TeamInfo
              team={away}
              teamName={game.away.name}
              scoreOrRecord={
                game.status === "Scheduled"
                  ? awayRecord
                  : (game.awayScore ?? "-")
              }
              isWinner={awayWins}
              isDark={isDark}
            />

            <CenterInfo
              isNBAFinals={isNBAFinals}
              isFinal={isFinal}
              isPlayoffs={isPlayoffs}
              broadcastNetworks={broadcastNetworks}
              showLiveInfo={showLiveInfo}
              period={game.period ?? ""} // <-- add fallback here
              clock={game.clock}
              formattedDate={formattedDate}
              isDark={isDark}
              gameNumberLabel={gameNumberLabel} // ✅ ADD THIS
              seriesSummary={seriesSummary ?? undefined}
            />

            <TeamInfo
              team={home}
              teamName={game.home.name}
              scoreOrRecord={
                game.status === "Scheduled"
                  ? homeRecord
                  : (game.homeScore ?? "-")
              }
              isWinner={homeWins}
              isDark={isDark}
            />
          </View>

          <BottomSheetScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "flex-start",
              paddingBottom: 80,
            }}
          >
            {game.linescore && (
              <LineScore
                linescore={game.linescore}
                homeCode={homeCode}
                awayCode={awayCode}
              />
            )}
            {/* Game Stats */}
            {!statsLoading && gameStats && <GameTeamStats stats={gameStats} />}
          </BottomSheetScrollView>
        </BlurView>
      </View>
    </BottomSheetModal>
  );
}
