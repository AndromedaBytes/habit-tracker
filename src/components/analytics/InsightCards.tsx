import type { InsightItem } from "../../types";
import { Panel } from "../shared/Panel";

export interface InsightCardsProps {
  items: InsightItem[];
}

export const InsightCards = ({ items }: InsightCardsProps) => {
  return (
    <Panel title="Insights">
      <div className="space-y-2">
        {items.map((ins, idx) => (
          <div key={`${ins.text}-${idx}`} className="flex items-start gap-2 rounded-lg border border-ab/15 bg-ab/5 px-3 py-2">
            <div className="text-sm">{ins.icon}</div>
            <div className="font-serif text-xs italic leading-relaxed text-ts">{ins.text}</div>
          </div>
        ))}
      </div>
    </Panel>
  );
};
