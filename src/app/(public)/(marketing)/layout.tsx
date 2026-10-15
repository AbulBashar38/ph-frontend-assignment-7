import { type ReactNode, Suspense } from "react";
import Footer from "@/components/layout/public/Footer";
import Header from "@/components/layout/public/Header";
import HeaderFallback from "@/components/layout/public/header-fallback";
import SmoothScroll from "@/components/shared/motion/smooth-scroll";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <SmoothScroll>
      <div className="flex min-h-screen flex-col bg-background text-foreground">
        {/* The header reads the current path; on dynamic pages that's only known per request */}
        <Suspense fallback={<HeaderFallback />}>
          <Header />
        </Suspense>
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </SmoothScroll>
  );
}
