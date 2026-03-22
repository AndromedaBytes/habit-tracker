import { Dialog, DialogContent } from "../ui/dialog";
import type { JournalEntry } from "../../types";

export interface JournalModalProps {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  dateLabel: string;
  value: JournalEntry;
  onSave: (entry: JournalEntry) => void;
}

export const JournalModal = ({ open, onOpenChange, dateLabel, value, onSave }: JournalModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <div className="font-serif text-2xl">Daily Journal</div>
        <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.14em] text-td">{dateLabel}</div>

        <label className="mb-1 block font-mono text-[10px] uppercase tracking-[0.14em] text-ts">How are you feeling?</label>
        <textarea id="journal-text" defaultValue={value.text} rows={4} className="mb-3 w-full rounded border border-white/10 bg-white/5 px-3 py-2 font-serif text-sm italic text-tp outline-none" />

        <label className="mb-1 block font-mono text-[10px] uppercase tracking-[0.14em] text-ts">Three things I'm grateful for</label>
        {["I", "II", "III"].map((n, i) => (
          <div key={n} className="mb-1 flex items-center gap-2">
            <div className="w-4 font-serif text-xs text-ab/70">{n}.</div>
            <input
              id={`journal-g-${i + 1}`}
              defaultValue={i === 0 ? value.g1 : i === 1 ? value.g2 : value.g3}
              className="w-full rounded border border-white/10 bg-white/5 px-2 py-1.5 font-serif text-xs text-tp outline-none"
            />
          </div>
        ))}

        <div className="mt-4 flex justify-end gap-2">
          <button type="button" onClick={() => onOpenChange(false)} className="rounded border border-white/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-ts">Close</button>
          <button
            type="button"
            onClick={() => {
              const text = (document.getElementById("journal-text") as HTMLTextAreaElement).value;
              const g1 = (document.getElementById("journal-g-1") as HTMLInputElement).value;
              const g2 = (document.getElementById("journal-g-2") as HTMLInputElement).value;
              const g3 = (document.getElementById("journal-g-3") as HTMLInputElement).value;
              onSave({ text, g1, g2, g3 });
              onOpenChange(false);
            }}
            className="rounded border border-ab/30 bg-gradient-to-br from-ai/40 to-ab/30 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-white"
          >
            Save
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
