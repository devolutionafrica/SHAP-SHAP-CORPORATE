"use client";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/base";

export const useAgence = () => {
  const username = localStorage.getItem("username");
  return useQuery({
    queryKey: ["agences", username],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const response = await api.get(`/dashboard/agence`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { username },
      });
      return response.data;
    },
    // staleTime: 1000 * 60 * 5,
    // retry: false,
    enabled: false,
  });
};
