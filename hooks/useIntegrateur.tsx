"use client";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/base";
import { useAuthContext } from "./contexts/authContext";

export const useIntegrateur = () => {
  const { getUsername } = useAuthContext();

  return useQuery({
    queryKey: ["integrateurs"],
    queryFn: async () => {
      const response = await api.get(`/pay/integrateurs`, {
        params: {},
      });
      return response.data;
    },

    enabled: false,
  });
};
