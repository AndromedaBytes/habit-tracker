import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import {
  ensureProfile,
  fetchAllDataForCurrentMonth,
  migrateLocalData,
  seedDefaultHabitsIfEmpty
} from "../lib/api";
import { STORAGE_KEY } from "../lib/constants";
import { useHabitStore } from "../store/habitStore";
import { loadPersistedState } from "../lib/utils";

export interface UseAuthResult {
  loading: boolean;
  session: Session | null;
  sendMagicLink: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuth = (): UseAuthResult => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        setLoading(false);
        navigate("/login");
        return;
      }

      setSession(data.session);

      if (!data.session) {
        setLoading(false);
        navigate("/login");
        return;
      }

      try {
        await ensureProfile(data.session.user.email ?? null);
        await seedDefaultHabitsIfEmpty();

        const localRaw = localStorage.getItem(STORAGE_KEY);
        if (localRaw) {
          const fallback = useHabitStore.getState();
          const localState = loadPersistedState(STORAGE_KEY, fallback);
          await migrateLocalData(localState);
          localStorage.removeItem(STORAGE_KEY);
          window.dispatchEvent(new CustomEvent("app:toast", { detail: "Your local data has been synced" }));
        }

        const hydrated = await fetchAllDataForCurrentMonth();
        useHabitStore.setState(hydrated, true);
      } finally {
        setLoading(false);
      }
    };

    init();

    const { data: listener } = supabase.auth.onAuthStateChange((_evt, next) => {
      setSession(next);
      if (!next) {
        navigate("/login");
      }
    });

    return () => listener.subscription.unsubscribe();
  }, [navigate]);

  return useMemo(
    () => ({
      loading,
      session,
      sendMagicLink: async (email: string) => {
        const redirectTo = `${window.location.origin}/`;
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: { emailRedirectTo: redirectTo }
        });
        if (error) throw error;
      },
      signOut: async () => {
        await supabase.auth.signOut();
        navigate("/login");
      }
    }),
    [loading, navigate, session]
  );
};
