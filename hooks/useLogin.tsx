// lib/hooks/useLogin.ts
import { useMutation } from "@tanstack/react-query";
import { api } from "../lib/api/base";

export const useLogin = () =>
  useMutation({
    mutationFn: async ({
      username,
      password,
    }: {
      username: string;
      password: string;
    }) => {
      const response = await api.post("/auth/login", { username, password });
      return response.data; 
    },
  });
