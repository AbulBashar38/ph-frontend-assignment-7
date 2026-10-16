import { ArrowRight, Eye, HeartHandshake, Lock, Scale } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import livingRoom from "@/assets/images/living-room.jpg";
import roommates from "@/assets/images/roommates.jpg";
import Parallax from "@/components/shared/motion/parallax";
import Reveal from "@/components/shared/motion/reveal";
import { Stagger, StaggerItem } from "@/components/shared/motion/stagger";
import PageHeader from "@/components/shared/page-header";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About us",
  description:
    "BariBasa makes renting in Bangladesh clearer: honest listings, fair roommate matching and online rent, for tenants and owners alike.",
  openGraph: {
    title: "About BariBasa",
    description:
      "Why we're building a clearer way to rent rooms and find roommates in Bangladesh.",
    url: "/about",
  },
};

const PRINCIPLES = [
  {
    icon: Eye,
    title: "Everything up front",
    text: "Rent, free rooms and move-in dates are on every listing, so nobody wastes a trip.",
  },
  {
    icon: Scale,
    title: "Fair for both sides",
    text: "Owners choose their tenants; tenants see every step of their application.",
  },
  {
    icon: Lock,
    title: "Privacy by default",
    text: "Phone numbers stay hidden until both people agree to connect.",
  },
  {
    icon: HeartHandshake,
    title: "Built for living together",
    text: "Roommates are matched on the things that actually decide whether sharing works.",
  },
];

const STEPS = [
  "Owners list their property and each room, with real rent and dates.",
  "Tenants search, shortlist and match with compatible roommates.",
  "Viewings are requested and confirmed inside the platform.",
  "Applications are reviewed, and an approved tenant pays rent online.",
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About us"
        title="Renting should be clear, fair and calm"
        description="We're building the place we wished existed when we were looking for a room: honest listings, sensible roommate matches and no guesswork about what happens next."
        breadcrumbs={[{ label: "About us" }]}
      />

      <section className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
        <Reveal>
          <p className="text-sm font-semibold tracking-wide text-primary uppercase">
            Why we started
          </p>
          <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight text-balance sm:text-4xl">
            Looking for a room in a big city is exhausting
          </h2>
          <div className="mt-6 space-y-4 leading-relaxed text-muted-foreground">
            <p>
              Listings without prices, rooms that were taken weeks ago, and
              flatmates you only really meet after moving in. Owners have their
              own version: endless calls, no-shows and rent reminders by hand.
            </p>
            <p>
              BariBasa puts the whole journey in one place, from the first
              search to the monthly rent, so both sides always know where they
              stand.
            </p>
          </div>
        </Reveal>
        <Parallax offset={30}>
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-2xl">
            <Image
              src={roommates}
              alt="Four flatmates talking around a table"
              fill
              placeholder="blur"
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </Parallax>
      </section>

      <section className="border-y bg-muted/40 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="max-w-2xl">
            <p className="text-sm font-semibold tracking-wide text-primary uppercase">
              What we believe
            </p>
            <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              Four principles behind every feature
            </h2>
          </Reveal>
          <Stagger className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PRINCIPLES.map(({ icon: Icon, title, text }) => (
              <StaggerItem key={title} className="h-full">
                <div className="h-full rounded-2xl border bg-card p-6">
                  <span className="flex size-11 items-center justify-center rounded-xl bg-accent text-primary">
                    <Icon className="size-5" />
                  </span>
                  <h3 className="mt-4 font-heading text-lg font-semibold">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {text}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
        <Parallax offset={30} className="order-last lg:order-first">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-2xl">
            <Image
              src={livingRoom}
              alt="A bright, furnished living room"
              fill
              placeholder="blur"
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </Parallax>
        <Reveal>
          <p className="text-sm font-semibold tracking-wide text-primary uppercase">
            How it works
          </p>
          <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            From listing to lease
          </h2>
          <ol className="mt-8 space-y-5">
            {STEPS.map((step, index) => (
              <li key={step} className="flex gap-4">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary font-heading font-bold text-primary-foreground">
                  {index + 1}
                </span>
                <p className="pt-1.5 text-muted-foreground">{step}</p>
              </li>
            ))}
          </ol>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/properties" className={buttonVariants()}>
              Browse listings
              <ArrowRight />
            </Link>
            <Link
              href="/services"
              className={buttonVariants({ variant: "outline" })}
            >
              See all features
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
