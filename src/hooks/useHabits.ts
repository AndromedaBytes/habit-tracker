import { useMemo } from "react";
import {
  optimisticAddHabit,
  optimisticRemoveHabit,
  optimisticSetSignalHabit,
  optimisticToggleTick,
  useHabitStore
} from "../store/habitStore";
import type { Habit, HabitCategory, HabitTemplate } from "../types";
import { tickKey } from "../lib/utils";

export interface UseHabitsResult {
  habits: Habit[];
  positiveHabits: Habit[];
  byCategory: Record<HabitCategory, Habit[]>;
  toggleTick: (habit: Habit, day: number) => boolean;
  removeHabit: (habitId: string) => Promise<void>;
  addHabit: (name: string, cat: HabitCategory) => Promise<void>;
  applyTemplate: (template: HabitTemplate) => Promise<void>;
  setSignalHabit: (habitId: string | null) => Promise<void>;
}

export const useHabits = (): UseHabitsResult => {
  const habits = useHabitStore((s) => s.habits);

  const byCategory = useMemo(
    () => ({
      black: habits.filter((h) => h.cat === "black"),
      blue: habits.filter((h) => h.cat === "blue"),
      red: habits.filter((h) => h.cat === "red")
    }),
    [habits]
  );

  return {
    habits,
    positiveHabits: habits.filter((h) => h.cat !== "red"),
    byCategory,
    toggleTick: (habit, day) => {
      const key = tickKey(habit.id, day);
      const prev = useHabitStore.getState().ticks[key];
      const now = new Date();
      void optimisticToggleTick(habit.id, day, now.getMonth(), now.getFullYear());
      return !prev;
    },
    removeHabit: async (habitId) => {
      await optimisticRemoveHabit(habitId);
    },
    addHabit: async (name, cat) => {
      await optimisticAddHabit(name, cat);
    },
    applyTemplate: async (template) => {
      for (const h of template.habits) {
        if (!useHabitStore.getState().habits.find((x) => x.name === h.name)) {
          await optimisticAddHabit(h.name, h.cat);
        }
      }
    },
    setSignalHabit: async (habitId) => {
      await optimisticSetSignalHabit(habitId);
    }
  };
};
