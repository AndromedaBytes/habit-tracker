import { buildMilestones } from "../lib/constants";
import { optimisticUnlockMilestone, useHabitStore } from "../store/habitStore";

export interface UseMilestonesResult {
  unlockedMilestones: string[];
  checkMilestones: (today: number) => string[];
}

export const useMilestones = (): UseMilestonesResult => {
  const unlockedMilestones = useHabitStore((s) => s.unlockedMilestones);

  return {
    unlockedMilestones,
    checkMilestones: (today) => {
      const state = useHabitStore.getState();
      const defs = buildMilestones(today);
      const newOnes: string[] = [];

      defs.forEach((m) => {
        if (!state.unlockedMilestones.includes(m.id) && m.check(state)) {
          void optimisticUnlockMilestone(m.id);
          newOnes.push(`${m.icon} ${m.name} unlocked!`);
        }
      });

      return newOnes;
    }
  };
};
