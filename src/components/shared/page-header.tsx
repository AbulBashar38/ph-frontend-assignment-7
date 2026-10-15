import { ChevronRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import Reveal from "@/components/shared/motion/reveal";

interface Crumb {
  label: string;
  href?: string;
}

// Title band at the top of public pages, with breadcrumbs
export default function PageHeader({
  eyebrow,
  title,
  description,
  breadcrumbs = [],
  children,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  breadcrumbs?: Crumb[];
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b bg-muted/40">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 right-0 size-80 rounded-full bg-highlight/15 blur-3xl"
      />
      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        {breadcrumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
              {[{ label: "Home", href: "/" }, ...breadcrumbs].map(
                (crumb, index, all) => (
                  <li key={crumb.label} className="flex items-center gap-1.5">
                    {crumb.href && index < all.length - 1 ? (
                      <Link href={crumb.href} className="hover:text-foreground">
                        {crumb.label}
                      </Link>
                    ) : (
                      <span aria-current="page" className="text-foreground">
                        {crumb.label}
                      </span>
                    )}
                    {index < all.length - 1 && (
                      <ChevronRight className="size-3.5" />
                    )}
                  </li>
                ),
              )}
            </ol>
          </nav>
        )}
        <Reveal y={16}>
          {eyebrow && (
            <p className="text-sm font-semibold tracking-wide text-primary uppercase">
              {eyebrow}
            </p>
          )}
          <h1 className="mt-2 font-heading text-4xl font-bold tracking-tight text-balance sm:text-5xl">
            {title}
          </h1>
          {description && (
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground text-pretty">
              {description}
            </p>
          )}
        </Reveal>
        {children}
      </div>
    </section>
  );
}
