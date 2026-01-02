import { create } from "zustand";

type AppErrorState = {
  redirectTo: string | null;
  message: string | null;
  setRedirect: (path: string, message?: string) => void;
  clear: () => void;
};

export const useAppErrorStore = create<AppErrorState>((set) => ({
  redirectTo: null,
  message: null,

  setRedirect: (path, message) => set({ redirectTo: path, message }),

  clear: () => set({ redirectTo: null, message: null }),
}));
