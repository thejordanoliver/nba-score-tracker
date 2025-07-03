import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useEffect, useState } from "react";
import {
  Appearance,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";
import Modal from "react-native-modal";

LocaleConfig.locales["custom"] = {
  monthNames: [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ],
  monthNamesShort: [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ],
  dayNames: [
    "Sunday", "Monday", "Tuesday", "Wednesday",
    "Thursday", "Friday", "Saturday",
  ],
  dayNamesShort: ["S", "M", "T", "W", "T", "F", "S"], // <-- just the first letter here
  today: "Today",
};


LocaleConfig.defaultLocale = "custom";

type CalendarDay = {
  dateString: string;
  day: number;
  month: number;
  year: number;
  timestamp: number;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  onSelectDate: (date: string) => void;
  markedDates: { [key: string]: any };
};

export default function CalendarModal({
  visible,
  onClose,
  onSelectDate,
  markedDates,
}: Props) {
  const systemColorScheme = useColorScheme();
  const [isDark, setIsDark] = useState(systemColorScheme === "dark");

  useEffect(() => {
    const listener = Appearance.addChangeListener(({ colorScheme }) => {
      setIsDark(colorScheme === "dark");
    });
    return () => listener.remove();
  }, []);

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      backdropOpacity={0.5}
      style={styles.modal}
    >
      <BlurView
        intensity={100}
        tint={isDark ? "dark" : "light"}
        style={styles.blurContainer}
      >
        <View style={styles.calendarWrapper}>
          {/* X Button */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={28} color={isDark ? "#fff" : "#1d1d1d"} />
          </TouchableOpacity>

<Calendar
  markedDates={markedDates}
  onDayPress={(day: CalendarDay) => {
    onSelectDate(day.dateString);
    onClose();
  }}
  theme={{
    backgroundColor: "transparent",
    calendarBackground: "transparent",
    textSectionTitleColor: isDark ? "white" : "#444", // Days of week
    selectedDayBackgroundColor: isDark ? "#fff" : "#1d1d1d",
    selectedDayTextColor: isDark ? "#1d1d1d" : "#fff",
    todayTextColor: isDark ? "#ff7675" : "red",
    dayTextColor: isDark ? "#fff" : "#1d1d1d",
    textDisabledColor: isDark ? "#555" : "#ccc",
    dotColor: isDark ? "#fff" : "#1d1d1d",
    selectedDotColor: isDark ? "#1d1d1d" : "#fff",
    monthTextColor: isDark ? "#fff" : "#1d1d1d",
    arrowColor: isDark ? "#fff" : "#1d1d1d",
    textMonthFontWeight: "bold",
    textDayFontWeight: "700",
    textMonthFontSize: 24,
    textDayFontSize: 20,
    textDayHeaderFontSize: 18,
  }}
/>


        </View>
      </BlurView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  blurContainer: {
    flex: 1,
    width: "100%",
    height: "100%",
    paddingTop: 100,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  calendarWrapper: {
    borderRadius: 20,
    padding: 20,
    width: "100%",
    height: 500,
  },
  closeButton: {
    alignSelf: "flex-end",
    marginBottom: 10,
    padding: 5,
  },
});
