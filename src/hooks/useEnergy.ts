import { optimisticSetEnergy, useHabitStore } from "../store/habitStore";

export interface UseEnergyResult {
  energy: Record<number, number>;
  setEnergy: (day: number, energyIndex: number) => void;
}

export const useEnergy = (): UseEnergyResult => {
  const energy = useHabitStore((s) => s.energy);
  return {
    energy,
    setEnergy: (day, energyIndex) => {
      const now = new Date();
      void optimisticSetEnergy(day, energyIndex, now.getMonth(), now.getFullYear());
    }
  };
};
