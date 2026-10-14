import { ArrowUpRight } from "lucide-react";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import apartmentImage from "@/assets/images/type-apartment.jpg";
import hostelImage from "@/assets/images/type-hostel.jpg";
import houseImage from "@/assets/images/type-house.jpg";
import studioImage from "@/assets/images/type-studio.jpg";
import subletImage from "@/assets/images/type-sublet.jpg";
import Reveal from "@/components/shared/motion/reveal";
import { Stagger, StaggerItem } from "@/components/shared/motion/stagger";
import SectionHeading from "@/components/shared/section-heading";
import { cn } from "@/lib/utils";

interface TypeTile {
  value: string;
  label: string;
  description: string;
  image: StaticImageData;
  featured?: boolean;
}

const TYPES: TypeTile[] = [
  {
    value: "APARTMENT",
    label: "Apartments",
    description: "Whole flats for families, couples and groups of friends",
    image: apartmentImage,
    featured: true,
  },
  {
    value: "SUBLET",
    label: "Sublets",
    description: "A room inside an existing flat",
    image: subletImage,
  },
  {
    value: "HOSTEL",
    label: "Hostels",
    description: "Beds and shared rooms for students",
    image: hostelImage,
  },
  {
    value: "STUDIO",
    label: "Studios",
    description: "Compact, self-contained units",
    image: studioImage,
  },
  {
    value: "HOUSE",
    label: "Houses",
    description: "Independent homes with more space",
    image: houseImage,
  },
];

export default function BrowseByType() {
  return (
    <section className="border-y bg-muted/40 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Browse by type"
            title="Start with the kind of place you need"
            description="From a single hostel bed to a whole house, every listing type has its own filters for rent, rooms and move-in dates."
          />
        </Reveal>

        <Stagger className="mt-12 grid auto-rows-[13rem] grid-cols-2 gap-3 sm:gap-4 lg:auto-rows-[15rem] lg:grid-cols-4">
          {TYPES.map(({ value, label, description, image, featured }) => (
            <StaggerItem
              key={value}
              className={cn(featured && "col-span-2 row-span-2")}
            >
              <Link
                href={`/properties?propertyType=${value}`}
                className="group relative flex size-full overflow-hidden rounded-3xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <Image
                  src={image}
                  alt={`${label} for rent`}
                  fill
                  placeholder="blur"
                  sizes={
                    featured
                      ? "(max-width: 1024px) 100vw, 50vw"
                      : "(max-width: 1024px) 50vw, 25vw"
                  }
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent transition-opacity duration-500 group-hover:opacity-90" />

                <div className="relative mt-auto flex w-full items-end justify-between gap-3 p-4 text-white sm:p-6">
                  <div>
                    <p
                      className={cn(
                        "font-heading font-semibold",
                        featured ? "text-3xl sm:text-4xl" : "text-xl",
                      )}
                    >
                      {label}
                    </p>
                    <p
                      className={cn(
                        "mt-1 text-sm text-white/80",
                        !featured && "hidden sm:block",
                      )}
                    >
                      {description}
                    </p>
                  </div>
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/15 backdrop-blur transition-all duration-300 group-hover:rotate-45 group-hover:bg-highlight group-hover:text-highlight-foreground">
                    <ArrowUpRight className="size-5" />
                  </span>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
