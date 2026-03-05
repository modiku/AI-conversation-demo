import en from "./locales/en";
import zh from "./locales/zh";
import type { TranslationKey } from "./locales/zh";

export type { TranslationKey };
export type Locale = "en" | "zh";

export const locales: Record<Locale, Record<TranslationKey, string>> = {
  en,
  zh,
};
