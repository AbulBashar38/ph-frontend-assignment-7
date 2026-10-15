"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

// Slow "Ken Burns" settle: starts slightly zoomed in and eases back to normal size
export default function ZoomIn({
  children,
  from = 1.12,
  duration = 2.4,
  className,
}: {
  children: ReactNode;
  from?: number;
  duration?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ scale: from }}
      animate={{ scale: 1 }}
      transition={{ duration, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
