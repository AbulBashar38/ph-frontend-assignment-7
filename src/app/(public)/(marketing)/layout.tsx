import type { ReactNode } from "react";
import Footer from "@/components/layout/public/Footer";
import Header from "@/components/layout/public/Header";
import SmoothScroll from "@/components/shared/motion/smooth-scroll";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <SmoothScroll>
      <div className="flex min-h-screen flex-col bg-background text-foreground">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </SmoothScroll>
  );
}
