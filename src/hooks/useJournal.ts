import {
  optimisticSaveIntention,
  optimisticSaveJournal,
  optimisticSaveMoment,
  optimisticSaveReview,
  optimisticSaveTrigger,
  useHabitStore
} from "../store/habitStore";
import type { JournalEntry, WeeklyReview } from "../types";

export interface UseJournalResult {
  journal: Record<number, JournalEntry>;
  reviews: Record<number, WeeklyReview>;
  moments: Record<number, string>;
  triggerLog: Array<{ habit: string; text: string; date: number }>;
  intention: Record<number, string>;
  saveJournal: (day: number, entry: JournalEntry) => void;
  saveReview: (day: number, review: WeeklyReview) => void;
  saveMoment: (day: number, text: string) => void;
  saveIntention: (day: number, value: string) => void;
  saveTrigger: (habit: string, text: string, day: number) => void;
}

export const useJournal = (): UseJournalResult => {
  const state = useHabitStore();

  return {
    journal: state.journal,
    reviews: state.reviews,
    moments: state.moments,
    triggerLog: state.triggerLog,
    intention: state.intention,
    saveJournal: (day, entry) => {
      const now = new Date();
      void optimisticSaveJournal(day, entry, now.getMonth(), now.getFullYear());
    },
    saveReview: (day, review) => {
      const now = new Date();
      void optimisticSaveReview(day, review, now.getMonth(), now.getFullYear());
    },
    saveMoment: (day, text) => {
      const now = new Date();
      void optimisticSaveMoment(day, text, now.getMonth(), now.getFullYear());
    },
    saveIntention: (day, value) => {
      const now = new Date();
      void optimisticSaveIntention(day, value, now.getMonth(), now.getFullYear());
    },
    saveTrigger: (habit, text, day) => {
      const now = new Date();
      void optimisticSaveTrigger(habit, text, day, now.getMonth(), now.getFullYear());
    }
  };
};
