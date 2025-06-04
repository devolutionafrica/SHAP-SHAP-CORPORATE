"use client";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/base";

export const useConvention = () => {
  const username = localStorage.getItem("username");
  return useQuery({
    queryKey: ["contrat", username],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const response = await api.get(`/corporate/${username}/convention`, {
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

export const useContratDetails = (id: string) => {
  const username = localStorage.getItem("username");
  return useQuery({
    queryKey: ["contratDetails", id],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const response = await api.get(`/contrat/${id}`, {
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
