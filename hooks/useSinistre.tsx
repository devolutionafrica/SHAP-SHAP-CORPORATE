"use client";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/base";
import { useAuthContext } from "./contexts/authContext";

export const useSinistre = (numeroPolice: string) => {
  const { getUsername } = useAuthContext();

  const username = getUsername();
  return useQuery({
    queryKey: ["sinistres", numeroPolice],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const response = await api.get(`/prestation/sinistre`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { numeroPolice },
      });
      return response.data;
    },

    enabled: false,
  });
};
