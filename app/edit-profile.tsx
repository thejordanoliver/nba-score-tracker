import { CustomHeaderTitle } from "@/components/CustomHeaderTitle";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { useNavigation, useRouter } from "expo-router";
import { goBack } from "expo-router/build/global-state/routing";
import { useEffect, useLayoutEffect, useState } from "react";
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

const BANNER_HEIGHT = 120;
const PROFILE_PIC_SIZE = 120;
const BASE_URL =
  "https://022d-2600-1006-b173-fec0-9d1d-aa0e-45fc-e30f.ngrok-free.app";

export default function EditProfileScreen() {
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [bannerImage, setBannerImage] = useState<string | null>(null);
  const isDark = useColorScheme() === "dark";
  const router = useRouter();
  const navigation = useNavigation();

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

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <CustomHeaderTitle title="Edit Favorites" onBack={goBack} />
      ),
    });
  }, [navigation, isDark]);

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
    const formData = new FormData();

    formData.append("fullName", fullName);
    formData.append("email", email);
    formData.append("bio", bio || "");

    // Append bannerImage - if local file, append file, else send URL string or omit if null
    if (bannerImage?.startsWith("file://")) {
      const filename = bannerImage.split("/").pop()!;
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : "image";

      formData.append("bannerImage", {
        uri: bannerImage,
        name: filename,
        type,
      } as any);
    } else if (bannerImage) {
      formData.append("bannerImage", bannerImage);
    }

    // Append profileImage - same logic as before
    if (profileImage?.startsWith("file://")) {
      const filename = profileImage.split("/").pop()!;
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : "image";

      formData.append("profileImage", {
        uri: profileImage,
        name: filename,
        type,
      } as any);
    } else if (profileImage) {
      formData.append("profileImage", profileImage);
    }

    const res = await fetch(`${BASE_URL}/api/users/${username}`, {
      method: "PATCH",
      headers: {
        // Do NOT set Content-Type header manually when sending FormData with fetch,
        // let fetch set the proper multipart/form-data boundary header automatically
      },
      body: formData,
    });

    if (!res.ok) {
      throw new Error("Failed to update profile");
    }

    const data = await res.json();

    // Save returned user data in AsyncStorage
    await AsyncStorage.setItem("fullName", data.user.full_name);
    await AsyncStorage.setItem("email", data.user.email);
    await AsyncStorage.setItem("bio", data.user.bio || "");
    if (data.user.profile_image)
      await AsyncStorage.setItem("profileImage", data.user.profile_image);

    if (data.user.banner_image) {
      await AsyncStorage.setItem("bannerImage", data.user.banner_image);
    } else {
      await AsyncStorage.removeItem("bannerImage");
    }

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
      <ScrollView
        contentContainerStyle={{
          paddingBottom: 40,
          backgroundColor: isDark ? "#1d1d1d" : "#fff",
        }}
      >
        <View style={[styles.container]}>
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
              <View style={[styles.profilePic, { backgroundColor: "#888" }]}>
                <Text style={styles.profilePlaceholderText}>
                  Tap to add pic
                </Text>
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
      borderColor: isDark ? "#1d1d1d" : "#fff",
    },

    formContainer: {
      paddingTop: 60,
    },
    label: {
      marginTop: 40,
      marginBottom: 20,
      fontSize: 16,
      fontFamily: "Oswald_400Regular",
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
      padding: 16,
      borderRadius: 8,
      alignItems: "center",
      marginHorizontal: 20,
    },
    saveButtonText: {
      color: isDark ? "#000" : "#fff",
      fontSize: 16,
      fontFamily: "Oswald_500Medium",
    },
    placeholderText: {
      color: "#fff",
      fontFamily: "Oswald_400Regular",
      fontSize: 20,
      marginBottom: 40,
      textAlign: "center",
    },
    profilePlaceholderText: {
      color: "#fff",
      fontFamily: "Oswald_400Regular",
      fontSize: 16,
      textAlign: "center",
      marginVertical: 40,
      marginHorizontal: 0,
    },
  });
