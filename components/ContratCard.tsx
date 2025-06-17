import { FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { useContrat } from "@/hooks/useContrat";
import { useContratContext } from "@/hooks/contexts/useContratContext";
import { useEffect } from "react";
import { useConvention } from "@/hooks/useConvention";
import { useUser } from "@/hooks/contexts/userContext";
import { Contrat, Convention } from "@/app/Types/type";
import { useRouter } from "next/navigation";

export default function ContratCard({}) {
  const useContratQuery = useContrat();
  const {
    contrats,
    setContrats,
    conventions,
    setConvention,
    handleLoadConvention,
    handleLoadContrat,
  } = useContratContext();

  const { getTypeUser, labelType } = useUser();
  const router = useRouter();

  useEffect(() => {
    console.log("Le type de personne connecté est ", getTypeUser());
    if (getTypeUser() == 1) {
      handleLoadContrat();
    }

    if (getTypeUser() == 2) {
      handleLoadConvention();
    }
  }, [, contrats, conventions, getTypeUser()]);

  return (
    <div>
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all duration-300 cursor-pointer group h-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-blue-700">
            {labelType()} Actifs
          </CardTitle>
          <FileText className="h-6 w-6 text-blue-600 group-hover:scale-110 transition-transform" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-blue-900">
            {getTypeUser() == 1
              ? contrats != null && contrats!.length > 0
                ? contrats!.length
                : 0
              : conventions != null && conventions!.length > 0
              ? conventions!.length
              : 0}
          </div>
          <p className="text-xs text-blue-600 mt-1">
            Tous vos contrats sont à jour
          </p>
          <div className="mt-3">
            <Button
              variant="ghost"
              size="sm"
              className="text-blue-700 hover:bg-blue-200 p-0"
              onClick={() =>
                router.push(getTypeUser() == 1 ? "/contrat" : "/conventions")
              }
            >
              Voir les détails →
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
