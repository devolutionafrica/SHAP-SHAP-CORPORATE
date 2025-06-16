"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useUser } from "@/hooks/contexts/userContext";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useUpdateProfile } from "@/hooks/useUpdateProfil";
import { useAuthContext } from "@/hooks/contexts/authContext";

dayjs.extend(customParseFormat);

const profileSchema = z.object({
  LIEU_NAISSANCE: z.string().trim().optional().or(z.literal("")),
  TELEPHONE: z
    .string()
    .trim()
    .regex(/^\+?\d{8,}$/, "Format de téléphone invalide")
    .optional()
    .or(z.literal("")),
  NUMERO_CLIENT: z
    .string()
    .trim()
    .regex(/^\+?\d{8,}$/, "Format de téléphone invalide")
    .optional()
    .or(z.literal("")),
  PROFESSION: z.string().trim().optional().or(z.literal("")),
  ADRESSE_EMAIL: z
    .string()
    .trim()
    .email("Adresse email invalide")
    .optional()
    .or(z.literal("")),
  ADRESSE_GEOGRAPHIQUE: z.string().trim().optional().or(z.literal("")),
  VILLE_RESIDENCE: z.string().trim().optional().or(z.literal("")),
  PAYS_RESIDENCE: z.string().trim().optional().or(z.literal("")),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfilPage() {
  const { user, getTypeUser } = useUser();
  const { getUsername } = useAuthContext();
  const [isEditing, setIsEditing] = useState(false);
  const updateUser = useUpdateProfile();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      LIEU_NAISSANCE: user?.LIEU_NAISSANCE || "",
      TELEPHONE: user?.TELEPHONE || "",
      NUMERO_CLIENT: user?.NUMERO_CLIENT || "",
      PROFESSION: user?.PROFESSION || "",

      ADRESSE_GEOGRAPHIQUE: user?.ADRESSE_POSTALE || "",
      VILLE_RESIDENCE: user?.LIEU_HABITATION || "",
      PAYS_RESIDENCE: user?.CODE_FILIALE || "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (user) {
      reset({
        LIEU_NAISSANCE: user.LIEU_NAISSANCE || "",
        TELEPHONE: user.TELEPHONE || "",
        NUMERO_CLIENT: user.NUMERO_CLIENT || "",
        PROFESSION: user.PROFESSION || "",
        ADRESSE_GEOGRAPHIQUE: user?.ADRESSE_POSTALE || "",
        VILLE_RESIDENCE: user?.LIEU_HABITATION || "",
        PAYS_RESIDENCE: user?.CODE_FILIALE || "",
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: ProfileFormData) => {
    try {
      const request = {
        // login: getUsername(),
        telephone: data.TELEPHONE,
        profession: data.PROFESSION,
        lieuNaissance: data.LIEU_NAISSANCE,
        adressePostale: data.ADRESSE_GEOGRAPHIQUE,
        lieuHabitation: data.VILLE_RESIDENCE,
      };

      await updateUser.mutateAsync(request, {
        onSuccess: (response) => {
          alert("Profile updated successfully");
          setIsEditing(false);
        },
        onError: (error) => {
          alert("Error updating profile");
          console.log(error);
        },
      });
    } catch (error) {
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    reset();
    setIsEditing(false);
  };

  const renderField = (
    label: string,
    value: string | undefined | null,
    fieldName: keyof ProfileFormData | null,
    isEditable: boolean = true
  ) => (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-700">{label}</label>
      {isEditing && isEditable && fieldName ? (
        <>
          <input
            type={fieldName === "ADRESSE_EMAIL" ? "email" : "text"}
            {...register(fieldName)}
            className={`p-3 bg-white rounded-lg border w-full focus:ring-2 focus:ring-[#223268] ${
              errors[fieldName] ? "border-red-500" : "border-gray-300"
            }`}
            defaultValue={value || ""}
          />
          {errors[fieldName] && (
            <span className="text-red-500 text-xs mt-1">
              {errors[fieldName]?.message as string}
            </span>
          )}
        </>
      ) : (
        <div className="p-3 bg-slate-50 rounded-lg border">
          <span className="text-slate-600">{value || "Non renseigné"}</span>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Mon Profil</h1>
        <p className="text-slate-600 mt-1">
          Gérez vos informations personnelles
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="shadow-lg border-0">
          <CardHeader className="text-center">
            <Avatar className="w-24 h-24 mx-auto mb-4">
              <AvatarImage src="/placeholder.svg?height=96&width=96" />
              <AvatarFallback className="bg-[#223268] text-white text-2xl">
                {user
                  ? user.NOM_CLIENT?.charAt(0) + user.PRENOMS_CLIENT?.charAt(0)
                  : "DB"}
              </AvatarFallback>
            </Avatar>
            <CardTitle>
              {user
                ? `${user.NOM_CLIENT || ""} ${user.PRENOMS_CLIENT || ""}`
                : "Utilisateur"}
            </CardTitle>
            <CardDescription>
              {user
                ? `${user.PROFESSION || "Non renseigné"}`
                : "Veuillez compléter votre profil pour plus d'informations."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full bg-[#223268]">Modifier Photo</Button>
            <Button variant="outline" className="w-full">
              Changer Mot de Passe
            </Button>
          </CardContent>
        </Card>

        {user == null && (
          <Card className="lg:col-span-2 shadow-lg border-0">
            <CardHeader>
              <CardTitle>Bienvenue</CardTitle>
              <CardDescription>
                Veuillez compléter votre profil pour accéder à toutes les
                fonctionnalités.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button className="bg-gradient-to-r bg-[#223268]">
                Compléter le Profil
              </Button>
            </CardContent>
          </Card>
        )}

        {user && (
          <Card className="lg:col-span-2 shadow-lg border-0">
            <CardHeader>
              <CardTitle>Informations Personnelles</CardTitle>
              <CardDescription>Mettez à jour vos informations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderField("Nom", user.NOM_CLIENT, null, false)}
                  {renderField("Prénoms", user.PRENOMS_CLIENT, null, false)}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">
                      {getTypeUser() == 1
                        ? "Date de Naissance"
                        : "Date Création"}
                    </label>
                    <div className="p-3 bg-slate-50 rounded-lg border">
                      <span className="text-slate-600">
                        {user.DATE_NAISSANCE
                          ? dayjs(user.DATE_NAISSANCE).format("DD/MM/YYYY")
                          : "Non renseigné"}
                      </span>
                    </div>
                  </div>

                  {renderField(
                    "Lieu de Naissance",
                    user.LIEU_NAISSANCE,
                    "LIEU_NAISSANCE"
                  )}
                  {renderField("Téléphone (1)", user.TELEPHONE, "TELEPHONE")}
                  {renderField(
                    "Téléphone (2)",
                    user.NUMERO_CLIENT,
                    "NUMERO_CLIENT"
                  )}
                  {renderField("Profession", user.PROFESSION, "PROFESSION")}

                  {renderField(
                    "Adresse Géographique",
                    user.ADRESSE_POSTALE,
                    "ADRESSE_GEOGRAPHIQUE"
                  )}
                  {renderField(
                    "Ville de Résidence",
                    user.LIEU_HABITATION,
                    "VILLE_RESIDENCE"
                  )}
                  {renderField(
                    "Pays de Résidence",
                    user.CODE_FILIALE,
                    "PAYS_RESIDENCE"
                  )}
                </div>

                <div className="flex space-x-4 pt-4">
                  {!isEditing && (
                    <Button
                      className="bg-[#223268]"
                      onClick={() => setIsEditing(true)}
                      type="button"
                    >
                      Modifier
                    </Button>
                  )}
                  {isEditing && (
                    <>
                      <Button
                        className="bg-[#223268]"
                        type="submit"
                        disabled={updateUser.isPending}
                      >
                        {updateUser.isPending ? "Application..." : "Appliquer"}
                      </Button>
                      <Button
                        variant="ghost"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={handleCancelEdit}
                        type="button"
                        disabled={updateUser.isPending}
                      >
                        Annuler
                      </Button>
                    </>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
