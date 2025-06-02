"use client";
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
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/contexts/userContext";

export default function HeaderComponent({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}) {
  const router = useRouter();
  const handleDeconnexion = () => {
    document.cookie = "isAuth=; Max-Age=0; path=/";
    localStorage.removeItem("token");
    router.push("/login");
  };

  const { user } = useUser();

  useEffect(() => {}, [user]);

  return (
    <div>
      {/* Modern Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  NSIA Assurance
                </span>
              </div>

              <nav className="hidden md:flex space-x-6">
                {[
                  { id: "dashboard", label: "Accueil", icon: TrendingUp },
                  { id: "contracts", label: "Mes Contrats", icon: FileText },
                  { id: "profile", label: "Mon Profil", icon: User },
                  { id: "agencies", label: "Nos Agences", icon: MapPin },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                      activeTab === item.id
                        ? "bg-blue-100 text-blue-700 font-medium"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3 pl-4 border-l border-slate-200">
                <Avatar className="w-8 h-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" />
                  <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm">
                    DB
                  </AvatarFallback>
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
                className="relative flex  flex-col"
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
