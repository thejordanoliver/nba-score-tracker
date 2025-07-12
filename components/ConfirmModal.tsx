import { BlurView } from "expo-blur";
import {
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import Modal from "react-native-modal";
import { useState, useEffect } from "react";

const OSEXTRALIGHT = "Oswald_200ExtraLight";
const OSLIGHT = "Oswald_300Light";
const OSREGULAR = "Oswald_400Regular";
const OSMEDIUM = "Oswald_500Medium";
const OSBOLD = "Oswald_700Bold";
const OSSEMIBOLD = "Oswald_600SemiBold";

type ConfirmModalProps = {
  visible: boolean;
  title?: string;
  message?: string;
  onCancel: () => void;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
};

export default function ConfirmModal({
  visible,
  title = "Are you sure?",
  message = "Please confirm your action.",
  onCancel,
  onConfirm,
  confirmText = "Yes",
  cancelText = "Cancel",
}: ConfirmModalProps) {
  const isDark = useColorScheme() === "dark";

  // Internal state to delay unmount after animation out
  const [showModal, setShowModal] = useState(visible);

  useEffect(() => {
    if (visible) {
      setShowModal(true);
    } else {
      const timeout = setTimeout(() => setShowModal(false), 300); // match animationOut duration
      return () => clearTimeout(timeout);
    }
  }, [visible]);

  if (!showModal) return null;

  const styles = StyleSheet.create({
    container: {
      backgroundColor: isDark
        ? "rgba(100, 100, 100, 0.5)"
        : "rgba(255, 255, 255, 0.5)",
      borderRadius: 20,
      justifyContent: "center",
      padding: 20,
      paddingBottom: 30,
      width: "100%",
      alignItems: "center",
      overflow: "hidden",
      marginBottom: 10,
      minHeight: 400,
    },
    dragIndicator: {
      width: 40,
      height: 4,
      borderRadius: 2,
      backgroundColor: isDark ? "#ccc" : "#666",
      marginBottom: 12,
      alignSelf: "center",
    },

    title: {
      fontSize: 28,
      fontFamily: OSBOLD,
      color: isDark ? "#fff" : "#000",
      textAlign: "center",
    },
    message: {
      fontSize: 16,
      color: isDark ? "#ddd" : "#333",
      marginBottom: 20,
      textAlign: "center",
      fontFamily: OSREGULAR,
    },
    buttonRow: {
      width: "100%",
    },
    button: {
      paddingVertical: 14,
      paddingHorizontal: 16,
      borderRadius: 8,
      marginVertical: 4,
    },
    cancelButton: {
      backgroundColor: isDark ? "#555" : "#eee",
    },
    confirmButton: {
      backgroundColor: isDark ? "#e74c3c" : "#d9534f",
    },
    cancelText: {
      color: isDark ? "#ddd" : "#333",
      fontFamily: OSBOLD,
      textAlign: "center",
      fontSize: 16,
    },
    confirmText: {
      color: "#fff",
      fontFamily: OSBOLD,
      textAlign: "center",
      fontSize: 16,
    },
    content: {
      flex: 1,
      justifyContent: "space-evenly",
      alignItems: "center",
      width: "100%",
    },
  });

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onCancel}
      onBackButtonPress={onCancel}
      swipeDirection="down"
      onSwipeComplete={onCancel}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      backdropTransitionOutTiming={200}
      backdropOpacity={0.5}
      style={{ justifyContent: "flex-end", margin: 0 }}
    >
      <View
        style={{
          paddingHorizontal: 16,
          paddingBottom: 16,
          width: "100%",
          minHeight: 360,
        }}
      >
        <View style={styles.container}>
          <BlurView
            intensity={80}
            tint={isDark ? "dark" : "light"}
            style={StyleSheet.absoluteFill}
          />

          {/* Drag Indicator */}
          <View style={styles.dragIndicator} />

          {/* Content */}
          <View style={styles.content}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>{message}</Text>
            <View style={styles.buttonRow}>
              <Pressable
                onPress={onCancel}
                style={[styles.button, styles.cancelButton]}
              >
                <Text style={styles.cancelText}>{cancelText}</Text>
              </Pressable>
              <Pressable
                onPress={onConfirm}
                style={[styles.button, styles.confirmButton]}
              >
                <Text style={styles.confirmText}>{confirmText}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}
