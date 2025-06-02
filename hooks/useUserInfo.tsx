"use client";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/base";

export const useUserInfo = () => {
  const username = localStorage.getItem("username");
  return useQuery({
    queryKey: ["user", username],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const response = await api.get(`/assures/profil`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { login: username },
      });
      return response.data;
    },
    // staleTime: 1000 * 60 * 5,
    // retry: false,
    enabled: false,
  });
};
