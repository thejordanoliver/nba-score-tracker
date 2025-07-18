import TeamInfoBottomSheet from "@/components/TeamInfoModal";
import { teams } from "@/constants/teams";
import { Ionicons } from "@expo/vector-icons";
import { HeaderTitle } from "@react-navigation/elements";
import { useState } from "react";
import {
  Dimensions,
  Image,
  TouchableOpacity,
  StyleSheet,
  TextStyle,
  useColorScheme,
  View,
  ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
const { width } = Dimensions.get("window");

type CustomHeaderTitleProps = {
  title?: string;
  playerName?: string;
  tabName?: string;
  onLogout?: () => void;
  onSettings?: () => void;
  onBack?: () => void;
  onCalendarPress?: () => void;
  onToggleLayout?: () => void;
  isGrid?: boolean;
  logo?: any;
  logoLight?: any;
  teamColor?: string;
  isTeamScreen?: boolean;
  transparentColor?: string;
  onSearchToggle?: () => void;
  teamCode?: string;
  teamCoach?: string;
  teamHistory?: string;
  isPlayerScreen?: boolean;
  showBackButton?: boolean;

  // Favorite
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  // Notifications
  notificationsEnabled?: boolean;
  onToggleNotifications?: () => void;
};

export function CustomHeaderTitle({
  title,
  playerName,
  tabName,
  onLogout,
  onSettings,
  onBack,
  onCalendarPress,
  onToggleLayout,
  isGrid,
  logo,
  logoLight,
  teamColor,
  transparentColor,
  onSearchToggle,
  isTeamScreen = false,
  teamCode,
  teamCoach,
  teamHistory,
  isFavorite,
  onToggleFavorite,
  notificationsEnabled,
  onToggleNotifications,
  isPlayerScreen,
  showBackButton = true, // default to true
}: CustomHeaderTitleProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const insets = useSafeAreaInsets();
  const [modalVisible, setModalVisible] = useState(false);

  const selectedTeam = teams.find((t) => t.code === teamCode);
  const coach = selectedTeam?.coach || teamCoach || "N/A";
  const coachImage = selectedTeam?.coachImage;
  const selectedLogo = logoLight ?? logo;
  const defaultBgColor = isDark ? "#1d1d1d" : "#fff";

  const textStyle: TextStyle = {
    fontFamily: "Oswald_400Regular",
    fontSize: 20,
    color: playerName ? "#fff" : isDark ? "#fff" : "#1d1d1d",
    textAlign: "center",
  };

  const containerStyle: ViewStyle = {
    width,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    height: 56,
  };

  return (
    <View style={{ paddingTop: insets.top, height: 56 + insets.top }}>
      {/* Status Bar Background */}
      <View
        style={{
          position: "absolute",
          top: 0,
          height: insets.top,
          width: "100%",
          backgroundColor: defaultBgColor,
          zIndex: -1,
        }}
      />

      {/* Team Header Background */}
      {isTeamScreen || isPlayerScreen ? (
        <View
          style={{
            position: "absolute",
            top: insets.top,
            height: 56,
            width: "100%",
            overflow: "hidden",
            zIndex: 0,
          }}
        >
          <View
            style={{
              ...StyleSheet.absoluteFillObject,
              backgroundColor: teamColor || defaultBgColor,
              zIndex: -1,
            }}
          />
          {selectedLogo && (
            <Image
              source={selectedLogo}
              style={{
                height: 200,
                width: "100%",
                resizeMode: "contain",
                opacity: 0.25,
                position: "absolute",
                top: -70,
                zIndex: 0,
              }}
            />
          )}
        </View>
      ) : (
        <View
          style={{
            ...StyleSheet.absoluteFillObject,
            backgroundColor: defaultBgColor,
            zIndex: -1,
          }}
        />
      )}

      {/* Foreground Header Content */}
      <View style={[containerStyle, { zIndex: 2 }]}>
        {/* Left Icon */}
        {tabName === "Profile" ? (
          <TouchableOpacity onPress={onLogout}>
            <Ionicons
              name="log-out"
              size={24}
              color={isDark ? "#fff" : "#1d1d1d"}
            />
          </TouchableOpacity>
        ) : showBackButton && onBack ? (
          <TouchableOpacity onPress={onBack}>
            <Ionicons
              name="arrow-back"
              size={24}
              color={isTeamScreen ? "#fff" : isDark ? "#fff" : "#1d1d1d"}
            />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 24 }} />
        )}

        {/* Title */}
        {playerName ? (
          <HeaderTitle style={textStyle}></HeaderTitle>
        ) : title ? (
          <HeaderTitle style={textStyle}>{title}</HeaderTitle>
        ) : (
          <View style={{ width: 36, height: 36 }} />
        )}

        {/* Right Icons */}
        {isTeamScreen ? (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {onToggleNotifications && (
              <TouchableOpacity
                onPress={onToggleNotifications}
                style={{ padding: 8, marginRight: 8 }}
              >
                <Ionicons
                  name={
                    notificationsEnabled
                      ? "notifications"
                      : "notifications-outline"
                  }
                  size={24}
                  color="#fff"
                />
              </TouchableOpacity>
            )}

            {onToggleFavorite && (
              <TouchableOpacity
                onPress={onToggleFavorite}
                style={{ padding: 8, marginRight: 8 }}
              >
                <Ionicons
                  name={isFavorite ? "star" : "star-outline"}
                  size={24}
                  color="#fff"
                />
              </TouchableOpacity>
            )}

            {!isPlayerScreen && (
              <TouchableOpacity
                onPress={() => setModalVisible(true)}
                style={{ padding: 8 }}
              >
                <Ionicons name="information-circle" size={24} color="#fff" />
              </TouchableOpacity>
            )}

            <TeamInfoBottomSheet
  visible={modalVisible}
  onClose={() => setModalVisible(false)}
  coachName={coach}
  coachImage={coachImage}
  teamHistory={teamHistory ?? "This is some team history..."}
  teamId={selectedTeam?.id}
/>

          </View>
        ) : tabName === "Profile" && onSettings ? (
          <TouchableOpacity onPress={onSettings}>
            <Ionicons
              name="settings"
              size={24}
              color={isDark ? "#fff" : "#1d1d1d"}
            />
          </TouchableOpacity>
        ) : tabName === "League" && onCalendarPress ? (
<TouchableOpacity onPress={onCalendarPress}>
            <Ionicons
              name="calendar"
              size={24}
              color={isDark ? "#fff" : "#1d1d1d"}
            />
          </TouchableOpacity>
        ) : tabName === "Explore" && onSearchToggle ? (
          <TouchableOpacity onPress={onSearchToggle}>
            <Ionicons
              name="search"
              size={24}
              color={isDark ? "#fff" : "#1d1d1d"}
            />
          </TouchableOpacity>
        ) : onToggleLayout !== undefined ? (
          <TouchableOpacity onPress={onToggleLayout}>
            <Ionicons
              name={isGrid ? "list" : "grid"}
              size={22}
              color={isDark ? "#fff" : "#000"}
            />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 24 }} />
        )}
      </View>
    </View>
  );
}
