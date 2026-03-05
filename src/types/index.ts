import type { Timestamp } from "firebase/firestore";

export interface Role {
  id: string;
  name: string;
  description: string;
  systemPrompt: string;
  avatar: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastMessageAt: Timestamp | null;
  messageCount: number;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: Timestamp;
}

export interface UserProfile {
  email: string;
  displayName: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
