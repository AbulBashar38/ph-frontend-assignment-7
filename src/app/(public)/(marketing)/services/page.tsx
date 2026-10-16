import {
  ArrowRight,
  BarChart3,
  BellRing,
  Building2,
  CalendarCheck,
  ClipboardCheck,
  CreditCard,
  FileText,
  Flag,
  Handshake,
  ImagePlus,
  KeyRound,
  type LucideIcon,
  Search,
  ShieldCheck,
  Users,
  Wallet,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/shared/motion/reveal";
import { Stagger, StaggerItem } from "@/components/shared/motion/stagger";
import PageHeader from "@/components/shared/page-header";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Services",
  description:
    "What BariBasa does for tenants, property owners and administrators: search, roommate matching, viewings, applications, online rent and moderation.",
  openGraph: {
    title: "Services | BariBasa",
    description:
      "Search and roommate matching for tenants, listing and tenant management for owners, and moderation tools for admins.",
    url: "/services",
  },
};

interface Feature {
  icon: LucideIcon;
  title: string;
  text: string;
}

const AUDIENCES: {
  id: string;
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  intro: string;
  cta?: { label: string; href: string };
  features: Feature[];
}[] = [
  {
    id: "tenants",
    icon: KeyRound,
    eyebrow: "For tenants",
    title: "Find a place, and people to share it with",
    intro: "Everything from the first search to paying rent each month.",
    cta: { label: "Start searching", href: "/properties" },
    features: [
      {
        icon: Search,
        title: "Search that respects your budget",
        text: "Filter by area, rent range, room type, number of people, amenities and move-in date.",
      },
      {
        icon: Users,
        title: "Roommate matching",
        text: "A score out of 100 based on budget, area, move-in date and lifestyle, with contact details shared only after you both agree.",
      },
      {
        icon: CalendarCheck,
        title: "Viewings on your schedule",
        text: "Request a time; the owner approves it or suggests another, and you can cancel anytime before.",
      },
      {
        icon: FileText,
        title: "Quick applications",
        text: "Apply with your move-in date and household size, and follow the status from your dashboard.",
      },
      {
        icon: CreditCard,
        title: "Rent paid online",
        text: "Secure card payments through Stripe, PDF receipts, and reminders before each due date.",
      },
      {
        icon: BellRing,
        title: "Notifications",
        text: "Know the moment a viewing is confirmed, an application is decided or rent is due.",
      },
    ],
  },
  {
    id: "owners",
    icon: Building2,
    eyebrow: "For property owners",
    title: "Fill rooms without chasing paperwork",
    intro: "List once, then manage viewings, tenants and rent in one place.",
    cta: { label: "List your property", href: "/register" },
    features: [
      {
        icon: ImagePlus,
        title: "Room-by-room listings",
        text: "Add photos and amenities, and give every room its own rent, capacity and availability date.",
      },
      {
        icon: CalendarCheck,
        title: "Viewing requests",
        text: "Approve, reschedule or decline requests, and mark viewings as done.",
      },
      {
        icon: ClipboardCheck,
        title: "Applicant review",
        text: "See who wants to move in and when. Approving one reserves the room and closes the others.",
      },
      {
        icon: Wallet,
        title: "Rent tracking",
        text: "Monthly rent bills are created automatically, so you can see what's paid and what's still due.",
      },
    ],
  },
  {
    id: "admins",
    icon: ShieldCheck,
    eyebrow: "For administrators",
    title: "Keep the marketplace trustworthy",
    intro: "Oversight tools for the team that runs the platform.",
    features: [
      {
        icon: Flag,
        title: "Listing moderation",
        text: "Suspend problematic listings and restore them once they're fixed.",
      },
      {
        icon: Users,
        title: "User management",
        text: "Search accounts and block or reactivate users when needed.",
      },
      {
        icon: BarChart3,
        title: "Platform analytics",
        text: "Users, listings, applications, rentals and monthly revenue at a glance.",
      },
      {
        icon: Handshake,
        title: "Audit trail",
        text: "Every important change is recorded with who made it and when.",
      },
    ],
  },
];

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Services"
        title="One platform for the whole rental journey"
        description="Different tools for tenants, owners and the team that keeps everything running."
        breadcrumbs={[{ label: "Services" }]}
      >
        <nav aria-label="Jump to" className="mt-8 flex flex-wrap gap-2">
          {AUDIENCES.map(({ id, eyebrow, icon: Icon }) => (
            <a
              key={id}
              href={`#${id}`}
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              <Icon />
              {eyebrow}
            </a>
          ))}
        </nav>
      </PageHeader>

      <div className="mx-auto max-w-7xl space-y-20 px-4 py-16 sm:px-6 lg:px-8">
        {AUDIENCES.map(
          ({ id, icon: Icon, eyebrow, title, intro, cta, features }) => (
            <section
              key={id}
              id={id}
              aria-labelledby={`${id}-title`}
              className="scroll-mt-28"
            >
              <Reveal className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div className="max-w-2xl">
                  <p className="flex items-center gap-2 text-sm font-semibold tracking-wide text-primary uppercase">
                    <Icon className="size-4" />
                    {eyebrow}
                  </p>
                  <h2
                    id={`${id}-title`}
                    className="mt-3 font-heading text-3xl font-bold tracking-tight text-balance"
                  >
                    {title}
                  </h2>
                  <p className="mt-3 text-muted-foreground">{intro}</p>
                </div>
                {cta && (
                  <Link
                    href={cta.href}
                    className={buttonVariants({
                      variant: "outline",
                      className: "self-start md:self-auto",
                    })}
                  >
                    {cta.label}
                    <ArrowRight />
                  </Link>
                )}
              </Reveal>

              <Stagger className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {features.map(
                  ({ icon: FeatureIcon, title: featureTitle, text }) => (
                    <StaggerItem key={featureTitle} className="h-full">
                      <div className="h-full rounded-2xl border bg-card p-6 transition-shadow hover:shadow-lg hover:shadow-primary/5">
                        <span className="flex size-11 items-center justify-center rounded-xl bg-accent text-primary">
                          <FeatureIcon className="size-5" />
                        </span>
                        <h3 className="mt-4 font-heading text-lg font-semibold">
                          {featureTitle}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                          {text}
                        </p>
                      </div>
                    </StaggerItem>
                  ),
                )}
              </Stagger>
            </section>
          ),
        )}
      </div>
    </>
  );
}
