"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

// Gentle, endless bobbing for small decorative badges
export default function Float({
  children,
  delay = 0,
  distance = 8,
  className,
}: {
  children: ReactNode;
  delay?: number;
  distance?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1, y: [0, -distance, 0] }}
      transition={{
        opacity: { duration: 0.5, delay },
        scale: { duration: 0.5, delay },
        y: {
          duration: 4,
          delay,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        },
      }}
    >
      {children}
    </motion.div>
  );
}
