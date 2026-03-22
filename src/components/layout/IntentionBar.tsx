import { FadeUp } from "../shared/FadeUp";
import { MoodOrbs } from "../shared/MoodOrbs";
import type { Habit } from "../../types";

export interface IntentionBarProps {
  intention: string;
  onIntentionChange: (value: string) => void;
  mood: number | undefined;
  onMoodSelect: (index: number) => void;
  positiveHabits: Habit[];
  signalHabit: string | null;
  onSignalHabitChange: (value: string | null) => void;
  isSignalDone: boolean;
}

export const IntentionBar = ({
  intention,
  onIntentionChange,
  mood,
  onMoodSelect,
  positiveHabits,
  signalHabit,
  onSignalHabitChange,
  isSignalDone
}: IntentionBarProps) => {
  return (
    <FadeUp>
      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-glass-b bg-glass px-4 py-2 backdrop-blur-xl">
        <div className="shrink-0 font-mono text-[10px] uppercase tracking-[0.18em] text-ts">Today's intention</div>
        <input
          value={intention}
          onChange={(e) => onIntentionChange(e.target.value)}
          placeholder="What will you commit to today?"
          className="min-w-[220px] flex-1 bg-transparent font-serif text-[15px] italic text-tp outline-none placeholder:text-td"
        />

        {positiveHabits.length > 0 ? (
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] tracking-[0.08em] text-td">Signal:</span>
            <select
              value={signalHabit ?? ""}
              onChange={(e) => onSignalHabitChange(e.target.value || null)}
              className="bg-transparent font-mono text-xs text-ab outline-none"
            >
              <option value="" className="bg-[#0e0e1e]">
                Choose one...
              </option>
              {positiveHabits.map((h) => (
                <option key={h.id} value={h.id} className="bg-[#0e0e1e]">
                  {h.name}
                </option>
              ))}
            </select>
            <span className={isSignalDone ? "text-ag" : "text-td"}>{isSignalDone ? "✓" : "○"}</span>
          </div>
        ) : null}

        <MoodOrbs selected={mood} onSelect={onMoodSelect} />
      </div>
    </FadeUp>
  );
};
