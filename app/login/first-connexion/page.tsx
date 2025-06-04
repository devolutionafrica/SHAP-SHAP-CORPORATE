"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import Image from "next/image";
import WelcomeIllustration from "@/public/Welcome.svg";

const schema = z.object({
  oldPassword: z.string().min(6, "Mot de passe actuel requis"),
  newPassword: z.string().min(6, "Nouveau mot de passe trop court"),
});

type PasswordFormData = z.infer<typeof schema>;

export default function WelcomeFirstLogin() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: PasswordFormData) => {
    console.log("Password change:", data);
    // TODO: call API to update password
  };

  //connexion à l'API pour la modification du mot de passe
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col md:flex-row bg-white/90 backdrop-blur-md shadow-xl rounded-xl overflow-hidden max-w-4xl"
      >
        {/* Illustration */}
        <div className="hidden md:flex items-center justify-center bg-purple-100 p-6">
          <Image
            src={WelcomeIllustration}
            alt="Bienvenue"
            width={300}
            height={300}
          />
        </div>

        {/* Formulaire */}
        <Card className="w-full max-w-md p-6 flex flex-col">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-bold text-indigo-700 text-center"
          >
            Bienvenue !
          </motion.h1>
          <p className="text-center text-sm text-gray-600 mt-2">
            Pour votre sécurité, merci de modifier votre mot de passe avant de
            continuer.
          </p>

          <form
            className="flex flex-col gap-4 mt-6"
            onSubmit={handleSubmit(onSubmit)}
          >
            <label className="flex flex-col text-sm">
              Mot de passe actuel :
              <input
                type="password"
                {...register("oldPassword")}
                className="mt-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-400"
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
                className="mt-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-400"
              />
              {errors.newPassword && (
                <span className="text-red-500 text-xs mt-1">
                  {errors.newPassword.message}
                </span>
              )}
            </label>

            <div className="flex flex-row justify-between mt-4">
              <button
                type="submit"
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition duration-200"
              >
                Modifier et continuer
              </button>
              <button
                type="button"
                className="text-indigo-600 underline text-sm hover:text-indigo-800"
                onClick={() => console.log("Ignorer la modification")}
              >
                Passer
              </button>
            </div>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
