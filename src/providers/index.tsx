"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import GoogleAuthProvider from "./google-auth.provider";
import QueryProvider from "./query.provider";
import ThemeProvider from "./theme.provider";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <GoogleAuthProvider>
        <QueryProvider>
          <TooltipProvider>
            {/* Every animation respects the visitor's "reduce motion" setting */}
            <MotionConfig reducedMotion="user">{children}</MotionConfig>
          </TooltipProvider>
        </QueryProvider>
      </GoogleAuthProvider>
    </ThemeProvider>
  );
}
