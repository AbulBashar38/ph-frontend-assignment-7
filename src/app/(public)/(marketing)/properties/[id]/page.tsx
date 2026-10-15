import type { Metadata } from "next";
import { Suspense } from "react";
import { getPropertyDetail } from "@/api/public.server";
import PropertyDetail from "@/components/modules/property-detail/property-detail";
import PropertyDetailSkeleton from "@/components/modules/property-detail/property-detail-skeleton";
import { formatCurrency } from "@/utils";

export async function generateMetadata({
  params,
}: PageProps<"/properties/[id]">): Promise<Metadata> {
  const { id } = await params;
  const property = await getPropertyDetail(id);

  if (!property) {
    return { title: "Property not found", robots: { index: false } };
  }

  const rent =
    property.minAvailableRent != null
      ? ` from ${formatCurrency(property.minAvailableRent)}/month`
      : "";
  const description =
    `${property.title} in ${property.area}, ${property.city}${rent}. ${property.description}`.slice(
      0,
      160,
    );

  return {
    title: property.title,
    description,
    openGraph: {
      title: property.title,
      description,
      url: `/properties/${property.id}`,
      images: property.images[0]
        ? [{ url: property.images[0].url, alt: property.title }]
        : undefined,
    },
  };
}

// The id is only known per request, so the property streams in behind a skeleton
export default function PropertyPage({
  params,
}: PageProps<"/properties/[id]">) {
  return (
    <Suspense fallback={<PropertyDetailSkeleton />}>
      {params.then(({ id }) => (
        <PropertyDetail id={id} />
      ))}
    </Suspense>
  );
}
