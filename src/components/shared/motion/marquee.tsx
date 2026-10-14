"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

// Endless horizontal ticker; the content is rendered twice so the loop is seamless
export default function Marquee({
  children,
  duration = 30,
  className,
}: {
  children: ReactNode;
  duration?: number;
  className?: string;
}) {
  return (
    <div
      className={`overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] ${className ?? ""}`}
    >
      <motion.div
        className="flex w-max"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          duration,
          ease: "linear",
          repeat: Number.POSITIVE_INFINITY,
        }}
      >
        <div className="flex shrink-0">{children}</div>
        <div aria-hidden="true" inert className="flex shrink-0">
          {children}
        </div>
      </motion.div>
    </div>
  );
}
