"use client";
import { User } from "@/app/Types/type";
import { api } from "@/lib/api/base";
import { useMutation } from "@tanstack/react-query";

interface UpdatePasswordData {
  password: string;
  newPassword: string;
  confirm: string;
  login: string;
}

export const useUpdatepassword = () => {
  return useMutation({
    mutationFn: async (data: UpdatePasswordData) => {
      console.log("data envoyée: ", data);
      const response = await api.patch("/auth/password/change", data, {});
      return response.data;
    },
  });
};
