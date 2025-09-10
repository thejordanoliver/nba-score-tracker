// components/NFL/NFLOfficials.tsx
import { Fonts } from "@/constants/fonts";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";
import HeadingTwo from "../Headings/HeadingTwo";

type Official = {
  displayName: string;
  position?: {
    displayName: string;
  };
};

type Props = {
  officials: Official[];
  loading: boolean;
  error: any;
};

export default function NFLOfficials({ officials, loading, error }: Props) {
  const isDark = useColorScheme() === "dark";
  const styles = getStyles(isDark);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="small" />
        <Text style={styles.loadingText}>Loading officials...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Failed to load officials</Text>
      </View>
    );
  }

  if (!officials || officials.length === 0) return null;

  // If odd number of officials, add a placeholder empty card to balance the row
  const officialsData =
    officials.length % 2 === 0 ? officials : [...officials, { displayName: "", position: { displayName: "" } }];

  return (
    <View style={styles.container}>
      <HeadingTwo>Game Officials</HeadingTwo>
      <FlatList
        data={officialsData}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => {
          // Empty placeholder for last card if odd
          if (!item.displayName) return <View style={[styles.card, { backgroundColor: "transparent" }]} />;

          const initials = item.displayName
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase();

          return (
            <View style={styles.card}>
              {/* Placeholder circle */}
              <View style={styles.placeholder}>
                <Text style={styles.initials}>{initials}</Text>
              </View>
              {/* Position and Name */}
              <Text style={styles.position}>
                {item.position?.displayName ?? "Official"}
              </Text>
              <Text style={styles.name}>{item.displayName}</Text>
            </View>
          );
        }}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        numColumns={2}
        columnWrapperStyle={styles.row}
        scrollEnabled={false}
      />
    </View>
  );
}

const getStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      marginTop: 20,
      borderRadius: 8,
    },
    row: {
      justifyContent: "space-between",
      marginBottom: 10,
    },
    card: {
      flex: 0.48, // ensures two cards per row with spacing
      padding: 12,
      borderRadius: 8,
      backgroundColor: isDark ? "#2e2e2e" : "#eee",
      elevation: 2,
      alignItems: "center",
    },
    placeholder: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: isDark ? "#555" : "#aaa",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 8,
    },
    initials: {
      color: "#fff",
      fontSize: 18,
      fontFamily: Fonts.OSBOLD,
    },
    position: {
      fontSize: 14,
      fontFamily: Fonts.OSSEMIBOLD,
      color: isDark ? "#888" : "#888",
      marginBottom: 4,
      textAlign: "center",
    },
    name: {
      fontSize: 16,
      fontFamily: Fonts.OSMEDIUM,
      color: isDark ? "#fff" : "#1d1d1d",
      textAlign: "center",
    },
    loadingText: {
      marginTop: 8,
      fontSize: 14,
      color: "#333",
    },
    errorText: {
      fontSize: 14,
      color: "red",
    },
  });
