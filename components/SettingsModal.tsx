import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";

type SettingsModalProps = {
  visible: boolean;
  onClose: () => void;
  onLogout: () => void;
  onDeleteAccount: () => void;
  onNavigate: (screen: "accountdetails" | "appearance" | "preferences") => void;
};

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function SettingsModal({
  visible,
  onClose,
  onLogout,
  onDeleteAccount,
  onNavigate,
}: SettingsModalProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  // Animated value for slide up
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  useEffect(() => {
    if (visible) {
      // Slide in animation
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    } else {
      // Slide out animation (slide down)
      Animated.timing(slideAnim, {
        toValue: SCREEN_HEIGHT,
        duration: 300,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }).start();
    }
  }, [visible, slideAnim]);

  // If not visible, render nothing to avoid overlay still showing
  if (!visible) return null;

  return (
    <Modal
      animationType="none" // no built-in animation, we animate manually
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <BlurView
        intensity={100}
        tint={isDark ? "dark" : "light"}
        style={styles.blurContainer}
      >
        <View
          style={[
            styles.glassOverlay,
            {
              backgroundColor: isDark
                ? "rgba(29, 29, 29, 0.4)"
                : "rgba(255,255,255,0.4)",
            },
          ]}
        />
        <Animated.View
          style={[
            styles.modalContainer,
            { transform: [{ translateY: slideAnim }] },
          ]}
        >
          <Text style={[styles.title, { color: isDark ? "#fff" : "#1d1d1d" }]}>
            Settings
          </Text>
        
          <Pressable
            style={[
              styles.optionButton,
              { borderBottomColor: isDark ? "rgba(255,255,255,0.2)" : "rgba(120, 120, 120, 0.5)" },
            ]}
            onPress={() => onNavigate("accountdetails")}
          >
            <Text
              style={[
                styles.optionText,
                { color: isDark ? "#fff" : "#1d1d1d" },
              ]}
            >
              Account Details
            </Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={isDark ? "#fff" : "#1d1d1d"}
            />
          </Pressable>
          {/* Repeat the same for other optionButtons */}
          <Pressable
            style={[
              styles.optionButton,
              { borderBottomColor: isDark ? "rgba(255,255,255,0.2)" : "rgba(120, 120, 120, 0.5)" },
            ]}
            onPress={() => onNavigate("appearance")}
          >
            <Text
              style={[
                styles.optionText,
                { color: isDark ? "#fff" : "#1d1d1d" },
              ]}
            >
              Appearance
            </Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={isDark ? "#fff" : "#1d1d1d"}
            />
          </Pressable>
          <Pressable
            style={[
              styles.optionButton,
              { borderBottomColor: isDark ? "rgba(255,255,255,0.2)" : "rgba(120, 120, 120, 0.5)" },
            ]}
            onPress={() => onNavigate("preferences")}
          >
            <Text
              style={[
                styles.optionText,
                { color: isDark ? "#fff" : "#1d1d1d" },
              ]}
            >
              Preferences
            </Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={isDark ? "#fff" : "#1d1d1d"}
            />
          </Pressable>
          <Pressable style={styles.dangerButton} onPress={onLogout}>
            <Text style={styles.dangerText}>Sign Out</Text>
          </Pressable>
          <Pressable style={styles.dangerButton} onPress={onDeleteAccount}>
            <Text style={styles.dangerText}>Delete Account</Text>
          </Pressable>
          <Pressable style={styles.closeButton} onPress={onClose}>
            <Ionicons
              name="close"
              size={30}
              color={isDark ? "#fff" : "#1d1d1d"}
            />
          </Pressable>
        </Animated.View>
      </BlurView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  blurContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  glassOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 12,
  },
  modalContainer: {
    width: "100%",
    height: "90%",
    borderRadius: 12,
    padding: 20,
    position: "relative",
    backgroundColor: "transparent", // keep transparent
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 24,
    textAlign: "center",
  },
  optionButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  optionText: {
    fontSize: 18,
    fontFamily: "Oswald_400Regular",
  },
  divider: {
    marginVertical: 20,
    borderBottomColor: "#f00",
    borderBottomWidth: 1,
  },
  dangerButton: {
    paddingVertical: 15,
    alignItems: "center",
  },
  dangerText: {
    color: "#e53935",
    fontWeight: "600",
    fontSize: 18,
    fontFamily: "Oswald_500Medium",
  },
  closeButton: {
    position: "absolute",
    top: 15,
    right: 15,
  },
});
