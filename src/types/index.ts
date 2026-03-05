import type { Timestamp } from "firebase/firestore";

export type Gender = "male" | "female";
export type Locale = "en" | "zh";

export interface PersonalityTrait {
  id: string;
  en: string;
  zh: string;
  emoji: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  systemPrompt: string;
  avatar: string;
  gender: Gender;
  personalityTraits: string[];
  avatarUrl: string | null;
  illustrationUrl: string | null;
  isPreset: boolean;
  presetId: string | null;
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
  avatarUrl: string | null;
  language: Locale;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface PresetCharacter {
  presetId: string;
  gender: Gender;
  personalityTraits: string[];
  nameEn: string;
  nameZh: string;
  descriptionEn: string;
  descriptionZh: string;
  avatar: string;
  systemPromptEn: string;
  systemPromptZh: string;
}
