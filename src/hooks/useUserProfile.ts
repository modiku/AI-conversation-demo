import { useEffect, useState, useCallback, useMemo } from "react";
import { doc, onSnapshot, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../config/firebase";
import { useAuth } from "./useAuth";
import type { UserProfile } from "../types";

const noopUpdate = async () => {};

export function useUserProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = onSnapshot(
      doc(db, "users", user.uid),
      (snapshot) => {
        if (snapshot.exists()) {
          setProfile(snapshot.data() as UserProfile);
        } else {
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [user]);

  // Reset when user logs out
  const currentProfile = user ? profile : null;
  const currentLoading = user ? loading : false;

  const updateProfile = useCallback(
    async (data: Partial<Pick<UserProfile, "displayName" | "avatarUrl">>) => {
      if (!user) return;
      await updateDoc(doc(db, "users", user.uid), {
        ...data,
        updatedAt: serverTimestamp(),
      });
    },
    [user]
  );

  return useMemo(
    () => ({
      profile: currentProfile,
      loading: currentLoading,
      updateProfile: user ? updateProfile : noopUpdate,
    }),
    [currentProfile, currentLoading, user, updateProfile]
  );
}
