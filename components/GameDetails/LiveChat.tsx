import { Fonts } from "@/constants/fonts";
import { useAuth } from "@/hooks/useAuth";
import { Ionicons } from "@expo/vector-icons";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { BlurView } from "expo-blur";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import io from "socket.io-client";
import ChatMessage from "./ChatMessage";

const SOCKET_URL =
  process.env.EXPO_PUBLIC_SOCKET_URL || "http://localhost:4000";
const BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:4000";

interface Message {
  user: string;
  message: string;
  time: number;
  profile_image?: string;
  reactions?: { [emoji: string]: string[] };
}

interface Props {
  gameId: string | number;
  onChange?: (index: number) => void;
}

export default function LiveChatBottomSheet({ gameId, onChange }: Props) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const socketRef = useRef<SocketIOClient.Socket | null>(null);
  const flatListRef = useRef<FlatList>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const isDark = useColorScheme() === "dark";
  const styles = getStyles(isDark);
  const userName = user?.username ?? "Anonymous";
  const userProfile = user?.profile_image;
  const [userCount, setUserCount] = useState(0);
  const snapPoints = useMemo(() => ["25%", "50%", "75%", "90%"], []);
  const EMOJIS = ["😂", "🔥"];

  const addReaction = (index: number, emoji: string) => {
    const currentUser = userName;
    setMessages((prev) => {
      const newMessages = [...prev];
      const message = newMessages[index];
      if (!message.reactions) message.reactions = {};
      const users = message.reactions[emoji] || [];
      if (users.includes(currentUser)) {
        message.reactions[emoji] = users.filter((u) => u !== currentUser);
      } else {
        message.reactions[emoji] = [...users, currentUser];
      }
      return newMessages;
    });
  };

  // Expand BottomSheet after mounting
  useEffect(() => {
    if (gameId != null) {
      const timeout = setTimeout(() => bottomSheetRef.current?.expand(), 50);
      return () => clearTimeout(timeout);
    } else {
      bottomSheetRef.current?.close();
    }
  }, [gameId]);

  useEffect(() => {
    const socket = io(SOCKET_URL);
    socketRef.current = socket;
    socket.emit("joinGame", gameId);
    socket.on("receiveMessage", (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
      flatListRef.current?.scrollToEnd({ animated: true });
    });
    socket.on("userCount", setUserCount);

    return () => {
      socket.disconnect();
    };
  }, [gameId]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const msg: Message = {
      user: userName,
      message: input,
      time: Date.now(),
      profile_image: userProfile,
    };
    socketRef.current?.emit("sendMessage", { gameId, ...msg });
    setInput("");
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 50);
  };

  const renderMessage = ({ item, index }: { item: Message; index: number }) => (
    <ChatMessage
      item={item}
      index={index}
      userName={userName}
      isDark={isDark}
      baseUrl={BASE_URL}
      emojis={EMOJIS}
      onReaction={addReaction}
    />
  );

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      onChange={onChange}
      enablePanDownToClose
      enableDynamicSizing={false}
      backgroundComponent={() => (
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: isDark
                ? "rgba(0, 0, 0, 0.25)"
                : "rgba(255, 255, 255, 0.25)",
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              overflow: "hidden",
            },
          ]}
        >
          <BlurView
            intensity={80}
            tint="systemUltraThinMaterial"
            style={[
              StyleSheet.absoluteFill,
              { backgroundColor: isDark ? "#1a1a1aCC" : "#ffffffCC" },
            ]}
          />
        </View>
      )}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      handleIndicatorStyle={{
        backgroundColor: isDark ? "#fff" : "#1d1d1d",
        width: 36,
        height: 4,
      }}
    >
      <BottomSheetView style={{ flex: 1 }}>
        <View style={{ padding: 12, alignItems: "center", flex: 1 }}>
          <Text
            style={{
              color: isDark ? "#aaa" : "#555",
              fontFamily: Fonts.OSREGULAR,
            }}
          >
            {userCount} {userCount === 1 ? "person" : "people"} in chat
          </Text>
        </View>

        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(_, idx) => idx.toString()}
          renderItem={renderMessage}
          style={{ height: 400 }} // <-- fixed height
          contentContainerStyle={{
            paddingHorizontal: 12,
            paddingBottom: 12,
            justifyContent: "flex-end",
          }}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        />

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={20}
        >
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Type your message..."
              placeholderTextColor={isDark ? "#aaa" : "#555"}
              value={input}
              onChangeText={setInput}
              onSubmitEditing={sendMessage}
              returnKeyType="send"
            />
            <TouchableOpacity onPress={sendMessage}>
              <Ionicons
                name="send"
                size={24}
                color={isDark ? "#fff" : "#1d1d1d"}
              />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </BottomSheetView>
    </BottomSheet>
  );
}

const getStyles = (isDark: boolean) =>
  StyleSheet.create({
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      padding: 8,
      borderTopWidth: 1,
      borderColor: isDark ? "#333" : "#ccc",
    },
    input: {
      flex: 1,
      padding: 10,
      borderRadius: 8,
      marginRight: 8,
      backgroundColor: isDark ? "#2e2e2e" : "#eee",
      color: isDark ? "#fff" : "#1d1d1d",
      fontFamily: Fonts.OSREGULAR,
    },
  });
