import { create } from 'zustand';

export const useTitleStore = create((set) => ({
  title: "Accueil",
  setTitle: (title) => set({ title }),
}));
