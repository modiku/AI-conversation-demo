import { useEffect, useState } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { useAuth } from "./useAuth";
import type { Role } from "../types";

export function useRoles() {
  const { user } = useAuth();
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "users", user.uid, "roles"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() }) as Role
      );
      // Sort: roles with recent messages first, then by creation time
      items.sort((a, b) => {
        const aTime = a.lastMessageAt?.toMillis() ?? 0;
        const bTime = b.lastMessageAt?.toMillis() ?? 0;
        if (aTime !== bTime) return bTime - aTime;
        return b.createdAt.toMillis() - a.createdAt.toMillis();
      });
      setRoles(items);
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  const createRole = async (data: {
    name: string;
    description: string;
    systemPrompt: string;
    avatar: string;
  }) => {
    if (!user) return;
    await addDoc(collection(db, "users", user.uid, "roles"), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastMessageAt: null,
      messageCount: 0,
    });
  };

  const updateRole = async (
    roleId: string,
    data: Partial<{
      name: string;
      description: string;
      systemPrompt: string;
      avatar: string;
    }>
  ) => {
    if (!user) return;
    await updateDoc(doc(db, "users", user.uid, "roles", roleId), {
      ...data,
      updatedAt: serverTimestamp(),
    });
  };

  const deleteRole = async (roleId: string) => {
    if (!user) return;
    // Delete all messages in the role first
    const messagesRef = collection(
      db,
      "users",
      user.uid,
      "roles",
      roleId,
      "messages"
    );
    const messagesSnapshot = await getDocs(messagesRef);
    const deletePromises = messagesSnapshot.docs.map((d) =>
      deleteDoc(d.ref)
    );
    await Promise.all(deletePromises);
    // Then delete the role
    await deleteDoc(doc(db, "users", user.uid, "roles", roleId));
  };

  return { roles, loading, createRole, updateRole, deleteRole };
}
