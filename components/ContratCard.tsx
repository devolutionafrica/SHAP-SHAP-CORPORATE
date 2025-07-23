import { FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { useContratContext } from "@/hooks/contexts/useContratContext";
import { useEffect } from "react";

import { useUserStore } from "@/store/userStore";
import { useRouter } from "next/navigation";
export default function ContratCard({}) {
  const {
    contrats,
    setContrats,
    conventions,
    setConvention,
    handleLoadConvention,
    handleLoadContrat,
  } = useContratContext();

  // const { getTypeUser, labelType } = useUser();
  const typeUser = useUserStore((state) => state.getTypeUser);
  const labelType = useUserStore((state) => state.getLabelType);
  const router = useRouter();

  useEffect(() => {
    console.log("Le type de personne connecté est ", typeUser());
    if (typeUser() == 1) {
      handleLoadContrat();
    }

    if (typeUser() == 2) {
      handleLoadConvention();
    }
  }, [, contrats, conventions, typeUser(), labelType]);

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
            {typeUser() == 1
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
                router.push(typeUser() == 1 ? "/contrat" : "/conventions")
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
