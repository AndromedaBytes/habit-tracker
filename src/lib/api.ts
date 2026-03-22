import { DEFAULT_STATE } from "./constants";
import { getTodayContext, tickKey } from "./utils";
import { supabase } from "./supabase";
import type { AppState, Habit, HabitCategory, JournalEntry, TriggerEntry, WeeklyReview } from "../types";

type DailyLogFields = {
  mood?: number | null;
  energy?: number | null;
  sleep_hours?: number | null;
  memorable_moment?: string | null;
  intention?: string | null;
};

type JournalFields = {
  body?: string | null;
  gratitude_1?: string | null;
  gratitude_2?: string | null;
  gratitude_3?: string | null;
};

type WeeklyReviewFields = {
  went_well?: string | null;
  drained?: string | null;
  drop_habit?: string | null;
  double_down?: string | null;
};

type SettingsFields = {
  signal_habit_id?: string | null;
  timer_sessions?: number;
};

const toISODate = (date: Date) => date.toISOString().slice(0, 10);

const requireUserId = async (): Promise<string> => {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  if (!data.user) throw new Error("No authenticated user");
  return data.user.id;
};

const dayFromDate = (date: Date): number => date.getDate();

export const getHabits = async (): Promise<Habit[]> => {
  const userId = await requireUserId();
  const { data, error } = await supabase
    .from("habits")
    .select("id,name,category,non_neg,sort_order")
    .eq("user_id", userId)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) throw error;
  return (data ?? []).map((h) => ({
    id: h.id,
    name: h.name,
    cat: h.category,
    nonNeg: !!h.non_neg
  }));
};

export const createHabit = async (habit: {
  name: string;
  category: HabitCategory;
  nonNeg: boolean;
  sortOrder?: number;
}): Promise<Habit> => {
  const userId = await requireUserId();
  const { data, error } = await supabase
    .from("habits")
    .insert({
      user_id: userId,
      name: habit.name,
      category: habit.category,
      non_neg: habit.nonNeg,
      sort_order: habit.sortOrder ?? 0
    })
    .select("id,name,category,non_neg")
    .single();

  if (error) throw error;
  return {
    id: data.id,
    name: data.name,
    cat: data.category,
    nonNeg: !!data.non_neg
  };
};

export const updateHabit = async (
  habitId: string,
  fields: Partial<{ name: string; category: HabitCategory; nonNeg: boolean; sortOrder: number }>
): Promise<Habit> => {
  const { data, error } = await supabase
    .from("habits")
    .update({
      name: fields.name,
      category: fields.category,
      non_neg: fields.nonNeg,
      sort_order: fields.sortOrder
    })
    .eq("id", habitId)
    .select("id,name,category,non_neg")
    .single();

  if (error) throw error;
  return {
    id: data.id,
    name: data.name,
    cat: data.category,
    nonNeg: !!data.non_neg
  };
};

export const deleteHabit = async (habitId: string): Promise<void> => {
  const { error } = await supabase.from("habits").delete().eq("id", habitId);
  if (error) throw error;
};

export const getTicksForMonth = async (year: number, month: number): Promise<Record<string, boolean>> => {
  const userId = await requireUserId();
  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0);

  const { data, error } = await supabase
    .from("habit_ticks")
    .select("habit_id,tick_date")
    .eq("user_id", userId)
    .gte("tick_date", toISODate(start))
    .lte("tick_date", toISODate(end));

  if (error) throw error;

  const out: Record<string, boolean> = {};
  (data ?? []).forEach((t) => {
    if (!t.habit_id) return;
    const d = new Date(`${t.tick_date}T00:00:00`);
    out[tickKey(t.habit_id, d.getDate())] = true;
  });
  return out;
};

export const toggleTick = async (habitId: string, date: Date): Promise<boolean> => {
  const userId = await requireUserId();
  const tickDate = toISODate(date);

  const { data: existing, error: checkError } = await supabase
    .from("habit_ticks")
    .select("id")
    .eq("habit_id", habitId)
    .eq("tick_date", tickDate)
    .maybeSingle();

  if (checkError) throw checkError;

  if (existing?.id) {
    const { error } = await supabase.from("habit_ticks").delete().eq("id", existing.id);
    if (error) throw error;
    return false;
  }

  const { error } = await supabase.from("habit_ticks").insert({
    user_id: userId,
    habit_id: habitId,
    tick_date: tickDate
  });

  if (error) throw error;
  return true;
};

export const getDailyLog = async (date: Date): Promise<{
  mood: number | null;
  energy: number | null;
  sleep_hours: number | null;
  memorable_moment: string | null;
  intention: string | null;
} | null> => {
  const userId = await requireUserId();
  const { data, error } = await supabase
    .from("daily_logs")
    .select("mood,energy,sleep_hours,memorable_moment,intention")
    .eq("user_id", userId)
    .eq("log_date", toISODate(date))
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const upsertDailyLog = async (date: Date, fields: DailyLogFields): Promise<void> => {
  const userId = await requireUserId();
  const { error } = await supabase.from("daily_logs").upsert(
    {
      user_id: userId,
      log_date: toISODate(date),
      ...fields
    },
    { onConflict: "user_id,log_date" }
  );
  if (error) throw error;
};

export const getJournalEntry = async (date: Date): Promise<JournalEntry | null> => {
  const userId = await requireUserId();
  const { data, error } = await supabase
    .from("journal_entries")
    .select("body,gratitude_1,gratitude_2,gratitude_3")
    .eq("user_id", userId)
    .eq("entry_date", toISODate(date))
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return {
    text: data.body ?? "",
    g1: data.gratitude_1 ?? "",
    g2: data.gratitude_2 ?? "",
    g3: data.gratitude_3 ?? ""
  };
};

export const upsertJournalEntry = async (date: Date, fields: JournalFields): Promise<void> => {
  const userId = await requireUserId();
  const { error } = await supabase.from("journal_entries").upsert(
    {
      user_id: userId,
      entry_date: toISODate(date),
      ...fields
    },
    { onConflict: "entry_date" }
  );

  if (error) throw error;
};

export const getWeeklyReviews = async (): Promise<Array<{ review_date: string; fields: WeeklyReview }>> => {
  const userId = await requireUserId();
  const { data, error } = await supabase
    .from("weekly_reviews")
    .select("review_date,went_well,drained,drop_habit,double_down")
    .eq("user_id", userId)
    .order("review_date", { ascending: true });

  if (error) throw error;

  return (data ?? []).map((r) => ({
    review_date: r.review_date,
    fields: {
      good: r.went_well ?? "",
      drained: r.drained ?? "",
      drop: r.drop_habit ?? "",
      double: r.double_down ?? ""
    }
  }));
};

export const saveWeeklyReview = async (date: Date, fields: WeeklyReviewFields): Promise<void> => {
  const userId = await requireUserId();
  const { error } = await supabase.from("weekly_reviews").insert({
    user_id: userId,
    review_date: toISODate(date),
    ...fields
  });
  if (error) throw error;
};

export const getTriggerLog = async (): Promise<TriggerEntry[]> => {
  const userId = await requireUserId();
  const { data, error } = await supabase
    .from("trigger_log")
    .select("habit_name,trigger_text,log_date")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  if (error) throw error;

  return (data ?? []).map((row) => ({
    habit: row.habit_name ?? "",
    text: row.trigger_text ?? "",
    date: row.log_date ? dayFromDate(new Date(`${row.log_date}T00:00:00`)) : 1
  }));
};

export const saveTrigger = async (habitName: string, text: string, date: Date): Promise<void> => {
  const userId = await requireUserId();
  const { error } = await supabase.from("trigger_log").insert({
    user_id: userId,
    habit_name: habitName,
    trigger_text: text,
    log_date: toISODate(date)
  });
  if (error) throw error;
};

export const getMilestones = async (): Promise<string[]> => {
  const userId = await requireUserId();
  const { data, error } = await supabase.from("milestones").select("milestone_id").eq("user_id", userId);
  if (error) throw error;
  return (data ?? []).map((m) => m.milestone_id);
};

export const getWindDownForMonth = async (year: number, month: number): Promise<Record<string, Record<number, boolean>>> => {
  const userId = await requireUserId();
  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0);

  const { data, error } = await supabase
    .from("wind_down")
    .select("log_date,item_index,completed")
    .eq("user_id", userId)
    .gte("log_date", toISODate(start))
    .lte("log_date", toISODate(end));

  if (error) throw error;

  const out: Record<string, Record<number, boolean>> = {};
  (data ?? []).forEach((row) => {
    const day = new Date(`${row.log_date}T00:00:00`).getDate();
    const key = `wd-${day}`;
    out[key] = out[key] || {};
    out[key][row.item_index] = !!row.completed;
  });

  return out;
};

export const upsertWindDownItem = async (date: Date, itemIndex: number, completed: boolean): Promise<void> => {
  const userId = await requireUserId();
  const { error } = await supabase.from("wind_down").upsert(
    {
      user_id: userId,
      log_date: toISODate(date),
      item_index: itemIndex,
      completed
    },
    { onConflict: "user_id,log_date,item_index" }
  );

  if (error) throw error;
};

export const unlockMilestone = async (milestoneId: string): Promise<void> => {
  const userId = await requireUserId();
  const { error } = await supabase.from("milestones").upsert(
    {
      user_id: userId,
      milestone_id: milestoneId
    },
    { onConflict: "user_id,milestone_id" }
  );
  if (error) throw error;
};

export const getSettings = async (): Promise<{ signal_habit_id: string | null; timer_sessions: number } | null> => {
  const userId = await requireUserId();
  const { data, error } = await supabase
    .from("app_settings")
    .select("signal_habit_id,timer_sessions")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return {
    signal_habit_id: data.signal_habit_id,
    timer_sessions: data.timer_sessions ?? 0
  };
};

export const updateSettings = async (fields: SettingsFields): Promise<void> => {
  const userId = await requireUserId();
  const { error } = await supabase.from("app_settings").upsert(
    {
      user_id: userId,
      ...fields
    },
    { onConflict: "user_id" }
  );
  if (error) throw error;
};

export const ensureProfile = async (email: string | null): Promise<void> => {
  const userId = await requireUserId();
  const { error } = await supabase.from("profiles").upsert({ id: userId, email }, { onConflict: "id" });
  if (error) throw error;
};

export const seedDefaultHabitsIfEmpty = async (): Promise<void> => {
  const existing = await getHabits();
  if (existing.length > 0) return;

  const defaults = DEFAULT_STATE().habits;
  for (let i = 0; i < defaults.length; i += 1) {
    const h = defaults[i];
    await createHabit({ name: h.name, category: h.cat, nonNeg: h.nonNeg, sortOrder: i });
  }
};

export const fetchAllDataForCurrentMonth = async (): Promise<AppState> => {
  const { year, month, today } = getTodayContext();

  const [habits, ticks, reviews, triggerLog, milestones, settings, windDown] = await Promise.all([
    getHabits(),
    getTicksForMonth(year, month),
    getWeeklyReviews(),
    getTriggerLog(),
    getMilestones(),
    getSettings(),
    getWindDownForMonth(year, month)
  ]);

  const next = DEFAULT_STATE();
  next.habits = habits;
  next.ticks = ticks;
  next.triggerLog = triggerLog;
  next.unlockedMilestones = milestones;
  next.signalHabit = settings?.signal_habit_id ?? null;
  next.timerSessions = settings?.timer_sessions ?? 0;
  next.windDown = windDown;

  for (let d = 1; d <= today; d += 1) {
    const date = new Date(year, month, d);
    const [daily, journal] = await Promise.all([getDailyLog(date), getJournalEntry(date)]);

    if (daily) {
      if (daily.mood != null) next.moods[d] = daily.mood;
      if (daily.energy != null) next.energy[d] = daily.energy;
      if (daily.sleep_hours != null) next.sleep[d] = Number(daily.sleep_hours);
      if (daily.memorable_moment) next.moments[d] = daily.memorable_moment;
      if (daily.intention) next.intention[d] = daily.intention;
    }

    if (journal) {
      next.journal[d] = journal;
    }
  }

  reviews.forEach((r) => {
    const d = new Date(`${r.review_date}T00:00:00`).getDate();
    next.reviews[d] = r.fields;
  });

  return next;
};

export const migrateLocalData = async (localState: AppState): Promise<void> => {
  await ensureProfile(null);
  await seedDefaultHabitsIfEmpty();

  const remoteHabits = await getHabits();
  const habitByName = new Map(remoteHabits.map((h) => [h.name, h.id]));

  for (let i = 0; i < localState.habits.length; i += 1) {
    const localHabit = localState.habits[i];
    if (!habitByName.has(localHabit.name)) {
      const created = await createHabit({
        name: localHabit.name,
        category: localHabit.cat,
        nonNeg: localHabit.nonNeg,
        sortOrder: i
      });
      habitByName.set(localHabit.name, created.id);
    }
  }

  const { year, month, daysInMonth } = getTodayContext();
  for (let d = 1; d <= daysInMonth; d += 1) {
    const date = new Date(year, month, d);
    const mood = localState.moods[d];
    const energy = localState.energy[d];
    const sleep = localState.sleep[d];
    const moment = localState.moments[d];
    const intention = localState.intention[d];

    if (mood != null || energy != null || sleep != null || moment || intention) {
      await upsertDailyLog(date, {
        mood: mood ?? null,
        energy: energy ?? null,
        sleep_hours: sleep ?? null,
        memorable_moment: moment ?? null,
        intention: intention ?? null
      });
    }

    const j = localState.journal[d];
    if (j) {
      await upsertJournalEntry(date, {
        body: j.text,
        gratitude_1: j.g1,
        gratitude_2: j.g2,
        gratitude_3: j.g3
      });
    }

    const r = localState.reviews[d];
    if (r) {
      await saveWeeklyReview(date, {
        went_well: r.good,
        drained: r.drained,
        drop_habit: r.drop,
        double_down: r.double
      });
    }

    const wd = localState.windDown[`wd-${d}`] || {};
    for (const itemIndexRaw of Object.keys(wd)) {
      const itemIndex = Number(itemIndexRaw);
      const completed = wd[itemIndex];
      await upsertWindDownItem(date, itemIndex, completed);
    }
  }

  for (const t of localState.triggerLog) {
    await saveTrigger(t.habit, t.text, new Date(year, month, t.date));
  }

  for (const milestoneId of localState.unlockedMilestones) {
    await unlockMilestone(milestoneId);
  }

  await updateSettings({
    signal_habit_id: localState.signalHabit,
    timer_sessions: localState.timerSessions
  });

  for (const h of localState.habits) {
    const habitId = habitByName.get(h.name);
    if (!habitId) continue;
    for (let d = 1; d <= daysInMonth; d += 1) {
      const localKey = tickKey(h.id, d);
      if (!localState.ticks[localKey]) continue;
      const targetDate = new Date(year, month, d);
      const isTicked = await toggleTick(habitId, targetDate);
      if (!isTicked) {
        await toggleTick(habitId, targetDate);
      }
    }
  }
};
