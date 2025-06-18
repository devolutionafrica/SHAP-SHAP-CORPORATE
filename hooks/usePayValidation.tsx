import { PayData } from "@/app/Types/type";
import { api } from "@/lib/api/base";
import { useMutation } from "@tanstack/react-query";

export const usePayValidation = () => {
  return useMutation({
    mutationFn: async ({ data }: { data: PayData }) => {
      const response = await api.post("/pay/prime", { data });
      return response.data;
    },
  });
};
