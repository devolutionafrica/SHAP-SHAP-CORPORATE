"use client";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/base";
import { useAuthContext } from "./contexts/authContext";

const getLocalStorageItem = (key: string): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(key);
  }
  return null;
};

export const useUserInfo = () => {
  const { getUsername } = useAuthContext();

  const username = getUsername();
  return useQuery({
    queryKey: ["user", username],
    queryFn: async () => {
      // const token = localStorage.getItem("token");
      const response = await api.get(`/assures/profil`, {
        // headers: {
        //   Authorization: `Bearer ${token}`,
        // },
        params: { login: username },
      });
      return response.data;
    },
    // staleTime: 1000 * 60 * 5,
    retry: false,
    enabled: true,
  });
};

export const useUserInfoById = (id: string) => {
  return useQuery({
    queryKey: ["userDetails", id],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const response = await api.get(`/assures/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { userId: id },
      });
      return response.data;
    },
    // staleTime: 1000 * 60 * 5,
    // retry: false,
    enabled: false,
  });
};
