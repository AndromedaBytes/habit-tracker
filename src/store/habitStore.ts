import { create } from "zustand";
import { DEFAULT_STATE, STORAGE_KEY } from "../lib/constants";
import { loadPersistedState, savePersistedState } from "../lib/utils";
import type { AppState } from "../types";
import {
  createHabit,
  deleteHabit,
  saveTrigger,
  saveWeeklyReview,
  toggleTick,
  unlockMilestone,
  updateSettings,
  upsertDailyLog,
  upsertJournalEntry,
  upsertWindDownItem,
  updateHabit
} from "../lib/api";

const initialState = loadPersistedState(STORAGE_KEY, DEFAULT_STATE());

export const useHabitStore = create<AppState>(() => initialState);

export const patchState = (recipe: (prev: AppState) => AppState) => {
  const prev = useHabitStore.getState();
  const next = recipe(prev);
  useHabitStore.setState(next, true);
  savePersistedState(STORAGE_KEY, next);
};

export const setState = <K extends keyof AppState>(key: K, value: AppState[K]) => {
  patchState((prev) => ({ ...prev, [key]: value }));
};

const applyOptimistic = async (
  recipe: (prev: AppState) => AppState,
  sync: (next: AppState, prev: AppState) => Promise<void>
) => {
  const prev = useHabitStore.getState();
  const next = recipe(prev);
  useHabitStore.setState(next, true);
  savePersistedState(STORAGE_KEY, next);

  try {
    await sync(next, prev);
  } catch (error) {
    useHabitStore.setState(prev, true);
    savePersistedState(STORAGE_KEY, prev);
    throw error;
  }
};

export const optimisticHydrate = (state: AppState) => {
  useHabitStore.setState(state, true);
  savePersistedState(STORAGE_KEY, state);
};

export const optimisticAddHabit = async (name: string, cat: "black" | "blue" | "red") => {
  const tempId = `tmp-${Date.now()}`;
  await applyOptimistic(
    (s) => ({
      ...s,
      habits: [...s.habits, { id: tempId, name, cat, nonNeg: cat === "black" }]
    }),
    async () => {
      await createHabit({ name, category: cat, nonNeg: cat === "black" });
    }
  );
};

export const optimisticRemoveHabit = async (habitId: string) => {
  await applyOptimistic(
    (s) => ({
      ...s,
      habits: s.habits.filter((h) => h.id !== habitId)
    }),
    async () => {
      await deleteHabit(habitId);
    }
  );
};

export const optimisticToggleTick = async (habitId: string, day: number, month: number, year: number) => {
  await applyOptimistic(
    (s) => {
      const key = `${habitId}-${day}`;
      return {
        ...s,
        ticks: {
          ...s.ticks,
          [key]: !s.ticks[key]
        }
      };
    },
    async () => {
      await toggleTick(habitId, new Date(year, month, day));
    }
  );
};

export const optimisticSetMood = async (day: number, moodIndex: number, month: number, year: number) => {
  await applyOptimistic(
    (s) => ({ ...s, moods: { ...s.moods, [day]: moodIndex } }),
    async () => {
      await upsertDailyLog(new Date(year, month, day), { mood: moodIndex });
    }
  );
};

export const optimisticSetEnergy = async (day: number, energyIndex: number, month: number, year: number) => {
  await applyOptimistic(
    (s) => ({ ...s, energy: { ...s.energy, [day]: energyIndex } }),
    async () => {
      await upsertDailyLog(new Date(year, month, day), { energy: energyIndex });
    }
  );
};

export const optimisticLogSleep = async (day: number, hours: number, month: number, year: number) => {
  await applyOptimistic(
    (s) => ({ ...s, sleep: { ...s.sleep, [day]: hours } }),
    async () => {
      await upsertDailyLog(new Date(year, month, day), { sleep_hours: hours });
    }
  );
};

export const optimisticSaveMoment = async (day: number, text: string, month: number, year: number) => {
  await applyOptimistic(
    (s) => ({ ...s, moments: { ...s.moments, [day]: text } }),
    async () => {
      await upsertDailyLog(new Date(year, month, day), { memorable_moment: text });
    }
  );
};

export const optimisticSaveIntention = async (day: number, text: string, month: number, year: number) => {
  await applyOptimistic(
    (s) => ({ ...s, intention: { ...s.intention, [day]: text } }),
    async () => {
      await upsertDailyLog(new Date(year, month, day), { intention: text });
    }
  );
};

export const optimisticSaveJournal = async (
  day: number,
  entry: { text: string; g1: string; g2: string; g3: string },
  month: number,
  year: number
) => {
  await applyOptimistic(
    (s) => ({ ...s, journal: { ...s.journal, [day]: entry } }),
    async () => {
      await upsertJournalEntry(new Date(year, month, day), {
        body: entry.text,
        gratitude_1: entry.g1,
        gratitude_2: entry.g2,
        gratitude_3: entry.g3
      });
    }
  );
};

export const optimisticSaveReview = async (
  day: number,
  review: { good: string; drained: string; drop: string; double: string },
  month: number,
  year: number
) => {
  await applyOptimistic(
    (s) => ({ ...s, reviews: { ...s.reviews, [day]: review } }),
    async () => {
      await saveWeeklyReview(new Date(year, month, day), {
        went_well: review.good,
        drained: review.drained,
        drop_habit: review.drop,
        double_down: review.double
      });
    }
  );
};

export const optimisticSaveTrigger = async (habit: string, text: string, day: number, month: number, year: number) => {
  await applyOptimistic(
    (s) => ({
      ...s,
      triggerLog: [...s.triggerLog, { habit, text, date: day }]
    }),
    async () => {
      await saveTrigger(habit, text, new Date(year, month, day));
    }
  );
};

export const optimisticToggleWindDown = async (day: number, itemIndex: number, month: number, year: number) => {
  await applyOptimistic(
    (s) => {
      const key = `wd-${day}`;
      const current = s.windDown[key] || {};
      return {
        ...s,
        windDown: {
          ...s.windDown,
          [key]: {
            ...current,
            [itemIndex]: !current[itemIndex]
          }
        }
      };
    },
    async (next) => {
      const key = `wd-${day}`;
      await upsertWindDownItem(new Date(year, month, day), itemIndex, !!next.windDown[key]?.[itemIndex]);
    }
  );
};

export const optimisticSetSignalHabit = async (habitId: string | null) => {
  await applyOptimistic(
    (s) => ({ ...s, signalHabit: habitId }),
    async () => {
      await updateSettings({ signal_habit_id: habitId });
    }
  );
};

export const optimisticIncrementTimerSessions = async () => {
  await applyOptimistic(
    (s) => ({ ...s, timerSessions: s.timerSessions + 1 }),
    async (next) => {
      await updateSettings({ timer_sessions: next.timerSessions });
    }
  );
};

export const optimisticUnlockMilestone = async (milestoneId: string) => {
  await applyOptimistic(
    (s) =>
      s.unlockedMilestones.includes(milestoneId)
        ? s
        : { ...s, unlockedMilestones: [...s.unlockedMilestones, milestoneId] },
    async () => {
      await unlockMilestone(milestoneId);
    }
  );
};

export const optimisticUpdateHabit = async (
  habitId: string,
  fields: Partial<{ name: string; category: "black" | "blue" | "red"; nonNeg: boolean }>
) => {
  await applyOptimistic(
    (s) => ({
      ...s,
      habits: s.habits.map((h) =>
        h.id === habitId
          ? {
              ...h,
              name: fields.name ?? h.name,
              cat: fields.category ?? h.cat,
              nonNeg: fields.nonNeg ?? h.nonNeg
            }
          : h
      )
    }),
    async () => {
      await updateHabit(habitId, fields);
    }
  );
};
