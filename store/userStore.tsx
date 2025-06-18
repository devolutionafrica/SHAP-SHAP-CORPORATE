"use client";
import { User } from "@/app/Types/type";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware"; // Pour la persistance dans localStorage

interface UserStoreState {
  user: User | null;
  typeUtilisateur: number | undefined;
  percentProfile: number | null;
  labelType?: string | undefined;
  username: string | undefined;
  // Actions
  setUser: (user: User | null) => void;
  setTypeUtilisateur: (type: number | undefined) => void;
  setPercentProfile: (percent: number | null) => void;
  setLabelType?: (label: string | undefined) => void;
  setUsername?: (label: string | undefined) => void;
  getTypeUser: () => number | undefined;
  getLabelType: () => string;
}

// Créez votre store Zustand
export const useUserStore = create<UserStoreState>()(
  persist(
    (set, get) => ({
      // --- État initial ---
      user: null,
      typeUtilisateur: undefined,
      percentProfile: null,
      username: undefined,
      // --- Actions (Setters) ---
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
      setLabelType: (label) => set({}),
      setPercentProfile: (percent) => set({ percentProfile: percent }),
      setUsername: (username) => set({ username }),
      // --- Fonctions dérivées / Getters ---
      // Ces fonctions accèdent à l'état via `get()`
      getTypeUser: () => {
        const currentType = get().typeUtilisateur;
        if (currentType === undefined) {
          const storedType = localStorage.getItem("type_user");
          // Si trouvé dans localStorage, mettez à jour l'état du store pour la prochaine fois
          if (storedType) {
            const parsedType = Number(storedType);
            // set({ typeUtilisateur: parsedType }); // Ne pas faire de set() ici directement, car getTypeUser est un getter
            return parsedType;
          }
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
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => localStorage),
      // Quelles parties de l'état doivent être persistées
      partialize: (state) => ({
        user: state.user,
        // typeUtilisateur: state.typeUtilisateur, // Pas nécessaire si géré par localStorage dans setTypeUtilisateur/getTypeUser
        percentProfile: state.percentProfile,
      }),
      // On hydrate le typeUtilisateur directement depuis localStorage lors de l'initialisation si nécessaire
      // ou on s'assure que getTypeUser le gère dynamiquement
      // La fonction de persistance ne gérera pas `typeUtilisateur` par défaut, car nous le traitons manuellement avec localStorage.
      // Si `typeUtilisateur` doit être aussi persisté via Zustand, ajoutez-le dans `partialize`.
      // Pour cet exemple, on se base sur `localStorage.getItem("type_user")` dans getTypeUser et setTypeUtilisateur.
    }
  )
);

useUserStore
  .getState()
  .setTypeUtilisateur(
    localStorage.getItem("type_user")
      ? Number(localStorage.getItem("type_user"))
      : undefined
  );
