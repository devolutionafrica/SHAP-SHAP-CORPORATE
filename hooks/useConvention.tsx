"use client";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/base";
import { useAuthContext } from "./contexts/authContext";

export const useConvention = () => {
  const { getUsername } = useAuthContext();

  const username = getUsername();
  return useQuery({
    queryKey: ["conventions", Date.now()],
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
    staleTime: Infinity,
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
