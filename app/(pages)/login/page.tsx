"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import Image from "next/image";
import LoginIllustration from "@/public/Login.svg";
import "./styles.scss";
import { login } from "@/app/repository/auths";

const loginSchema = z.object({
  email: z.string().email("Adresse email invalide"),
  password: z.string().min(6, "Mot de passe trop court"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    login(data.email, data.password).then((response) => {
      if (response.status == 200) {
        router.push("/");
      } else {
        alert("Identifiants incorrects. Veuillez réessayer.");
      }
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-100 login-page">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row bg-white backdrop-blur-md shadow-xl rounded-xl overflow-hidden max-w-4xl"
      >
        {/* Illustration */}
        <div className="hidden md:flex items-center justify-center bg-indigo-100 p-6">
          <Image
            src={LoginIllustration}
            alt="Connexion"
            width={300}
            height={300}
          />
        </div>

        {/* Formulaire */}
        <Card className="w-full max-w-md p-6 flex flex-col">
          <h1 className="font-extrabold text-[28px] text-indigo-700 text-center">
            Connexion
          </h1>
          <p className="text-center text-sm text-gray-600 mt-1">
            Connectez-vous à votre compte pour accéder à toutes les
            fonctionnalités.
          </p>

          <form
            className="flex flex-col gap-4 mt-6"
            onSubmit={handleSubmit(onSubmit)}
          >
            <label className="flex flex-col text-sm">
              Email:
              <input
                type="email"
                {...register("email")}
                className="mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-400"
              />
              {errors.email && (
                <span className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </span>
              )}
            </label>
            <label className="flex flex-col text-sm">
              Mot de passe:
              <input
                type="password"
                {...register("password")}
                className="mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-400"
              />
              {errors.password && (
                <span className="text-red-500 text-xs mt-1">
                  {errors.password.message}
                </span>
              )}
            </label>
            <div className="flex flex-row items-center justify-between text-sm mt-2">
              <a
                href="/login/forgot"
                className="text-indigo-600 hover:underline"
              >
                Mot de passe oublié ?
              </a>
              <button
                type="submit"
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition duration-200"
              >
                "Se connecter"
              </button>
            </div>
            <p className="mt-4 text-center text-sm">
              Vous n'avez pas de compte ?{" "}
              <a href="/register" className="text-indigo-600 hover:underline">
                Inscrivez-vous
              </a>
            </p>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
