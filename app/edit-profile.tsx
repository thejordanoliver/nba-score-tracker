import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from "react-native";
const BANNER_HEIGHT = 180;
const PROFILE_PIC_SIZE = 120;

export default function EditProfileScreen() {
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [bannerImage, setBannerImage] = useState<string | null>(null);
  const isDark = useColorScheme() === "dark";
  const router = useRouter();

  useEffect(() => {
    const loadData = async () => {
      const storedUsername = await AsyncStorage.getItem("username");
      const storedFullName = await AsyncStorage.getItem("fullName");
      const storedEmail = await AsyncStorage.getItem("email");
      const storedBio = await AsyncStorage.getItem("bio");
      const storedProfileImage = await AsyncStorage.getItem("profileImage");
      const storedBannerImage = await AsyncStorage.getItem("bannerImage");
      if (storedUsername) setUsername(storedUsername);
      if (storedFullName) setFullName(storedFullName);
      if (storedEmail) setEmail(storedEmail);
      if (storedBio) setBio(storedBio);
      if (storedProfileImage) setProfileImage(storedProfileImage);
      if (storedBannerImage) setBannerImage(storedBannerImage);
    };
    loadData();
  }, []);

  const pickImage = async (setImage: (uri: string) => void) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission denied",
        "We need permission to access your gallery."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: true,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImage(uri);
    }
  };

  const handleSave = async () => {
    try {
      await AsyncStorage.setItem("username", username);
      await AsyncStorage.setItem("fullName", fullName);
      await AsyncStorage.setItem("email", email);
      await AsyncStorage.setItem("bio", bio);
      if (profileImage)
        await AsyncStorage.setItem("profileImage", profileImage);
      if (bannerImage) await AsyncStorage.setItem("bannerImage", bannerImage);
      Alert.alert("Saved", "Profile updated.");
      router.back();
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to save profile info.");
    }
  };

  const styles = getStyles(isDark);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={{ paddingBottom: 40,  backgroundColor: isDark ? "#121212" : "#fff", }}>

        <View
          style={[
            styles.container
          ]}
        >
          <Pressable onPress={() => pickImage(setBannerImage)}>
            {bannerImage ? (
              <Image source={{ uri: bannerImage }} style={styles.banner} />
            ) : (
              <View style={[styles.banner, { backgroundColor: "#888" }]}>
                <Text style={styles.placeholderText}>Tap to add banner</Text>
              </View>
            )}
          </Pressable>

          <Pressable
            onPress={() => pickImage(setProfileImage)}
            style={styles.profilePicContainer}
          >
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.profilePic} />
            ) : (
              <View style={[styles.profilePic, { backgroundColor: "#ccc" }]}>
                <Text style={styles.placeholderText}>Add Pic</Text>
              </View>
            )}
          </Pressable>

          <View style={styles.formContainer}>
            <Text style={[styles.label, { color: isDark ? "#fff" : "#000" }]}>
              Name
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  color: isDark ? "#fff" : "#000",
                  backgroundColor: isDark ? "#222" : "#eee",
                },
              ]}
              value={fullName}
              onChangeText={setFullName}
            />
            <Text style={[styles.label, { color: isDark ? "#fff" : "#000" }]}>
              Username
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  color: isDark ? "#fff" : "#000",
                  backgroundColor: isDark ? "#222" : "#eee",
                },
              ]}
              value={username}
              onChangeText={setUsername}
            />

            <Text style={[styles.label, { color: isDark ? "#fff" : "#000" }]}>
              Email
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  color: isDark ? "#fff" : "#000",
                  backgroundColor: isDark ? "#222" : "#eee",
                },
              ]}
              value={email}
              onChangeText={setEmail}
            />

            <Text style={[styles.label, { color: isDark ? "#fff" : "#000" }]}>
              Bio
            </Text>
            <TextInput
              style={[
                styles.input,
                styles.bioInput,
                {
                  color: isDark ? "#fff" : "#000",
                  backgroundColor: isDark ? "#222" : "#eee",
                },
              ]}
              multiline
              value={bio}
              onChangeText={setBio}
            />

            <Pressable style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const getStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      backgroundColor: isDark ? "#121212" : "#fff",
      flex: 1,
      
    },
    banner: {
      height: BANNER_HEIGHT,
      width: "100%",
      borderRadius: 0,
      marginBottom: 12,
      resizeMode: "cover",
      justifyContent: "center",
      alignItems: "center",
    },
    profilePicContainer: {
      position: "absolute",
      top: BANNER_HEIGHT - 60, // Adjust as needed
      alignSelf: "center",
      zIndex: 10,
    },
    profilePic: {
      width: PROFILE_PIC_SIZE,
      height: PROFILE_PIC_SIZE,
      borderRadius: PROFILE_PIC_SIZE / 2,
      borderWidth: 4,
      borderColor: isDark ? "#121212" : "#fff",
    },

    formContainer: {
      paddingTop: 60,

    },
    label: {
      marginTop: 40,
      marginBottom: 20,
      fontSize: 16,
      fontFamily: "Oswald_500Medium",
      marginHorizontal: 20,
    },
    input: {
      padding: 20,
      borderRadius: 8,
      fontSize: 16,
      marginBottom: 12,
      marginHorizontal: 20,
      fontFamily: "Oswald_300Light",
    },
    bioInput: {
      marginHorizontal: 16,
      height: 100,
      textAlignVertical: "top",
    },
    saveButton: {
      marginVertical: 24,
     backgroundColor: isDark ? "#fff" : "#000",
      padding: 14,
      borderRadius: 8,
      alignItems: "center",
      marginHorizontal: 20,
    },
    saveButtonText: {
      color: isDark ? "#000" : "#fff",
      fontSize: 16,
      fontWeight: "600",
    },
    placeholderText: {
      color: "#fff",
      fontWeight: "500",
    },
  });
