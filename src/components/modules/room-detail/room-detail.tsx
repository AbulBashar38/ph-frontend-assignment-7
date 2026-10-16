import {
  ArrowUpRight,
  BedDouble,
  Building2,
  CalendarDays,
  MapPin,
  UserRound,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getRoomDetail } from "@/api/public.server";
import ImageGallery from "@/components/modules/property-detail/image-gallery";
import AmenityList from "@/components/shared/amenity-list";
import Reveal from "@/components/shared/motion/reveal";
import StatusBadge from "@/components/shared/status-badge";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate, formatEnum } from "@/utils";
import RoomActions from "./room-actions";

// Server component: the full public view of one room
export default async function RoomDetail({ id }: { id: string }) {
  const room = await getRoomDetail(id);
  if (!room) notFound();

  const { property } = room;
  // The room's own photos first, then the building's
  const images = [...room.images, ...property.images];
  // Building amenities the room doesn't already list
  const buildingAmenities = property.amenities.filter(
    (amenity) => !room.amenities.includes(amenity),
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <Reveal y={16}>
        <ImageGallery
          images={images}
          title={`${room.name}, ${property.title}`}
        />
      </Reveal>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_22rem]">
        <div className="space-y-10">
          <Reveal y={16} className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={room.status} size="default" />
              <Badge variant="positive">{formatEnum(room.roomType)} room</Badge>
            </div>
            <h1 className="font-heading text-3xl leading-tight font-bold tracking-tight text-balance sm:text-4xl">
              {room.name}
            </h1>
            <p className="text-muted-foreground">
              in{" "}
              <Link
                href={`/properties/${property.id}`}
                className="font-semibold text-foreground hover:text-primary hover:underline"
              >
                {property.title}
              </Link>
            </p>
            <p className="flex items-start gap-2 text-muted-foreground">
              <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
              {property.address}, {property.area}, {property.city}
            </p>
          </Reveal>

          <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {[
              {
                icon: Users,
                label: "Fits",
                value: `${room.maxOccupants} ${room.maxOccupants === 1 ? "person" : "people"}`,
              },
              {
                icon: BedDouble,
                label: "Room type",
                value: formatEnum(room.roomType),
              },
              {
                icon: CalendarDays,
                label: "Available from",
                value: room.availableFrom
                  ? formatDate(room.availableFrom, "dd MMM yyyy")
                  : "Now",
              },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="rounded-2xl border bg-card p-4">
                <dt className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Icon className="size-4 text-primary" />
                  {label}
                </dt>
                <dd className="mt-1 font-semibold">{value}</dd>
              </div>
            ))}
          </dl>

          {room.description && (
            <section aria-labelledby="room-about" className="space-y-3">
              <h2
                id="room-about"
                className="font-heading text-xl font-semibold"
              >
                About this room
              </h2>
              <p className="leading-relaxed whitespace-pre-line text-muted-foreground">
                {room.description}
              </p>
            </section>
          )}

          <section aria-labelledby="room-amenities" className="space-y-4">
            <h2
              id="room-amenities"
              className="font-heading text-xl font-semibold"
            >
              In the room
            </h2>
            <AmenityList amenities={room.amenities} />
          </section>

          {buildingAmenities.length > 0 && (
            <section aria-labelledby="building-amenities" className="space-y-4">
              <h2
                id="building-amenities"
                className="font-heading text-xl font-semibold"
              >
                In the building
              </h2>
              <AmenityList amenities={buildingAmenities} />
            </section>
          )}
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="space-y-6 rounded-3xl border bg-card p-6 shadow-sm">
            <div>
              <p className="text-sm text-muted-foreground">Monthly rent</p>
              <p className="font-heading text-3xl font-bold">
                {formatCurrency(room.monthlyRent)}
                <span className="text-base font-medium text-muted-foreground">
                  {" "}
                  /month
                </span>
              </p>
            </div>

            <RoomActions
              roomId={room.id}
              roomName={room.name}
              propertyId={property.id}
              status={room.status}
              maxOccupants={room.maxOccupants}
              monthlyRent={room.monthlyRent}
            />

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
          </div>

          <Link
            href={`/properties/${property.id}`}
            className="group flex items-center gap-3 rounded-2xl border bg-card p-4 transition-colors hover:border-primary/40"
          >
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent text-primary">
              <Building2 className="size-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-xs text-muted-foreground">
                {formatEnum(property.propertyType)} · see all rooms
              </span>
              <span className="block truncate font-semibold">
                {property.title}
              </span>
            </span>
            <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
          </Link>
        </aside>
      </div>
    </div>
  );
}
