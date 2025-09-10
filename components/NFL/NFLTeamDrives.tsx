// components/NFL/NFLTeamDrives.tsx
import { getNFLTeamsLogo } from "@/constants/teamsNFL";
import { useEffect, useMemo, useState } from "react";
import { Image, StyleSheet, Text, useColorScheme, View } from "react-native";
import HeadingTwo from "../Headings/HeadingTwo";
import FixedWidthTabBar, { getLabelStyle } from "./FixedWidthTabBar";
import NFLDrivesList, { Drive } from "./NFLDrivesList";

type Props = {
  previousDrives?: Drive[] | null;
  currentDrives?: Drive[] | null;
  loading?: boolean;
  error?: string | null;
};

export default function NFLTeamDrives({
  previousDrives = [],
  currentDrives = [],
  loading = false,
  error = null,
}: Props) {
  const isDark = useColorScheme() === "dark";
  const styles = getStyles(isDark);

  // ✅ Normalize to arrays
  const prev = Array.isArray(previousDrives) ? previousDrives : [];
  const curr = Array.isArray(currentDrives) ? currentDrives : [];

  const allDrives = useMemo(() => [...curr, ...prev], [curr, prev]);

  // ✅ unique team abbreviations (safe strings only)
  const teams = useMemo(
    () =>
      Array.from(
        new Set(
          allDrives
            .map((d) =>
              typeof d?.team?.abbreviation === "string"
                ? d.team.abbreviation.trim()
                : null
            )
            .filter((abbr): abbr is string => !!abbr)
        )
      ),
    [allDrives]
  );

  const [selectedTeam, setSelectedTeam] = useState<string>("");

  // ✅ auto-select first available team when teams change
  useEffect(() => {
    if (teams.length > 0) {
      if (!selectedTeam || !teams.includes(selectedTeam)) {
        setSelectedTeam(teams[0]);
      }
    } else {
      setSelectedTeam("");
    }
  }, [teams, selectedTeam]);

  const teamDrives = useMemo(
    () => allDrives.filter((d) => d?.team?.abbreviation === selectedTeam),
    [allDrives, selectedTeam]
  );
  const safeDrives = teamDrives.filter((d) => d?.team?.abbreviation);

  // ✅ if no teams, just render all drives list
  if (teams.length === 0) {
    return (
      <NFLDrivesList
        previousDrives={prev}
        currentDrives={curr}
        loading={loading}
        error={error}
      />
    );
  }

  return (
    <View style={styles.container}>
      <HeadingTwo>Drives</HeadingTwo>

      <FixedWidthTabBar
        tabs={teams} // string[]
        selected={selectedTeam}
        onTabPress={setSelectedTeam}
        renderLabel={(abbr, isSelected) => {
          if (!abbr) return null; // defensive

          const logo = getNFLTeamsLogo(abbr, isDark);
          return (
            <View style={styles.tabLabel}>
              {logo && (
                <Image
                  source={logo}
                  style={[styles.logo, { opacity: isSelected ? 1 : 0.5 }]}
                  resizeMode="contain"
                />
              )}
              <Text style={getLabelStyle(isDark, isSelected, { fontSize: 12 })}>
                {abbr}
              </Text>
            </View>
          );
        }}
      />

      <NFLDrivesList
        previousDrives={[]} // only show selected team’s drives
        currentDrives={safeDrives}
        loading={loading}
        error={error}
      />
    </View>
  );
}

const getStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      marginTop: 10,
    },
    tabLabel: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    logo: {
      width: 28,
      height: 28,
    },
  });
