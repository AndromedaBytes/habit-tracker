import { MOODS } from "../../lib/constants";
import { Panel } from "../shared/Panel";

export interface MoodChartProps {
  today: number;
  moods: Record<number, number>;
}

export const MoodChart = ({ today, moods }: MoodChartProps) => {
  const values = Object.entries(moods)
    .filter(([d]) => +d >= 1 && +d <= today)
    .map(([, v]) => v);

  const avg = values.length ? values.reduce((a, b) => a + b, 0) / values.length : null;

  return (
    <Panel title="Mood This Month">
      <div className="flex h-[72px] items-end gap-0.5 pt-1">
        {Array.from({ length: today }, (_, i) => i + 1).map((day) => {
          const mood = moods[day];
          return (
            <div key={day} className="flex flex-1 flex-col items-center gap-0.5">
              <div
                className="w-full rounded-t"
                style={{
                  minHeight: "2px",
                  height: `${mood != null ? ((mood + 1) / 5) * 68 + 5 : 2}%`,
                  background: mood != null ? `${MOODS[mood].color}bb` : "rgba(255,255,255,.05)"
                }}
              />
              <div className="font-mono text-[9px] text-td">{day % 7 === 1 ? day : ""}</div>
            </div>
          );
        })}
      </div>
      {avg != null ? (
        <div className="mt-2 font-mono text-[10px] tracking-[0.07em] text-ts">
          Avg mood: {MOODS[Math.round(avg)].emoji} {MOODS[Math.round(avg)].label}
        </div>
      ) : null}
    </Panel>
  );
};
