import { Dialog, DialogContent } from "../ui/dialog";
import type { InsightItem } from "../../types";

export interface BriefingModalProps {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  dateLabel: string;
  stats: Array<{ label: string; value: string }>;
  memory: string | null;
  insight: InsightItem | null;
}

export const BriefingModal = ({ open, onOpenChange, dateLabel, stats, memory, insight }: BriefingModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[520px]">
        <div className="font-serif text-2xl">☀️ Morning Briefing</div>
        <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.14em] text-td">{dateLabel}</div>

        <div className="mb-3 grid grid-cols-2 gap-2">
          {stats.map((s) => (
            <div key={s.label} className="rounded-lg border border-white/10 bg-white/5 p-3">
              <div className="bg-gradient-to-br from-white to-ab bg-clip-text font-serif text-3xl leading-none text-transparent">{s.value}</div>
              <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.1em] text-td">{s.label}</div>
            </div>
          ))}
        </div>

        {memory ? (
          <div className="mb-3 rounded-r-lg border-l-2 border-l-ab/40 bg-ab/5 px-3 py-2">
            <div className="mb-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-td">Memory</div>
            <div className="font-serif text-sm italic text-ts">"{memory}"</div>
          </div>
        ) : null}

        {insight ? (
          <div className="mb-3 flex items-start gap-2 rounded-lg border border-ab/15 bg-ab/5 px-3 py-2">
            <div>{insight.icon}</div>
            <div className="font-serif text-sm italic text-ts">{insight.text}</div>
          </div>
        ) : null}

        <div className="flex justify-end">
          <button type="button" onClick={() => onOpenChange(false)} className="rounded border border-ab/30 bg-gradient-to-br from-ai/40 to-ab/30 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-white">
            Begin the day
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
