import { motion } from "framer-motion";
import type { PropsWithChildren } from "react";

export interface FadeUpProps extends PropsWithChildren {
  className?: string;
}

export const FadeUp = ({ className, children }: FadeUpProps) => {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className={className}>
      {children}
    </motion.div>
  );
};
