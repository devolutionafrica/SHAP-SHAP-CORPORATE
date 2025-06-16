"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import Image from "next/image";
import WelcomeIllustration from "@/public/Welcome.svg"; // Assurez-vous que cette image existe
import { useResetPassword } from "@/hooks/useLogin";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthContext } from "@/hooks/contexts/authContext";
import { CheckCircle, MailWarning } from "lucide-react";

const schema = z.object({
  oldPassword: z.string().min(6, "Mot de passe actuel requis"),
  newPassword: z.string().min(6, "Nouveau mot de passe trop court"),
  email: z.string().email("Veuillez entrer votre adresse mail"),
  phone: z.string().min(8, "Veuillez saisir un numéro valide"),
});

type PasswordFormData = z.infer<typeof schema>;

export default function WelcomeFirstLogin() {
  const useChangePassword = useResetPassword();

  const router = useRouter();

  const { getUsername } = useAuthContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: PasswordFormData) => {
    useChangePassword.mutateAsync(
      {
        newPassword: data.oldPassword,
        password: data.newPassword,
        email: data.email,
        phone: data.phone,
      },
      {
        onSuccess: (response) => {
          console.log(response);
        },
        onError: (error) => {},
      }
    );
  };

  useEffect(() => {
    if (!getUsername()) {
      router.push("/login");
    }
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br login-page">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row bg-white backdrop-blur-md shadow-xl rounded-xl md:overflow-hidden max-w-4xl w-full h-[80vh]" // Classes de LoginPage
      >
        <div className="relative hidden md:block w-full md:w-1/2 h-full">
          <Image
            src={WelcomeIllustration}
            alt="Bienvenue"
            layout="fill"
            objectFit="contain"
            className="rounded-l-xl p-6"
          />
        </div>

        {/* Formulaire - Adapté de LoginPage */}
        <Card className="w-full md:w-1/2 p-6 flex flex-col justify-center sm:overflow-y-auto">
          <h1
            // Supprime les animations motion pour correspondre à LoginPage
            className="font-extrabold text-[28px] text-[#223268] text-center"
          >
            Bienvenue !
          </h1>
          <p className="text-center text-sm text-gray-600 mt-2">
            Pour votre sécurité, merci de modifier votre mot de passe avant de
            continuer.
          </p>

          <form
            className="flex flex-col gap-4 mt-6"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="md:flex md:flex-row sm:flex-col gap-4">
              <label className="flex flex-col text-sm">
                Mot de passe actuel :
                <input
                  type="password"
                  {...register("oldPassword")}
                  className="mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-400" // rounded-md
                />
                {errors.oldPassword && (
                  <span className="text-red-500 text-xs mt-1">
                    {errors.oldPassword.message}
                  </span>
                )}
              </label>

              <label className="flex flex-col text-sm">
                Nouveau mot de passe :
                <input
                  type="password"
                  {...register("newPassword")}
                  className="mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-400" // rounded-md
                />
                {errors.newPassword && (
                  <span className="text-red-500 text-xs mt-1">
                    {errors.newPassword.message}
                  </span>
                )}
              </label>
            </div>

            <div className="md:flex md:flex-row sm:flex-col gap-4">
              <label className="flex flex-col text-sm">
                Adresse email:
                <input
                  type="email"
                  {...register("email")}
                  className="mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-400" // rounded-md
                />
                {errors.email && (
                  <span className="text-red-500 text-xs mt-1">
                    {errors.email.message}
                  </span>
                )}
              </label>
              <label className="flex flex-col text-sm">
                Numéro téléphone :
                <input
                  type="number"
                  {...register("phone")}
                  className="mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-400" // rounded-md
                />
                {errors.phone && (
                  <span className="text-red-500 text-xs mt-1">
                    {errors.phone.message}
                  </span>
                )}
              </label>
            </div>

            {useChangePassword.isSuccess && (
              <div>
                <div className="p-3 rounded bg-blue-200 border-blue-600 text-blue-600 flex  flex-row gap-3">
                  <div>
                    <CheckCircle />
                  </div>
                  Mot de passe modifié{" "}
                </div>
              </div>
            )}

            {useChangePassword.isError && (
              <div>
                <div className="p-3 rounded bg-red-200 border-red-600 text-red-600 flex  flex-row gap-3">
                  <div>
                    <MailWarning />
                  </div>
                  Une erreur est survenue veuillez réessayer{" "}
                </div>
              </div>
            )}

            <div className="flex flex-row items-center justify-between text-sm mt-2">
              <button
                type="submit"
                className="!bg-[#ca9a2c] text-white px-4 py-2 rounded hover:bg-indigo-700 transition duration-200"
              >
                {useChangePassword.isPending && !useChangePassword.isSuccess
                  ? "Chargemen ..."
                  : "Modifier et continuer"}
              </button>

              {useChangePassword.isSuccess && (
                <button
                  type="button"
                  className="!bg-[#ca9a2c] text-white px-4 py-2 rounded hover:bg-indigo-700 transition duration-200"
                  onClick={() => router.push("/dashboard")}
                >
                  Continuer
                </button>
              )}

              <div>
                <button
                  type="button"
                  className="!text-indigo-600 underline text-sm "
                  onClick={() => {
                    router.push("/dashboard");
                  }}
                >
                  Passer
                </button>
              </div>
            </div>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
