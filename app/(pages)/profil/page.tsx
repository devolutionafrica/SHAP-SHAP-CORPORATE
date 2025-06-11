"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import dayjs, { Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useUser } from "@/hooks/contexts/userContext";

export default function ProfilPage() {
  const { user, getTypeUser } = useUser();

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
                DB
              </AvatarFallback>
            </Avatar>
            <CardTitle>
              {user
                ? `${user.NOM_CLIENT} ${user.PRENOMS_CLIENT}`
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Nom
                  </label>
                  <div className="p-3 bg-slate-50 rounded-lg border">
                    <span className="text-slate-600">
                      {user.NOM_CLIENT || "Non renseigné"}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Prénoms
                  </label>
                  <div className="p-3 bg-slate-50 rounded-lg border">
                    <span className="text-slate-600">
                      {user.PRENOMS_CLIENT || "Non renseigné"}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    {getTypeUser() == 1 ? "Date de Naissance" : "Date Création"}
                  </label>
                  <div className="p-3 bg-slate-50 rounded-lg border">
                    <span className="text-slate-600">
                      {dayjs(user.DATE_NAISSANCE).format("dd/MM/yyyy") ||
                        "Non renseigné"}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Lieu de Naissance
                  </label>
                  <div className="p-3 bg-slate-50 rounded-lg border">
                    <span className="text-slate-600">
                      {user.LIEU_NAISSANCE || "Non renseigné"}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Téléphone (1)
                  </label>
                  <div className="p-3 bg-slate-50 rounded-lg border">
                    <span className="text-slate-600">
                      {user.TELEPHONE || "Non renseigné"}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Téléphone (2)
                  </label>
                  <div className="p-3 bg-slate-50 rounded-lg border">
                    <span className="text-slate-600">
                      {user.NUMERO_CLIENT || "Non renseigné"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4 pt-4">
                <Button className="bg-[#223268]">Modifier</Button>
                <Button variant="outline">Appliquer</Button>
                <Button
                  variant="ghost"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  Annuler
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
