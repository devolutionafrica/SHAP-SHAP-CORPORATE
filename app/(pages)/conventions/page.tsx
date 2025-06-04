// components/AdhesionTable.tsx
"use client";

import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";

import { Adhesion, allAdhesions } from "../../(pages)/contrat/[id]/lib/data"; // Assurez-vous que le chemin est correct
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableColumn,
} from "../../../components/ui/table2"; // Assurez-vous que le chemin est correct
import { Button, Skeleton } from "@mui/material";
import "./style.scss";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { useContratByConvention } from "@/hooks/useContratByConvention";
import { useParams, useRouter } from "next/navigation";

import { useContratContext } from "@/hooks/contexts/useContratContext";
import { useConvention } from "@/hooks/useConvention";
import { Convention } from "@/app/Types/type";
import { Book } from "lucide-react";

// Headers du tableau pour un affichage plus lisible
const tableHeaders = [
  { key: "NUMERO_DE_CONVENTION", label: "N° Convention" },
  { key: "LIBELLE_CONVENTION", label: "Libelle Convention" },
];

export default function AdhesionTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = 10;

  const param = useParams();
  const id = param.id as string;
  const loaderContrat = useConvention();
  const router = useRouter();
  const { handleLoadConvention, conventions } = useContratContext();

  const gotoDetails = (id: string) => {
    router.push(`/conventions/${id}/details`);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  useEffect(() => {
    handleLoadConvention();
  }, [id, conventions]);

  return (
    <div className="w-full  border border-gray-200 rounded overflow-hidden details-convention ">
      <div className="mt-11">
        <h1 className=" p-4 text-[28px] flex flex-row gap-5 items-center">
          <Book />
          Liste de vos conventions
        </h1>
      </div>

      <div className="overflow-x-auto relative">
        <Table className="min-w-full divide-y divide-gray-200">
          <TableHeader className="bg-[#223268] !text-white table-header">
            <TableRow>
              {tableHeaders.map((header) => (
                <TableColumn
                  key={header.key}
                  className="px-4 py-3 text-left text-xs font-semibold  uppercase tracking-wider"
                >
                  {header.label}
                </TableColumn>
              ))}
            </TableRow>
          </TableHeader>
          <AnimatePresence mode="wait">
            {loaderContrat.isLoading && <Skeleton />}
            {conventions && (
              <TableBody className="">
                {conventions.map((adhesion: Convention, index) => (
                  <motion.tr
                    key={adhesion.NUMERO_DE_CONVENTION || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="hover:bg-gray-50 border-b last:border-b-0"
                  >
                    {tableHeaders.map((header) => (
                      <TableCell
                        key={header.key}
                        className="px-4 whitespace-nowrap text-sm text-gray-800 my-6 hover:bg-blue-300"
                        onClick={() =>
                          gotoDetails(adhesion.NUMERO_DE_CONVENTION)
                        }
                      >
                        {/* {header.key === "ETAT_POLICE" ? (
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
                          
                        )} */}
                        <div className=" font-bold cursor-pointer ">
                          {(adhesion[
                            header.key as keyof Convention
                          ] as React.ReactNode) || "N/A"}
                        </div>
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
            {loaderContrat.data && conventions?.length == 0 && (
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
