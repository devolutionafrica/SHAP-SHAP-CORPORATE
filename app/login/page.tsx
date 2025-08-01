"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { motion, scale } from "framer-motion";
import Image from "next/image";

import { Card } from "@/components/ui/card";
import Family from "@/public/family.jpg";
import Logo from "@/public/nsiavie.png";
import "./styles.scss";
import { useLogin } from "@/hooks/useLogin";
import { useAuthContext } from "@/hooks/contexts/authContext";

const loginSchema = z.object({
  email: z.string().min(6, "Adresse email invalide"),
  password: z.string().min(6, "Mot de passe trop court"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const loginMutation = useLogin();
  const router = useRouter();
  const { setUserName } = useAuthContext();

  const onSubmit = async (data: LoginFormData) => {
    loginMutation.mutateAsync(
      {
        username: data.email,
        password: data.password,
      },
      {
        onSuccess: (response) => {
          localStorage.setItem("token", response.token);
          localStorage.setItem("username", response.username);
          document.cookie = "isAuth=true; path=/";
          setUserName(response.username);
          if (response.isFirstConnection == 1) {
            router.push("/dashboard");
          } else {
            router.push("/login/first-connexion");
          }
        },
        onError: (error) => {
          console.error("Erreur de connexion :", error);
          alert("Échec de la connexion. Veuillez vérifier vos identifiants.");
        },
      }
    );
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br login-page">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row bg-white backdrop-blur-md shadow-xl rounded-3xl overflow-hidden max-w-4xl w-full h-[90vh]"
      >
        <div className="relative hidden md:block w-full md:w-1/2 h-full">
          <Image
            src={Family}
            alt="Connexion"
            layout="fill"
            objectFit="cover"
            className="rounded-l-xl"
          />
        </div>

        {/* Formulaire */}
        <Card className="w-full md:w-1/2 p-6 flex flex-col rounded-none justify-center bg-[#223268] ">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col items-center my-4"
          >
            <Image
              src="/nsiavie.png"
              alt="logo"
              width={200}
              height={200}
            ></Image>
            <h1 className="font-extrabold text-[28px] text-[#ca9a2c] text-center">
              CONNEXION
            </h1>
          </motion.div>
          {/* <Image src={Logo} alt="NSIA" width={200} className="justify-center" /> */}
          <p className="text-center text-sm text-white mt-1 ">
            Connectez-vous à votre compte pour accéder à toutes les
            fonctionnalités.
          </p>

          <form
            className="flex flex-col gap-4 mt-6"
            onSubmit={handleSubmit(onSubmit)}
          >
            <label className="flex flex-col text-sm text-white">
              Email:
              <input
                type="text"
                {...register("email")}
                className="mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-400 text-black"
              />
              {errors.email && (
                <span className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </span>
              )}
            </label>
            <label className="flex flex-col text-sm text-white">
              Mot de passe:
              <input
                type="password"
                {...register("password")}
                className="mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-400 text-black"
              />
              {errors.password && (
                <span className="text-red-500 text-xs mt-1">
                  {errors.password.message}
                </span>
              )}
            </label>
            {loginMutation.error && (
              <div className="flex justify-center p-2 bg-red-200 rounded text-sm text-red-800">
                Vos données ne sont pas correctes
              </div>
            )}
            <div className="flex flex-row items-center justify-between text-sm mt-2">
              <a href="/login/forgot" className="text-[white] hover:underline">
                Mot de passe oublié ?
              </a>
              <button
                type="submit"
                className="!bg-[#ca9a2c] text-white px-4 py-2 rounded hover:bg-indigo-700 transition duration-200"
              >
                {loginMutation.isPending ? "Connexion..." : "Se connecter"}
              </button>
            </div>
            <p className="mt-4 text-center text-sm text-teal-50 ">
              Vous n'avez pas de compte ?{" "}
              <a href="/register" className="text-[white] hover:underline">
                Inscrivez-vous
              </a>
            </p>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
