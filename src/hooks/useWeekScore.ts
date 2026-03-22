import { useMemo } from "react";
import { calcWeekScore } from "../lib/utils";
import { useHabitStore } from "../store/habitStore";

export interface UseWeekScoreResult {
  weekScore: number;
}

export const useWeekScore = (today: number, now: Date): UseWeekScoreResult => {
  const state = useHabitStore();
  const weekScore = useMemo(() => calcWeekScore(state, today, now), [state, today, now]);
  return { weekScore };
};
