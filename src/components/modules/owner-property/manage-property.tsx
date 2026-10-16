"use client";

import {
  Archive,
  ArrowLeft,
  ExternalLink,
  EyeOff,
  Info,
  MapPin,
  SearchX,
  Send,
  ShieldAlert,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import RemovePropertyDialog from "@/components/modules/owner-properties/remove-property-dialog";
import { usePropertyActions } from "@/components/modules/owner-properties/use-property-actions";
import DashboardPageHeader from "@/components/shared/dashboard-page-header";
import EmptyState from "@/components/shared/empty-state";
import QueryError from "@/components/shared/query-error";
import StatusBadge from "@/components/shared/status-badge";
import UrlTabs from "@/components/shared/url-tabs";
import { Button, buttonVariants } from "@/components/ui/button";
import { useManagedProperty, useUrlState } from "@/hooks";
import type { ManagedProperty } from "@/types";
import { getErrorStatus } from "@/utils";
import DetailsTab from "./details-tab";
import ManagePropertySkeleton from "./manage-property-skeleton";
import PhotosTab from "./photos-tab";
import RoomsTab from "./rooms-tab";

function Notice({
  icon: Icon,
  tone,
  children,
}: {
  icon: typeof Info;
  tone: "info" | "danger";
  children: React.ReactNode;
}) {
  return (
    <div
      className={
        tone === "danger"
          ? "flex gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-sm"
          : "flex gap-3 rounded-2xl border bg-accent/40 p-4 text-sm"
      }
    >
      <Icon
        className={
          tone === "danger"
            ? "mt-0.5 size-4 shrink-0 text-destructive"
            : "mt-0.5 size-4 shrink-0 text-primary"
        }
      />
      <div>{children}</div>
    </div>
  );
}

function Header({ property }: { property: ManagedProperty }) {
  const router = useRouter();
  const actions = usePropertyActions(property);
  const [confirmRemove, setConfirmRemove] = useState(false);

  return (
    <>
      <DashboardPageHeader
        title={property.title}
        description={
          <span className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <StatusBadge status={property.status} size="default" />
            <span className="inline-flex items-center gap-1">
              <MapPin className="size-4" />
              {property.area}, {property.city}
            </span>
          </span>
        }
        actions={
          <>
            {property.status === "PUBLISHED" && (
              <Link
                href={`/properties/${property.id}`}
                className={buttonVariants({ variant: "outline", size: "sm" })}
              >
                <ExternalLink />
                Public page
              </Link>
            )}
            {actions.canHide && (
              <Button
                variant="outline"
                size="sm"
                disabled={actions.statusPending}
                onClick={actions.hide}
              >
                <EyeOff />
                Hide
              </Button>
            )}
            {actions.canPublish && (
              <Button
                size="sm"
                disabled={Boolean(actions.blocker) || actions.statusPending}
                onClick={actions.publish}
              >
                <Send />
                Publish
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Remove listing"
              onClick={() => setConfirmRemove(true)}
              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              <Archive />
            </Button>
          </>
        }
      />
      <RemovePropertyDialog
        open={confirmRemove}
        onOpenChange={setConfirmRemove}
        title={property.title}
        pending={actions.archiving}
        onConfirm={() =>
          actions.archive(() => router.replace("/owner/properties"))
        }
      />

      {property.status === "SUSPENDED" && (
        <Notice icon={ShieldAlert} tone="danger">
          <p className="font-medium">Suspended by an admin</p>
          <p className="text-muted-foreground">
            {property.moderationNote ??
              "It's hidden from search until an admin restores it."}
          </p>
        </Notice>
      )}
      {actions.blocker && (
        <Notice icon={Info} tone="info">
          <p className="font-medium">Almost ready to publish</p>
          <p className="text-muted-foreground">
            {property.images.length === 0 && (
              <>
                Add at least one{" "}
                <Link href="?tab=photos" className="text-primary underline">
                  photo
                </Link>
                {property.rooms.length === 0 ? " and " : "."}
              </>
            )}
            {property.rooms.length === 0 && (
              <>
                {property.images.length === 0 ? "one " : "Add at least one "}
                <Link href="?tab=rooms" className="text-primary underline">
                  room
                </Link>
                .
              </>
            )}
          </p>
        </Notice>
      )}
    </>
  );
}

// The owner's page for one listing: details, photos and rooms in URL tabs (?tab=photos|rooms)
export default function ManageProperty({ id }: { id: string }) {
  const query = useManagedProperty(id);
  const { get } = useUrlState();
  const tab = get("tab");

  if (query.isPending) return <ManagePropertySkeleton />;

  if (query.isError) {
    const status = getErrorStatus(query.error);
    return status === 404 || status === 403 ? (
      <EmptyState
        icon={SearchX}
        title="Listing not found"
        description="It may have been removed, or it belongs to another account."
        action={
          <Link
            href="/owner/properties"
            className={buttonVariants({ variant: "outline" })}
          >
            <ArrowLeft />
            My properties
          </Link>
        }
      />
    ) : (
      <QueryError error={query.error} onRetry={() => query.refetch()} />
    );
  }

  const property = query.data.data;

  return (
    <div className="space-y-6">
      <Link
        href="/owner/properties"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        My properties
      </Link>
      <Header property={property} />

      <UrlTabs
        urlKey="tab"
        label="Property sections"
        options={[
          { value: "", label: "Details" },
          { value: "photos", label: `Photos (${property.images.length})` },
          { value: "rooms", label: `Rooms (${property.rooms.length})` },
        ]}
      />

      {tab === "photos" ? (
        <PhotosTab property={property} />
      ) : tab === "rooms" ? (
        <RoomsTab property={property} />
      ) : (
        // Keyed so the forms reset to the saved values after another tab changed them
        <DetailsTab key={property.updatedAt} property={property} />
      )}
    </div>
  );
}
