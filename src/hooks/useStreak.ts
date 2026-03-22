import { useMemo } from "react";
import { calcStreak } from "../lib/utils";
import { useHabitStore } from "../store/habitStore";

export interface UseStreakResult {
  streak: number;
}

export const useStreak = (today: number): UseStreakResult => {
  const state = useHabitStore();
  const streak = useMemo(() => calcStreak(state, today), [state, today]);
  return { streak };
};
