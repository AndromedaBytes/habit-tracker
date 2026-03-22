import { useEffect, useMemo, useState } from "react";
import { Header } from "./components/layout/Header";
import { IntentionBar } from "./components/layout/IntentionBar";
import { ReflectionPanel } from "./components/dashboard/ReflectionPanel";
import { HabitBank } from "./components/dashboard/HabitBank";
import { MetricsColumn } from "./components/dashboard/MetricsColumn";
import { NonNegotiables } from "./components/dashboard/NonNegotiables";
import { MilestoneGrid } from "./components/dashboard/MilestoneGrid";
import { WindDown } from "./components/dashboard/WindDown";
import { WeekScore } from "./components/analytics/WeekScore";
import { Heatmap } from "./components/analytics/Heatmap";
import { HabitRates } from "./components/analytics/HabitRates";
import { MoodChart } from "./components/analytics/MoodChart";
import { Correlations } from "./components/analytics/Correlations";
import { InsightCards } from "./components/analytics/InsightCards";
import { ExportCSV } from "./components/analytics/ExportCSV";
import { JournalModal } from "./components/modals/JournalModal";
import { BriefingModal } from "./components/modals/BriefingModal";
import { WeeklyReviewModal } from "./components/modals/WeeklyReviewModal";
import { AddHabitModal } from "./components/modals/AddHabitModal";
import { TemplatesModal } from "./components/modals/TemplatesModal";
import { TriggerLogModal } from "./components/modals/TriggerLogModal";
import { FocusTimerDrawer } from "./components/timer/FocusTimerDrawer";
import { MeshBackground } from "./components/shared/MeshBackground";
import { Toast } from "./components/shared/Toast";
import { Panel } from "./components/shared/Panel";
import { BRIEFING_STORAGE_KEY, MOODS, QUOTES } from "./lib/constants";
import { calcCorrelations, exportCSV, generateInsights, getTodayContext, tickKey } from "./lib/utils";
import { optimisticToggleWindDown, useHabitStore } from "./store/habitStore";
import { useHabits } from "./hooks/useHabits";
import { useMood } from "./hooks/useMood";
import { useEnergy } from "./hooks/useEnergy";
import { useSleep } from "./hooks/useSleep";
import { useJournal } from "./hooks/useJournal";
import { useTimer } from "./hooks/useTimer";
import { useMilestones } from "./hooks/useMilestones";
import { useStreak } from "./hooks/useStreak";
import { useWeekScore } from "./hooks/useWeekScore";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import { useAuth } from "./hooks/useAuth";
import { useRealtimeSync } from "./hooks/useRealtimeSync";
import type { Habit } from "./types";

function App() {
  const { loading, session } = useAuth();
  const state = useHabitStore();
  const { now, year, month, today, daysInMonth } = getTodayContext();
  useRealtimeSync(!!session);

  const [view, setView] = useState<"dashboard" | "analytics">("dashboard");
  const [quote] = useState(QUOTES[Math.floor(Math.random() * QUOTES.length)]);

  const [journalOpen, setJournalOpen] = useState(false);
  const [briefingOpen, setBriefingOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [addHabitOpen, setAddHabitOpen] = useState(false);
  const [templatesOpen, setTemplatesOpen] = useState(false);
  const [triggerOpen, setTriggerOpen] = useState(false);
  const [triggerHabitName, setTriggerHabitName] = useState("");
  const [quickTickOpen, setQuickTickOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);

  const [toastMsg, setToastMsg] = useState("");
  const [toastOpen, setToastOpen] = useState(false);

  const { habits, positiveHabits, toggleTick, removeHabit, addHabit, applyTemplate, setSignalHabit } = useHabits();
  const { setMood } = useMood();
  const { setEnergy } = useEnergy();
  const { logSleep } = useSleep();
  const { saveJournal, saveReview, saveMoment, saveIntention, saveTrigger } = useJournal();
  const { checkMilestones, unlockedMilestones } = useMilestones();
  const { streak } = useStreak(today);
  const { weekScore } = useWeekScore(today, now);

  const timer = useTimer(() => {
    showToast("⚡ Focus session complete!");
  });

  const insights = useMemo(() => generateInsights(state, today), [state, today]);
  const correlations = useMemo(() => calcCorrelations(state, today, year, month), [state, today, year, month]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setToastOpen(true);
    window.setTimeout(() => setToastOpen(false), 2600);
  };

  const toggleHabitTick = (habit: Habit, day: number) => {
    const active = toggleTick(habit, day);
    if (habit.cat === "red" && active) {
      setTriggerHabitName(habit.name);
      setTriggerOpen(true);
    }
  };

  const isSignalDone = state.signalHabit != null ? !!state.ticks[tickKey(state.signalHabit, today)] : false;

  useEffect(() => {
    const unlocked = checkMilestones(today);
    unlocked.forEach((msg, idx) => {
      window.setTimeout(() => showToast(msg), idx * 1200);
    });
  }, [today, state.ticks, state.sleep, state.journal, state.reviews, state.energy, state.timerSessions]);

  useEffect(() => {
    const hour = now.getHours();
    const last = localStorage.getItem(BRIEFING_STORAGE_KEY);
    if (hour >= 6 && hour < 10 && last !== String(today)) {
      localStorage.setItem(BRIEFING_STORAGE_KEY, String(today));
      window.setTimeout(() => setBriefingOpen(true), 1200);
    }
  }, [now, today]);

  useKeyboardShortcuts({
    onJournal: () => setJournalOpen(true),
    onToggleTimer: timer.toggleDrawer,
    onQuickTick: () => setQuickTickOpen((v) => !v),
    onBriefing: () => setBriefingOpen(true),
    onToggleShortcuts: () => setShortcutsOpen((v) => !v),
    onMood: (index) => {
      setMood(today, index);
      showToast(`${MOODS[index].emoji} Mood set to ${MOODS[index].label}`);
    },
    onEscape: () => setShortcutsOpen(false),
    onSpace: () => {
      if (timer.open) timer.toggleRun();
    }
  });

  useEffect(() => {
    const listener = (event: Event) => {
      const custom = event as CustomEvent<string>;
      showToast(custom.detail);
    };
    window.addEventListener("app:toast", listener);
    return () => window.removeEventListener("app:toast", listener);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-0 text-tp">
        <MeshBackground />
        <div className="relative z-10 grid min-h-screen place-items-center font-serif text-2xl italic text-ts">
          Restoring your sanctuary...
        </div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-bg-0 font-syne text-tp">
      <MeshBackground />
      <Toast open={toastOpen} message={toastMsg} />

      <div className="relative z-10 mx-auto grid min-h-screen max-w-[1520px] grid-rows-[auto_auto_1fr] gap-3 p-4 max-md:p-2.5">
        <Header
          quote={quote}
          streak={streak}
          weekScore={weekScore}
          view={view}
          onViewChange={setView}
          onOpenBriefing={() => setBriefingOpen(true)}
          onOpenReview={() => setReviewOpen(true)}
        />

        <IntentionBar
          intention={state.intention[today] || ""}
          onIntentionChange={(value) => saveIntention(today, value)}
          mood={state.moods[today]}
          onMoodSelect={(index) => setMood(today, index)}
          positiveHabits={positiveHabits}
          signalHabit={state.signalHabit}
          onSignalHabitChange={setSignalHabit}
          isSignalDone={isSignalDone}
        />

        {view === "dashboard" ? (
          <div className="grid grid-cols-[258px_1fr_278px] gap-3 max-[1060px]:grid-cols-2 max-[680px]:grid-cols-1">
            <ReflectionPanel
              daysInMonth={daysInMonth}
              today={today}
              moods={state.moods}
              moments={state.moments}
              isCarryFlaggedDay={(d) =>
                d >= 3 &&
                habits
                  .filter((h) => h.cat !== "red")
                  .some((h) => !state.ticks[`${h.id}-${d}`] && !state.ticks[`${h.id}-${d - 1}`] && !state.ticks[`${h.id}-${d - 2}`])
              }
              onMomentChange={(day, text) => saveMoment(day, text)}
            />

            <HabitBank
              state={state}
              daysInMonth={daysInMonth}
              today={today}
              onToggleTick={toggleHabitTick}
              onDeleteHabit={(habit) => {
                if (window.confirm(`Delete "${habit.name}"?`)) removeHabit(habit.id);
              }}
              onOpenAddHabit={() => setAddHabitOpen(true)}
              onOpenTemplates={() => setTemplatesOpen(true)}
            />

            <MetricsColumn
              state={state}
              today={today}
              daysInMonth={daysInMonth}
              positiveHabits={positiveHabits}
              onSetEnergy={(index) => setEnergy(today, index)}
              onLogSleep={(hours) => logSleep(today, hours)}
            >
              <NonNegotiables
                habits={habits.filter((h) => h.nonNeg)}
                isDone={(habitId) => !!state.ticks[tickKey(habitId, today)]}
                onToggle={(habit) => toggleHabitTick(habit, today)}
              />
              <WindDown
                visible={now.getHours() >= 19}
                doneMap={state.windDown[`wd-${today}`] || {}}
                onToggle={(index) =>
                  void optimisticToggleWindDown(today, index, month, year)
                }
              />
              <MilestoneGrid today={today} unlocked={unlockedMilestones} />
            </MetricsColumn>
          </div>
        ) : (
          <div className="pt-1">
            <WeekScore
              score={weekScore}
              streak={streak}
              timerSessions={state.timerSessions}
              journalEntries={Object.keys(state.journal).length}
              reviews={Object.keys(state.reviews).length}
            />
            <Heatmap
              monthName={now.toLocaleString("default", { month: "long" })}
              daysInMonth={daysInMonth}
              today={today}
              habits={habits}
              ticks={state.ticks}
              moods={state.moods}
            />
            <div className="mb-3 grid grid-cols-2 gap-3 max-[1060px]:grid-cols-1">
              <HabitRates habits={habits} today={today} ticks={state.ticks} />
              <MoodChart today={today} moods={state.moods} />
              <Correlations data={correlations} />
              <Panel title="Bad Habit Triggers">
                {(state.triggerLog || []).length === 0 ? (
                  <div className="text-xs italic text-td">Tick a red habit to log its trigger.</div>
                ) : (
                  <div className="max-h-[200px] space-y-1 overflow-y-auto">
                    {state.triggerLog
                      .slice(-6)
                      .reverse()
                      .map((t, idx) => (
                        <div key={`${t.habit}-${t.date}-${idx}`} className="rounded-lg border border-abad/15 bg-abad/5 px-3 py-2">
                          <div className="font-mono text-[10px] text-abad/60">
                            {t.habit} · {new Date(year, month, t.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </div>
                          <div className="mt-1 font-serif text-xs italic text-ts">{t.text}</div>
                        </div>
                      ))}
                  </div>
                )}
              </Panel>
              <Panel title="Sleep Stats">
                {Object.keys(state.sleep).length ? (
                  <div className="grid grid-cols-3 gap-1.5">
                    {(() => {
                      const values = Object.entries(state.sleep)
                        .filter(([d]) => +d >= 1 && +d <= today)
                        .map(([, v]) => v);
                      const avg = (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1);
                      return (
                        <>
                          <SleepKpi label="Avg" value={`${avg}h`} />
                          <SleepKpi label="Best" value={`${Math.max(...values)}h`} />
                          <SleepKpi label="Worst" value={`${Math.min(...values)}h`} />
                        </>
                      );
                    })()}
                  </div>
                ) : (
                  <div className="text-xs italic text-td">Log sleep to see stats.</div>
                )}
              </Panel>
              <InsightCards items={insights} />
              <ExportCSV
                onExport={() => {
                  exportCSV(state, today, year, month);
                  showToast("📊 CSV exported!");
                }}
              />
            </div>
          </div>
        )}
      </div>

      <div
        className={`fixed bottom-[70px] left-5 z-[49] w-[260px] rounded-2xl border border-white/10 bg-[#0c0c1e] p-4 shadow-2xl transition ${
          quickTickOpen ? "pointer-events-auto translate-y-0 scale-100 opacity-100" : "pointer-events-none translate-y-5 scale-95 opacity-0"
        }`}
      >
        <div className="mb-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.16em] text-ts">
          Quick Tick
          <button type="button" onClick={() => setQuickTickOpen(false)} className="text-sm text-td">
            x
          </button>
        </div>
        <div className="space-y-1">
          {positiveHabits.map((h) => {
            const done = !!state.ticks[tickKey(h.id, today)];
            return (
              <button
                key={h.id}
                type="button"
                onClick={() => toggleHabitTick(h, today)}
                className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left ${done ? "bg-ab/10" : "hover:bg-glass-h"}`}
              >
                <div className={`h-1.5 w-1.5 rounded-full ${h.cat === "blue" ? "bg-ab" : "bg-white/50"}`} />
                <div
                  className={`grid h-4 w-4 place-items-center rounded border text-[10px] ${
                    done ? "border-ab bg-ab/20 text-white" : "border-white/15"
                  }`}
                >
                  ✓
                </div>
                <div className={`text-xs ${done ? "text-tp" : "text-ts"}`}>{h.name}</div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="fixed bottom-5 right-5 z-[49] flex flex-col items-end gap-2">
        <button
          type="button"
          onClick={() => setJournalOpen(true)}
          className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-ai to-ab text-white shadow-[0_0_16px_rgba(79,195,247,.35)]"
        >
          ✎
        </button>
        <button
          type="button"
          onClick={() => setQuickTickOpen((v) => !v)}
          className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-[#2d6a4f] to-ag text-white shadow-[0_0_14px_rgba(74,222,128,.3)]"
        >
          ✓
        </button>
      </div>

      <div
        className={`fixed bottom-[70px] left-1/2 z-[300] min-w-[280px] -translate-x-1/2 rounded-xl border border-white/10 bg-[#0c0c1e] px-4 py-3 transition ${
          shortcutsOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.15em] text-ts">Keyboard Shortcuts</div>
        {[
          ["J", "Open Journal"],
          ["T", "Toggle Focus Timer"],
          ["Q", "Quick Tick panel"],
          ["B", "Morning Briefing"],
          ["1-5", "Log mood"],
          ["Space", "Start / Pause timer"],
          ["?", "Show this panel"]
        ].map(([k, d]) => (
          <div key={k} className="mb-1 grid grid-cols-[34px_1fr] items-center gap-2 font-mono text-[10px]">
            <div className="rounded border border-white/20 bg-white/10 px-1 text-center text-tp">{k}</div>
            <div className="text-ts">{d}</div>
          </div>
        ))}
      </div>

      <FocusTimerDrawer timer={timer} totalSessions={state.timerSessions} />

      <JournalModal
        open={journalOpen}
        onOpenChange={setJournalOpen}
        dateLabel={now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
        value={state.journal[today] || { text: "", g1: "", g2: "", g3: "" }}
        onSave={(entry) => {
          saveJournal(today, entry);
          showToast("📖 Entry saved.");
        }}
      />

      <BriefingModal
        open={briefingOpen}
        onOpenChange={setBriefingOpen}
        dateLabel={now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
        stats={[
          { label: "Day Streak", value: String(streak) },
          {
            label: "Yesterday",
            value: `${Math.round(
              ((today > 1 ? positiveHabits.filter((h) => state.ticks[tickKey(h.id, today - 1)]).length : 0) /
                Math.max(positiveHabits.length, 1)) *
                100
            )}%`
          },
          {
            label: "Sleep Hrs",
            value: String(
              state.sleep[today] ||
                (Object.values(state.sleep).length
                  ? (Object.values(state.sleep).reduce((a, b) => a + b, 0) / Object.values(state.sleep).length).toFixed(1)
                  : "-")
            )
          },
          { label: "Week Score", value: String(weekScore) }
        ]}
        memory={(() => {
          const memDays = Object.keys(state.moments).filter((d) => state.moments[+d] && +d !== today);
          if (!memDays.length) return null;
          const randomDay = memDays[Math.floor(Math.random() * memDays.length)];
          return state.moments[+randomDay];
        })()}
        insight={insights[0] ?? null}
      />

      <WeeklyReviewModal
        open={reviewOpen}
        onOpenChange={setReviewOpen}
        dateLabel={`Week of ${now.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`}
        value={state.reviews[today] || { good: "", drained: "", drop: "", double: "" }}
        onSave={(review) => {
          saveReview(today, review);
          showToast("📋 Review saved. Good work.");
        }}
      />

      <AddHabitModal open={addHabitOpen} onOpenChange={setAddHabitOpen} onAdd={(name, cat) => addHabit(name, cat)} />

      <TemplatesModal
        open={templatesOpen}
        onOpenChange={setTemplatesOpen}
        onPick={(template) => {
          if (!window.confirm(`Load "${template.name}" template? This adds ${template.habits.length} habits.`)) return;
          applyTemplate(template);
          showToast(`${template.icon} ${template.name} template loaded!`);
        }}
      />

      <TriggerLogModal
        open={triggerOpen}
        onOpenChange={setTriggerOpen}
        habitName={triggerHabitName}
        onSave={(text) => saveTrigger(triggerHabitName, text, today)}
      />
    </div>
  );
}

interface SleepKpiProps {
  label: string;
  value: string;
}

const SleepKpi = ({ label, value }: SleepKpiProps) => (
  <div className="rounded-lg border border-glass-b bg-white/3 px-2 py-2">
    <div className="font-serif text-xl text-tp">{value}</div>
    <div className="font-mono text-[10px] uppercase tracking-[0.08em] text-td">{label}</div>
  </div>
);

export default App;
