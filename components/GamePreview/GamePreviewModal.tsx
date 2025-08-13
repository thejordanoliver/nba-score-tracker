import GameTeamStats from "@/components/GameDetails/GameTeamStats";
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
import { Dimensions, StyleSheet, View, useColorScheme } from "react-native";
import { GameLeaders } from "../GameDetails";
import LineScore from "../GameDetails/LineScore";
import CenterInfo from "./CenterInfo";
import TeamInfo from "./TeamInfo";
type Props = {
  visible: boolean;
  game: Game;
  onClose: () => void;
};

const windowHeight = Dimensions.get("window").height;

export default function GamePreviewModal({ visible, game, onClose }: Props) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
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

    const { code, color, secondaryColor } = team;

    if (code === "SAS") return secondaryColor || "#fff";
    if (code === "BKN" && isDark) return secondaryColor || color || "#444";

    return color || "#444";
  };

  const homeColor = getTeamColor(home);
  const awayColor = getTeamColor(away);

  const isCanceled = game.status === "Canceled";
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
  const snapPoints = useMemo(() => ["40%", "60%", "80%", "87.5%", "94%"], []);
  const homeCode = home?.code ?? game.home.code ?? "";
  const awayCode = away?.code ?? game.away.code ?? "";
  const maxHeight = windowHeight * 0.9;
  const currentPeriodRaw = Number(game.periods?.current ?? game.period);
  const totalPeriodsPlayed =
    game.linescore?.home?.length ??
    game.linescore?.away?.length ??
    currentPeriodRaw;

  return (
    <BottomSheetModal
      ref={sheetRef}
      index={1}
      snapPoints={snapPoints}
      onDismiss={onClose}
      enableContentPanningGesture={true}
      enableHandlePanningGesture={true}
      enableDynamicSizing={false}
      backdropComponent={(props) => (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
        />
      )}
      handleStyle={{
        backgroundColor: "transparent",
        height: 40, // bigger tap target for drag gesture
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        left: 8,
        right: 8,
        top: 0,
      }}
      handleIndicatorStyle={{
        backgroundColor: isDark ? "#888" : "#444",
        width: 36,
        height: 4,
        borderRadius: 2,
      }}
      backgroundStyle={{ backgroundColor: "transparent" }}
    >
      <View
        style={{
          flex: 1, // fill all available height inside bottom sheet
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
          tint={"systemUltraThinMaterial"}
          style={{
            flex: 1,
            padding: 20,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            paddingTop: 40, // <-- add extra top padding here so content isn't flush with top
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
              isGameOver
            />

            <CenterInfo
              isNBAFinals={isNBAFinals}
              isFinal={isFinal}
              isCanceled={isCanceled}
              isHalftime={game.isHalftime ?? false}
              broadcastNetworks={broadcastNetworks}
              showLiveInfo={showLiveInfo}
              period={game.periods?.current ?? 0}
              endOfPeriod={game.periods?.endOfPeriod ?? false}
              totalPeriodsPlayed={totalPeriodsPlayed}
              time={game.time}
              clock={game.clock}
              formattedDate={formattedDate}
              isDark={isDark}
              gameNumberLabel={gameNumberLabel}
              seriesSummary={seriesSummary ?? undefined}
              isPlayoffs={isPlayoffs}
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
              isGameOver
            />
          </View>

          <View style={{ flex: 1, minHeight: 0 }}>
            <BottomSheetScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingBottom: 100, // reduced padding to avoid overlap
                minHeight: 0,
              }}
              style={{ flexGrow: 0 }}
            >
              {game.linescore && (
                <View style={{ marginBottom: 16 }}>
                  <LineScore
                    linescore={game.linescore}
                    homeCode={homeCode}
                    awayCode={awayCode}
                  />
                </View>
              )}

              {game?.id && homeId && awayId && (
                <View style={{ marginBottom: 16 }}>
                  <GameLeaders
                    gameId={game.id.toString()}
                    homeTeamId={homeId}
                    awayTeamId={awayId}
                  />
                </View>
              )}

              {!statsLoading && gameStats && (
                <GameTeamStats stats={gameStats} />
              )}
            </BottomSheetScrollView>
          </View>
        </BlurView>
      </View>
    </BottomSheetModal>
  );
}
