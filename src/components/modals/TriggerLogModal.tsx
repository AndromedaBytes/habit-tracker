import { Dialog, DialogContent } from "../ui/dialog";

export interface TriggerLogModalProps {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  habitName: string;
  onSave: (text: string) => void;
}

export const TriggerLogModal = ({ open, onOpenChange, habitName, onSave }: TriggerLogModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[380px]">
        <div className="font-serif text-2xl">What triggered this?</div>
        <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.14em] text-td">{habitName}</div>

        <label className="mb-1 block font-mono text-[10px] uppercase tracking-[0.14em] text-ts">Root cause or trigger</label>
        <textarea id="trigger-text" rows={3} className="w-full rounded border border-white/10 bg-white/5 px-3 py-2 font-serif text-sm text-tp outline-none" placeholder="Boredom, stress, environment, social pressure..." />

        <div className="mt-4 flex justify-end gap-2">
          <button type="button" onClick={() => onOpenChange(false)} className="rounded border border-white/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-ts">Skip</button>
          <button
            type="button"
            onClick={() => {
              const text = (document.getElementById("trigger-text") as HTMLTextAreaElement).value.trim();
              if (text) onSave(text);
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
