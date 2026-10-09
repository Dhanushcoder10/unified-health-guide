import { createContext, useContext, type ReactNode } from "react";
import type { Language } from "./health-data";
import telugu from "./health-telugu.json";

export const HealthLanguageContext = createContext<Language>("en");
const dictionary: Record<string, string> = telugu;
export function translateHealthText(text: string, language: Language): string {
  if (language === "en" || !text.trim()) return text;
  const exact = dictionary[text.trim()];
  if (exact) return text.replace(text.trim(), exact);
  let result = text;
  for (const [english, translation] of Object.entries(dictionary).sort((a, b) => b[0].length - a[0].length)) {
    if (english.length < 3) continue;
    result = result.replaceAll(english, translation);
  }
  return result;
}
export function useHealthTranslation() {
  const language = useContext(HealthLanguageContext);
  return (text: string) => translateHealthText(text, language);
}
export function Translated({ children }: { children: ReactNode }) {
  const translate = useHealthTranslation();
  const convert = (value: ReactNode): ReactNode => typeof value === "string" ? translate(value) : Array.isArray(value) ? value.map(convert) : value;
  return <>{convert(children)}</>;
}