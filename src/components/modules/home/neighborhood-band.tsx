import { MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import livingRoom from "@/assets/images/living-room.jpg";
import Marquee from "@/components/shared/motion/marquee";
import Parallax from "@/components/shared/motion/parallax";
import Reveal from "@/components/shared/motion/reveal";

const AREAS = [
  "Mirpur",
  "Dhanmondi",
  "Uttara",
  "Gulshan",
  "Banani",
  "Bashundhara",
  "Mohammadpur",
  "Badda",
  "Mohakhali",
  "Farmgate",
  "Rampura",
  "Khilgaon",
];

export default function NeighborhoodBand() {
  return (
    <section className="relative isolate flex min-h-[32rem] flex-col justify-between overflow-hidden py-16 text-white sm:min-h-[38rem]">
      <Parallax
        offset={90}
        className="absolute inset-x-0 -top-28 -bottom-28 -z-10"
      >
        <Image
          src={livingRoom}
          alt="A sunlit, furnished living room"
          fill
          placeholder="blur"
          sizes="100vw"
          className="object-cover"
        />
      </Parallax>
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/70 via-black/45 to-black/75" />

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <p className="text-sm font-semibold tracking-wide text-highlight uppercase">
            Search by neighborhood
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="mt-4 max-w-3xl font-heading text-4xl leading-[1.05] font-bold tracking-tight text-balance sm:text-6xl">
            Your next home might be one street away.
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mt-5 max-w-xl text-lg text-white/80">
            Pick an area to see every published flat and room there, with rent
            and move-in dates up front.
          </p>
        </Reveal>
      </div>

      <Marquee duration={40} className="mt-14">
        {AREAS.map((area) => (
          <Link
            key={area}
            href={`/properties?area=${encodeURIComponent(area)}`}
            className="mx-2 flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-5 py-3 text-base font-medium whitespace-nowrap backdrop-blur-md transition-colors hover:bg-white hover:text-foreground"
          >
            <MapPin className="size-4" />
            {area}
          </Link>
        ))}
      </Marquee>
    </section>
  );
}
