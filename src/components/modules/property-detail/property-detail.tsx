import { CalendarDays, DoorOpen, MapPin, UserRound } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getPropertyDetail } from "@/api/public.server";
import AmenityList from "@/components/shared/amenity-list";
import Reveal from "@/components/shared/motion/reveal";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate, formatEnum } from "@/utils";
import ImageGallery from "./image-gallery";
import ListingActions from "./listing-actions";
import RoomList from "./room-list";

// Server component: the full public view of one property
export default async function PropertyDetail({ id }: { id: string }) {
  const property = await getPropertyDetail(id);
  if (!property) notFound();

  const hasAvailableRoom = property.availableRoomCount > 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <Reveal y={16}>
        <ImageGallery images={property.images} title={property.title} />
      </Reveal>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_22rem]">
        <div className="space-y-10">
          <Reveal y={16} className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge variant="positive">
                {formatEnum(property.propertyType)}
              </Badge>
              <Badge variant={hasAvailableRoom ? "highlight" : "muted"}>
                {hasAvailableRoom
                  ? `${property.availableRoomCount} room${property.availableRoomCount === 1 ? "" : "s"} free`
                  : "Fully occupied"}
              </Badge>
            </div>
            <h1 className="font-heading text-3xl leading-tight font-bold tracking-tight text-balance sm:text-4xl">
              {property.title}
            </h1>
            <p className="flex items-start gap-2 text-muted-foreground">
              <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
              {property.address}, {property.area}, {property.city}
            </p>
          </Reveal>

          <section aria-labelledby="about-title" className="space-y-3">
            <h2 id="about-title" className="font-heading text-xl font-semibold">
              About this place
            </h2>
            <p className="leading-relaxed whitespace-pre-line text-muted-foreground">
              {property.description}
            </p>
          </section>

          <section aria-labelledby="amenities-title" className="space-y-4">
            <h2
              id="amenities-title"
              className="font-heading text-xl font-semibold"
            >
              Amenities
            </h2>
            <AmenityList amenities={property.amenities} />
          </section>

          <section
            id="rooms"
            aria-labelledby="rooms-title"
            className="scroll-mt-28 space-y-4"
          >
            <div className="flex items-end justify-between gap-3">
              <h2
                id="rooms-title"
                className="font-heading text-xl font-semibold"
              >
                Rooms
              </h2>
              <p className="text-sm text-muted-foreground">
                {property.rooms.length}{" "}
                {property.rooms.length === 1 ? "room" : "rooms"}
              </p>
            </div>
            <RoomList rooms={property.rooms} />
          </section>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="space-y-6 rounded-3xl border bg-card p-6 shadow-sm">
            <div>
              <p className="text-sm text-muted-foreground">Rent from</p>
              <p className="font-heading text-3xl font-bold">
                {property.minAvailableRent != null
                  ? formatCurrency(property.minAvailableRent)
                  : "—"}
                {property.minAvailableRent != null && (
                  <span className="text-base font-medium text-muted-foreground">
                    {" "}
                    /month
                  </span>
                )}
              </p>
            </div>

            <dl className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl bg-muted/60 p-3">
                <dt className="flex items-center gap-1.5 text-muted-foreground">
                  <DoorOpen className="size-3.5" /> Free rooms
                </dt>
                <dd className="mt-1 font-semibold">
                  {property.availableRoomCount} of {property.rooms.length}
                </dd>
              </div>
              <div className="rounded-xl bg-muted/60 p-3">
                <dt className="flex items-center gap-1.5 text-muted-foreground">
                  <CalendarDays className="size-3.5" /> Move in
                </dt>
                <dd className="mt-1 font-semibold">
                  {property.earliestAvailableFrom
                    ? formatDate(property.earliestAvailableFrom, "dd MMM yyyy")
                    : "—"}
                </dd>
              </div>
            </dl>

            <ListingActions hasAvailableRoom={hasAvailableRoom} />

            {property.owner && (
              <div className="flex items-center gap-3 border-t pt-5">
                <span className="relative flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-accent text-primary">
                  {property.owner.imageUrl ? (
                    <Image
                      src={property.owner.imageUrl}
                      alt=""
                      fill
                      sizes="44px"
                      className="object-cover"
                    />
                  ) : (
                    <UserRound className="size-5" />
                  )}
                </span>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">Listed by</p>
                  <p className="truncate font-semibold capitalize">
                    {property.owner.name}
                  </p>
                </div>
              </div>
            )}

            {property.publishedAt && (
              <p className="text-xs text-muted-foreground">
                Listed on {formatDate(property.publishedAt, "dd MMM yyyy")}
              </p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
