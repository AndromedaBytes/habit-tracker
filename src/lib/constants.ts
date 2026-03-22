import type { AppState, HabitTemplate, Milestone, Mood, TimerPreset } from "../types";
import { calcStreak } from "./utils";

export const STORAGE_KEY = "sanctuary_v6";
export const BRIEFING_STORAGE_KEY = "sanctuary_briefing_day";

export const QUOTES: string[] = [
  "We suffer more in imagination than in reality. - Seneca",
  "The impediment to action advances action. - Marcus Aurelius",
  "Discipline is choosing between what you want now and what you want most.",
  "Every action you take is a vote for the person you wish to become. - James Clear",
  "You have power over your mind, not outside events. - Marcus Aurelius",
  "The cave you fear to enter holds the treasure you seek. - Campbell",
  "Small habits consistently executed compound into extraordinary results.",
  "What you do every day matters more than what you do once in a while. - Gretchen Rubin",
  "He who has a why can bear almost any how. - Nietzsche",
  "Your future self is watching you right now through your memories."
];

export const MOODS: Mood[] = [
  { emoji: "😔", color: "#6b7db3", label: "Low" },
  { emoji: "😐", color: "#8b8fa8", label: "Okay" },
  { emoji: "🙂", color: "#7db5a0", label: "Good" },
  { emoji: "😊", color: "#7fba8a", label: "Great" },
  { emoji: "🤩", color: "#e8c468", label: "Amazing" }
];

export const ENERGY_LABELS = ["😴", "😑", "🙂", "⚡", "🚀"];

export const WIND_DOWN: string[] = [
  "Phone off / on silent",
  "Tomorrow's top 3 written",
  "Gratitude entry done",
  "No screens 30 min before bed"
];

export const TIMER_PRESETS: TimerPreset[] = [
  { work: 25, breakTime: 5, cycles: 4, label: "25/5" },
  { work: 50, breakTime: 10, cycles: 2, label: "50/10" },
  { work: 90, breakTime: 20, cycles: 1, label: "90/20" }
];

export const TEMPLATES: HabitTemplate[] = [
  {
    icon: "🏃",
    name: "Athlete",
    desc: "Training, recovery, nutrition",
    habits: [
      { name: "Morning workout", cat: "black" },
      { name: "Protein target", cat: "black" },
      { name: "Cold shower", cat: "blue" },
      { name: "8h sleep", cat: "black" },
      { name: "Doom-scrolling", cat: "red" }
    ]
  },
  {
    icon: "🧠",
    name: "Deep Worker",
    desc: "Focus, learning, creation",
    habits: [
      { name: "2h deep work block", cat: "black" },
      { name: "Read 30 min", cat: "black" },
      { name: "No phone mornings", cat: "black" },
      { name: "Meditation", cat: "blue" },
      { name: "Social media", cat: "red" }
    ]
  },
  {
    icon: "📚",
    name: "Student",
    desc: "Study, review, rest",
    habits: [
      { name: "Study session", cat: "black" },
      { name: "Review notes", cat: "black" },
      { name: "Exercise", cat: "blue" },
      { name: "Gratitude journal", cat: "blue" },
      { name: "Late night screen", cat: "red" }
    ]
  },
  {
    icon: "🌿",
    name: "Stoic",
    desc: "Discipline, reflection, calm",
    habits: [
      { name: "Morning journal", cat: "black" },
      { name: "Cold exposure", cat: "black" },
      { name: "Evening walk", cat: "blue" },
      { name: "Reading", cat: "black" },
      { name: "News consumption", cat: "red" }
    ]
  }
];

export const DEFAULT_STATE = (): AppState => ({
  habits: [
    { id: "h1", name: "Cold Exposure", cat: "black", nonNeg: true },
    { id: "h2", name: "Exercise", cat: "black", nonNeg: true },
    { id: "h3", name: "Read 30 min", cat: "black", nonNeg: false },
    { id: "h4", name: "Meditation", cat: "blue", nonNeg: false },
    { id: "h5", name: "Social Media", cat: "red", nonNeg: false }
  ],
  ticks: {},
  moments: {},
  sleep: {},
  journal: {},
  moods: {},
  energy: {},
  intention: {},
  timerSessions: 0,
  unlockedMilestones: [],
  reviews: {},
  triggerLog: [],
  windDown: {},
  signalHabit: null
});

export const buildMilestones = (today: number): Milestone[] => [
  { id: "first", icon: "🌱", name: "First Tick", check: (s) => Object.keys(s.ticks).length >= 1 },
  { id: "week7", icon: "🔥", name: "7-Day Streak", check: (s) => calcStreak(s, today) >= 7 },
  { id: "month30", icon: "💎", name: "30-Day Streak", check: (s) => calcStreak(s, today) >= 30 },
  {
    id: "perfect",
    icon: "⭐",
    name: "Perfect Day",
    check: (s) => {
      const positiveHabits = s.habits.filter((h) => h.cat !== "red");
      return positiveHabits.length > 0 && positiveHabits.every((h) => s.ticks[`${h.id}-${today}`]);
    }
  },
  { id: "j7", icon: "📖", name: "7 Entries", check: (s) => Object.keys(s.journal).length >= 7 },
  { id: "sleep8", icon: "🌙", name: "8h Sleep", check: (s) => Object.values(s.sleep).some((v) => v >= 8) },
  {
    id: "h5",
    icon: "🎯",
    name: "5 Habits",
    check: (s) => s.habits.filter((h) => h.cat !== "red").length >= 5
  },
  { id: "f10", icon: "⚡", name: "10 Sessions", check: (s) => (s.timerSessions || 0) >= 10 },
  {
    id: "grateful",
    icon: "🙏",
    name: "Gratitude x3",
    check: (s) => Object.values(s.journal).filter((j) => j.g1 && j.g2 && j.g3).length >= 3
  },
  { id: "review", icon: "📋", name: "Weekly Review", check: (s) => Object.keys(s.reviews || {}).length >= 1 },
  { id: "energy5", icon: "🚀", name: "Peak Energy", check: (s) => Object.values(s.energy || {}).some((v) => v === 4) }
];
