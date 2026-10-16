import type { Metadata } from "next";
import { Suspense } from "react";
import ManageProperty from "@/components/modules/owner-property/manage-property";
import ManagePropertySkeleton from "@/components/modules/owner-property/manage-property-skeleton";

export const metadata: Metadata = {
  title: "Manage property",
  robots: { index: false },
};

// The id is only known per request, and the tabs read ?tab, so the page streams in behind a skeleton
export default function Page({ params }: PageProps<"/owner/properties/[id]">) {
  return (
    <Suspense fallback={<ManagePropertySkeleton />}>
      {params.then(({ id }) => (
        <ManageProperty id={id} />
      ))}
    </Suspense>
  );
}
