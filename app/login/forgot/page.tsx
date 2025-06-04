"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";

const forgotPasswordSchema = z.object({
  username: z.string().min(3, "Nom d'utilisateur requis"),
  newPassword: z
    .string()
    .min(6, "Le mot de passe doit contenir au moins 6 caractères"),
});

type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [success, setSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = (data: ForgotPasswordData) => {
    console.log("Form submitted:", data);
    setSuccess(true);
    // send to backend here
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md p-6"
      >
        <Card className="w-full p-6 shadow-2xl rounded-xl backdrop-blur-lg bg-white/90">
          <h1 className="text-2xl font-extrabold text-center text-indigo-700 mb-2">
            Réinitialiser le mot de passe
          </h1>
          <p className="text-center text-sm text-gray-600 mb-6">
            Entrez votre nom d'utilisateur et un nouveau mot de passe.
          </p>

          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <label className="flex flex-col text-sm">
              Nom d'utilisateur :
              <input
                type="text"
                {...register("username")}
                className="mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              {errors.username && (
                <span className="text-red-500 text-xs mt-1">
                  {errors.username.message}
                </span>
              )}
            </label>

            <label className="flex flex-col text-sm">
              Nouveau mot de passe :
              <input
                type="password"
                {...register("newPassword")}
                className="mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              {errors.newPassword && (
                <span className="text-red-500 text-xs mt-1">
                  {errors.newPassword.message}
                </span>
              )}
            </label>

            <button
              type="submit"
              className="mt-4 bg-indigo-600 text-white font-semibold py-2 px-4 rounded hover:bg-indigo-700 transition duration-200"
            >
              Valider
            </button>
          </form>

          {success && (
            <motion.p
              className="text-green-600 text-sm text-center mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              Mot de passe modifié avec succès !
            </motion.p>
          )}
        </Card>
      </motion.div>
    </div>
  );
}
