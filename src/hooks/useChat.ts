import { useEffect, useState, useCallback } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  doc,
  updateDoc,
  serverTimestamp,
  increment,
  limit,
  getDocs,
} from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { db, functions } from "../config/firebase";
import { useAuth } from "./useAuth";
import type { Message, Role } from "../types";

const chatFn = httpsCallable<
  { messages: { role: string; content: string }[] },
  { content: string }
>(functions, "chat");

export function useChat(roleId: string, role: Role | null) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!user || !roleId) return;

    const q = query(
      collection(db, "users", user.uid, "roles", roleId, "messages"),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() }) as Message
      );
      setMessages(items);
      setLoading(false);
    });

    return unsubscribe;
  }, [user, roleId]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!user || !role || !content.trim() || sending) return;

      setSending(true);
      const messagesRef = collection(
        db,
        "users",
        user.uid,
        "roles",
        roleId,
        "messages"
      );
      const roleRef = doc(db, "users", user.uid, "roles", roleId);

      try {
        // 1. Save user message
        await addDoc(messagesRef, {
          role: "user",
          content: content.trim(),
          createdAt: serverTimestamp(),
        });

        // 2. Build context: system prompt + recent messages
        const recentQuery = query(
          messagesRef,
          orderBy("createdAt", "desc"),
          limit(20)
        );
        const recentSnapshot = await getDocs(recentQuery);
        const recentMessages = recentSnapshot.docs
          .map((d) => d.data())
          .reverse()
          .map((m) => ({
            role: m.role as string,
            content: m.content as string,
          }));

        const contextMessages = [
          { role: "system", content: role.systemPrompt },
          ...recentMessages,
        ];

        // 3. Call Cloud Function
        const result = await chatFn({ messages: contextMessages });

        // 4. Save assistant message
        await addDoc(messagesRef, {
          role: "assistant",
          content: result.data.content,
          createdAt: serverTimestamp(),
        });

        // 5. Update role metadata
        await updateDoc(roleRef, {
          lastMessageAt: serverTimestamp(),
          messageCount: increment(2),
        });
      } catch (error) {
        console.error("Send message error:", error);
        // Save error message for user feedback
        await addDoc(messagesRef, {
          role: "assistant",
          content: "抱歉，AI 响应失败，请稍后重试。",
          createdAt: serverTimestamp(),
        });
        await updateDoc(roleRef, {
          lastMessageAt: serverTimestamp(),
          messageCount: increment(2),
        });
      } finally {
        setSending(false);
      }
    },
    [user, role, roleId, sending]
  );

  return { messages, loading, sending, sendMessage };
}
