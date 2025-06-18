"use client";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/base";
import { useAuthContext } from "./contexts/authContext";

export const useCotisationTotal = (
  dateDeb: string,
  dateFin: string,
  numeroPolice: string
) => {
  const { getUsername } = useAuthContext();

  const username = getUsername();
  return useQuery({
    queryKey: ["cotisation", numeroPolice],
    queryFn: async () => {
      // const token = localStorage.getItem("token");
      const response = await api.get(`/cotisation/total`, {
        // headers: {
        //   Authorization: `Bearer ${token}`,
        // },
        params: { dateDeb, dateFin, numeroPolice },
      });
      return response.data;
    },
    // staleTime: 1000 * 60 * 5,
    // retry: false,
    enabled: false,
  });
};
