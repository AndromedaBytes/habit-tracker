import type { PropsWithChildren } from "react";
import { cn } from "../../lib/utils";

export interface PanelProps extends PropsWithChildren {
  title?: string;
  className?: string;
  titleClassName?: string;
}

export const Panel = ({ title, className, titleClassName, children }: PanelProps) => {
  return (
    <div className={cn("rounded-2xl border border-glass-b bg-glass p-4 backdrop-blur-xl transition hover:border-white/20", className)}>
      {title ? (
        <div className={cn("mb-3 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-ts after:h-px after:flex-1 after:bg-glass-b", titleClassName)}>
          {title}
        </div>
      ) : null}
      {children}
    </div>
  );
};
