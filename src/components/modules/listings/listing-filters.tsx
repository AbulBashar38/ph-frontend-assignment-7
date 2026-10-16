"use client";

import { RotateCcw, SlidersHorizontal } from "lucide-react";
import { ALL_AMENITIES, AMENITY_ICONS } from "@/components/shared/amenity-list";
import SearchInput from "@/components/shared/search-input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { NativeSelect } from "@/components/ui/native-select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useUrlState } from "@/hooks";
import { formatEnum } from "@/utils";

export type ListingKind = "properties" | "rooms";

const PROPERTY_TYPES = ["APARTMENT", "HOUSE", "SUBLET", "HOSTEL", "STUDIO"];
const ROOM_TYPES = ["SINGLE", "SHARED", "MASTER", "STUDIO"];
const OCCUPANTS = ["1", "2", "3", "4", "5", "6"];

// Every key these filters own (used for "Clear all" and the active-filter count)
export const FILTER_KEYS = [
  "searchTerm",
  "area",
  "city",
  "propertyType",
  "roomType",
  "minRent",
  "maxRent",
  "occupants",
  "amenities",
  "availableOnly",
] as const;

function FilterControls({ kind }: { kind: ListingKind }) {
  const { get, set } = useUrlState();
  const amenities = get("amenities").split(",").filter(Boolean);

  const toggleAmenity = (amenity: string) => {
    const next = amenities.includes(amenity)
      ? amenities.filter((item) => item !== amenity)
      : [...amenities, amenity];
    set({ amenities: next.join(",") });
  };

  return (
    <FieldGroup className="gap-5">
      <Field>
        <FieldLabel htmlFor={`${kind}-search`}>Search</FieldLabel>
        <SearchInput
          id={`${kind}-search`}
          placeholder={
            kind === "properties" ? "Title, street, area…" : "Room or property…"
          }
        />
      </Field>

      <Field>
        <FieldLabel htmlFor={`${kind}-area`}>Area</FieldLabel>
        <SearchInput
          withIcon={false}
          id={`${kind}-area`}
          urlKey="area"
          placeholder="e.g. Mirpur, Dhanmondi"
        />
      </Field>

      <Field>
        <FieldLabel htmlFor={`${kind}-property-type`}>Property type</FieldLabel>
        <NativeSelect
          id={`${kind}-property-type`}
          value={get("propertyType")}
          onChange={(event) => set({ propertyType: event.target.value })}
        >
          <option value="">Any type</option>
          {PROPERTY_TYPES.map((type) => (
            <option key={type} value={type}>
              {formatEnum(type)}
            </option>
          ))}
        </NativeSelect>
      </Field>

      <Field>
        <FieldLabel htmlFor={`${kind}-room-type`}>Room type</FieldLabel>
        <NativeSelect
          id={`${kind}-room-type`}
          value={get("roomType")}
          onChange={(event) => set({ roomType: event.target.value })}
        >
          <option value="">Any room</option>
          {ROOM_TYPES.map((type) => (
            <option key={type} value={type}>
              {formatEnum(type)}
            </option>
          ))}
        </NativeSelect>
      </Field>

      <Field>
        <FieldLabel>Monthly rent (৳)</FieldLabel>
        <div className="grid grid-cols-2 gap-2">
          <SearchInput
            withIcon={false}
            urlKey="minRent"
            type="number"
            inputMode="numeric"
            min={0}
            placeholder="Min"
            aria-label="Minimum monthly rent"
          />
          <SearchInput
            withIcon={false}
            urlKey="maxRent"
            type="number"
            inputMode="numeric"
            min={0}
            placeholder="Max"
            aria-label="Maximum monthly rent"
          />
        </div>
      </Field>

      <Field>
        <FieldLabel htmlFor={`${kind}-occupants`}>People</FieldLabel>
        <NativeSelect
          id={`${kind}-occupants`}
          value={get("occupants")}
          onChange={(event) => set({ occupants: event.target.value })}
        >
          <option value="">Any</option>
          {OCCUPANTS.map((count) => (
            <option key={count} value={count}>
              {count === "1" ? "Just me" : `${count} people`}
            </option>
          ))}
        </NativeSelect>
      </Field>

      <Field>
        <FieldLabel>Amenities</FieldLabel>
        <div className="flex flex-wrap gap-2">
          {ALL_AMENITIES.map((amenity) => {
            const Icon = AMENITY_ICONS[amenity];
            return (
              <Badge
                key={amenity}
                variant="chip"
                render={
                  <button
                    type="button"
                    aria-pressed={amenities.includes(amenity)}
                    onClick={() => toggleAmenity(amenity)}
                  />
                }
              >
                <Icon />
                {formatEnum(amenity)}
              </Badge>
            );
          })}
        </div>
      </Field>

      {kind === "properties" && (
        <Field orientation="horizontal">
          <Checkbox
            id="available-only"
            checked={get("availableOnly") === "true"}
            onCheckedChange={(checked) =>
              set({ availableOnly: checked ? "true" : null })
            }
          />
          <FieldLabel htmlFor="available-only" className="font-normal">
            Only show places with a free room
          </FieldLabel>
        </Field>
      )}
    </FieldGroup>
  );
}

// Filters for /properties and /rooms: a sidebar on large screens, a sheet behind a button on phones
export default function ListingFilters({ kind }: { kind: ListingKind }) {
  const { get, clear } = useUrlState();
  const activeCount = FILTER_KEYS.filter((key) => get(key)).length;

  const clearButton = activeCount > 0 && (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => clear([...FILTER_KEYS])}
      className="text-muted-foreground"
    >
      <RotateCcw />
      Clear all
    </Button>
  );

  return (
    <>
      <aside className="hidden lg:block">
        <div className="sticky top-24 rounded-2xl border bg-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-heading text-lg font-semibold">Filters</h2>
            {clearButton}
          </div>
          <FilterControls kind={kind} />
        </div>
      </aside>

      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger
            render={<Button variant="outline" size="sm" className="w-full" />}
          >
            <SlidersHorizontal />
            Filters
            {activeCount > 0 && (
              <Badge size="sm" className="ml-1">
                {activeCount}
              </Badge>
            )}
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-full overflow-y-auto sm:max-w-sm"
          >
            <SheetHeader className="flex-row items-center justify-between">
              <SheetTitle>Filters</SheetTitle>
              {clearButton}
            </SheetHeader>
            <div className="px-4 pb-6">
              <FilterControls kind={kind} />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
