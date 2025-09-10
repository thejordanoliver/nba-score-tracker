// components/NFL/Games/NFLGamePreviewModal.tsx
import { TeamLocationSection } from "@/components/GameDetails";
import LineScore from "@/components/GameDetails/LineScore";
import Weather from "@/components/GameDetails/Weather";
import { NFLGameCenterInfo } from "@/components/NFL/GameInfo";
import NFLInjuries from "@/components/NFL/NFLInjuries";
import NFLOfficials from "@/components/NFL/NFLOfficials";
import NFLTeamDrives from "@/components/NFL/NFLTeamDrives";
import { teams } from "@/constants/teamsNFL";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useMemo, useRef, useState } from "react";
import { Animated, StyleSheet, useColorScheme, View } from "react-native";
import TeamInfo from "./TeamInfo";
import { arenaImages } from "@/constants/teams";
import { neutralStadiums, stadiumImages } from "@/constants/teamsNFL";
import { useNFLGamePossession } from "@/hooks/useNFLGamePossession";
import { useNFLGameOfficialsAndInjuries } from "@/hooks/useNFLOfficials";
import { useWeatherForecast } from "@/hooks/useWeather";

import { useChatStore } from "@/store/chatStore";
import { NFLGame } from "@/types/nfl";

type Props = {
  game: NFLGame;
  visible: boolean;
  onClose: () => void;
};

export default function NFLGamePreviewModal({ game, visible, onClose }: Props) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const sheetRef = useRef<BottomSheetModal>(null);
  const { openChat, isOpen: isChatOpen } = useChatStore();
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showDetails = true;

  const gameInfo = game.game;
  const home = game.teams.home;
  const away = game.teams.away;
  const scores = game.scores;

  // Ensure timestamp is a number
  const timestampNum = Number(gameInfo.date.timestamp);
  const gameDateStr = new Date(timestampNum * 1000).toISOString();

  // Determine winner
  const awayIsWinner =
    gameInfo.status.long === "Finished" &&
    (scores.away?.total ?? 0) > (scores.home?.total ?? 0);
  const homeIsWinner =
    gameInfo.status.long === "Finished" &&
    (scores.home?.total ?? 0) > (scores.away?.total ?? 0);

  // Status mapping
  type GameStatus =
    | "Scheduled"
    | "In Progress"
    | "Halftime"
    | "Final"
    | "Canceled"
    | "Postponed"
    | "Delayed";
  const statusMap: Record<string, GameStatus> = {
    NS: "Scheduled",
    Q1: "In Progress",
    Q2: "In Progress",
    Q3: "In Progress",
    Q4: "In Progress",
    OT: "In Progress",
    HT: "Halftime",
    FT: "Final",
    AOT: "Final",
    CANC: "Canceled",
    PST: "Postponed",
    DELAYED: "Delayed",
  };
  const rawStatus = (
    gameInfo.status.short ||
    gameInfo.status.long ||
    ""
  ).toUpperCase();
  const gameStatus: GameStatus = statusMap[rawStatus] ?? "Scheduled";

  // Linescore
  const linescore = useMemo(() => {
    const homePeriods = [
      scores.home?.quarter_1,
      scores.home?.quarter_2,
      scores.home?.quarter_3,
      scores.home?.quarter_4,
    ];
    const awayPeriods = [
      scores.away?.quarter_1,
      scores.away?.quarter_2,
      scores.away?.quarter_3,
      scores.away?.quarter_4,
    ];
    if (scores.home?.overtime != null) homePeriods.push(scores.home.overtime);
    if (scores.away?.overtime != null) awayPeriods.push(scores.away.overtime);
    return {
      home: homePeriods.map((v) => (v != null ? String(v) : "0")),
      away: awayPeriods.map((v) => (v != null ? String(v) : "0")),
    };
  }, [scores]);

  // Possession
  const { possessionTeam } = useNFLGamePossession(
    Number(home.id),
    Number(away.id),
    gameDateStr
  );

  // Officials & Injuries
  const { officials, injuries, previousDrives, currentDrives } =
    useNFLGameOfficialsAndInjuries(home.nickname, away.nickname, gameDateStr);

  // Weather
  const isNeutralSite =
    gameInfo.venue?.name &&
    ![home.stadium, away.stadium].includes(gameInfo.venue?.name ?? "");
  const lat = isNeutralSite
    ? (neutralStadiums[gameInfo.venue?.name ?? ""]?.latitude ?? null)
    : home.latitude;
  const lon = isNeutralSite
    ? (neutralStadiums[gameInfo.venue?.name ?? ""]?.longitude ?? null)
    : home.longitude;
  
    const stadiumData = isNeutralSite
    ? neutralStadiums[gameInfo.venue?.name ?? ""]
    : home;
  const { weather } = useWeatherForecast(
    lat,
    lon,
    gameDateStr,
    stadiumData?.city ?? ""
  );

  console.log(stadiumData)
  const displayWeather = weather
    ? { ...weather, cityName: stadiumData?.city ?? "Unknown" }
    : null;

  // Snap points
  const snapPoints = useMemo(() => ["40%", "60%", "80%", "94%"], []);
  const homeTeamData = teams.find((t) => t.id === home.id) ?? home;
  const awayTeamData = teams.find((t) => t.id === away.id) ?? away;

  // Scroll animations
  const handleScrollStart = () => {
    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    setIsScrolling(true);
  };
  const handleScrollEnd = () => {
    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    scrollTimeout.current = setTimeout(() => setIsScrolling(false), 1000);
  };
  useEffect(() => {
    Animated.timing(opacityAnim, {
      toValue: isChatOpen || isScrolling ? 0 : 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [isChatOpen, isScrolling]);

  // Modal open/close
  useEffect(() => {
    if (visible) sheetRef.current?.present();
    else sheetRef.current?.dismiss();
  }, [visible]);

  // Colors for NFLGameCenterInfo
  const colorsRecord = useMemo(
    () => ({
      text: "",
      record: "",
      score: "",
      winnerScore: "",
    }),
    []
  );

  return (
    <BottomSheetModal
      ref={sheetRef}
      index={1}
      snapPoints={snapPoints}
      onDismiss={onClose}
      enableContentPanningGesture
      enableHandlePanningGesture
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
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        left: 8,
        right: 8,
        top: 0,
      }}
      handleIndicatorStyle={{
        backgroundColor: "#888",
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
        <LinearGradient
          colors={[awayTeamData.color ?? "#444", homeTeamData.color ?? "#444"]}
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
          tint={isDark ? "systemUltraThinMaterialDark" : "light"}
          style={{
            flex: 1,
            padding: 20,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            paddingTop: 40,
          }}
        >
          {/* Teams */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <TeamInfo
              team={awayTeamData}
              teamName={awayTeamData.nickname} // now defined
              scoreOrRecord={scores?.away?.total ?? 0}
              isWinner={awayIsWinner}
              isDark={isDark}
              isGameOver={
                gameStatus === "Final" ||
                gameStatus === "Canceled" ||
                gameStatus === "Postponed"
              }
            />
            <NFLGameCenterInfo
              status={gameStatus}
              date={new Date(timestampNum * 1000).toLocaleDateString()}
              time={new Date(timestampNum * 1000).toLocaleTimeString()}
              period={gameInfo.status.short}
              clock={gameInfo.status.timer ?? ""}
              isDark={isDark}
              homeTeam={home}
              awayTeam={away}
              colors={colorsRecord}
            />
            <TeamInfo
              team={homeTeamData}
              teamName={homeTeamData.nickname}
              scoreOrRecord={scores?.home?.total ?? 0}
              isWinner={homeIsWinner}
              isDark={isDark}
              isGameOver={
                gameStatus === "Final" ||
                gameStatus === "Canceled" ||
                gameStatus === "Postponed"
              }
            />
          </View>

          {/* Scrollable Details */}
          <BottomSheetScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
            style={{ flexGrow: 0 }}
            onScrollBeginDrag={handleScrollStart}
            onMomentumScrollEnd={handleScrollEnd}
          >
            {showDetails && (
              <View style={{ gap: 20 }}>
                <LineScore
                  linescore={linescore}
                  homeCode={homeTeamData.code}
                  awayCode={awayTeamData.code}
                />
                <NFLTeamDrives
                  previousDrives={previousDrives}
                  currentDrives={currentDrives}
                />
                <NFLInjuries injuries={injuries} loading={false} error={null} />
                <NFLOfficials
                  officials={officials}
                  loading={false}
                  error={null}
                />
                  <TeamLocationSection
                            arenaImage={
                              isNeutralSite
                                ? stadiumImages[gameInfo?.venue?.name ?? ""] ||
                                  arenaImages[gameInfo?.venue?.city ?? ""]
                                : homeTeamData?.stadiumImage
                            }
                            arenaName={
                              isNeutralSite
                                ? (gameInfo?.venue?.name ?? "")
                                : (homeTeamData?.stadium ?? "")
                            }
                            location={
                              isNeutralSite
                                ? (gameInfo?.venue?.city ?? "")
                                : (homeTeamData?.location ?? "")
                            }
                            address={
                              isNeutralSite
                                ? (neutralStadiums[gameInfo?.venue?.name ?? ""]?.address ??
                                  "")
                                : (homeTeamData?.address ?? "")
                            }
                            arenaCapacity={
                              isNeutralSite
                                ? (neutralStadiums[gameInfo?.venue?.name ?? ""]
                                    ?.stadiumCapictiy ?? "")
                                : (homeTeamData?.stadiumCapictiy ?? "")
                            }
                            loading={false}
                            error={null}
                          />
              

                <Weather
                  weather={displayWeather}
                  address={stadiumData?.city ?? ""}
                  loading={false}
                  error={null}
                />
              </View>
            )}
          </BottomSheetScrollView>
        </BlurView>
      </View>

      <Animated.View
        style={{
          opacity: opacityAnim,
          position: "absolute",
          bottom: 100,
          left: 0,
          right: 0,
        }}
        pointerEvents={isChatOpen ? "none" : "auto"}
      />
    </BottomSheetModal>
  );
}
