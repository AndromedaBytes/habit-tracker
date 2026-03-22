import { useEffect } from "react";
import { supabase } from "../lib/supabase";
import { fetchAllDataForCurrentMonth } from "../lib/api";
import { useHabitStore } from "../store/habitStore";

export const useRealtimeSync = (enabled: boolean) => {
  useEffect(() => {
    if (!enabled) return;

    const channel = supabase
      .channel("habits-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "habits" }, async () => {
        const next = await fetchAllDataForCurrentMonth();
        useHabitStore.setState(next, true);
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "habit_ticks" }, async () => {
        const next = await fetchAllDataForCurrentMonth();
        useHabitStore.setState(next, true);
      })
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [enabled]);
};
