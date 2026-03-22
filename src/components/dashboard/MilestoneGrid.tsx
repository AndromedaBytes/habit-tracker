import { Panel } from "../shared/Panel";
import { buildMilestones } from "../../lib/constants";

export interface MilestoneGridProps {
  today: number;
  unlocked: string[];
}

export const MilestoneGrid = ({ today, unlocked }: MilestoneGridProps) => {
  const milestones = buildMilestones(today);

  return (
    <Panel title="Milestones">
      <div className="grid grid-cols-3 gap-1.5">
        {milestones.map((m) => {
          const active = unlocked.includes(m.id);
          return (
            <div
              key={m.id}
              title={m.name}
              className={`rounded-lg border p-2 text-center ${active ? "border-ab/20 bg-ab/10" : "border-white/10 bg-white/2"}`}
            >
              <div className={`text-lg ${active ? "opacity-100" : "opacity-25 grayscale"}`}>{m.icon}</div>
              <div className={`font-mono text-[9px] uppercase tracking-[0.06em] ${active ? "text-ab" : "text-td"}`}>{m.name}</div>
            </div>
          );
        })}
      </div>
    </Panel>
  );
};
