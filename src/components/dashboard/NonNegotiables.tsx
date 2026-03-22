import { Panel } from "../shared/Panel";
import type { Habit } from "../../types";

export interface NonNegotiablesProps {
  habits: Habit[];
  isDone: (habitId: string) => boolean;
  onToggle: (habit: Habit) => void;
}

export const NonNegotiables = ({ habits, isDone, onToggle }: NonNegotiablesProps) => {
  return (
    <Panel title="Non-Negotiables">
      {!habits.length ? <div className="text-xs italic text-td">Core habits appear here.</div> : null}
      <div className="space-y-1">
        {habits.map((h) => {
          const done = isDone(h.id);
          return (
            <button
              key={h.id}
              type="button"
              onClick={() => onToggle(h)}
              className={`flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-left transition ${
                done ? "border-ab/20 bg-ab/10" : "border-transparent bg-white/2 hover:bg-glass-h"
              }`}
            >
              <div
                className={`grid h-4 w-4 place-items-center rounded-full border text-[10px] ${
                  done ? "border-ab bg-ab/20 text-ab" : "border-white/20 text-transparent"
                }`}
              >
                ✓
              </div>
              <div className={`text-xs ${done ? "text-tp" : "text-ts"}`}>{h.name}</div>
            </button>
          );
        })}
      </div>
    </Panel>
  );
};
