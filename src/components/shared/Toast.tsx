import { AnimatePresence, motion } from "framer-motion";

export interface ToastProps {
  message: string;
  open: boolean;
}

export const Toast = ({ message, open }: ToastProps) => {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          className="fixed left-1/2 top-5 z-[500] flex -translate-x-1/2 items-center gap-2 rounded-full border border-ab/40 bg-gradient-to-br from-ai/90 to-ab/80 px-5 py-2 font-mono text-[11px] uppercase tracking-[0.1em] text-white"
        >
          <span>🏆</span>
          <span>{message}</span>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};
