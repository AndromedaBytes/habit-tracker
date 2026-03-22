import { Panel } from "../shared/Panel";
import { MOODS } from "../../lib/constants";

export interface ReflectionPanelProps {
  daysInMonth: number;
  today: number;
  moods: Record<number, number>;
  moments: Record<number, string>;
  isCarryFlaggedDay: (day: number) => boolean;
  onMomentChange: (day: number, text: string) => void;
}

export const ReflectionPanel = ({
  daysInMonth,
  today,
  moods,
  moments,
  isCarryFlaggedDay,
  onMomentChange
}: ReflectionPanelProps) => {
  return (
    <Panel title="The Reflection">
      <div className="max-h-[520px] space-y-1 overflow-y-auto pr-1">
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
          const isToday = day === today;
          const mood = moods[day];

          return (
            <div
              key={day}
              className={`grid grid-cols-[24px_8px_1fr] items-start gap-2 rounded-lg px-2 py-1 ${
                isToday ? "border border-ab/20 bg-ab/10" : "hover:bg-glass-h"
              } ${!isToday && isCarryFlaggedDay(day) ? "border-l-2 border-l-abad" : ""}`}
            >
              <div className={`pt-0.5 text-center font-serif text-sm ${isToday ? "text-ab" : "text-ts"}`}>
                {String(day).padStart(2, "0")}
              </div>
              <div
                className="mt-[7px] h-1.5 w-1.5 rounded-full"
                style={{
                  background: mood != null ? MOODS[mood].color : "rgba(255,255,255,.06)",
                  boxShadow: mood != null ? `0 0 5px ${MOODS[mood].color}` : "none"
                }}
              />
              <textarea
                value={moments[day] || ""}
                disabled={day > today}
                onChange={(e) => onMomentChange(day, e.target.value)}
                placeholder={isToday ? "One thing from today..." : "-"}
                className="w-full resize-none bg-transparent font-serif text-xs italic leading-relaxed text-tp outline-none placeholder:text-td disabled:opacity-15"
                rows={1}
              />
            </div>
          );
        })}
      </div>
    </Panel>
  );
};
