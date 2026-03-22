export type HabitCategory = "black" | "blue" | "red";

export interface Habit {
  id: string;
  name: string;
  cat: HabitCategory;
  nonNeg: boolean;
}

export interface JournalEntry {
  text: string;
  g1: string;
  g2: string;
  g3: string;
}

export interface WeeklyReview {
  good: string;
  drained: string;
  drop: string;
  double: string;
}

export interface TriggerEntry {
  habit: string;
  text: string;
  date: number;
}

export interface Mood {
  emoji: string;
  color: string;
  label: string;
}

export interface Milestone {
  id: string;
  icon: string;
  name: string;
  check: (state: AppState) => boolean;
}

export interface HabitTemplate {
  icon: string;
  name: string;
  desc: string;
  habits: Array<Pick<Habit, "name" | "cat">>;
}

export interface CorrelationResult {
  pct: number;
  desc: string;
}

export interface InsightItem {
  icon: string;
  text: string;
}

export interface AppState {
  habits: Habit[];
  ticks: Record<string, boolean>;
  moments: Record<number, string>;
  sleep: Record<number, number>;
  moods: Record<number, number>;
  energy: Record<number, number>;
  journal: Record<number, JournalEntry>;
  reviews: Record<number, WeeklyReview>;
  triggerLog: TriggerEntry[];
  windDown: Record<string, Record<number, boolean>>;
  signalHabit: string | null;
  timerSessions: number;
  unlockedMilestones: string[];
  intention: Record<number, string>;
}

export interface TodayContext {
  now: Date;
  year: number;
  month: number;
  today: number;
  daysInMonth: number;
}

export interface TimerPreset {
  work: number;
  breakTime: number;
  cycles: number;
  label: string;
}
