import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Amenity } from "@/types";
import type {
  PropertyDetailsValues,
  PropertyLocationValues,
  RoomFormValues,
} from "@/validation";

export const WIZARD_STEPS = [
  { key: "details", title: "Details" },
  { key: "location", title: "Location" },
  { key: "amenities", title: "Amenities" },
  { key: "photos", title: "Photos" },
  { key: "rooms", title: "Rooms & rent" },
  { key: "review", title: "Review" },
] as const;

export interface RoomDraft extends RoomFormValues {
  id: string;
}

interface Draft {
  step: number;
  details: PropertyDetailsValues;
  location: PropertyLocationValues;
  amenities: Amenity[];
  rooms: RoomDraft[];
  publishNow: boolean;
}

interface PropertyWizardState extends Draft {
  // Files can't be saved to sessionStorage, so photos last only while the tab is open
  photos: File[];
  // Each room draft's photos, by its id (also kept only in memory)
  roomPhotos: Record<string, File[]>;
  goTo: (step: number) => void;
  saveDetails: (details: PropertyDetailsValues) => void;
  saveLocation: (location: PropertyLocationValues) => void;
  saveAmenities: (amenities: Amenity[]) => void;
  setPhotos: (photos: File[]) => void;
  addRoom: (room: RoomFormValues, photos: File[]) => void;
  updateRoom: (id: string, room: RoomFormValues, photos: File[]) => void;
  removeRoom: (id: string) => void;
  setPublishNow: (publishNow: boolean) => void;
  reset: () => void;
}

const EMPTY_DRAFT: Draft = {
  step: 0,
  details: { title: "", description: "", propertyType: "" },
  location: { address: "", city: "Dhaka", area: "" },
  amenities: [],
  rooms: [],
  publishNow: true,
};

const lastStep = WIZARD_STEPS.length - 1;

// The "Add property" draft: survives a refresh (sessionStorage) so a half-finished listing isn't lost
export const usePropertyWizardStore = create<PropertyWizardState>()(
  persist(
    (set) => ({
      ...EMPTY_DRAFT,
      photos: [],
      roomPhotos: {},
      goTo: (step) => set({ step: Math.min(Math.max(step, 0), lastStep) }),
      // Each step saves its values and moves on
      saveDetails: (details) =>
        set((state) => ({ details, step: state.step + 1 })),
      saveLocation: (location) =>
        set((state) => ({ location, step: state.step + 1 })),
      saveAmenities: (amenities) =>
        set((state) => ({ amenities, step: state.step + 1 })),
      setPhotos: (photos) => set({ photos }),
      addRoom: (room, photos) =>
        set((state) => {
          const id = crypto.randomUUID();
          return {
            rooms: [...state.rooms, { ...room, id }],
            roomPhotos: { ...state.roomPhotos, [id]: photos },
          };
        }),
      updateRoom: (id, room, photos) =>
        set((state) => ({
          rooms: state.rooms.map((draft) =>
            draft.id === id ? { ...room, id } : draft,
          ),
          roomPhotos: { ...state.roomPhotos, [id]: photos },
        })),
      removeRoom: (id) =>
        set((state) => {
          const { [id]: _removed, ...roomPhotos } = state.roomPhotos;
          return {
            rooms: state.rooms.filter((draft) => draft.id !== id),
            roomPhotos,
          };
        }),
      setPublishNow: (publishNow) => set({ publishNow }),
      reset: () => set({ ...EMPTY_DRAFT, photos: [], roomPhotos: {} }),
    }),
    {
      name: "property-wizard-draft",
      storage: createJSONStorage(() => sessionStorage),
      partialize: ({ step, details, location, amenities, rooms, publishNow }) =>
        ({
          step,
          details,
          location,
          amenities,
          rooms,
          publishNow,
        }) satisfies Draft,
    },
  ),
);
