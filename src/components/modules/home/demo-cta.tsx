import { ArrowRight, Building2, KeyRound, ShieldCheck } from "lucide-react";
import Link from "next/link";
import Reveal from "@/components/shared/motion/reveal";
import { Stagger, StaggerItem } from "@/components/shared/motion/stagger";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ROLES = [
  {
    role: "tenant",
    label: "Tenant",
    text: "Search, match, apply and pay",
    icon: KeyRound,
  },
  {
    role: "owner",
    label: "Owner",
    text: "List rooms and review tenants",
    icon: Building2,
  },
  {
    role: "admin",
    label: "Admin",
    text: "Moderate and see analytics",
    icon: ShieldCheck,
  },
];

export default function DemoCta() {
  return (
    <section className="px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
      <Reveal
        y={40}
        className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-foreground px-6 py-14 text-background sm:px-12 sm:py-16"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 -left-16 size-80 rounded-full bg-primary/40 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 right-0 size-72 rounded-full bg-highlight/25 blur-3xl"
        />

        <div className="relative grid items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <h2 className="font-heading text-3xl leading-tight font-bold tracking-tight text-balance sm:text-5xl">
              Ready to find your next place?
            </h2>
            <p className="mt-4 max-w-lg text-base leading-relaxed opacity-75">
              Create a free account in a minute, or explore the platform first
              with a one-click demo account for any role.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/register"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "h-11 gap-2 bg-highlight px-5 text-highlight-foreground hover:bg-highlight/90",
                )}
              >
                Create free account
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/properties"
                className={cn(
                  buttonVariants({ size: "lg", variant: "outline" }),
                  "h-11 border-background/25 bg-transparent px-5 text-background hover:bg-background/10 hover:text-background",
                )}
              >
                Browse listings
              </Link>
            </div>
          </div>

          <Stagger className="space-y-3">
            <p className="text-sm font-semibold tracking-wide uppercase opacity-60">
              Try a demo account
            </p>
            {ROLES.map(({ role, label, text, icon: Icon }) => (
              <StaggerItem key={role}>
                <Link
                  href={`/login?demo=${role}`}
                  className="group flex items-center gap-4 rounded-2xl border border-background/15 bg-background/5 p-4 transition-colors hover:bg-background/10"
                >
                  <span className="flex size-10 items-center justify-center rounded-xl bg-background/10">
                    <Icon className="size-5" />
                  </span>
                  <span className="flex-1">
                    <span className="block font-semibold">{label}</span>
                    <span className="block text-sm opacity-65">{text}</span>
                  </span>
                  <ArrowRight className="size-4 opacity-60 transition-transform group-hover:translate-x-1" />
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </Reveal>
    </section>
  );
}
