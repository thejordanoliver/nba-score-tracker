import ChampionshipBanner from "@/components/ChampionshipBanner";
import { logoMap } from "@/constants/teams";
import { useTeamInfo } from "@/hooks/useTeamInfo";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { BlurView } from "expo-blur";
import { useEffect, useMemo, useRef } from "react";
import { StyleSheet, Text, View, useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TeamInfoCard from "./TeamInfoCard";
import { teams } from "@/constants/teams";

import Heading from "./Heading";
const OSREGULAR = "Oswald_400Regular";
const OSMEDIUM = "Oswald_500Medium";
const OSSEMIBOLD = "Oswald_600SemiBold";

type Props = {
  visible: boolean;
  onClose: () => void;
  coachName: string;
  coachImage?: any;
  teamHistory?: string;
  teamId?: string;
};

export default function TeamInfoBottomSheet({
  visible,
  onClose,
  coachName,
  coachImage,
  teamHistory,
  teamId,
}: Props) {
  const isDark = useColorScheme() === "dark";
  const insets = useSafeAreaInsets();
  const sheetRef = useRef<BottomSheetModal>(null);

  const { team: fetchedTeam, loading, error } = useTeamInfo(teamId);

const localTeam = teams.find((t) => t.id === teamId);


  useEffect(() => {
    if (visible) {
      sheetRef.current?.present();
    } else {
      sheetRef.current?.dismiss();
    }
  }, [visible]);

  const snapPoints = useMemo(() => ["60%", "90%"], []);

  return (
   <BottomSheetModal
  ref={sheetRef}
  index={0}
  snapPoints={snapPoints}
  onDismiss={onClose}
  enablePanDownToClose
  enableDynamicSizing={false} // <-- prevents full-screen expansion
  backdropComponent={(props) => (
    <BottomSheetBackdrop
      {...props}
      disappearsOnIndex={-1}
      appearsOnIndex={0}
      pressBehavior="close"
    />
  )}
  backgroundStyle={{
    backgroundColor: "transparent",
  }}
  handleStyle={{
    backgroundColor: "transparent",
    paddingTop: 12,
    alignItems: "center",
    position: "absolute",
    left: 0,
    right: 0,
  }}
  handleIndicatorStyle={{
    backgroundColor: localTeam?.color,
    width: 36,
    height: 4,
    borderRadius: 2,
  }}
>

      <View
        style={{
          flex: 1,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          overflow: "hidden",
        }}
      >
        <BlurView
          intensity={100}
          tint={isDark ? "dark" : "light"}
          style={StyleSheet.absoluteFill}
        />

        <View style={{ paddingHorizontal: 12, flex: 1 }}>
          {/* Header */}
          <View style={{}}>

         
          <Text
            style={{
              fontFamily: OSSEMIBOLD,
              fontSize: 20,
              paddingTop: insets.top - 30,
              color: isDark ? "#fff" : "#000",
              textAlign: "center",
            }}
          >
            {fetchedTeam?.name}
          </Text>
 </View>
          {/* Content */}
          <BottomSheetScrollView
            contentContainerStyle={{
              paddingTop: 20,
              paddingBottom: 40,
            }}
            showsVerticalScrollIndicator={false}
          >
            <Text
              style={{
                textAlign: "center",
                fontSize: 20,
                fontFamily: OSMEDIUM,
                marginBottom: 8,
                paddingBottom: 4,
                borderBottomWidth: .5,
                borderBottomColor: isDark ? "#ccc" : "#444",
                color: isDark ? "#fff" : "#1d1d1d",
              }}
            >
              Championships
            </Text>

            <ChampionshipBanner
              years={fetchedTeam?.championships || []}
              logo={
                fetchedTeam?.logo_filename
                  ? logoMap[fetchedTeam.logo_filename]
                  : undefined
              }
              teamName={fetchedTeam?.name}
              teamId={fetchedTeam?.id}
            />

            <TeamInfoCard teamId={teamId} />
          </BottomSheetScrollView>
        </View>
      </View>
    </BottomSheetModal>
  );
}
