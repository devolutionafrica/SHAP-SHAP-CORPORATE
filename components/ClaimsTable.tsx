// components/ClaimTable.tsx
"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

// CORRECTION 1: Enlève l'import de 'Claim' si vous utilisez 'Sinistre' exclusivement.
// import { Claim } from "@/app/(pages)/contrat/[id]/lib/data"; // Ce chemin pourrait être supprimé

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
// CORRECTION 2: Assurez-vous que le chemin vers votre table est correct (table ou table2)
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableColumn,
} from "./ui/table2"; // J'ai remis 'table', changez en 'table2' si nécessaire
import { Button } from "./ui/button";

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

import { Sinistre } from "@/app/Types/type"; // C'est le type que vous voulez utiliser

const tableHeaders = [
  { key: "NumeroBeneficiaire", label: "N° Bénéficiaire" },
  { key: "NumeroSinistre", label: "N° Sinistre" },
  { key: "LibelleSinistre", label: "Libellé Sinistre" },
  { key: "DateReglement", label: "Date Règlement" },
  { key: "MontantRegle", label: "Montant Réglé (TTC)" }, // Corrigé : utilise "MontantRegle" de Sinistre
  { key: "ModeReglement", label: "Mode Règlement" },
  { key: "CauseSinistre", label: "Cause Sinistre" },
  { key: "DateDeclaration", label: "Date Déclaration" }, // Corrigé : utilise "DateDeclaration" de Sinistre
];

// CORRECTION 6: Utiliser Sinistre pour les props du composant
interface ClaimTableProps {
  claims: Sinistre[];
}

export default function ClaimTable({ claims }: ClaimTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Nombre d'éléments par page

  const totalPages = Math.ceil(claims.length / itemsPerPage);

  const paginatedClaims = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return claims.slice(startIndex, endIndex);
  }, [claims, currentPage, itemsPerPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (claims.length === 0) {
    return (
      <Card className="w-full shadow-lg border border-gray-200 rounded-xl p-4">
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl font-bold text-gray-800">
            Tableau récapitulatif
          </CardTitle>
        </CardHeader>
        <CardContent></CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full shadow-lg border border-gray-200 rounded-xl overflow-hidden">
      <CardHeader className="p-4 sm:p-6 bg-gray-50 border-b border-gray-200">
        <CardTitle className="text-xl sm:text-2xl font-bold text-gray-800">
          Tableau récapitulatif des prestations
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto relative">
          <Table className="min-w-full divide-y divide-gray-200">
            <TableHeader className="bg-gray-100">
              <TableRow className="bg-[#223268]">
                {tableHeaders.map((header) => (
                  <TableColumn
                    key={header.key}
                    className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider"
                  >
                    {header.label}
                  </TableColumn>
                ))}
              </TableRow>
            </TableHeader>
            <AnimatePresence mode="wait">
              <TableBody>
                {paginatedClaims.map((claim, index) => (
                  <motion.tr
                    key={claim.NumeroSinistre || index} // Utilise NumeroSinistre de l'interface Sinistre
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="hover:bg-gray-50 border-b last:border-b-0"
                  >
                    {tableHeaders.map((header) => (
                      <TableCell
                        key={header.key}
                        className="px-4 py-3 whitespace-nowrap text-sm text-gray-800"
                      >
                        {/* CORRECTION 8: Accéder aux propriétés de 'claim' en utilisant les clés de 'tableHeaders' */}
                        {header.key === "MontantRegle" // Changé de "montantRegleTTC" à "MontantRegle"
                          ? `${claim[
                              header.key as keyof Sinistre
                            ]?.toLocaleString(
                              // Utilise Sinistre ici
                              "fr-FR",
                              {
                                style: "currency",
                                currency: "XOF",
                              }
                            )}`
                          : (claim[
                              header.key as keyof Sinistre // Utilise Sinistre ici
                            ] as React.ReactNode) || ""}
                      </TableCell>
                    ))}
                  </motion.tr>
                ))}
              </TableBody>
            </AnimatePresence>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="flex justify-between items-center p-4 bg-gray-50 border-t border-gray-200 flex-wrap gap-2">
            <span className="text-sm text-gray-600">
              Page {currentPage} sur {totalPages}
            </span>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className="hidden sm:flex"
              >
                <ChevronsLeft className="h-4 w-4" /> Premier
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" /> Précédent
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Suivant <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                className="hidden sm:flex"
              >
                Dernier <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
