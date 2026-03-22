import { Panel } from "../shared/Panel";

export interface WeekScoreProps {
  score: number;
  streak: number;
  timerSessions: number;
  journalEntries: number;
  reviews: number;
}

export const WeekScore = ({ score, streak, timerSessions, journalEntries, reviews }: WeekScoreProps) => {
  const color = score >= 80 ? "var(--ag)" : score >= 50 ? "var(--ab)" : "var(--aw)";

  return (
    <Panel title="Week Score" className="mb-3">
      <div
        style={{ background: `linear-gradient(135deg, ${color}, var(--ab))` }}
        className="bg-clip-text text-center font-serif text-5xl leading-none text-transparent"
      >
        {score}
      </div>
      <div className="mt-1 text-center font-mono text-[10px] uppercase tracking-[0.15em] text-td">out of 100</div>
      <div className="mt-3 grid grid-cols-2 gap-1.5">
        <Kpi label="Day Streak" value={String(streak)} />
        <Kpi label="Focus Sessions" value={String(timerSessions)} />
        <Kpi label="Journal Entries" value={String(journalEntries)} />
        <Kpi label="Weekly Reviews" value={String(reviews)} />
      </div>
    </Panel>
  );
};

interface KpiProps {
  label: string;
  value: string;
}

const Kpi = ({ label, value }: KpiProps) => (
  <div className="rounded-lg border border-glass-b bg-white/3 px-2.5 py-2">
    <div className="font-serif text-xl leading-none text-tp">{value}</div>
    <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.08em] text-td">{label}</div>
  </div>
);
