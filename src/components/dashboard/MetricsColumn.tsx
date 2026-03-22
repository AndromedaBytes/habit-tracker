import { useEffect, useRef, useState } from "react";
import { Panel } from "../shared/Panel";
import { EnergyDots } from "../shared/EnergyDots";
import type { AppState, Habit } from "../../types";

export interface MetricsColumnProps {
  state: AppState;
  today: number;
  daysInMonth: number;
  positiveHabits: Habit[];
  onSetEnergy: (index: number) => void;
  onLogSleep: (hours: number) => void;
  children: React.ReactNode;
}

export const MetricsColumn = ({
  state,
  today,
  daysInMonth,
  positiveHabits,
  onSetEnergy,
  onLogSleep,
  children
}: MetricsColumnProps) => {
  const [sleepInput, setSleepInput] = useState("");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const doneToday = positiveHabits.filter((h) => state.ticks[`${h.id}-${today}`]).length;
  const completion = positiveHabits.length ? Math.round((doneToday / positiveHabits.length) * 100) : 0;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.clientWidth || 240;
    const h = 110;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    const minH = 4;
    const maxH = 10;
    const pL = 22;
    const pR = 6;
    const pT = 5;
    const pB = 15;
    const gW = w - pL - pR;
    const gH = h - pT - pB;

    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = "rgba(255,255,255,.05)";
    [4, 6, 8, 10].forEach((level) => {
      const y = pT + gH - ((level - minH) / (maxH - minH)) * gH;
      ctx.beginPath();
      ctx.moveTo(pL, y);
      ctx.lineTo(pL + gW, y);
      ctx.stroke();
      ctx.fillStyle = "rgba(255,255,255,.16)";
      ctx.font = "8px monospace";
      ctx.fillText(String(level), 0, y + 3);
    });

    const points: Array<{ x: number; y: number }> = [];
    for (let d = 1; d <= daysInMonth; d += 1) {
      if (!state.sleep[d]) continue;
      points.push({
        x: pL + ((d - 1) / (daysInMonth - 1)) * gW,
        y: pT + gH - ((state.sleep[d] - minH) / (maxH - minH)) * gH
      });
    }

    if (points.length > 1) {
      const grad = ctx.createLinearGradient(pL, 0, pL + gW, 0);
      grad.addColorStop(0, "rgba(124,111,205,.8)");
      grad.addColorStop(1, "rgba(79,195,247,.8)");
      ctx.strokeStyle = grad;
      ctx.lineWidth = 2;
      ctx.beginPath();
      points.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
      ctx.stroke();
    }

    points.forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(79,195,247,.88)";
      ctx.fill();
    });
  }, [daysInMonth, state.sleep]);

  return (
    <div className="flex flex-col gap-3">
      <Panel title="At a Glance">
        <div className="grid grid-cols-2 gap-1.5">
          <StatCard label="Done today" value={String(doneToday)} />
          <StatCard label="Completion" value={`${completion}%`} />
          <StatCard label="Sleep hrs" value={state.sleep[today] ? String(state.sleep[today]) : "-"} />
          <StatCard label="Energy" value={state.energy[today] != null ? `${state.energy[today] + 1}/5` : "-"} />
        </div>
        <div className="mt-3">
          <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.16em] text-ts">Energy level</div>
          <EnergyDots selected={state.energy[today]} onSelect={onSetEnergy} />
        </div>
      </Panel>

      <Panel title="Sleep Trend">
        <canvas ref={canvasRef} className="h-[110px] w-full" />
        <div className="mt-2 flex items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ts">Log</span>
          <input
            value={sleepInput}
            onChange={(e) => setSleepInput(e.target.value)}
            type="number"
            min={2}
            max={12}
            step={0.5}
            className="w-16 rounded border border-white/10 bg-white/5 px-2 py-1 font-mono text-xs text-tp outline-none"
            placeholder="7.5"
          />
          <button
            type="button"
            onClick={() => {
              const n = parseFloat(sleepInput);
              onLogSleep(n);
              setSleepInput("");
            }}
            className="rounded border border-white/10 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.08em] text-ts"
          >
            Log
          </button>
        </div>
      </Panel>

      {children}
    </div>
  );
};

interface StatCardProps {
  label: string;
  value: string;
}

const StatCard = ({ label, value }: StatCardProps) => (
  <div className="rounded-lg border border-glass-b bg-white/3 px-3 py-2">
    <div className="bg-gradient-to-br from-white to-ab bg-clip-text font-serif text-2xl leading-none text-transparent">{value}</div>
    <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.1em] text-td">{label}</div>
  </div>
);
