"use client";
import { triggerSessionExpiredModal } from "@/components/providers/SessionModalProviders";
import axios from "axios";
import { useUserStore } from "@/store/userStore";
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
    const count = useUserStore((state) => state.countSessionExpire);
    if (error.response?.status == 401 || error.response?.status == 403) {
      localStorage.removeItem("token");
      console.log(
        "Token supprimé du localStorage car l'utilisateur n'est pas autorisé ou la session a expiré."
      );

      triggerSessionExpiredModal();

      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);
