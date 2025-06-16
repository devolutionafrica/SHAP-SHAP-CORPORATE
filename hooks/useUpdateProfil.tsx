"use client";
import { User } from "@/app/Types/type";
import { api } from "@/lib/api/base";
import { useMutation } from "@tanstack/react-query";
import { useAuthContext } from "./contexts/authContext";

export const useUpdateProfile = () => {
  const { getUsername } = useAuthContext();
  const token = getUsername("token");
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await api.patch("/assures/profil", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
  });
};
