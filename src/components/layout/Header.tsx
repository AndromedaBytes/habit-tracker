import { FadeUp } from "../shared/FadeUp";

export interface HeaderProps {
  quote: string;
  streak: number;
  weekScore: number;
  view: "dashboard" | "analytics";
  onViewChange: (view: "dashboard" | "analytics") => void;
  onOpenBriefing: () => void;
  onOpenReview: () => void;
}

export const Header = ({ quote, streak, weekScore, view, onViewChange, onOpenBriefing, onOpenReview }: HeaderProps) => {
  return (
    <FadeUp>
      <header className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-glass-b bg-glass px-5 py-3 backdrop-blur-xl">
        <div className="font-serif text-2xl tracking-wide text-transparent [background:linear-gradient(135deg,#fff_40%,theme(colors.ab))] bg-clip-text">
          <span className="italic">Sanctuary</span>
        </div>

        <div className="flex-1 text-center">
          <div className="mx-auto max-w-[380px] font-serif text-xs italic leading-relaxed text-ts">{quote}</div>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2">
          <button
            type="button"
            onClick={onOpenBriefing}
            className="rounded-full border border-ab/30 bg-ab/10 px-3 py-1 font-mono text-[11px] tracking-[0.07em] text-ab hover:bg-ab/20"
          >
            🔥 {streak} day streak
          </button>
          <div className="rounded-full border border-ag/25 bg-ag/10 px-3 py-1 font-mono text-[11px] tracking-[0.07em] text-ag">
            ⭐ {weekScore}/100 this week
          </div>
          <button
            type="button"
            onClick={() => onViewChange("dashboard")}
            className={`rounded-md border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.1em] ${
              view === "dashboard" ? "border-white/20 bg-glass-h text-tp" : "border-glass-b bg-glass text-ts"
            }`}
          >
            Dashboard
          </button>
          <button
            type="button"
            onClick={() => onViewChange("analytics")}
            className={`rounded-md border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.1em] ${
              view === "analytics" ? "border-white/20 bg-glass-h text-tp" : "border-glass-b bg-glass text-ts"
            }`}
          >
            Analytics
          </button>
          <button
            type="button"
            onClick={onOpenReview}
            className="rounded-md border border-glass-b bg-glass px-3 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-ts"
          >
            Weekly Review
          </button>
          <span className="font-mono text-[10px] tracking-[0.08em] text-td">Press ? for shortcuts</span>
        </div>
      </header>
    </FadeUp>
  );
};
