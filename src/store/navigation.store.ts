import { create } from "zustand";

interface NavigationState {
  // A filter/sort/page change is waiting for the server to send the new results
  isUpdating: boolean;
  setUpdating: (isUpdating: boolean) => void;
}

// Shared between the controls that change the URL and the results that show it (they live in different trees)
export const useNavigationStore = create<NavigationState>()((set) => ({
  isUpdating: false,
  setUpdating: (isUpdating) => set({ isUpdating }),
}));
