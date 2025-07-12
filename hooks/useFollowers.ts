import { useEffect, useState } from "react";

export type User = {
  id: string;
  username: string;
  profile_image: string;
  isFollowing: boolean;
};

export function useFollowers(
  currentUserId: string,
  targetUserId: string,
  type: "followers" | "following"
) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Convert string IDs to numbers
  const currentUserIdNum = Number(currentUserId);
  const targetUserIdNum = Number(targetUserId);

  useEffect(() => {
    if (!targetUserId) {
      console.log("[useFollowers] No targetUserId provided, skipping fetch");
      return;
    }

    console.log(`[useFollowers] Fetching ${type} for user:`, targetUserIdNum);

    setLoading(true);
    setError(null);

    fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/follows/${targetUserIdNum}/${type}`)
      .then((res) => {
        console.log(`[useFollowers] Response status: ${res.status}`);
        if (!res.ok) throw new Error("Failed to fetch users");
        return res.json();
      })
      .then((data: User[]) => {
        console.log("[useFollowers] Fetched users:", data);
        setUsers(data);
      })
      .catch((err) => {
        console.error("[useFollowers] Error fetching users:", err);
        setError(err.message || "Error fetching users");
      })
      .finally(() => {
        console.log("[useFollowers] Fetch completed");
        setLoading(false);
      });
  }, [targetUserIdNum, type]); // use numeric ID as dependency

  const toggleFollow = async (followeeId: string) => {
    console.log("[useFollowers] Toggling follow for:", followeeId);
    try {
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/follows/toggle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          followerId: currentUserIdNum,  // send numeric ID
          followeeId: Number(followeeId), // ensure numeric ID
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to toggle follow");
      }

      const data = await res.json();
      console.log("[useFollowers] Toggle follow response:", data);

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === followeeId ? { ...user, isFollowing: data.isFollowing } : user
        )
      );
    } catch (err) {
      console.error("[useFollowers] Toggle follow failed:", err);
    }
  };

  return { users, loading, error, toggleFollow };
}
