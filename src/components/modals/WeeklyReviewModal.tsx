import { Dialog, DialogContent } from "../ui/dialog";
import type { WeeklyReview } from "../../types";

export interface WeeklyReviewModalProps {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  dateLabel: string;
  value: WeeklyReview;
  onSave: (review: WeeklyReview) => void;
}

export const WeeklyReviewModal = ({ open, onOpenChange, dateLabel, value, onSave }: WeeklyReviewModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[520px]">
        <div className="font-serif text-2xl">Weekly Review</div>
        <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.14em] text-td">{dateLabel}</div>

        <Field id="wr1" label="What went well this week?" defaultValue={value.good} isTextArea />
        <Field id="wr2" label="What drained you or held you back?" defaultValue={value.drained} isTextArea />
        <Field id="wr3" label="One habit to drop or renegotiate" defaultValue={value.drop} />
        <Field id="wr4" label="One thing to double down on" defaultValue={value.double} />

        <div className="mt-3 flex justify-end gap-2">
          <button type="button" onClick={() => onOpenChange(false)} className="rounded border border-white/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-ts">Cancel</button>
          <button
            type="button"
            onClick={() => {
              onSave({
                good: (document.getElementById("wr1") as HTMLTextAreaElement).value,
                drained: (document.getElementById("wr2") as HTMLTextAreaElement).value,
                drop: (document.getElementById("wr3") as HTMLInputElement).value,
                double: (document.getElementById("wr4") as HTMLInputElement).value
              });
              onOpenChange(false);
            }}
            className="rounded border border-ab/30 bg-gradient-to-br from-ai/40 to-ab/30 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-white"
          >
            Save Review
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface FieldProps {
  id: string;
  label: string;
  defaultValue: string;
  isTextArea?: boolean;
}

const Field = ({ id, label, defaultValue, isTextArea = false }: FieldProps) => {
  return (
    <div className="mb-3">
      <label className="mb-1 block font-mono text-[10px] uppercase tracking-[0.14em] text-ts">{label}</label>
      {isTextArea ? (
        <textarea id={id} rows={2} defaultValue={defaultValue} className="w-full rounded border border-white/10 bg-white/5 px-3 py-2 font-serif text-sm text-tp outline-none" />
      ) : (
        <input id={id} defaultValue={defaultValue} className="w-full rounded border border-white/10 bg-white/5 px-3 py-2 font-serif text-sm text-tp outline-none" />
      )}
    </div>
  );
};
