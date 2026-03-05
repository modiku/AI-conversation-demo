import { useEffect, useRef } from "react";
import type { Message } from "../types";

const MAX_FOLLOWUPS = 1;
const IDLE_TIMEOUT_MS = 60_000;

export function useAutoFollowup({
  messages,
  sending,
  sendFollowup,
}: {
  messages: Message[];
  sending: boolean;
  sendFollowup: () => Promise<void>;
}) {
  const followupCountRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sendFollowupRef = useRef(sendFollowup);
  const lastUserMsgCountRef = useRef(0);

  // Keep sendFollowup ref fresh without triggering the timer effect
  useEffect(() => {
    sendFollowupRef.current = sendFollowup;
  }, [sendFollowup]);

  useEffect(() => {
    // Clear any existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    // Count user messages to detect new user input
    const userMsgCount = messages.filter((m) => m.role === "user").length;
    if (userMsgCount > lastUserMsgCountRef.current) {
      followupCountRef.current = 0;
    }
    lastUserMsgCountRef.current = userMsgCount;

    // Guards: don't start timer
    if (messages.length === 0) return;
    if (sending) return;
    if (followupCountRef.current >= MAX_FOLLOWUPS) return;
    if (messages[messages.length - 1].role !== "assistant") return;

    // Start idle timer
    timerRef.current = setTimeout(() => {
      if (followupCountRef.current < MAX_FOLLOWUPS) {
        followupCountRef.current += 1;
        sendFollowupRef.current();
      }
    }, IDLE_TIMEOUT_MS);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [messages, sending]);
}
