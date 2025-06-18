"use client";
import { triggerSessionExpiredModal } from "@/components/providers/SessionModalProviders";
import axios from "axios";

export const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Vérifiez le statut de l'erreur
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.error(
        "Session expirée ou non autorisée. Affichage de la modale."
      );

      // Nettoyez le token localement
      localStorage.removeItem("token");
      // Si vous stockez d'autres infos utilisateur, effacez-les aussi
      // localStorage.removeItem("user");

      // Déclenchez l'affichage de la modale d'expiration de session
      // La fonction triggerSessionExpiredModal gérera si le provider est monté ou non
      triggerSessionExpiredModal();

      // Optionnel: Alerte pour le débogage, à retirer en production
      // alert(`Erreur: ${error.response.status} - Votre session a expiré ou n'est pas valide.`);

      // Rejetez la promesse pour arrêter le flux normal de la requête
      // Cela empêchera les composants qui ont initié la requête de traiter cette erreur comme une erreur normale.
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);
