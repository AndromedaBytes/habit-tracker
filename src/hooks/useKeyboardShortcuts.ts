import { useEffect } from "react";

export interface KeyboardHandlers {
  onJournal: () => void;
  onToggleTimer: () => void;
  onQuickTick: () => void;
  onBriefing: () => void;
  onToggleShortcuts: () => void;
  onMood: (index: number) => void;
  onEscape: () => void;
  onSpace: () => void;
}

export const useKeyboardShortcuts = (handlers: KeyboardHandlers) => {
  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      const tag = (document.activeElement?.tagName || "").toLowerCase();
      if (tag === "input" || tag === "textarea") return;

      switch (e.key) {
        case "j":
        case "J":
          handlers.onJournal();
          break;
        case "t":
        case "T":
          handlers.onToggleTimer();
          break;
        case "q":
        case "Q":
          handlers.onQuickTick();
          break;
        case "b":
        case "B":
          handlers.onBriefing();
          break;
        case "?":
          handlers.onToggleShortcuts();
          break;
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
          handlers.onMood(parseInt(e.key, 10) - 1);
          break;
        case " ":
          e.preventDefault();
          handlers.onSpace();
          break;
        case "Escape":
          handlers.onEscape();
          break;
        default:
          break;
      }
    };

    document.addEventListener("keydown", listener);
    return () => document.removeEventListener("keydown", listener);
  }, [handlers]);
};
