import { Dialog, DialogContent } from "../ui/dialog";
import { TEMPLATES } from "../../lib/constants";
import type { HabitTemplate } from "../../types";

export interface TemplatesModalProps {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  onPick: (template: HabitTemplate) => void;
}

export const TemplatesModal = ({ open, onOpenChange, onPick }: TemplatesModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[420px]">
        <div className="font-serif text-2xl">Habit Templates</div>
        <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.14em] text-td">Load a curated starter pack</div>

        <div className="mb-3 grid grid-cols-2 gap-2">
          {TEMPLATES.map((t) => (
            <button
              key={t.name}
              type="button"
              onClick={() => {
                onPick(t);
                onOpenChange(false);
              }}
              className="rounded-lg border border-white/10 bg-white/5 p-3 text-left hover:border-white/20 hover:bg-glass-h"
            >
              <div className="text-xl">{t.icon}</div>
              <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-ts">{t.name}</div>
              <div className="mt-1 font-serif text-xs italic text-td">{t.desc}</div>
            </button>
          ))}
        </div>

        <div className="flex justify-end">
          <button type="button" onClick={() => onOpenChange(false)} className="rounded border border-white/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-ts">Cancel</button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
