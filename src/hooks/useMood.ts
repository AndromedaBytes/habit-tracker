import { optimisticSetMood, useHabitStore } from "../store/habitStore";

export interface UseMoodResult {
  moods: Record<number, number>;
  setMood: (day: number, moodIndex: number) => void;
}

export const useMood = (): UseMoodResult => {
  const moods = useHabitStore((s) => s.moods);
  return {
    moods,
    setMood: (day, moodIndex) => {
      const now = new Date();
      void optimisticSetMood(day, moodIndex, now.getMonth(), now.getFullYear());
    }
  };
};
