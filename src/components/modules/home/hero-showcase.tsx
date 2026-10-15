import { BedDouble, CalendarDays, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import heroFallback from "@/assets/images/hero-fallback.jpg";
import livingRoom from "@/assets/images/living-room.jpg";
import Float from "@/components/shared/motion/float";
import Parallax from "@/components/shared/motion/parallax";
import Reveal from "@/components/shared/motion/reveal";
import { Badge } from "@/components/ui/badge";
import type { Property } from "@/types";
import { formatCurrency, formatDate, formatEnum } from "@/utils";

// Collage of the newest real listing; falls back to brand photography when nothing has photos yet
export default function HeroShowcase({
  properties,
}: {
  properties: Property[];
}) {
  const main = properties.find((property) => property.images?.length);
  const secondImage =
    properties.filter((property) => property.images?.length)[1]?.images[0]
      ?.url ??
    main?.images[1]?.url ??
    null;

  return (
    <Reveal
      delay={0.3}
      y={40}
      className="relative mx-auto w-full max-w-md lg:max-w-none"
    >
      <Parallax offset={30}>
        {main ? (
          <Link
            href={`/properties/${main.id}`}
            className="group relative block aspect-[4/5] overflow-hidden rounded-[2rem] shadow-2xl shadow-primary/15 sm:aspect-[5/6]"
          >
            <Image
              src={main.images[0].url}
              alt={main.title}
              fill
              priority
              sizes="(max-width: 1024px) 90vw, 40vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

            <div className="absolute inset-x-4 bottom-4 rounded-2xl bg-background/95 p-4 shadow-lg backdrop-blur transition-transform duration-500 group-hover:-translate-y-1 sm:inset-x-5 sm:bottom-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-medium text-primary">
                    {formatEnum(main.propertyType)} · Just listed
                  </p>
                  <p className="mt-0.5 truncate font-heading text-base font-semibold">
                    {main.title}
                  </p>
                  <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="size-3.5 shrink-0" />
                    <span className="truncate">
                      {main.area}, {main.city}
                    </span>
                  </p>
                </div>
                {main.minAvailableRent != null && (
                  <div className="shrink-0 text-right">
                    <p className="text-[11px] text-muted-foreground">from</p>
                    <p className="font-heading text-lg font-bold">
                      {formatCurrency(main.minAvailableRent)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Link>
        ) : (
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-2xl shadow-primary/15 sm:aspect-[5/6]">
            <Image
              src={heroFallback}
              alt="A bright, furnished living room"
              fill
              priority
              placeholder="blur"
              sizes="(max-width: 1024px) 90vw, 40vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <p className="absolute inset-x-6 bottom-6 font-heading text-2xl font-semibold text-white">
              New homes are listed here every week.
            </p>
          </div>
        )}
      </Parallax>

      <Parallax
        offset={-70}
        className="absolute top-10 -left-12 hidden w-36 xl:block"
      >
        <div className="relative aspect-square -rotate-6 overflow-hidden rounded-3xl border-4 border-background shadow-xl">
          <Image
            src={secondImage ?? livingRoom}
            alt=""
            fill
            sizes="144px"
            className="object-cover"
          />
        </div>
      </Parallax>

      {main && (
        <div className="absolute top-6 -right-4 hidden flex-col gap-2 sm:flex">
          <Float delay={0.9}>
            <Badge variant="glass" className="shadow-lg">
              <BedDouble className="text-primary" />
              {main.availableRoomCount} room
              {main.availableRoomCount === 1 ? "" : "s"} free
            </Badge>
          </Float>
          {main.earliestAvailableFrom && (
            <Float delay={1.2}>
              <Badge variant="highlight" className="shadow-lg">
                <CalendarDays />
                Move in {formatDate(main.earliestAvailableFrom, "dd MMM")}
              </Badge>
            </Float>
          )}
        </div>
      )}
    </Reveal>
  );
}
