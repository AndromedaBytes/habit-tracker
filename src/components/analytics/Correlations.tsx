import type { CorrelationResult } from "../../types";
import { Panel } from "../shared/Panel";

export interface CorrelationsProps {
  data: CorrelationResult[];
}

export const Correlations = ({ data }: CorrelationsProps) => {
  return (
    <Panel title="Habit Correlations">
      {!data.length ? <div className="text-xs italic text-td">Need more data for correlations.</div> : null}
      <div className="space-y-2">
        {data.slice(0, 3).map((c, idx) => (
          <div key={`${c.desc}-${idx}`} className="rounded-lg border border-ab/15 bg-ab/5 px-3 py-2">
            <div className="font-serif text-2xl leading-none text-ab">{c.pct > 0 ? "+" : ""}{c.pct}%</div>
            <div className="mt-1 font-serif text-xs italic leading-relaxed text-ts">{c.desc}</div>
          </div>
        ))}
      </div>
    </Panel>
  );
};
