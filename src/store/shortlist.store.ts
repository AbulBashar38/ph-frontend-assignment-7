import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

// How many properties can be compared side by side
export const SHORTLIST_LIMIT = 6;

interface ShortlistState {
  // Only ids: the compare page always loads fresh listing data
  ids: string[];
  // false when the list is already full
  add: (id: string) => boolean;
  remove: (id: string) => void;
  clear: () => void;
}

// Properties a tenant saved to compare, kept in this browser (localStorage)
export const useShortlistStore = create<ShortlistState>()(
  persist(
    (set, get) => ({
      ids: [],
      add: (id) => {
        const { ids } = get();
        if (ids.includes(id)) return true;
        if (ids.length >= SHORTLIST_LIMIT) return false;
        set({ ids: [...ids, id] });
        return true;
      },
      remove: (id) => set({ ids: get().ids.filter((saved) => saved !== id) }),
      clear: () => set({ ids: [] }),
    }),
    {
      name: "property-shortlist",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
