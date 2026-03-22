import type { Habit } from "../../types";
import { Panel } from "../shared/Panel";

export interface HeatmapProps {
  monthName: string;
  daysInMonth: number;
  today: number;
  habits: Habit[];
  ticks: Record<string, boolean>;
  moods: Record<number, number>;
}

export const Heatmap = ({ monthName, daysInMonth, today, habits, ticks, moods }: HeatmapProps) => {
  const positive = habits.filter((h) => h.cat !== "red");

  return (
    <Panel title={`Monthly Heatmap - ${monthName}`} className="mb-3">
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
          const done = positive.length ? positive.filter((h) => ticks[`${h.id}-${day}`]).length : 0;
          const pct = positive.length ? done / positive.length : 0;
          let bg = "rgba(255,255,255,.03)";
          if (day <= today) {
            if (pct === 0) bg = "rgba(255,255,255,.04)";
            else if (pct < 0.34) bg = "rgba(79,195,247,.15)";
            else if (pct < 0.67) bg = "rgba(79,195,247,.38)";
            else if (pct < 1) bg = "rgba(79,195,247,.58)";
            else bg = "rgba(79,195,247,.88)";
          }

          return (
            <div
              key={day}
              title={`Day ${day}: ${Math.round(pct * 100)}%`}
              style={{
                background: bg,
                borderColor: moods[day] != null ? `${["#6b7db3", "#8b8fa8", "#7db5a0", "#7fba8a", "#e8c468"][moods[day]]}55` : "rgba(255,255,255,.05)",
                outline: day === today ? "2px solid rgba(79,195,247,.6)" : "none",
                outlineOffset: day === today ? "1px" : "0"
              }}
              className="aspect-square rounded border"
            />
          );
        })}
      </div>
    </Panel>
  );
};
