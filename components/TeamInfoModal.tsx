import ChampionshipBanner from "@/components/ChampionshipBanner";
import { logoMap } from "@/constants/teams";
import { useTeamInfo } from "@/hooks/useTeamInfo"; // adjust path if needed
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import {
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TeamInfoCard from "./TeamInfoCard";

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

export default function TeamInfoModal({
  visible,
  onClose,
  coachName,
  coachImage,
  teamHistory,
  teamId,
}: Props) {
  const isDark = useColorScheme() === "dark";
  const insets = useSafeAreaInsets();
  const { team: fetchedTeam, loading, error } = useTeamInfo(teamId);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          paddingTop: insets.top + 40,
          paddingHorizontal: 12,
          alignItems: "center",
        }}
      >
        <BlurView
          intensity={100}
          tint={isDark ? "dark" : "light"}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        />

        <View
          style={{
            flex: 1,
            width: "100%",
            borderRadius: 12,
            overflow: "hidden",
          }}
        >
          <TouchableOpacity
            onPress={onClose}
            style={{
              position: "absolute",
              top: 0,
              right: 8,
              zIndex: 10,
              paddingHorizontal: 8,
            }}
          >
            <Ionicons name="close" size={28} color={isDark ? "#fff" : "#000"} />
          </TouchableOpacity>

          <Text
            style={{
              fontFamily: OSSEMIBOLD,
              fontSize: 20,
              marginBottom: 12,
              color: isDark ? "#fff" : "#000",
              textAlign: "center",
            }}
          >
            {fetchedTeam?.name}{" "}
            {/* or fullName if you want to create a helper */}
          </Text>

          <ScrollView
            contentContainerStyle={{
              paddingTop: 20,
              paddingBottom: 40,
            }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Text
              style={{
                textAlign: "center",
                fontSize: 20,
                fontFamily: OSMEDIUM,
                marginBottom: 8,
                paddingBottom: 4,
                borderBottomWidth: 1,
                borderBottomColor: isDark ? "#444" : "#ccc",
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
            />

            <TeamInfoCard teamId={teamId} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
