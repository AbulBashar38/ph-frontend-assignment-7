"use client";

import { ReactLenis } from "lenis/react";
import { MotionConfig, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import "lenis/dist/lenis.css";

// Lenis smooth scrolling for the public pages; everything falls back to normal motion-free behavior
// when the visitor has "reduce motion" turned on
export default function SmoothScroll({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion();

  return (
    <MotionConfig reducedMotion="user">
      {reduceMotion ? (
        children
      ) : (
        <ReactLenis root options={{ lerp: 0.1, smoothWheel: true }}>
          {children}
        </ReactLenis>
      )}
    </MotionConfig>
  );
}
