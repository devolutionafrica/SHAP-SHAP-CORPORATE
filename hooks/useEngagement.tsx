"use client";

import { api } from "@/lib/api/base";
import { useQuery } from "@tanstack/react-query";
import { useUserStore } from "@/store/userStore";
export const useTauxEngagement = () => {
  const username = useUserStore((state) => state.user?.LOGIN);
  return useQuery({
    queryKey: ["engagement"],
    queryFn: async () => {
      const response = await api.get(`/assures/user/${username}/engagement`);
      return response.data;
    },
  });
};
