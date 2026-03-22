import { optimisticLogSleep, useHabitStore } from "../store/habitStore";

export interface UseSleepResult {
  sleep: Record<number, number>;
  logSleep: (day: number, hours: number) => void;
}

export const useSleep = (): UseSleepResult => {
  const sleep = useHabitStore((s) => s.sleep);
  return {
    sleep,
    logSleep: (day, hours) => {
      if (!hours || hours < 2 || hours > 12) return;
      const now = new Date();
      void optimisticLogSleep(day, hours, now.getMonth(), now.getFullYear());
    }
  };
};
