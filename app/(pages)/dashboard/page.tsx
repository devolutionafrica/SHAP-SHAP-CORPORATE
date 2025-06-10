"use client";
import { Contrat, Convention } from "@/app/Types/type";
import ContratCard from "@/components/ContratCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAuthContext } from "@/hooks/contexts/authContext";
import { useAgenceContext } from "@/hooks/contexts/useAgenceContext";
import { useContratContext } from "@/hooks/contexts/useContratContext";
import { useUser } from "@/hooks/contexts/userContext";
import { useAgence } from "@/hooks/useAgence";
import { useUserInfo } from "@/hooks/useUserInfo";
import { Calendar, FileText, Mail, MapPin, Phone, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ButtonOutline } from "./component/ButtonOutline";
import { useConvention } from "@/hooks/useConvention";

export default function DashboardPage() {
  const { user, labelType } = useUser();

  const {
    setUser,
    percentProfile,
    setPercentProfile,
    setTypeUtilisateur,
    typeUtilisateur,
    getTypeUser,
  } = useUser();
  const userinfo = useUserInfo();

  const { contrats, conventions, handleLoadConvention } = useContratContext();

  const { agences, setAgence } = useAgenceContext();

  const formatTypeUser = (civility: string) => {
    switch (civility) {
      case "MONSIEUR":
      case "MADAME":
      case "MADEMOISELLE":
      case "MAITRE": {
        return 1;
      }

      default:
        return 2;
    }
  };

  const handleLoadUserData = async () => {
    await userinfo
      .refetch()
      .then((result) => {
        if (result.data) {
          console.log("User data fetched:", result.data);
          setUser(result.data.data);
          setPercentProfile!(result.data.pourcentage);
          console.log("User data loaded successfully:", user?.CIVILITE);
          if (user) {
            localStorage.setItem(
              "type_user",
              formatTypeUser(user.CIVILITE).toString()
            );
            console.log("Type contrats:\n\n", getTypeUser());
            console.log("UTILISATEUR :\n\n\n", user);
            setTypeUtilisateur(formatTypeUser(user.CIVILITE));
          }
        }
      })
      .catch((error) => {
        console.error("Error loading user data:", error);
        alert("Erreur lors du chargement des données utilisateur.");
      });
  };

  const agenceQuery = useAgence();
  const router = useRouter();
  const handleLoadAgences = async () => {
    await agenceQuery
      .refetch()
      .then((result) => {
        if (result.data) {
          console.log("Agences data fetched:", result.data);
          setAgence(result.data.agences);
          console.log("Agences loaded successfully:", agences);
        }
      })
      .catch((error) => {
        console.error("Error loading agences:", error);
        alert("Erreur lors du chargement des agences.");
      });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    handleLoadUserData();
    handleLoadAgences();
    handleLoadConvention();
  }, [user, contrats, conventions]);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-slate-600">
          Chargement des données utilisateur...
        </p>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-slate-900">
            Bienvenue,{" "}
            <span className="text-[#223268] bg-clip-text text-transparent">
              {user?.NOM_CLIENT || "Utilisateur"}
            </span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Gérez vos contrats d'assurance, consultez vos informations et restez
            connecté avec nos services.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Contrat card */}
          <ContratCard />

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-all duration-300 cursor-pointer group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700">
                Agences Disponibles
              </CardTitle>
              <MapPin className="h-6 w-6 text-green-600 group-hover:scale-110 transition-transform" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-900">
                {agences != null && agences!.length > 0 ? agences!.length : 0}
              </div>
              <p className="text-xs text-green-600 mt-1">
                Agence la plus proche
              </p>
              <div className="mt-3">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-green-700 hover:bg-green-200 p-0"
                >
                  Localiser →
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-all duration-300 cursor-pointer group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-700">
                Profil Complété
              </CardTitle>
              <User className="h-6 w-6 text-purple-600 group-hover:scale-110 transition-transform" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-900">
                {percentProfile} %
              </div>
              <Progress value={percentProfile} className="mt-2 h-2" />
              <ButtonOutline>Compléter →</ButtonOutline>
            </CardContent>
          </Card>
        </div>

        {/* Recent Contracts */}
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl text-slate-900">
                  {labelType()}
                </CardTitle>
                <CardDescription className="text-slate-600">
                  Vos derniers contrats d'assurance
                </CardDescription>
              </div>
              <Button variant="outline" size="sm">
                Voir tout
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {getTypeUser() == 1 &&
                contrats != null &&
                contrats!.map((contract: Contrat) => (
                  <div
                    key={Date.now() + contract.NumeroContrat}
                    className="p-6 hover:bg-slate-50 transition-colors cursor-pointer group"
                    onClick={() =>
                      router.push(`/contrat/${contract.NumeroContrat}/details`)
                    }
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-[#223268] rounded-lg flex items-center justify-center">
                          <FileText className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                            {contract.Produit}
                          </h3>
                          <p className="text-sm text-slate-500">
                            Contrat #{contract.NumeroContrat}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge
                          variant="secondary"
                          className="bg-green-100 text-green-800 border-green-200"
                        >
                          {contract.EtatPolice}
                        </Badge>
                        <p className="text-sm text-slate-500 mt-1">
                          Expire: {contract.DateFinPolice ?? "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

              {getTypeUser() == 2 &&
                conventions != null &&
                conventions!.map((contract: Convention) => (
                  <div
                    key={Date.now() + contract.NUMERO_DE_CONVENTION}
                    className="p-6 hover:bg-slate-50 transition-colors cursor-pointer group"
                    onClick={() =>
                      router.push(
                        `/conventions/${contract.NUMERO_DE_CONVENTION}/details`
                      )
                    }
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center">
                          <FileText className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                            {contract.LIBELLE_CONVENTION}
                          </h3>
                          <p className="text-sm text-slate-500">
                            Contrat #{contract.NUMERO_DE_CONVENTION}
                          </p>
                        </div>
                      </div>
                      {/* <div className="text-right">
                        <Badge
                          variant="secondary"
                          className="bg-green-100 text-green-800 border-green-200"
                        >
                          {contract.EtatPolice}
                        </Badge>
                        <p className="text-sm text-slate-500 mt-1">
                          Expire: {contract.DateFinPolice ?? "N/A"}
                        </p>
                      </div> */}
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-xl text-slate-900">
              Actions Rapides
            </CardTitle>
            <CardDescription>
              Accédez rapidement aux fonctionnalités principales
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                {
                  icon: FileText,
                  label: "Nouvelle Demande",
                  color: "blue",
                },
                { icon: Calendar, label: "Rendez-vous", color: "green" },
                { icon: Phone, label: "Contact Support", color: "purple" },
                { icon: Mail, label: "Messages", color: "orange" },
              ].map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="h-20 flex-col space-y-2 hover:shadow-md transition-all duration-200 group"
                >
                  <action.icon className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  <span className="text-sm">{action.label}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
