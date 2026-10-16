import type { Metadata } from "next";
import { Suspense } from "react";
import { getRoomDetail } from "@/api/public.server";
import PropertyDetailSkeleton from "@/components/modules/property-detail/property-detail-skeleton";
import RoomDetail from "@/components/modules/room-detail/room-detail";
import { formatCurrency, formatEnum } from "@/utils";

export async function generateMetadata({
  params,
}: PageProps<"/rooms/[id]">): Promise<Metadata> {
  const { id } = await params;
  const room = await getRoomDetail(id);

  if (!room) {
    return { title: "Room not found", robots: { index: false } };
  }

  const title = `${room.name} · ${room.property.title}`;
  const description = `${formatEnum(room.roomType)} room for ${formatCurrency(room.monthlyRent)}/month in ${room.property.area}, ${room.property.city}. Fits up to ${room.maxOccupants}.`;
  const image = room.images[0] ?? room.property.images[0];

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `/rooms/${room.id}`,
      images: image ? [{ url: image.url, alt: title }] : undefined,
    },
  };
}

// The id is only known per request, so the room streams in behind a skeleton
export default function RoomPage({ params }: PageProps<"/rooms/[id]">) {
  return (
    <Suspense fallback={<PropertyDetailSkeleton />}>
      {params.then(({ id }) => (
        <RoomDetail id={id} />
      ))}
    </Suspense>
  );
}
