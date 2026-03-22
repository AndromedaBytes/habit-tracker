import type { Habit } from "../../types";
import { Panel } from "../shared/Panel";

export interface HabitRatesProps {
  habits: Habit[];
  today: number;
  ticks: Record<string, boolean>;
}

export const HabitRates = ({ habits, today, ticks }: HabitRatesProps) => {
  const positive = habits.filter((h) => h.cat !== "red");

  return (
    <Panel title="Habit Completion Rates">
      <div className="space-y-1.5">
        {!positive.length ? <div className="text-xs italic text-td">No habits yet.</div> : null}
        {positive.map((h) => {
          const done = Array.from({ length: today }, (_, i) => i + 1).filter((d) => ticks[`${h.id}-${d}`]).length;
          const pct = Math.round((done / today) * 100);
          const col = h.cat === "blue" ? "var(--ab)" : "rgba(255,255,255,.45)";
          return (
            <div key={h.id} className="grid grid-cols-[100px_1fr_30px] items-center gap-1.5">
              <div className="truncate font-serif text-xs text-ts">{h.name}</div>
              <div className="h-1.5 overflow-hidden rounded bg-white/5">
                <div style={{ width: `${pct}%`, background: col }} className="h-full rounded" />
              </div>
              <div className="text-right font-mono text-[10px] text-td">{pct}%</div>
            </div>
          );
        })}
      </div>
    </Panel>
  );
};
