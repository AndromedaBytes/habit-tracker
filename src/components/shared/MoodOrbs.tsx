import { MOODS } from "../../lib/constants";
import { cn } from "../../lib/utils";

export interface MoodOrbsProps {
  selected: number | undefined;
  onSelect: (index: number) => void;
}

export const MoodOrbs = ({ selected, onSelect }: MoodOrbsProps) => {
  return (
    <div className="flex items-center gap-1">
      {MOODS.map((m, i) => (
        <button
          key={m.label}
          type="button"
          title={m.label}
          onClick={() => onSelect(i)}
          className={cn(
            "grid h-7 w-7 place-items-center rounded-full border-2 border-transparent text-sm opacity-40 transition hover:scale-110 hover:opacity-80",
            selected === i && "scale-110 border-white/40 opacity-100"
          )}
        >
          {m.emoji}
        </button>
      ))}
    </div>
  );
};
