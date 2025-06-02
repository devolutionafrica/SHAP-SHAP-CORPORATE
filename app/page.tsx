"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
} from "lucide-react";
import HeaderComponent from "@/components/HeaderComponent";
import ProfilPage from "./(pages)/profil/page";
import Agence from "./(pages)/agence/agence";
import ContratPage from "./(pages)/contrat/page";
import DashboardPage from "./(pages)/dashboard/page";
import { useAuthContext } from "@/hooks/contexts/authContext";
import "@/lib/api/setup";
import { useUser } from "@/hooks/contexts/userContext";
import { useUserInfo } from "@/hooks/useUserInfo";
import { useRouter } from "next/navigation";
import AgencePage from "./(pages)/agence/agence";
export default function ModernDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-2">
      <HeaderComponent activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}

      <div className="content p-8">
        {activeTab === "dashboard" && <DashboardPage />}

        {activeTab === "contracts" && <ContratPage />}

        {activeTab === "profile" && <ProfilPage />}

        {activeTab === "agencies" && <AgencePage />}
      </div>
    </div>
  );
}
