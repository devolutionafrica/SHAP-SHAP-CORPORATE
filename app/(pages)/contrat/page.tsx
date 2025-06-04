"use client";
import { Contrat } from "@/app/Types/type";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useContratContext } from "@/hooks/contexts/useContratContext";
import { useUser } from "@/hooks/contexts/userContext";
import { FileText } from "lucide-react";

import { useRouter } from "next/navigation";

export default function ContratPage() {
  const { contrats } = useContratContext();
  const { getTypeUser } = useUser();
  const router = useRouter();
  const handleGotoDetails = (id: string) => {
    if (getTypeUser() == 2) {
      router.push(`/conventions/${id}/details`);
    } else {
      router.push(`/contrat/${id}/details`);
    }
  };

  const { labelType } = useUser();

  return (
    <div className="space-y-6 ">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{labelType()}</h1>
          <p className="text-slate-600 mt-1">
            Gérez tous vos contrats d'assurance
          </p>
        </div>
        {/* <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
          Nouveau Contrat
        </Button> */}
      </div>

      <div className="flex flex-col">
        <label htmlFor="">
          Rechercher par police
          <input type="text" className="p-2 border-collapse" />
        </label>
      </div>

      <div className="shadow border-0">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#223268] text-white">
                <tr>
                  <th className="text-left p-4 font-semibold ">Produit</th>
                  <th className="text-left p-4 font-semibold ">Numéro</th>
                  <th className="text-left p-4 font-semibold ">Début</th>
                  <th className="text-left p-4 font-semibold ">Fin</th>
                  <th className="text-left p-4 font-semibold ">Périodicité</th>
                  <th className="text-left p-4 font-semibold">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {contrats != null &&
                  contrats.map((contract: Contrat) => (
                    <tr
                      key={contract.NumeroContrat}
                      onClick={() => handleGotoDetails(contract.NumeroContrat!)}
                      className="hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                            <FileText className="w-4 h-4 text-white" />
                          </div>
                          <span className="font-medium text-slate-900">
                            {contract.Produit}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-slate-600">
                        {contract.NumeroContrat ?? "NA"}
                      </td>
                      <td className="p-4 text-slate-600">
                        {contract.DateDebutPolice ?? "N/A"}
                      </td>
                      <td className="p-4 text-slate-600">
                        {contract.DateFinPolice ?? "N/A"}
                      </td>
                      <td className="p-4 text-slate-600">
                        {contract.PeriodicieCotisation ?? "N/A"}
                      </td>
                      <td className="p-4">
                        <Badge
                          variant="secondary"
                          className="bg-green-100 text-green-800 border-green-200"
                        >
                          {contract.EtatPolice ?? "N/A"}
                        </Badge>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </div>
    </div>
  );
}
