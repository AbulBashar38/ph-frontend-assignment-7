import { ArrowRight, Building2, Plus } from "lucide-react";
import Link from "next/link";
import Reveal from "@/components/shared/motion/reveal";
import { Stagger, StaggerItem } from "@/components/shared/motion/stagger";
import PropertyCard from "@/components/shared/property-card";
import SectionHeading from "@/components/shared/section-heading";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Property } from "@/types";

export default function FeaturedListings({
  properties,
  total,
}: {
  properties: Property[];
  total: number;
}) {
  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Fresh on the market"
            title="Newly listed homes"
            description="Every listing shows the real starting rent, how many rooms are free and when you can move in."
            action={
              total > 0 && (
                <Link
                  href="/properties"
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "gap-2 self-start md:self-auto",
                  )}
                >
                  View all {total} listing{total === 1 ? "" : "s"}
                  <ArrowRight className="size-4" />
                </Link>
              )
            }
          />
        </Reveal>

        {properties.length > 0 ? (
          <Stagger className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map((property) => (
              <StaggerItem key={property.id}>
                <PropertyCard property={property} />
              </StaggerItem>
            ))}
            {properties.length < 3 && (
              <StaggerItem>
                <Link
                  href="/register"
                  className="group flex h-full min-h-72 flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition-colors hover:border-primary/50 hover:bg-accent/40"
                >
                  <span className="flex size-14 items-center justify-center rounded-2xl bg-accent text-primary transition-transform duration-300 group-hover:scale-110 group-hover:rotate-90">
                    <Plus className="size-6" />
                  </span>
                  <span className="mt-5 font-heading text-xl font-semibold">
                    Have a room to rent?
                  </span>
                  <span className="mt-2 max-w-xs text-sm text-muted-foreground">
                    List your flat or spare room for free and get viewing
                    requests from registered tenants.
                  </span>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                    List your property
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </StaggerItem>
            )}
          </Stagger>
        ) : (
          <div className="mt-10 flex flex-col items-center rounded-3xl border border-dashed bg-muted/30 px-6 py-14 text-center">
            <span className="flex size-14 items-center justify-center rounded-2xl bg-accent text-primary">
              <Building2 className="size-7" />
            </span>
            <h3 className="mt-5 font-heading text-xl font-semibold">
              No listings published yet
            </h3>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              Own a flat or a spare room? Publish it in a few minutes and start
              receiving viewing requests.
            </p>
            <Link href="/register" className={cn(buttonVariants(), "mt-6")}>
              List your property
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
