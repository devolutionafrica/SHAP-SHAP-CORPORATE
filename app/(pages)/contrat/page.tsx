"use client";

import React, { useState, useMemo, useEffect } from "react";
import dayjs from "dayjs";
import { motion, AnimatePresence } from "framer-motion";

// Composants Shadcn UI ou similaires
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableColumn,
} from "@/components/ui/table2"; // Assurez-vous que ce chemin est correct pour votre projet
import { Button as MuiButton, Skeleton as MuiSkeleton } from "@mui/material"; // Pour les boutons de pagination et les squelettes
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  Book, // Icône pour l'en-tête principal
  FileWarning, // Icône pour l'état d'erreur
  ClipboardList, // Icône pour l'état de tableau vide
  FileText, // Icône pour le produit dans le tableau
} from "lucide-react";
import { Badge } from "@/components/ui/badge"; // Composant de badge pour le statut

import { Contrat } from "@/app/Types/type";
import { useContratContext } from "@/hooks/contexts/useContratContext";
import { useUser } from "@/hooks/contexts/userContext";
import { useContrat } from "@/hooks/useContrat";

import { useRouter } from "next/navigation";

const tableHeaders = [
  { key: "Produit", label: "Produit" },
  { key: "NumeroContrat", label: "Numéro" },
  { key: "DateDebutPolice", label: "Début" },
  { key: "DateFinPolice", label: "Fin" },
  { key: "PeriodicieCotisation", label: "Périodicité" },
  { key: "EtatPolice", label: "Statut" },
];

const TableRowSkeleton = ({ columns }: { columns: number }) => (
  <TableRow className="animate-pulse bg-gray-100 h-12">
    {Array.from({ length: columns }).map((_, i) => (
      <TableCell key={i}>
        <MuiSkeleton variant="text" width="80%" height={20} />
      </TableCell>
    ))}
  </TableRow>
);

export default function ContratPage() {
  const contratLoad = useContrat();
  const { contrats, handleLoadContrat } = useContratContext();
  const { getTypeUser, labelType } = useUser(); // Contexte pour les informations utilisateur
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Nombre d'éléments par page, peut être configuré
  const [searchTerm, setSearchTerm] = useState("");

  const handleGotoDetails = (id: string) => {
    if (getTypeUser() == 2) {
      router.push(`/conventions/${id}/details`);
    } else {
      router.push(`/contrat/${id}/details`);
    }
  };

  const filteredContrats = useMemo(() => {
    if (!contrats) return [];
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return contrats.filter((contract) =>
      Object.values(contract).some(
        (value) =>
          (typeof value === "string" || typeof value === "number") &&
          String(value).toLowerCase().includes(lowerCaseSearchTerm)
      )
    );
  }, [contrats, searchTerm]);

  const totalPages = Math.ceil(filteredContrats.length / itemsPerPage);

  const currentContrats = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredContrats.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredContrats, currentPage, itemsPerPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  useEffect(() => {
    handleLoadContrat();
  }, []);

  useEffect(() => {
    handleLoadContrat();
    setCurrentPage(1);
  }, [searchTerm]);

  const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.3,
        ease: "easeOut",
      },
    }),
    exit: {
      opacity: 0,
      x: -20,
      transition: { duration: 0.2, ease: "easeOut" },
    },
  };

  return (
    <div className="w-full md:mx-auto  md:p-6 md:lg:p-8">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-100">
        <div className="p-6 bg-gradient-to-r from-[#223268] to-[#1a254f] text-white flex items-center justify-between flex-wrap gap-4 rounded-t-xl">
          <h1 className="text-2xl md:text-3xl font-extrabold flex items-center gap-4">
            <Book className="w-8 h-8 text-blue-300" />
            {labelType()}
          </h1>
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5" />
            <Input
              type="text"
              placeholder="Rechercher par numéro de police..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-lg bg-white bg-opacity-20 text-white placeholder-gray-300 border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-300 ease-in-out w-full md:w-64"
            />
          </div>
        </div>

        {/* Conteneur du tableau avec défilement horizontal */}
        <div className="overflow-x-auto relative min-h-[300px]">
          <Table className="w-full divide-y divide-gray-200">
            <TableHeader className="bg-gray-50">
              <TableRow>
                {tableHeaders.map((header) => (
                  <TableColumn
                    key={header.key}
                    className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700"
                  >
                    {header.label}
                  </TableColumn>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100">
              <AnimatePresence mode="sync">
                {/* Affichage des squelettes de chargement */}
                {contratLoad.isLoading ? (
                  Array.from({ length: itemsPerPage }).map((_, index) => (
                    <TableRowSkeleton
                      key={index}
                      columns={tableHeaders.length}
                    />
                  ))
                ) : // Affichage du message d'erreur
                contratLoad.error ? (
                  <TableRow>
                    <TableCell
                      colSpan={tableHeaders.length}
                      className="text-center py-8 text-red-600 font-medium text-lg"
                    >
                      <FileWarning className="inline-block w-6 h-6 mr-2 text-red-500" />
                      Erreur lors du chargement des contrats. Veuillez
                      réessayer.
                    </TableCell>
                  </TableRow>
                ) : // Affichage du message "pas de données"
                filteredContrats.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={tableHeaders.length}
                      className="text-center py-8 text-gray-500 font-medium text-lg"
                    >
                      <ClipboardList className="inline-block w-6 h-6 mr-2 text-gray-400" />
                      {searchTerm
                        ? "Aucun contrat ne correspond à votre recherche."
                        : "Aucun contrat trouvé."}
                    </TableCell>
                  </TableRow>
                ) : (
                  // Affichage des contrats paginés
                  currentContrats.map((contract: Contrat, index) => (
                    <motion.tr
                      key={contract.NumeroContrat}
                      variants={rowVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      custom={index}
                      className="hover:bg-blue-50 border-b last:border-b-0 cursor-pointer transition-colors duration-200 ease-in-out"
                      onClick={() => handleGotoDetails(contract.NumeroContrat!)}
                    >
                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-medium">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-[#223268] rounded-lg flex items-center justify-center">
                            <FileText className="w-4 h-4 text-white" />
                          </div>
                          <span>{contract.Produit}</span>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                        {contract.NumeroContrat ?? ""}
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                        {contract.DateDebutPolice
                          ? dayjs(contract.DateDebutPolice).format("DD/MM/YYYY")
                          : ""}
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                        {contract.DateFinPolice
                          ? dayjs(contract.DateFinPolice).format("DD/MM/YYYY")
                          : ""}
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                        {contract.PeriodicieCotisation ?? ""}
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm">
                        <Badge
                          variant="secondary"
                          className={`
                            ${
                              contract.EtatPolice === "Actif"
                                ? "bg-green-100 text-green-800 border-green-200"
                                : contract.EtatPolice === "Résilié"
                                ? "bg-red-100 text-red-800 border-red-200"
                                : "bg-gray-100 text-gray-800 border-gray-200"
                            }
                            text-xs font-semibold px-2.5 py-0.5 rounded-full
                          `}
                        >
                          {contract.EtatPolice ?? ""}
                        </Badge>
                      </TableCell>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </TableBody>
          </Table>
        </div>

        {totalPages > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-center p-4 bg-gray-50 border-t border-gray-200 flex-wrap gap-4 rounded-b-xl">
            <span className="text-sm text-gray-600 font-semibold">
              Page {currentPage} sur {totalPages}
            </span>
            <div className="flex space-x-2">
              <MuiButton
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1 || contratLoad.isLoading}
                className="hidden sm:inline-flex px-3 py-2 text-sm font-medium rounded-md text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 transition-colors duration-200 items-center justify-center"
              >
                <ChevronsLeft className="h-4 w-4 mr-1" /> Premier
              </MuiButton>
              <MuiButton
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || contratLoad.isLoading}
                className="px-2 sm:px-3 py-2 text-sm font-medium rounded-md text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center"
              >
                <ChevronLeft className="h-4 w-4 mr-0 sm:mr-1" />{" "}
                <span className="hidden sm:inline">Précédent</span>
              </MuiButton>
              <MuiButton
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || contratLoad.isLoading}
                className="px-2 sm:px-3 py-2 text-sm font-medium rounded-md text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center"
              >
                <span className="hidden sm:inline">Suivant</span>{" "}
                <ChevronRight className="h-4 w-4 ml-0 sm:ml-1" />
              </MuiButton>
              <MuiButton
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages || contratLoad.isLoading}
                className="hidden sm:inline-flex px-3 py-2 text-sm font-medium rounded-md text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 transition-colors duration-200 items-center justify-center"
              >
                Dernier <ChevronsRight className="h-4 w-4 ml-1" />
              </MuiButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
