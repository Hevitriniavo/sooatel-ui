import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      isAuthenticated: false,
        token: null,
        type: null,
        setToken: async (token) => set({ token }),
        setIsAuthenticated: (value) => set({ isAuthenticated: value }),
        logout: () => set({ isAuthenticated: false, token: null, type: null }),
    }),
    {
      name: 'auth',  
      getStorage: () => localStorage,
    }
  )
);
