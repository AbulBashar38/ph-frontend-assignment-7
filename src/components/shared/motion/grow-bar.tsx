"use client";

import { motion } from "motion/react";

// A progress bar that fills to `percent` when it scrolls into view
export default function GrowBar({
  percent,
  delay = 0,
  className,
}: {
  percent: number;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.span
      className={className}
      initial={{ width: 0 }}
      whileInView={{ width: `${percent}%` }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 1.1, delay, ease: [0.22, 1, 0.36, 1] }}
    />
  );
}
