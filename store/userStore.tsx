"use client";
import { User } from "@/app/Types/type";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface UserStoreState {
  user: User | null;
  typeUtilisateur: number | undefined;
  percentProfile: number | null;
  labelType?: string | undefined;
  username: string | undefined;
  headerLabel: string | undefined;
  // Actions
  setUser: (user: User | null) => void;
  setTypeUtilisateur: (type: number | undefined) => void;
  setPercentProfile: (percent: number | null) => void;
  setLabelType?: (label: string | undefined) => void;
  setUsername?: (label: string | undefined) => void;
  getTypeUser: () => number | undefined;
  getLabelType: () => string;
  getUsername?: () => string | undefined;
  setHeaderLabel?: (label: string | undefined) => void;
  countSessionExpire: number;
  setCountSessionExpire: () => void;
}

// Créez votre store Zustand
export const useUserStore = create<UserStoreState>()(
  persist(
    (set, get) => ({
      user: null,
      typeUtilisateur: undefined,
      percentProfile: null,
      username: undefined,
      headerLabel: "Chargement ...",
      countSessionExpire: 0,
      setUser: (user) => set({ user }),
      setTypeUtilisateur: (type) => {
        set({ typeUtilisateur: type });
        // Optionnel : Mettre à jour localStorage ici si vous voulez que ce soit la source de vérité
        if (type !== undefined) {
          localStorage.setItem("type_user", String(type));
        } else {
          localStorage.removeItem("type_user");
        }
      },
      setHeaderLabel: (label) => set({ headerLabel: label }),
      setLabelType: (label) => set({}),
      setPercentProfile: (percent) => set({ percentProfile: percent }),
      setUsername: (username) => set({ username }),
      setCountSessionExpire: () => {
        let current = get().countSessionExpire;
        set({ countSessionExpire: ++current });
      },
      getTypeUser: () => {
        const currentType = get().typeUtilisateur;
        if (currentType === undefined) {
          // const storedType = localStorage.getItem("type_user");
          // if (storedType) {
          //   const parsedType = Number(storedType);
          //   return parsedType;
          // }
        }
        return currentType;
      },
      getLabelType: () => {
        const type = get().getTypeUser();
        if (type === 1) {
          return "Mes Contrats";
        } else if (type === 2) {
          return "Mes Conventions";
        } else {
          return "Chargement ...";
        }
      },
      getUsername: () => {
        return get().username;
      },
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => localStorage),
      // Quelles parties de l'état doivent être persistées
      partialize: (state) => ({
        user: state.user,
        percentProfile: state.percentProfile,
        typeUtilisateur: state.typeUtilisateur,
        typeLabel: state.labelType,
        username: state.username,
        headerLabel: state.headerLabel,
      }),
    }
  )
);

useUserStore.getState();
// .setTypeUtilisateur(
//   localStorage.getItem("type_user")
//     ? Number(localStorage.getItem("type_user"))
//     : undefined
// );
