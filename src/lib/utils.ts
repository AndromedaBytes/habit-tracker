import type { AppState, CorrelationResult, Habit, InsightItem, TodayContext } from "../types";
import { MOODS } from "./constants";

export const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

export const getTodayContext = (): TodayContext => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const today = now.getDate();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  return { now, year, month, today, daysInMonth };
};

export const tickKey = (habitId: string, day: number) => `${habitId}-${day}`;

export const loadPersistedState = (storageKey: string, fallback: AppState): AppState => {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return fallback;
    return { ...fallback, ...JSON.parse(raw) } as AppState;
  } catch {
    return fallback;
  }
};

export const savePersistedState = (storageKey: string, state: AppState) => {
  localStorage.setItem(storageKey, JSON.stringify(state));
};

export const calcStreak = (state: AppState, today: number): number => {
  const nn = state.habits.filter((h) => h.nonNeg);
  if (!nn.length) return 0;

  let streak = 0;
  for (let d = today; d >= 1; d -= 1) {
    if (nn.every((h) => state.ticks[tickKey(h.id, d)])) {
      streak += 1;
      continue;
    }
    if (d < today) break;
  }
  return streak;
};

export const calcWeekScore = (state: AppState, today: number, now: Date): number => {
  const dayOfWeek = now.getDay();
  const weekStart = today - dayOfWeek;
  const positive = state.habits.filter((h) => h.cat !== "red");

  let days = 0;
  let habitSum = 0;
  let sleepSum = 0;
  let sleepDays = 0;
  let moodSum = 0;
  let moodDays = 0;

  for (let d = Math.max(1, weekStart); d <= today; d += 1) {
    days += 1;
    const done = positive.length
      ? positive.filter((h) => state.ticks[tickKey(h.id, d)]).length / positive.length
      : 0;
    habitSum += done;

    if (state.sleep[d]) {
      sleepSum += Math.min(state.sleep[d] / 8, 1);
      sleepDays += 1;
    }

    if (state.moods[d] != null) {
      moodSum += state.moods[d] / 4;
      moodDays += 1;
    }
  }

  const habitScore = days ? habitSum / days : 0;
  const sleepScore = sleepDays ? sleepSum / sleepDays : 0.5;
  const moodScore = moodDays ? moodSum / moodDays : 0.5;
  const focusScore = Math.min((state.timerSessions || 0) / 10, 1);

  return Math.round((habitScore * 0.4 + sleepScore * 0.25 + moodScore * 0.2 + focusScore * 0.15) * 100);
};

export const getCarryForwardFlag = (state: AppState, habit: Habit, day: number): boolean => {
  if (habit.cat === "red" || day < 3) return false;
  return (
    !state.ticks[tickKey(habit.id, day)] &&
    !state.ticks[tickKey(habit.id, day - 1)] &&
    !state.ticks[tickKey(habit.id, day - 2)]
  );
};

export const calcCorrelations = (
  state: AppState,
  today: number,
  year: number,
  month: number
): CorrelationResult[] => {
  const positive = state.habits.filter((h) => h.cat !== "red");
  const results: CorrelationResult[] = [];

  const exHabit = state.habits.find((h) => {
    const n = h.name.toLowerCase();
    return n.includes("exercise") || n.includes("workout") || n.includes("run");
  });

  if (exHabit && Object.keys(state.moods).length > 5) {
    const exDays: number[] = [];
    const noExDays: number[] = [];

    for (let d = 1; d <= today; d += 1) {
      if (state.moods[d] == null) continue;
      (state.ticks[tickKey(exHabit.id, d)] ? exDays : noExDays).push(state.moods[d]);
    }

    if (exDays.length > 2 && noExDays.length > 2) {
      const exAvg = exDays.reduce((a, b) => a + b, 0) / exDays.length;
      const noAvg = noExDays.reduce((a, b) => a + b, 0) / noExDays.length;
      const diff = Math.round(((exAvg - noAvg) / 4) * 100);
      if (Math.abs(diff) > 5) {
        results.push({
          pct: diff,
          desc: `On days you ${exHabit.name.toLowerCase()}, your mood is ${Math.abs(diff)}% ${
            diff > 0 ? "higher" : "lower"
          }.`
        });
      }
    }
  }

  const sleepDays = Object.keys(state.sleep).filter((d) => +d <= today);
  if (sleepDays.length > 4 && positive.length) {
    const good: number[] = [];
    const poor: number[] = [];

    sleepDays.forEach((d) => {
      const completion = positive.filter((h) => state.ticks[tickKey(h.id, +d)]).length / positive.length;
      (state.sleep[+d] >= 7 ? good : poor).push(completion);
    });

    if (good.length > 1 && poor.length > 1) {
      const gAvg = good.reduce((a, b) => a + b, 0) / good.length;
      const pAvg = poor.reduce((a, b) => a + b, 0) / poor.length;
      const diff = Math.round((gAvg - pAvg) * 100);
      if (Math.abs(diff) > 5) {
        results.push({
          pct: diff,
          desc: `With 7h+ sleep, you complete ${Math.abs(diff)}% more habits than on poor sleep nights.`
        });
      }
    }
  }

  const byDay: Record<number, number[]> = {};
  for (let d = 1; d <= today; d += 1) {
    const dow = new Date(year, month, d).getDay();
    byDay[dow] = byDay[dow] || [];
    byDay[dow].push(
      positive.length ? positive.filter((h) => state.ticks[tickKey(h.id, d)]).length / positive.length : 0
    );
  }

  let bestDow: number | null = null;
  let bestVal = 0;
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  Object.keys(byDay).forEach((dow) => {
    const avg = byDay[+dow].reduce((a, b) => a + b, 0) / byDay[+dow].length;
    if (avg > bestVal) {
      bestVal = avg;
      bestDow = +dow;
    }
  });

  if (bestDow != null && bestVal > 0.5) {
    results.push({
      pct: Math.round(bestVal * 100),
      desc: `Your strongest day is ${dayNames[bestDow]} with ${Math.round(bestVal * 100)}% average completion.`
    });
  }

  return results;
};

export const generateInsights = (state: AppState, today: number): InsightItem[] => {
  const out: InsightItem[] = [];
  const positive = state.habits.filter((h) => h.cat !== "red");

  let bestHabit: Habit | undefined;
  let bestPct = 0;

  positive.forEach((h) => {
    const done = Array.from({ length: today }, (_, i) => i + 1).filter((d) => state.ticks[tickKey(h.id, d)]).length;
    const pct = today ? done / today : 0;
    if (pct > bestPct) {
      bestPct = pct;
      bestHabit = h;
    }
  });

  if (bestHabit) {
    out.push({
      icon: "🏆",
      text: `Your strongest habit is ${bestHabit.name} - ${Math.round(bestPct * 100)}% completion this month.`
    });
  }

  const sleepValues = Object.entries(state.sleep)
    .filter(([d]) => +d >= 1 && +d <= today)
    .map(([, v]) => v);

  if (sleepValues.length > 3) {
    const recent = sleepValues.slice(-3).reduce((a, b) => a + b, 0) / 3;
    out.push({
      icon: "🌙",
      text:
        recent >= 7.5
          ? "Recent sleep is solid - keep protecting it."
          : recent >= 6
            ? "Sleep is borderline. An early night could transform your week."
            : "Sleep is below optimal. A strict wind-down routine would help."
    });
  }

  const moodValues = Object.entries(state.moods)
    .filter(([d]) => +d >= 1 && +d <= today)
    .map(([, v]) => v);

  if (moodValues.length > 5) {
    const avg = moodValues.reduce((a, b) => a + b, 0) / moodValues.length;
    out.push({
      icon: "💭",
      text: `Average mood: ${MOODS[Math.round(avg)].label}. ${avg > 2.5 ? "Keep the momentum." : "Notice patterns on harder days."}`
    });
  }

  const streak = calcStreak(state, today);
  if (streak >= 3) {
    out.push({ icon: "🔥", text: `${streak}-day streak. Do not break the chain.` });
  }

  if (!out.length) {
    out.push({ icon: "✨", text: "Keep tracking. Insights emerge as your data grows." });
  }

  return out;
};

export const exportCSV = (
  state: AppState,
  today: number,
  year: number,
  month: number,
  filePrefix = "sanctuary"
): void => {
  const positive = state.habits.filter((h) => h.cat !== "red");
  const headers = ["Date", "Day", "Mood", "Energy", "Sleep", ...positive.map((h) => h.name), "Memorable Moment"];
  const rows = [headers.join(",")];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  for (let d = 1; d <= today; d += 1) {
    const dt = new Date(year, month, d);
    const mi = state.moods[d];
    const ei = state.energy[d];
    const row = [
      `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`,
      dayNames[dt.getDay()],
      mi != null ? MOODS[mi].label : "",
      ei != null ? String(ei + 1) : "",
      String(state.sleep[d] ?? ""),
      ...positive.map((h) => (state.ticks[tickKey(h.id, d)] ? "1" : "0")),
      `"${(state.moments[d] || "").replace(/"/g, '""')}"`
    ];

    rows.push(row.join(","));
  }

  const blob = new Blob([rows.join("\n")], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `${filePrefix}-${year}-${String(month + 1).padStart(2, "0")}.csv`;
  a.click();
};
