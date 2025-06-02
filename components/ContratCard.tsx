import { FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { useContrat } from "@/hooks/useContrat";
import { useContratContext } from "@/hooks/contexts/useContratContext";
import { useEffect } from "react";

export default function ContratCard({}) {
  const useContratQuery = useContrat();
  const { contrat, setContrat } = useContratContext();
  const handleLoadContrats = async () => {
    await useContratQuery
      .refetch()
      .then((result) => {
        if (result.data) {
          setContrat(result.data.data);
        }
      })
      .catch((error) => {
        console.error("Error loading contrats:", error);
        alert("Erreur lors du chargement des contrats.");
      });
  };

  useEffect(() => {
    handleLoadContrats();
  }, [contrat]);

  return (
    <div>
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all duration-300 cursor-pointer group">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-blue-700">
            Contrats Actifs
          </CardTitle>
          <FileText className="h-6 w-6 text-blue-600 group-hover:scale-110 transition-transform" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-blue-900">
            {contrat != null && contrat!.length > 0 ? contrat!.length : 0}
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
