import { Panel } from "../shared/Panel";
import { WIND_DOWN } from "../../lib/constants";

export interface WindDownProps {
  visible: boolean;
  doneMap: Record<number, boolean>;
  onToggle: (index: number) => void;
}

export const WindDown = ({ visible, doneMap, onToggle }: WindDownProps) => {
  if (!visible) return null;

  return (
    <Panel title="🌙 Evening Wind-Down" titleClassName="text-aw after:bg-aw/20" className="border-aw/20 bg-aw/5">
      <div className="space-y-1">
        {WIND_DOWN.map((item, i) => {
          const done = !!doneMap[i];
          return (
            <button
              key={item}
              type="button"
              onClick={() => onToggle(i)}
              className={`flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-left transition ${
                done ? "border-aw/30 bg-aw/10" : "border-transparent bg-white/2 hover:bg-glass-h"
              }`}
            >
              <div
                className={`grid h-4 w-4 place-items-center rounded-full border text-[10px] ${
                  done ? "border-aw bg-aw/20 text-aw" : "border-aw/30 text-transparent"
                }`}
              >
                ✓
              </div>
              <span className={`text-xs ${done ? "text-tp" : "text-ts"}`}>{item}</span>
            </button>
          );
        })}
      </div>
    </Panel>
  );
};
