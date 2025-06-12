import { User } from "@/app/Types/type";
import { api } from "@/lib/api/base";
import { useMutation } from "@tanstack/react-query";

export const useUpdateProfile = () => {
  const token = localStorage.getItem("token");
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
