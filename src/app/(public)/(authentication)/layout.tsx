import { Building2, CalendarCheck, CreditCard, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import livingRoom from "@/assets/images/living-room.jpg";
import Reveal from "@/components/shared/motion/reveal";
import { Stagger, StaggerItem } from "@/components/shared/motion/stagger";
import ZoomIn from "@/components/shared/motion/zoom-in";

const PROMISES = [
  { icon: Users, text: "Roommate matches scored on budget, area and habits" },
  {
    icon: CalendarCheck,
    text: "Viewings and applications tracked in one place",
  },
  { icon: CreditCard, text: "Rent paid securely through Stripe" },
];

// Split screen shared by login, sign-up and verification: the form on the left, brand photo on the right
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-svh lg:grid-cols-[1fr_minmax(0,0.9fr)]">
      <div className="flex flex-col gap-8 px-4 py-6 sm:px-10 md:py-10">
        <Link href="/" className="group flex w-fit items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-transform group-hover:-rotate-6">
            <Building2 className="size-5" />
          </span>
          <span className="font-heading text-xl font-bold tracking-tight">
            Bari<span className="text-primary">Basa</span>
          </span>
        </Link>

        <main className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md">{children}</div>
        </main>
      </div>

      <div className="relative hidden overflow-hidden lg:sticky lg:top-0 lg:block lg:h-svh">
        <ZoomIn className="absolute inset-0">
          <Image
            src={livingRoom}
            alt="A sunlit, furnished living room"
            fill
            priority
            placeholder="blur"
            sizes="45vw"
            className="object-cover"
          />
        </ZoomIn>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />

        <div className="absolute inset-x-10 bottom-10 text-white">
          <Reveal delay={0.4}>
            <p className="max-w-md font-heading text-4xl leading-tight font-bold text-balance">
              A room that fits. People who fit with you.
            </p>
          </Reveal>
          <Stagger className="mt-6 space-y-3" stagger={0.15}>
            {PROMISES.map(({ icon: Icon, text }) => (
              <StaggerItem
                key={text}
                className="flex items-center gap-3 text-white/85"
              >
                <span className="flex size-9 items-center justify-center rounded-lg bg-white/15 backdrop-blur">
                  <Icon className="size-4" />
                </span>
                {text}
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </div>
  );
}
