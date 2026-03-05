import { createContext } from "react";
import type { TranslationKey, Locale } from "../i18n";

export interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
}

export const I18nContext = createContext<I18nContextType | null>(null);
