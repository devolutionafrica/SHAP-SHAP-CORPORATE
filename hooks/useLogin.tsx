// lib/hooks/useLogin.ts
"use client";
import { useMutation } from "@tanstack/react-query";
import { api } from "../lib/api/base";
import { useAuthContext } from "./contexts/authContext";

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

export const useResetPassword = () => {
  const { getUsername } = useAuthContext();
  const login = getUsername();
  const token = localStorage.getItem("token");
  return useMutation({
    mutationFn: async ({
      password,
      newPassword,
    }: {
      password: string;
      newPassword: string;
    }) => {
      const response = await api.patch("/auth/password/reset", {
        login,
        password,
        newPassword,
      });
      return response.data;
    },
  });
};
