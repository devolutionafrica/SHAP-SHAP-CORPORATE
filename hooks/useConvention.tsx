"use client";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/base";
import { useAuthContext } from "./contexts/authContext";

export const useConvention = () => {
  const { getUsername } = useAuthContext();

  const username = getUsername();
  return useQuery({
    queryKey: ["conventions", username],
    queryFn: async () => {
      // const token = localStorage.getItem("token");
      const response = await api.get(`/corporate/${username}/convention`, {
        // headers: {
        //   Authorization: `Bearer ${token}`,
        // },
        params: { username },
      });
      return response.data;
    },

    retry: true,
    enabled: true,
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
    retry: true,
    enabled: true,
  });
};
