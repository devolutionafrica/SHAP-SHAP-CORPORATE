"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card"; // Assurez-vous que le chemin est correct pour votre composant Card
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import Image from "next/image"; // Importez le composant Image de Next.js

const forgotPasswordSchema = z
  .object({
    username: z.string().min(3, "Nom d'utilisateur requis"),
    newPassword: z
      .string()
      .min(6, "Le mot de passe doit contenir au moins 6 caractères"),
    confirmPassword: z
      .string()
      .min(
        6,
        "La confirmation du mot de passe doit contenir au moins 6 caractères"
      ),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;

type ForgotPasswordPageProps = {
  type?: string | null;
  cancel?: () => void;
};

export default function ForgotPasswordPage({
  type,
  cancel,
}: ForgotPasswordPageProps) {
  const [success, setSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }, // Ajout de isSubmitting pour désactiver le bouton
  } = useForm<ForgotPasswordData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordData) => {
    console.log("Form submitted:", data);
    // Simule un appel backend
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setSuccess(true);
    // Ici, vous enverriez les données au backend
    // Exemple:
    // try {
    //   const response = await fetch('/api/reset-password', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(data),
    //   });
    //   if (response.ok) {
    //     setSuccess(true);
    //   } else {
    //     // Gérer les erreurs du backend
    //     const errorData = await response.json();
    //     console.error("Backend error:", errorData);
    //     setMessage(errorData.message || "Une erreur est survenue.");
    //   }
    // } catch (error) {
    //   console.error("Network error:", error);
    //   setMessage("Erreur de connexion au serveur.");
    // }
  };

  return (
    <div className="flex items-center justify-center min-h-screen shadow-lg bg-gray-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md p-6"
      >
        <Card className="w-full p-8 shadow-3xl backdrop-blur-md bg-white/80 border border-gray-100 rounded-lg">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="mb-6 flex justify-center"
          >
            <Image
              src="/nsiavie.png"
              alt="Illustration de réinitialisation de mot de passe"
              width={180}
              height={180}
              className="object-contain"
            />
          </motion.div>

          <h1 className="text-3xl font-extrabold text-center text-[#223268] mb-3">
            Réinitialiser votre mot de passe
          </h1>
          <p className="text-center text-sm text-gray-700 mb-8 max-w-xs mx-auto">
            Veuillez entrer votre nom d'utilisateur et votre nouveau mot de
            passe sécurisé ci-dessous.
          </p>

          <form
            className="flex flex-col gap-2"
            onSubmit={handleSubmit(onSubmit)}
          >
            <label className="flex flex-col text-sm font-medium text-gray-700">
              Nom d'utilisateur :
              <input
                type="text"
                {...register("username")}
                className="mt-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150 ease-in-out placeholder-gray-400"
                placeholder="Votre nom d'utilisateur"
              />
              {errors.username && (
                <motion.span
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-600 text-xs mt-1"
                >
                  {errors.username.message}
                </motion.span>
              )}
            </label>

            <label className="flex flex-col text-sm font-medium text-gray-700">
              Nouveau mot de passe :
              <input
                type="password"
                {...register("newPassword")}
                className="mt-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150 ease-in-out placeholder-gray-400"
                placeholder="Minimum 6 caractères"
              />
              {errors.newPassword && (
                <motion.span
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-600 text-xs mt-1"
                >
                  {errors.newPassword.message}
                </motion.span>
              )}
            </label>

            <label className="flex flex-col text-sm font-medium text-gray-700">
              Confirmer le mot de passe :
              <input
                type="confirmPassword"
                {...register("newPassword")}
                className="mt-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150 ease-in-out placeholder-gray-400"
                placeholder="Minimum 6 caractères"
              />
              {errors.confirmPassword && (
                <motion.span
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-600 text-xs mt-1"
                >
                  {errors.confirmPassword.message}
                </motion.span>
              )}
            </label>

            <div className="flex flex-row items-center flex-wrap justify-center gap-4">
              <motion.button
                type="button"
                whileHover={{ scale: 1.02, backgroundColor: "#4f46e5" }}
                whileTap={{ scale: 0.98 }} // Effet de clic
                className=" flex-1 mt-6  text-[#1a254d] font-semibold py-3 px-4 border border-[#1a254d] rounded-md hover:shadow-xl transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                onClick={
                  type != "Component"
                    ? () => {
                        window.location.href = "/login";
                      }
                    : cancel
                }
              >
                {type != "Component" ? "Connexion" : "Fermer"}
              </motion.button>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02, backgroundColor: "#4f46e5" }} // Effet de survol
                whileTap={{ scale: 0.98 }} // Effet de clic
                className=" flex-1 mt-6 bg-[#1a254d] text-white font-semibold py-3 px-4 rounded-md  hover:shadow-xl transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Réinitialisation en cours..." : "Valider"}
              </motion.button>
            </div>
          </form>

          {success && (
            <motion.p
              className="text-green-600 text-sm font-semibold text-center mt-6 p-3 bg-green-50 rounded-md border border-green-200"
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              🎉 Mot de passe modifié avec succès ! Vous pouvez maintenant vous
              connecter avec votre nouveau mot de passe.
            </motion.p>
          )}
        </Card>
      </motion.div>
    </div>
  );
}
