import { Fonts } from "@/constants/fonts";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },

  searchBarWrapper: {
    overflow: "hidden",
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#888",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    color: "#000",
    fontFamily: Fonts.OSLIGHT,
  },
  searchInputDark: {
    borderColor: "#555",
    color: "#fff",
  },
  itemContainer: {
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  itemContainerDark: {
    borderBottomColor: "#333",
  },
  teamName: {
    fontSize: 18,
    fontFamily: Fonts.OSSEMIBOLD,
  },
  playerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
    backgroundColor: "#888",
  },
  playerInfo: {
   
  },
  playerName: {
    fontSize: 18,
    fontFamily: Fonts.OSSEMIBOLD,
  },
  playerTeam: {
    fontSize: 14,
    color: "#555",
    fontFamily: Fonts.OSLIGHT,
    opacity: 0.5,
  },
  textDark: {
    color: "#eee",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#888",
  },
  errorText: {
    color: "red",
    textAlign: "center",
  },
  errorTextDark: {
    color: "#ff6666",
  },
  centerPrompt: {
    flex: 1,
    marginTop: 80,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  nbaLogo: {
    width: 100,
    height: 100,
    marginBottom: 12,
  },
  promptText: {
    fontSize: 24,
    fontFamily: Fonts.OSREGULAR,
    color: "#555",
  },

  teamRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  teamLogo: {
    width: 48,
    height: 48,
    marginRight: 12,
  },

  userRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  userInfo: {
   
  },
  userName: {
    fontSize: 18,
    fontFamily: Fonts.OSSEMIBOLD,
  },

  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    marginBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#888",
  },
});
