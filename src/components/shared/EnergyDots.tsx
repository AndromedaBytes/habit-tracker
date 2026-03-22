import { ENERGY_LABELS } from "../../lib/constants";
import { cn } from "../../lib/utils";

const COLORS = ["#6b7db3", "#8b8fa8", "#7db5a0", "#7fba8a", "#e8c468"];

export interface EnergyDotsProps {
  selected?: number;
  onSelect: (index: number) => void;
}

export const EnergyDots = ({ selected, onSelect }: EnergyDotsProps) => {
  return (
    <div className="mb-2 flex items-center gap-1">
      {ENERGY_LABELS.map((icon, i) => (
        <button
          key={icon}
          type="button"
          title={`Energy: ${i + 1}/5`}
          onClick={() => onSelect(i)}
          style={{ backgroundColor: `${COLORS[i]}22`, color: COLORS[i] }}
          className={cn(
            "grid h-6 w-6 place-items-center rounded-full border-2 border-transparent text-xs opacity-35 transition hover:scale-110 hover:opacity-80",
            selected === i && "scale-110 border-white/35 opacity-100"
          )}
        >
          {icon}
        </button>
      ))}
    </div>
  );
};
