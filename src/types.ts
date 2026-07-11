export type EraCategory =
  | "Todo"
  | "Proto-Eslavo"
  | "Eslavo Oriental"
  | "Eslavo Eclesiástico"
  | "Ruso Medio"
  | "Dialecto de Moscú"
  | "Ruso Moderno";

export interface EraItem {
  id: string;
  title: string;
  era: string;
  category: Exclude<EraCategory, "Todo">;
  description: string;
  duration: string;
  badge: string;
  insightTitle?: string;
  insightText?: string;
  image?: string;
  icon?: string;
  detailText: string;
  isCustom?: boolean;
}

export interface Enigma {
  id: string;
  title: string;
  description: string;
  insightTitle: string;
  insightText: string;
  icon: string;
  sampleText: string; // The text that will be loaded into the workspace / private workspace
}

export interface LogEntry {
  id: string;
  title: string;
  resolved: boolean;
  time: string;
  description: string;
  icon: string;
}

export interface BadgeItem {
  id: string;
  title: string;
  unlocked: boolean;
  icon: string;
  description: string;
}

export interface Message {
  role: "user" | "assistant";
  content: string;
}
