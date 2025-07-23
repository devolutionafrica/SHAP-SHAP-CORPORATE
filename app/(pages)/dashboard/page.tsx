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
import { useAgenceContext } from "@/hooks/contexts/useAgenceContext";
import { useContratContext } from "@/hooks/contexts/useContratContext";
import { useAgence } from "@/hooks/useAgence";
import { useUserInfo } from "@/hooks/useUserInfo";
import { Calendar, FileText, Mail, MapPin, Phone, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ButtonOutline } from "./component/ButtonOutline";
import { useUserStore } from "@/store/userStore";
import { motion } from "framer-motion";
import { useTauxEngagement } from "@/hooks/useEngagement";

export default function DashboardPage() {
  const userinfo = useUserInfo();
  const setUser = useUserStore((state) => state.setUser);
  const user = useUserStore((state) => state.user);
  const setTypeUtilisateur = useUserStore((state) => state.setTypeUtilisateur);
  const percentProfile = useUserStore((state) => state.percentProfile);
  const setPercentProfile = useUserStore((state) => state.setPercentProfile);
  const getTypeUser = useUserStore((state) => state.getTypeUser);
  const labelType = useUserStore((state) => state.getLabelType);
  const setLabelType = useUserStore((state) => state.setLabelType);
  const setHeaderLabel = useUserStore((state) => state.setHeaderLabel);
  const setUsername = useUserStore((state) => state.username);
  const setEngagement = useUserStore((state) => state.setTauxEngagement);
  const engagement = useUserStore((state) => state.tauxEngagement);
  const {
    contrats,
    conventions,
    handleLoadConvention,
    handleLoadContrat,
    totalContratConvention,
  } = useContratContext();

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
    userinfo
      .refetch()
      .then((result) => {
        if (result.data) {
          setUser(result.data.data);
          setPercentProfile!(result.data.pourcentage);

          if (user) {
            localStorage.setItem(
              "type_user",
              formatTypeUser(user.CIVILITE).toString()
            );

            setTypeUtilisateur(formatTypeUser(user.CIVILITE));
            setLabelType!(
              formatTypeUser(user.CIVILITE) == 1
                ? "Mes Contrats"
                : formatTypeUser(user.CIVILITE) == 2
                ? "Mes Conventions"
                : "Chargement ..."
            );
            setHeaderLabel!(
              formatTypeUser(user.CIVILITE) == 1
                ? "Mes Contrats"
                : formatTypeUser(user.CIVILITE) == 2
                ? "Mes Conventions"
                : "Chargement ..."
            );
          }
        }
      })
      .catch((error) => {
        console.error("Error loading user data:", error);
        alert("Erreur lors du chargement des données utilisateur.");
      });
  };

  const useEngagement = useTauxEngagement();

  const agenceQuery = useAgence();
  const router = useRouter();
  const handleLoadAgences = async () => {
    await agenceQuery
      .refetch()
      .then((result) => {
        if (result.data) {
          setAgence(result.data.agences);
        }
      })
      .catch((error) => {
        console.error("Error loading agences:", error);
        alert("Erreur lors du chargement des agences.");
      });
  };
  const loadEngagement = async () => {
    await useEngagement
      .refetch()
      .then((result) => {
        if (result.data) {
          console.log("Taux d'engagement :", result.data.data);
          // alert(result.data.data);
          setEngagement(+result.data.data * 100);
        }
      })
      .catch((e) => {
        console.error("Mon erreur ", e);
      });
  };

  useEffect(() => {
    handleLoadUserData();
    handleLoadAgences();
    loadEngagement();
    handleLoadConvention();
    handleLoadContrat();
  }, [getTypeUser(), user, contrats, conventions]);

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
    <main className="max-w-7xl mx-auto md:px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-4"
        >
          <h1 className="text-xl md:text-4xl font-bold text-slate-900">
            Bienvenue,{" "}
            <span className="text-[#223268] bg-clip-text">
              {user?.NOM_CLIENT || "Utilisateur"}
            </span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Gérez vos contrats d'assurance, consultez vos informations et restez
            connecté avec nos services.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {getTypeUser() == 1 && (
            // <motion.div>
            <Card className="bg-gradient-to-br from-yellow-200 to-yellow-100 border-yellow-400 hover:shadow-lg transition-all duration-300 cursor-pointer group">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-yellow-800">
                  Mon Taux d'engagement
                </CardTitle>
                <MapPin className="h-6 w-6 text-yellow-600 group-hover:scale-110 transition-transform" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-yellow-900">
                  {Math.floor(engagement ?? 0)} %
                </div>
                <p className="text-xs text-yellow-800 mt-1">
                  Nombre total de tous les contrats pour les conventions
                </p>
                <div className="mt-3"></div>
              </CardContent>
            </Card>
            // </motion.div>
          )}

          <ContratCard />

          {getTypeUser() == 2 && (
            // <motion.div>
            <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 hover:shadow-lg transition-all duration-300 cursor-pointer group">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-yellow-700">
                  Nombre Total des contrats
                </CardTitle>
                <MapPin className="h-6 w-6 text-yellow-600 group-hover:scale-110 transition-transform" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-yellow-900">
                  {totalContratConvention}
                </div>
                <p className="text-xs text-yellow-600 mt-1">
                  Nombre total de tous les contrats pour les conventions
                </p>
                <div className="mt-3"></div>
              </CardContent>
            </Card>
            // </motion.div>
          )}
          {/* <motion.div
            initial={{ opacity: 0, scale: 1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="h-full"
          > */}
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
                  onClick={() => router.push("/agences")}
                >
                  Localiser →
                </Button>
              </div>
            </CardContent>
          </Card>
          {/* </motion.div> */}

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
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
                <Button
                  onClick={() => router.push("/profil")}
                  className="bg-purple-100 text-purple-500 my-2 hover:bg-purple-400 hover:text-black"
                >
                  Compléter →
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl text-slate-900">
                  {labelType()}
                </CardTitle>
                <CardDescription className="text-slate-600">
                  Vos{" "}
                  {getTypeUser() == 1
                    ? "derniers contrats"
                    : " dernières Conventions"}{" "}
                  d'assurance
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  router.push(getTypeUser() == 2 ? "/conventions" : "/contrat")
                }
              >
                Voir tout
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {getTypeUser() == 1 &&
                contrats != null &&
                contrats.slice(0, 8)!.map((contract: Contrat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
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
                            {getTypeUser() == 1 ? "Contrat" : "Convention"}#
                            {contract.NumeroContrat}
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
                          Expire:{" "}
                          {contract.DateFinPolice
                            ? new Date(
                                contract.DateFinPolice
                              ).toLocaleDateString()
                            : ""}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}

              {getTypeUser() == 2 &&
                conventions != null &&
                conventions!.slice(0, 6).map((contract: Convention, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="p-6 hover:bg-slate-50 transition-colors cursor-pointer group"
                    onClick={() =>
                      router.push(
                        `/conventions/${contract.NUMERO_DE_CONVENTION}/details`
                      )
                    }
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-[#223268] rounded-lg flex items-center justify-center">
                          <FileText className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                            {contract.LIBELLE_CONVENTION}
                          </h3>
                          <p className="text-sm text-slate-500">
                            Convention #{contract.NUMERO_DE_CONVENTION}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>
          </CardContent>
        </Card>

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
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.15 }}
                >
                  <Button
                    variant="outline"
                    className="h-20 flex-col space-y-2 hover:shadow-md transition-all duration-200 group w-full"
                  >
                    <action.icon className="w-6 h-6 group-hover:scale-110 transition-transform" />
                    <span className="text-sm">{action.label}</span>
                  </Button>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
