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
  Menu as MenuIcon,
  X as CloseIcon,
  SubscriptIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUser } from "@/hooks/contexts/userContext";
import { useAuthContext } from "@/hooks/contexts/authContext";

import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { useContratContext } from "@/hooks/contexts/useContratContext";
import Image from "next/image";
import logo from "@/public/nsiavie.png";
import { useUserStore } from "@/store/userStore";
export default function HeaderComponent({}: {}) {
  const router = useRouter();
  const pathname = usePathname();
  // const { user, getTypeUser, labelType } = useUser();
  const { isAuth } = useAuthContext();

  const { initializeData } = useContratContext();

  // État pour gérer l'ouverture/fermeture du menu mobile
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const setTypeUser = useUserStore((state) => state.setTypeUtilisateur);
  const setLabelUser = useUserStore((state) => state.setLabelType);
  const setHeaderLabel = useUserStore((state) => state.setHeaderLabel);
  const handleDeconnexion = () => {
    document.cookie = "isAuth=; Max-Age=0; path=/";
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("type_user");
    setTypeUser(undefined);
    setLabelUser!(undefined);
    setHeaderLabel!("Chargement ...");
    initializeData();
    router.push("/login");
  };

  //data zustand
  const typeUser = useUserStore((state) => state.getTypeUser);
  const labelType = useUserStore((state) => state.getLabelType);
  const type = useUserStore((state) => state.typeUtilisateur);
  const user = useUserStore((state) => state.user);
  const headerLabel = useUserStore((state) => state.headerLabel);
  const activeTab = useUserStore((state) => state.activeTab);
  const setActiveTab = useUserStore((state) => state.setActiveTab);
  const tabUrl = [
    { name: "Accueil", url: "/dashboard", icon: TrendingUp },
    {
      name: `${headerLabel}`,
      url: `${typeUser() == 1 ? "/contrat" : "/conventions"}`,
      icon: FileText,
    },
    // { name: "Souscription", url: "/suscription", icon: SubscriptIcon },
    { name: "Mon Profil", url: "/profil", icon: User },
    { name: "Nos Agences", url: "/agences", icon: MapPin },
    { name: "Paramètres", url: "/settings", icon: Settings }, // Ajouté pour l'exemple
    // Ajouté pour la déconnexion dans le menu mobile
    {
      name: "Déconnexion",
      url: "/logout",
      icon: LogOut,
      action: handleDeconnexion,
    },
  ];

  // const [activeTab, setActiveTab] = useState("Accueil");
  useEffect(() => {
    const matchingTab = tabUrl.find((item) => pathname.startsWith(item.url));

    if (matchingTab) {
      if (matchingTab.name.includes("Chargement")) {
        console.log("active tab 2: ", activeTab);
      } else {
        setActiveTab(matchingTab.name);
      }
    }
  }, [pathname, typeUser(), activeTab]);

  const handleNavigate = (url: string, name: string) => {
    setActiveTab(name);
    router.push(url);
    setIsMobileMenuOpen(false); // Ferme le menu mobile après navigation
  };

  return (
    <div className="sticky top-0 z-50 ">
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 !bg-[#223268] rounded-b-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <div
                className="flex items-center space-x-3 cursor-pointer"
                onClick={() => router.push("/")}
              >
                <div className="w-12 h-12 bg-[#223268] rounded-lg flex items-center justify-center">
                  <Image
                    src={logo}
                    alt="logo"
                    width={48}
                    height={58}
                    objectFit="cover"
                  />
                </div>
                <span className="md:text-xl font-bold text-[#ffffff] whitespace-nowrap">
                  NSIA ASSURANCE
                </span>
              </div>

              {/* Navigation Desktop */}
              <nav className="hidden md:flex space-x-6">
                {tabUrl
                  .filter(
                    (item) =>
                      item.name !== "Déconnexion" && item.name !== "Paramètres"
                  )
                  .map(
                    (
                      item // Filtrer Déconnexion/Paramètres ici car ils ont un emplacement spécifique sur desktop
                    ) =>
                      type == 2 && item.name == "Mon Profil" ? (
                        ""
                      ) : (
                        <button
                          key={item.name}
                          onClick={() => handleNavigate(item.url, item.name)}
                          className={`flex items-center text-[12px] space-x-2 px-2 py-2 rounded-3xl transition-all duration-200 ${
                            activeTab === item.name
                              ? "bg-[#c4c4c470] text-white font-medium "
                              : "text-white hover:text-white hover:bg-[#c4c4c470]"
                          }`}
                        >
                          <item.icon className="w-4 h-4 text-white" />
                          <span className="text-white">
                            {item.name.toUpperCase()}
                          </span>
                        </button>
                      )
                  )}
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              {/* Profil et Déconnexion Desktop */}
              <div className="hidden md:flex items-center space-x-4 cursor-pointer">
                <div
                  className="flex items-center space-x-3 pl-4 border-l border-slate-200"
                  onClick={() => router.push("/profil")}
                >
                  <Avatar className=" !bg-[#ca9a2c] justify-center items-center">
                    <User color="white" />
                  </Avatar>
                  <div className="hidden sm:block">
                    <p className="text-sm font-medium text-white">
                      {user?.NOM_CLIENT || "Nom Utilisateur"}
                    </p>
                    <p className="text-xs text-white">
                      {user?.PROFESSION || " "}
                    </p>
                  </div>
                  <Button variant="ghost" size="icon">
                    <Settings className="w-4 h-4 text-white" />
                  </Button>
                </div>
                <div className="">
                  <Button
                    variant="ghost"
                    className="relative flex flex-col items-center justify-center text-white"
                    onClick={handleDeconnexion}
                  >
                    <LogOut className="" />
                    <span className="text-[9px] text-white">Déconnexion</span>
                  </Button>
                </div>
              </div>

              {/* Bouton pour menu mobile (visible sur écrans petits) */}
              <div className="md:hidden flex items-center">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-2 text-white hover:text-slate-900 hover:bg-slate-100 rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                  aria-controls="mobile-menu"
                  aria-expanded={isMobileMenuOpen}
                >
                  {isMobileMenuOpen ? (
                    <CloseIcon className="h-6 w-6" aria-hidden="true" />
                  ) : (
                    <MenuIcon className="h-6 w-6" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Menu mobile (Transition de Headless UI pour l'animation) */}
        <Transition
          show={isMobileMenuOpen}
          as={Fragment}
          enter="transition ease-out duration-200 transform"
          enterFrom="opacity-0 scale-95 -translate-y-2"
          enterTo="opacity-100 scale-100 translate-y-0"
          leave="transition ease-in duration-150 transform"
          leaveFrom="opacity-100 scale-100 translate-y-0"
          leaveTo="opacity-0 scale-95 -translate-y-2"
        >
          <div className="md:hidden" id="mobile-menu">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-slate-200">
              {tabUrl.map((item) =>
                typeUser() == 2 && item.name == "Mon Profil" ? (
                  ""
                ) : (
                  <button
                    key={item.name}
                    onClick={() =>
                      item.action
                        ? item.action()
                        : handleNavigate(item.url, item.name)
                    }
                    className={`flex items-center w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                      activeTab === item.name
                        ? "bg-[#1b338570] text-blue-700"
                        : "text-white hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    <item.icon className="h-5 w-5 mr-3" aria-hidden="true" />
                    {item.name}
                  </button>
                  // <div>ok</div>
                )
              )}
              {/* Afficher les infos utilisateur dans le menu mobile aussi */}
              <div
                className="mt-4 pt-4 border-t border-slate-200 flex items-center px-3 py-2 space-x-3 cursor-pointer"
                onClick={() => {
                  router.push("/profil");
                  setIsMobileMenuOpen(false);
                }}
              >
                <Avatar className="!bg-[#ca9a2c] justify-center items-center">
                  <User color="white" />
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    {user?.NOM_CLIENT || "Nom Utilisateur"}
                  </p>
                  <p className="text-xs text-slate-500">
                    {user?.PROFESSION || " "}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </header>
    </div>
  );
}
