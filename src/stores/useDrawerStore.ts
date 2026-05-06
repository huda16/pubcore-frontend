import { create } from "zustand";

type DrawerState = {
  open: boolean;
  toggleDrawer: () => void;
  setOpen: (_open: boolean) => void;
};

export const useDrawerStore = create<DrawerState>()((set) => ({
  open: false,
  toggleDrawer: () => set((state) => ({ open: !state.open })),
  setOpen: (open) => set({ open }),
}));
