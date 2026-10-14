"use client";

import { motion } from "motion/react";

// The hand-drawn underline under the hero headline, drawn from left to right on load
export default function DrawLine({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 300 12"
      preserveAspectRatio="none"
      className={className}
    >
      <motion.path
        d="M2 9C60 3 140 2 298 7"
        fill="none"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.1, delay: 0.7, ease: [0.65, 0, 0.35, 1] }}
      />
    </svg>
  );
}
