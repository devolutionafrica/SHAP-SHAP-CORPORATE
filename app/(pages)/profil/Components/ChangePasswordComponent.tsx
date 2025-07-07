"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card"; // Assurez-vous que le chemin est correct pour votre composant Card
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import Image from "next/image"; // Importez le composant Image de Next.js
// import { useResetPassword } from "@/hooks/useLogin"; // Cette ligne semble inutilisée, je l'ai commentée
import { useUpdatepassword } from "@/hooks/useResetpassword"; // Assurez-vous que le chemin est correct pour votre hook
import { useUserStore } from "@/store/userStore";

const passwordSchema = z
  .object({
    oldPassword: z.string().min(1, "L'ancien mot de passe est requis."), // Renommé 'password' en 'oldPassword'
    newPassword: z
      .string()
      .min(6, "Le nouveau mot de passe doit contenir au moins 6 caractères."),
    confirmNewPassword: z // Renommé 'confirmPassword' pour la clarté
      .string()
      .min(
        6,
        "La confirmation du mot de passe doit contenir au moins 6 caractères."
      ),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Les nouveaux mots de passe ne correspondent pas.",
    path: ["confirmNewPassword"], // L'erreur s'affichera sous le champ de confirmation
  });

type PasswordData = z.infer<typeof passwordSchema>;

type ForgotPasswordPageProps = {
  type?: string | null;
  cancel?: () => void;
};

export default function ForgotPasswordComponent({
  type,
  cancel,
}: ForgotPasswordPageProps) {
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // État pour les messages d'erreur du backend
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<PasswordData>({
    resolver: zodResolver(passwordSchema),
  });

  const username = useUserStore((state) => state.username);

  const updatePasswordMutation = useUpdatepassword();
  const user = useUserStore((state) => state.user);
  const onSubmit = async (data: PasswordData) => {
    setSuccess(false);
    setErrorMessage(null);

    updatePasswordMutation.mutate(
      {
        password: data.oldPassword,
        newPassword: data.newPassword,
        confirm: data.confirmNewPassword,
        login: user?.LOGIN!,
      },
      {
        onSuccess: () => {
          setSuccess(true);
          reset();

          if (type === "Component" && cancel) {
            alert(
              "Mot de passe modifié avec succès ! La fenêtre va se fermer."
            );
            setTimeout(() => cancel(), 1000);
          } else {
            alert(
              "Mot de passe modifié avec succès ! Vous serez redirigé vers la page de connexion."
            );
            setTimeout(() => {
              window.location.href = "/login";
            }, 1000);
          }
        },
        onError: (error: Error) => {
          console.error(
            "Erreur lors de la réinitialisation du mot de passe :",
            error
          );
          // Affiche un message d'erreur plus convivial à l'utilisateur
          setErrorMessage(
            error.message ||
              "Une erreur est survenue lors de la mise à jour du mot de passe."
          );
        },
      }
    );
  };

  // La fonction handleSubmit(onSubmit) est directement passée à onSubmit de la balise form
  // Pas besoin de 'const handleSubmitForm = handleSubmit(onSubmit);'
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
              alt="Logo NSIA Vie" // Texte alternatif plus descriptif
              width={180}
              height={180}
              className="object-contain"
            />
          </motion.div>

          <h1 className="text-3xl font-extrabold text-center text-[#223268] mb-3">
            Modifier votre mot de passe
          </h1>
          <p className="text-center text-sm text-gray-700 mb-8 max-w-xs mx-auto">
            Veuillez entrer votre ancien mot de passe, puis votre nouveau mot de
            passe et le confirmer.
          </p>

          <form
            className="flex flex-col gap-2"
            onSubmit={handleSubmit(onSubmit)} // CORRECTION ICI ! Appelez handleSubmit(onSubmit) directement
          >
            <label className="flex flex-col text-sm font-medium text-gray-700">
              Ancien mot de passe :
              <input
                type="password"
                {...register("oldPassword")} // Utilisez 'oldPassword'
                className="mt-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150 ease-in-out placeholder-gray-400"
                placeholder="Votre ancien mot de passe"
              />
              {errors.oldPassword && (
                <motion.span
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-600 text-xs mt-1"
                >
                  {errors.oldPassword.message}
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
              Confirmer le nouveau mot de passe :
              <input
                type="password"
                {...register("confirmNewPassword")} // Utilisez 'confirmNewPassword'
                className="mt-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150 ease-in-out placeholder-gray-400"
                placeholder="Confirmez le nouveau mot de passe"
              />
              {errors.confirmNewPassword && (
                <motion.span
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-600 text-xs mt-1"
                >
                  {errors.confirmNewPassword.message}
                </motion.span>
              )}
            </label>

            <div className="flex flex-row items-center flex-wrap justify-center gap-4">
              <motion.button
                type="button"
                whileHover={{ scale: 1.02, backgroundColor: "#e2e8f0" }} // Couleur de survol plus douce
                whileTap={{ scale: 0.98 }}
                className="flex-1 mt-6 text-[#1a254d] font-semibold py-3 px-4 border border-[#1a254d] rounded-md hover:shadow-xl transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                onClick={
                  type !== "Component"
                    ? () => {
                        window.location.href = "/login";
                      }
                    : () => {
                        // Assurez-vous que cancel est bien défini si type est "Component"
                        if (cancel) cancel();
                      }
                }
              >
                {type !== "Component" ? "Annuler" : "Fermer"}
              </motion.button>
              <motion.button
                type="submit"
                whileTap={{ scale: 0.98 }}
                className="flex-1 mt-6 !bg-[#1a254d] text-white font-semibold py-3 px-4 rounded-md hover:shadow-xl transition duration-300 ease-in-out"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Envoi en cours..." : "Valider"}
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
              🎉 Mot de passe modifié avec succès !
            </motion.p>
          )}

          {errorMessage && (
            <motion.p
              className="text-red-600 text-sm font-semibold text-center mt-6 p-3 bg-red-50 rounded-md border border-red-200"
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              ⚠️ Erreur de changement de Mot de passe
            </motion.p>
          )}
        </Card>
      </motion.div>
    </div>
  );
}
