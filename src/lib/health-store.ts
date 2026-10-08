import type { ChatThread, Language, Medication } from "./health-data";
import { initialMedications } from "./health-data";

export type HealthState = {
  language: Language;
  medications: Medication[];
  threads: ChatThread[];
  deviceConnected: boolean;
  metrics: { steps: number; heartRate: number; sleep: number; water: number };
};

const KEY = "healthpilot-state-v1";

export const defaultHealthState: HealthState = {
  language: "en",
  medications: initialMedications,
  threads: [],
  deviceConnected: false,
  metrics: { steps: 6240, heartRate: 72, sleep: 7.1, water: 5 },
};

export function loadHealthState(): HealthState {
  if (typeof window === "undefined") return defaultHealthState;
  try {
    const saved = window.localStorage.getItem(KEY);
    return saved ? { ...defaultHealthState, ...JSON.parse(saved) as Partial<HealthState> } : defaultHealthState;
  } catch {
    return defaultHealthState;
  }
}

export function saveHealthState(state: HealthState) {
  window.localStorage.setItem(KEY, JSON.stringify(state));
}