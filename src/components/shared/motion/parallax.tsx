"use client";

import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { type ReactNode, useRef } from "react";

interface ParallaxProps {
  children: ReactNode;
  // Pixels moved across the element's full pass through the viewport; negative moves up
  offset?: number;
  className?: string;
}

export default function Parallax({
  children,
  offset = 60,
  className,
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const raw = useTransform(scrollYProgress, [0, 1], [offset, -offset]);
  const y = useSpring(raw, { stiffness: 120, damping: 30, mass: 0.4 });

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}
