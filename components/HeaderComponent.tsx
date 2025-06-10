"use client"; // Conserver cette directive

import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Bell,
  FileText,
  MapPin,
  User,
  TrendingUp,
  Calendar,
  Shield,
  Phone,
  Mail,
  Settings,
  LogOut,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation"; // <-- Importez usePathname
import { useUser } from "@/hooks/contexts/userContext";
import { useAuthContext } from "@/hooks/contexts/authContext";
import Profile from "/public/Login.svg";
import Image from "next/image";

export default function HeaderComponent({}: {}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, getTypeUser, labelType } = useUser();
  const { isAuth } = useAuthContext();

  const handleDeconnexion = () => {
    document.cookie = "isAuth=; Max-Age=0; path=/";
    localStorage.removeItem("token");
    router.push("/login");
  };

  const tabUrl = [
    { name: "Accueil", url: "/dashboard", icon: TrendingUp },
    {
      name: `${labelType()}`,
      url: `${getTypeUser() == 1 ? "/contrat" : "/conventions"}`,
      icon: FileText,
    },
    { name: "Mon Profil", url: "/profil", icon: User },
    { name: "Nos Agences", url: "/agences", icon: MapPin },
  ];

  const [activeTab, setActiveTab] = useState("Accueil");

  // Met à jour la tabulation active en fonction du chemin actuel de l'URL
  useEffect(() => {
    const matchingTab = tabUrl.find((item) => pathname.startsWith(item.url));
    if (matchingTab) {
      setActiveTab(matchingTab.name);
    } else {
      // Optionnel: définir une tabulation par défaut si aucune correspondance n'est trouvée
      setActiveTab("Accueil");
    }
  }, [pathname]); // Se déclenche à chaque changement de chemin d'URL

  const handleNavigate = (url: string, name: string) => {
    setActiveTab(name);
    router.push(url);
  };

  // L'useEffect pour `user` peut être conservé si vous avez d'autres logiques liées à l'utilisateur
  useEffect(() => {}, [user]);

  return (
    <div>
      {/* En-tête Moderne */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <div
                className="flex items-center space-x-3 cursor-pointer "
                onClick={() => router.push("/")}
              >
                <div className="w-8 h-8 bg-[#223268] rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-[#223268]">
                  NSIA ASSURANCE
                </span>
              </div>

              <nav className="hidden md:flex space-x-6">
                {tabUrl.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => handleNavigate(item.url, item.name)}
                    className={`flex items-center text-[12px] space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                      activeTab === item.name
                        ? "bg-[#1b338570] text-blue-700 font-medium"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </button>
                ))}
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3 pl-4 border-l border-slate-200">
                <Avatar className=" !bg-[#ca9a2c] justify-center items-center">
                  <User color="white" />
                </Avatar>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-slate-900">
                    {user?.NOM_CLIENT || "Nom Utilisateur"}
                  </p>
                  <p className="text-xs text-slate-500">
                    {user?.PROFESSION || " "}
                  </p>
                </div>
                <Button variant="ghost" size="icon">
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
              <Button
                variant="ghost"
                className="relative flex flex-col"
                onClick={() => handleDeconnexion()}
              >
                <LogOut className="w-5 h-5" />
                <span className="text-[9px]">Déconnexion</span>
              </Button>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}
