import { Fragment, useMemo } from "react";
import { Panel } from "../shared/Panel";
import { getCarryForwardFlag, tickKey } from "../../lib/utils";
import type { AppState, Habit, HabitCategory } from "../../types";

interface HabitRowProps {
  habit: Habit;
  cat: HabitCategory;
  daysInMonth: number;
  today: number;
  state: AppState;
  onToggleTick: (habit: Habit, day: number) => void;
  onDeleteHabit: (habit: Habit) => void;
}

const Sparkline = ({ habit, state, today }: { habit: Habit; state: AppState; today: number }) => {
  const points = useMemo(() => {
    const width = 40;
    const height = 14;
    const days = 7;
    const start = Math.max(1, today - days + 1);
    return Array.from({ length: today - start + 1 }, (_, i) => {
      const d = start + i;
      const x = ((d - start) / (days - 1)) * (width - 2) + 1;
      const y = state.ticks[tickKey(habit.id, d)] ? 2 : height - 2;
      return `${x},${y}`;
    }).join(" ");
  }, [habit.id, state.ticks, today]);

  return (
    <svg width="40" height="14" viewBox="0 0 40 14" className="shrink-0">
      <polyline
        points={points}
        fill="none"
        stroke={habit.cat === "red" ? "rgba(255,92,92,.5)" : habit.cat === "blue" ? "rgba(79,195,247,.5)" : "rgba(255,255,255,.3)"}
        strokeWidth="1.5"
      />
    </svg>
  );
};

const HabitRow = ({ habit, cat, daysInMonth, today, state, onToggleTick, onDeleteHabit }: HabitRowProps) => {
  const carryFlag = getCarryForwardFlag(state, habit, today);

  return (
    <tr>
      <td className="pb-1 pr-2">
        <div className="group relative flex items-center gap-1 text-xs text-ts">
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              cat === "black" ? "bg-white/80" : cat === "blue" ? "bg-ab" : "bg-abad"
            }`}
          />
          <span>{habit.name}</span>
          {carryFlag ? <span className="text-[10px] text-abad">⚠</span> : null}
          <Sparkline habit={habit} state={state} today={today} />
          <button
            type="button"
            onClick={() => onDeleteHabit(habit)}
            className="absolute -right-4 hidden h-3 w-3 rounded-full border border-abad/30 bg-abad/10 text-[8px] text-abad group-hover:grid group-hover:place-items-center"
          >
            x
          </button>
        </div>
      </td>

      {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
        const active = !!state.ticks[tickKey(habit.id, day)];
        const disabled = day > today;
        return (
          <td key={`${habit.id}-${day}`} className="p-[2px] text-center">
            <button
              type="button"
              disabled={disabled}
              onClick={() => onToggleTick(habit, day)}
              className={`grid h-[18px] w-[18px] place-items-center rounded border text-[10px] transition ${
                disabled
                  ? "cursor-not-allowed opacity-10"
                  : active
                    ? cat === "red"
                      ? "border-abad bg-abad/15 text-abad shadow-bglow"
                      : cat === "blue"
                        ? "border-ab bg-ab/20 text-white shadow-sglow"
                        : "border-white/45 bg-white/15 text-white"
                    : "border-white/10 bg-white/5 hover:scale-110 hover:border-white/20"
              }`}
            >
              {active ? "✓" : ""}
            </button>
          </td>
        );
      })}
    </tr>
  );
};

export interface HabitBankProps {
  state: AppState;
  daysInMonth: number;
  today: number;
  onToggleTick: (habit: Habit, day: number) => void;
  onDeleteHabit: (habit: Habit) => void;
  onOpenAddHabit: () => void;
  onOpenTemplates: () => void;
}

export const HabitBank = ({
  state,
  daysInMonth,
  today,
  onToggleTick,
  onDeleteHabit,
  onOpenAddHabit,
  onOpenTemplates
}: HabitBankProps) => {
  return (
    <Panel className="overflow-hidden">
      <div className="mb-3 flex items-center justify-between">
        <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-ts">The Habit Bank</div>
        <button
          type="button"
          onClick={onOpenTemplates}
          className="rounded border border-glass-b bg-glass px-2 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-ts"
        >
          Templates
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[580px] w-full border-separate border-spacing-0">
          <thead>
            <tr>
              <th className="min-w-[130px] pb-2 text-left font-mono text-[10px] font-normal tracking-[0.07em] text-td">Habit</th>
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => (
                <th key={day} className={`pb-2 px-0.5 text-center font-mono text-[10px] font-normal text-td ${day === today ? "text-ab" : ""}`}>
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(["black", "blue", "red"] as HabitCategory[]).map((cat, idx) => (
              <Fragment key={`${cat}-rows`}>
                {idx > 0 ? (
                  <tr key={`${cat}-sep`}>
                    <td colSpan={daysInMonth + 1} className="py-1">
                      <div className="h-px bg-glass-b" />
                    </td>
                  </tr>
                ) : null}
                {state.habits
                  .filter((h) => h.cat === cat)
                  .map((habit) => (
                    <HabitRow
                      key={habit.id}
                      habit={habit}
                      cat={cat}
                      daysInMonth={daysInMonth}
                      today={today}
                      state={state}
                      onToggleTick={onToggleTick}
                      onDeleteHabit={onDeleteHabit}
                    />
                  ))}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <button
        type="button"
        onClick={onOpenAddHabit}
        className="mt-3 flex w-full items-center gap-2 rounded border border-dashed border-white/15 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.1em] text-td hover:border-white/25 hover:text-ts"
      >
        + Add Habit
      </button>
    </Panel>
  );
};
