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
import { useI18n } from "./useI18n";
import { useUserProfile } from "./useUserProfile";
import type { Message, Role } from "../types";

/**
 * Split AI response into a few chat-like chunks (2-3 sentences each).
 * Only splits when there are enough sentences; short replies stay as one bubble.
 */
function splitIntoChunks(text: string): string[] {
  // Split by sentence-ending punctuation, keeping the delimiter attached
  const sentences = text
    .split(/(?<=[。！？.!?])\s*/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  // 3 sentences or fewer → keep as single bubble
  if (sentences.length <= 3) return [text.trim()];

  const chunks: string[] = [];
  let i = 0;
  while (i < sentences.length) {
    const remaining = sentences.length - i;
    // Last group: take whatever is left (avoid a lonely 1-sentence tail)
    if (remaining <= 3) {
      chunks.push(sentences.slice(i).join(""));
      break;
    }
    // Randomly pick 2 or 3 sentences per bubble
    const groupSize = Math.random() < 0.5 ? 2 : 3;
    chunks.push(sentences.slice(i, i + groupSize).join(""));
    i += groupSize;
  }
  return chunks;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const chatFn = httpsCallable<
  { messages: { role: string; content: string }[] },
  { content: string }
>(functions, "chat");

export function useChat(roleId: string, role: Role | null) {
  const { user } = useAuth();
  const { locale, t } = useI18n();
  const { profile } = useUserProfile();
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
        (d) => ({ id: d.id, ...d.data() }) as Message
      );
      setMessages(items);
      setLoading(false);
    });

    return unsubscribe;
  }, [user, roleId]);

  // Shared context builder for sendMessage and sendFollowup
  const buildContext = useCallback(async () => {
    if (!user || !role) return null;

    const messagesRef = collection(
      db,
      "users",
      user.uid,
      "roles",
      roleId,
      "messages"
    );
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

    let extraInstructions = "";

    if (profile?.displayName) {
      extraInstructions +=
        locale === "zh"
          ? `\n\n用户的名字是「${profile.displayName}」，请在对话中自然地称呼用户的名字。`
          : `\n\nThe user's name is "${profile.displayName}". Please address them by name naturally in the conversation.`;
    }

    extraInstructions +=
      locale === "zh"
        ? "\n\n重要：你必须使用中文回复。"
        : "\n\nIMPORTANT: You MUST respond in English only.";

    extraInstructions +=
      locale === "zh"
        ? "\n\n回复风格要求：请用自然、丰富的语言回复，可以包含多句话。可以分享想法、提出问题或补充相关话题，让对话更有深度。避免总是只回复一句话。"
        : "\n\nResponse style: Please respond with natural, rich language. Feel free to use multiple sentences, share thoughts, ask questions, or expand on related topics. Avoid single-sentence replies.";

    return {
      messagesRef,
      roleRef: doc(db, "users", user.uid, "roles", roleId),
      contextMessages: [
        { role: "system", content: role.systemPrompt + extraInstructions },
        ...recentMessages,
      ],
    };
  }, [user, role, roleId, locale, profile]);

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

        // 2. Build context
        const ctx = await buildContext();
        if (!ctx) throw new Error("Failed to build context");

        // 3. Call Cloud Function
        const result = await chatFn({ messages: ctx.contextMessages });

        // 4. Save assistant message(s) — split into chat-like chunks
        const chunks = splitIntoChunks(result.data.content);
        for (let i = 0; i < chunks.length; i++) {
          if (i > 0) await delay(600 + Math.random() * 800);
          await addDoc(messagesRef, {
            role: "assistant",
            content: chunks[i],
            createdAt: serverTimestamp(),
          });
        }

        // 5. Update role metadata
        await updateDoc(roleRef, {
          lastMessageAt: serverTimestamp(),
          messageCount: increment(1 + chunks.length),
        });
      } catch (error) {
        console.error("Send message error:", error);
        await addDoc(messagesRef, {
          role: "assistant",
          content: t("chat.aiError"),
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
    [user, role, roleId, sending, t, buildContext]
  );

  const sendFollowup = useCallback(async () => {
    if (!user || !role || sending || messages.length === 0) return;

    setSending(true);
    try {
      const ctx = await buildContext();
      if (!ctx) return;

      // Append follow-up instruction to system prompt
      const followupInstruction =
        locale === "zh"
          ? "\n\n[主动跟进] 用户已经有一段时间没有回复了。请根据当前对话上下文，用符合你角色性格的方式表达你注意到用户沉默了。可以直接提到用户没说话这件事，比如「怎么不说话了」「气氛变得好尴尬啊」「能理我一下嘛」之类的，但具体怎么说要结合上下文和你的角色性格来决定，要自然不生硬。只说一两句话就好。"
          : "\n\n[Proactive follow-up] The user hasn't responded for a while. Based on the conversation context, acknowledge their silence in a way that fits your character — e.g. \"Why so quiet?\", \"This is getting awkward...\", \"Hey, still there?\". Choose what to say based on the conversation context and your personality. Keep it to one or two sentences.";

      const contextMessages = ctx.contextMessages.map((m, i) =>
        i === 0 ? { ...m, content: m.content + followupInstruction } : m
      );

      const result = await chatFn({ messages: contextMessages });

      const chunks = splitIntoChunks(result.data.content);
      for (let i = 0; i < chunks.length; i++) {
        if (i > 0) await delay(600 + Math.random() * 800);
        await addDoc(ctx.messagesRef, {
          role: "assistant",
          content: chunks[i],
          createdAt: serverTimestamp(),
        });
      }

      await updateDoc(ctx.roleRef, {
        lastMessageAt: serverTimestamp(),
        messageCount: increment(chunks.length),
      });
    } catch (error) {
      console.error("Follow-up error:", error);
    } finally {
      setSending(false);
    }
  }, [user, role, sending, messages.length, locale, buildContext]);

  return { messages, loading, sending, sendMessage, sendFollowup };
}
