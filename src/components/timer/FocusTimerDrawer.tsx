import type { UseTimerResult } from "../../hooks/useTimer";

export interface FocusTimerDrawerProps {
  timer: UseTimerResult;
  totalSessions: number;
}

export const FocusTimerDrawer = ({ timer, totalSessions }: FocusTimerDrawerProps) => {
  const mins = Math.floor(timer.remaining / 60);
  const secs = timer.remaining % 60;

  return (
    <div
      className={`fixed bottom-0 right-0 z-50 w-[305px] rounded-t-2xl border border-white/10 border-b-0 bg-[#0a0a1b] px-4 py-3 shadow-2xl transition md:w-[305px] ${
        timer.open ? "translate-y-0" : "translate-y-[calc(100%-40px)]"
      }`}
    >
      <button type="button" onClick={timer.toggleDrawer} className="flex w-full items-center justify-between">
        <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-ts">
          <div className={`h-1.5 w-1.5 rounded-full ${timer.running ? "animate-pulse bg-abad shadow-[0_0_6px_rgba(255,92,92,.8)]" : "bg-td"}`} />
          Focus Timer
        </div>
        <span className="font-mono text-[10px] text-td">{timer.open ? "▼" : "▲"}</span>
      </button>

      <div className="mt-3 bg-gradient-to-br from-white to-ab bg-clip-text text-center font-serif text-5xl leading-none text-transparent">
        {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
      </div>
      <div className="mt-1 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-ts">
        {timer.breakMode ? "Break" : "Focus"}
      </div>

      <div className="mt-2 h-[3px] overflow-hidden rounded bg-white/10">
        <div style={{ width: `${(timer.remaining / timer.total) * 100}%` }} className="h-full bg-gradient-to-r from-ai to-ab" />
      </div>

      <div className="mt-3 flex justify-center gap-1">
        {timer.presets.map((p, i) => (
          <button
            key={p.label}
            type="button"
            onClick={() => timer.setPreset(i)}
            className={`rounded border px-2 py-1 font-mono text-[10px] ${
              timer.activePreset === i ? "border-white/20 bg-white/10 text-ts" : "border-white/10 text-td"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="mt-2 flex justify-center gap-1.5">
        <button type="button" onClick={timer.reset} className="rounded border border-white/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.09em] text-ts">
          Reset
        </button>
        <button
          type="button"
          onClick={timer.toggleRun}
          className="rounded border border-ab/30 bg-gradient-to-br from-ai/40 to-ab/30 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.09em] text-white"
        >
          {timer.running ? "Pause" : "Start"}
        </button>
      </div>

      <div className="mt-2 flex justify-center gap-1">
        {Array.from({ length: timer.maxSessions }, (_, i) => (
          <div
            key={i}
            className={`h-1.5 w-1.5 rounded-full border ${
              i < timer.sessionsInCycle
                ? "border-ab bg-ab shadow-[0_0_6px_rgba(79,195,247,.5)]"
                : i === timer.sessionsInCycle && timer.running && !timer.breakMode
                  ? "animate-pulse border-ab"
                  : "border-white/20"
            }`}
          />
        ))}
      </div>
      <div className="mt-1 text-center font-mono text-[10px] text-td">{totalSessions} sessions today</div>
    </div>
  );
};
