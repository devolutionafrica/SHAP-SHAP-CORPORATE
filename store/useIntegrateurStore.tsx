"use client";
import { Integrageur, User } from "@/app/Types/type";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware"; // Pour la persistance dans localStorage

interface IntegrateurStoreState {
  integrateurs: Integrageur[] | null;
  setIntegrateurs: (data: Integrageur[]) => void;
}

/*
 * Store Zustand pour gérer les intégrateurs
 * Ce store est utilisé pour stocker et gérer les intégrateurs dans l'application.
 */

export const useIntegrateurStore = create<IntegrateurStoreState>()(
  persist(
    (set, get) => ({
      integrateurs: [],

      setIntegrateurs: (data: Integrageur[]) => set({ integrateurs: data }),
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => localStorage),
      // Quelles parties de l'état doivent être persistées
      partialize: (state) => ({
        integrateurs: state.integrateurs,
      }),
    }
  )
);

useIntegrateurStore.getState();
