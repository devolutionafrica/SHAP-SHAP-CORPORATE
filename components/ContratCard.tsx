import { FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { useContrat } from "@/hooks/useContrat";
import { useContratContext } from "@/hooks/contexts/useContratContext";
import { useEffect } from "react";
import { useConvention } from "@/hooks/useConvention";
import { useUser } from "@/hooks/contexts/userContext";
import { Convention } from "@/app/Types/type";

export default function ContratCard({}) {
  const useContratQuery = useContrat();
  const {
    contrats,
    setContrats,
    conventions,
    setConvention,
    handleLoadConvention,
  } = useContratContext();
  const loaderConvention = useConvention();

  const { getTypeUser, labelType } = useUser();

  const handleLoadContrats = async () => {
    await useContratQuery
      .refetch()
      .then((result) => {
        if (result.data) {
          setContrats(result.data.data);
        }
      })
      .catch((error) => {
        console.error("Error loading contrats:", error);
        alert("Erreur lors du chargement des contrats.");
      });
  };

  useEffect(() => {
    if (getTypeUser() == 1) {
      handleLoadContrats();
    } else {
      handleLoadConvention();
    }
  }, [contrats, conventions]);

  return (
    <div>
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all duration-300 cursor-pointer group">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-blue-700">
            {labelType() && "Actifs"}
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
            >
              Voir les détails →
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
