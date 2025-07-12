import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { getStyles } from "../../styles/ProfileScreen.styles";
import FollowersModal from "./FollowersModal";

type Props = {
  followersCount: number;
  followingCount: number;
  isDark: boolean;
  currentUserId: string;
  targetUserId: string;
  onFollowersPress?: () => void;
  onFollowingPress?: () => void;
};

export default function FollowStats({
  followersCount,
  followingCount,
  isDark,
  currentUserId,
  targetUserId,
  onFollowersPress,
  onFollowingPress,
}: Props) {
  const styles = getStyles(isDark);

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<"followers" | "following">("followers");

  const openModal = (type: "followers" | "following") => {
    if ((type === "followers" && onFollowersPress) || (type === "following" && onFollowingPress)) {
      // Use external handler if provided
      type === "followers" ? onFollowersPress?.() : onFollowingPress?.();
    } else {
      // Fallback to internal modal
      setModalType(type);
      setShowModal(true);
    }
  };

  const closeModal = () => setShowModal(false);

  return (
    <>
      <View style={styles.followContainer}>
        <TouchableOpacity
          onPress={() => openModal("followers")}
          style={styles.followItem}
          activeOpacity={0.6}
        >
          <Text style={styles.followCount}>{followersCount}</Text>
          <Text style={styles.followLabel}>Followers</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => openModal("following")}
          style={styles.followItem}
          activeOpacity={0.6}
        >
          <Text style={styles.followCount}>{followingCount}</Text>
          <Text style={styles.followLabel}>Following</Text>
        </TouchableOpacity>
      </View>

      {/* Internal modal only used if external handlers not passed */}
      {!(onFollowersPress || onFollowingPress) && (
        <FollowersModal
          visible={showModal}
          onClose={closeModal}
          type={modalType}
          currentUserId={currentUserId}
          targetUserId={targetUserId}
        />
      )}
    </>
  );
}
