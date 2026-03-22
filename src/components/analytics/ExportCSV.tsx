import { Panel } from "../shared/Panel";

export interface ExportCSVProps {
  onExport: () => void;
}

export const ExportCSV = ({ onExport }: ExportCSVProps) => {
  return (
    <Panel title="Export Data">
      <div className="mb-3 font-serif text-xs italic text-ts">
        Download your month as CSV for journaling, coaching, or self-review.
      </div>
      <button
        type="button"
        onClick={onExport}
        className="rounded border border-ag/30 bg-gradient-to-br from-ag/20 to-ab/15 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.1em] text-white"
      >
        Export CSV
      </button>
    </Panel>
  );
};
