import { useRouter } from "expo-router";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

type HighlightCardProps = {
  videoId: string;
  title: string;
  publishedAt: string;
  thumbnail: string;
};

export default function HighlightCard({
  videoId,
  title,
  publishedAt,
  thumbnail,
}: HighlightCardProps) {
  const router = useRouter();
  const isDark = useColorScheme() === "dark";
  const styles = getStyles(isDark);

  const handlePress = () => {
    router.push({
      pathname: "/highlights/video",
      params: { videoId, title },
    });
  };

  const publishedDate = new Date(publishedAt).toLocaleDateString();

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.85}>
      <View style={styles.card}>
        <Image source={{ uri: thumbnail }} style={styles.thumbnail} />
        <View style={styles.details}>
          <Text numberOfLines={2} style={styles.title}>
            {title}
          </Text>
          <Text style={styles.date}>{publishedDate}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const getStyles = (isDark: boolean) =>
  StyleSheet.create({
    card: {
      flexDirection: "column",
      backgroundColor: isDark ? "#2e2e2e" : "#eee",
      paddingBottom: 12,
      marginVertical: 8,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: isDark ? "#3a3a3a" : "#e6e6e6",
      overflow: "hidden",
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 6,
      elevation: 3,
    },
    thumbnail: {
      width: "100%",
      height: 200,
      resizeMode: "cover",
    },
    details: {
      paddingHorizontal: 12,
      marginTop: 8,
    },
    title: {
      fontFamily: "Oswald_700Bold",
      fontSize: 16,
      marginBottom: 4,
      color: isDark ? "#fff" : "#1d1d1d",
    },
    date: {
      fontFamily: "Oswald_400Regular",
      fontSize: 12,
      color: isDark ? "#aaa" : "#666",
      fontStyle: "italic",
    },
  });
