import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type ListingView = "grid" | "list";

interface UiState {
  listingView: ListingView;
  setListingView: (view: ListingView) => void;
}

// Client-only UI preferences; server data always stays in TanStack Query
export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      listingView: "grid",
      setListingView: (listingView) => set({ listingView }),
    }),
    {
      name: "ui-preferences",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
