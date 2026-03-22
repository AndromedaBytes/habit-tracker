import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { TIMER_PRESETS } from "../lib/constants";
import { optimisticIncrementTimerSessions } from "../store/habitStore";

export interface TimerState {
  open: boolean;
  running: boolean;
  breakMode: boolean;
  remaining: number;
  total: number;
  sessionsInCycle: number;
  maxSessions: number;
  activePreset: number;
}

export interface UseTimerResult extends TimerState {
  presets: typeof TIMER_PRESETS;
  toggleDrawer: () => void;
  toggleRun: () => void;
  reset: () => void;
  setPreset: (idx: number) => void;
}

export const useTimer = (onCycleComplete: () => void): UseTimerResult => {
  const [open, setOpen] = useState(false);
  const [running, setRunning] = useState(false);
  const [breakMode, setBreakMode] = useState(false);
  const [activePreset, setActivePreset] = useState(0);
  const [sessionsInCycle, setSessionsInCycle] = useState(0);

  const workSecs = TIMER_PRESETS[activePreset].work * 60;
  const breakSecs = TIMER_PRESETS[activePreset].breakTime * 60;
  const maxSessions = TIMER_PRESETS[activePreset].cycles;

  const [remaining, setRemaining] = useState(workSecs);
  const [total, setTotal] = useState(workSecs);
  const intervalRef = useRef<number | null>(null);

  const reset = useCallback(() => {
    setRunning(false);
    setBreakMode(false);
    setSessionsInCycle(0);
    setRemaining(workSecs);
    setTotal(workSecs);
  }, [workSecs]);

  useEffect(() => {
    reset();
  }, [activePreset, reset]);

  useEffect(() => {
    if (!running) return;

    intervalRef.current = window.setInterval(() => {
      setRemaining((prev) => {
        if (prev > 1) return prev - 1;

        if (!breakMode) {
          void optimisticIncrementTimerSessions();
          onCycleComplete();
          setSessionsInCycle((v) => {
            const next = v + 1;
            if (next >= maxSessions) {
              setRunning(false);
              setBreakMode(false);
              setTotal(workSecs);
              return 0;
            }
            setBreakMode(true);
            setTotal(breakSecs);
            return next;
          });
          return breakSecs;
        }

        setBreakMode(false);
        setTotal(workSecs);
        return workSecs;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [running, breakMode, breakSecs, maxSessions, onCycleComplete, workSecs]);

  const setPreset = (idx: number) => setActivePreset(idx);

  return useMemo(
    () => ({
      open,
      running,
      breakMode,
      remaining,
      total,
      sessionsInCycle,
      maxSessions,
      activePreset,
      presets: TIMER_PRESETS,
      toggleDrawer: () => setOpen((v) => !v),
      toggleRun: () => setRunning((v) => !v),
      reset,
      setPreset
    }),
    [open, running, breakMode, remaining, total, sessionsInCycle, maxSessions, activePreset, reset]
  );
};
