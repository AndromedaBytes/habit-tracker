import { useState } from "react";
import { Dialog, DialogContent } from "../ui/dialog";
import type { HabitCategory } from "../../types";

export interface AddHabitModalProps {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  onAdd: (name: string, cat: HabitCategory) => void;
}

export const AddHabitModal = ({ open, onOpenChange, onAdd }: AddHabitModalProps) => {
  const [name, setName] = useState("");
  const [cat, setCat] = useState<HabitCategory>("black");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[360px]">
        <div className="font-serif text-2xl">New Habit</div>
        <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.14em] text-td">Define what you want to track</div>

        <label className="mb-1 block font-mono text-[10px] uppercase tracking-[0.14em] text-ts">Habit Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} className="mb-3 w-full rounded border border-white/10 bg-white/5 px-3 py-2 font-serif text-sm text-tp outline-none" />

        <label className="mb-1 block font-mono text-[10px] uppercase tracking-[0.14em] text-ts">Category</label>
        <div className="mb-4 flex flex-wrap gap-1">
          {([
            ["black", "⬤ Core"],
            ["blue", "⬤ Building"],
            ["red", "⬤ Minimize"]
          ] as Array<[HabitCategory, string]>).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setCat(value)}
              className={`rounded border px-2 py-1 font-mono text-[10px] uppercase tracking-[0.1em] ${
                cat === value ? "border-white/20 bg-white/10 text-tp" : "border-white/10 text-ts"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex justify-end gap-2">
          <button type="button" onClick={() => onOpenChange(false)} className="rounded border border-white/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-ts">Cancel</button>
          <button
            type="button"
            onClick={() => {
              if (!name.trim()) return;
              onAdd(name.trim(), cat);
              setName("");
              setCat("black");
              onOpenChange(false);
            }}
            className="rounded border border-ab/30 bg-gradient-to-br from-ai/40 to-ab/30 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-white"
          >
            Add Habit
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
