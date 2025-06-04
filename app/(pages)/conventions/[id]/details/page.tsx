// components/AdhesionTable.tsx
"use client";

import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";

import { Adhesion, allAdhesions } from "../../../contrat/[id]/lib/data"; // Assurez-vous que le chemin est correct
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableColumn,
} from "../../../../../components/ui/table2"; // Assurez-vous que le chemin est correct
import { Button, Skeleton } from "@mui/material";
import "./style.scss";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { useContratByConvention } from "@/hooks/useContratByConvention";
import { useParams } from "next/navigation";
import { InfoPolice } from "@/app/Types/type";

// Headers du tableau pour un affichage plus lisible
const tableHeaders = [
  { key: "NomAssure", label: "Nom" },
  { key: "PrenomsAssure", label: "Prénom" },
  { key: "NUMERO_POLICE", label: "N° Contrat" },
  { key: "DATE_DEBUT_POLICE", label: "Date Début Police" },
  { key: "PERIODICITE_COTISATION", label: "Périodicité Cotisation" },
  { key: "EtatPolice", label: "État Police" },
];

export default function AdhesionTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = 10;

  const param = useParams();
  const id = param.id as string;
  const loaderContrat = useContratByConvention(id);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const [contrats, setContrats] = useState<InfoPolice[] | null>(null);

  const getContratByConvention = async () => {
    await loaderContrat
      .refetch()
      .then((response) => {
        setContrats(response.data.data as InfoPolice[]);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    getContratByConvention();
  }, [id]);

  return (
    <div className="w-full shadow-lg border border-gray-200 rounded overflow-hidden details-convention ">
      <div className="p-4 sm:p-6 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg sm:text-xl font-bold text-gray-800">
          Liste des adhésions
        </h3>
        <span className="text-md sm:text-lg font-semibold text-gray-700">
          Nombre total adhésion: {10}
        </span>
      </div>
      <div className="flex flex-col  m-4 gap-2">
        <h3 className="font-serif">Rechercher un contrat</h3>
        <div className="flex flex-row gap-2 items-end">
          <div>
            <label htmlFor="">Nom scripteur</label>
            <Input className="max-w-[220px]" />
          </div>
          ou
          <div>
            <label htmlFor="">Numéro police</label>
            <Input className="max-w-[220px]" />
          </div>
          <div>
            <Button>Rechercher</Button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto relative">
        <Table className="min-w-full divide-y divide-gray-200">
          <TableHeader className="bg-gray-100">
            <TableRow>
              {tableHeaders.map((header) => (
                <TableColumn
                  key={header.key}
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  {header.label}
                </TableColumn>
              ))}
            </TableRow>
          </TableHeader>
          <AnimatePresence mode="wait">
            {loaderContrat.isLoading && <Skeleton />}
            {contrats && (
              <TableBody>
                {contrats.map((adhesion, index) => (
                  <motion.tr
                    key={adhesion.NUMERO_POLICE || index}
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
                        {header.key === "ETAT_POLICE" ? (
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                            ${
                              adhesion.EtatPolice === "ACTIF"
                                ? "bg-green-100 text-green-800"
                                : adhesion.EtatPolice === "SUSPENDU"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {adhesion.EtatPolice}
                          </span>
                        ) : (
                          (adhesion[
                            header.key as keyof InfoPolice
                          ] as React.ReactNode) || "N/A"
                        )}
                      </TableCell>
                    ))}
                  </motion.tr>
                ))}
              </TableBody>
            )}

            {loaderContrat.error && (
              <div>
                <span>Error de chargement des contrats</span>
              </div>
            )}
            {loaderContrat.data && contrats?.length == 0 && (
              <div>Aucun contrat trouvé</div>
            )}
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
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className="hidden sm:flex"
            >
              <ChevronsLeft className="h-4 w-4" /> Premier
            </Button>
            <Button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" /> Précédent
            </Button>
            <Button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Suivant <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              className="hidden sm:flex"
            >
              Dernier <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
