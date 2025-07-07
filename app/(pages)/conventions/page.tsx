"use client";

import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableColumn,
} from "../../../components/ui/table2"; // Make sure this path is correct, consider if table2 is a typo or specific
import { Button as MuiButton, Skeleton as MuiSkeleton } from "@mui/material"; // Keep MUI Button for now, style with Tailwind
import "./style.scss"; // For global styles if needed
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search, // Added Search icon for input
  Book,
  FileWarning, // For error state icon
  ClipboardList, // For empty state icon
} from "lucide-react";
import { useConvention } from "@/hooks/useConvention"; // Corrected hook name from useContratByConvention
import { useParams, useRouter } from "next/navigation";
import { useContratContext } from "@/hooks/contexts/useContratContext";
import { Convention } from "@/app/Types/type";


const tableHeaders = [
  { key: "NUMERO_DE_CONVENTION", label: "N° Convention" },
  { key: "LIBELLE_CONVENTION", label: "Libellé Convention" },
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

export default function AdhesionTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [searchTerm, setSearchTerm] = useState("");

  const param = useParams();
  const id = param.id as string;
  const loaderConvention = useConvention(); // Corrected variable name
  const router = useRouter();
  const { handleLoadConvention, conventions } = useContratContext();

  // Filter conventions based on search term
  const filteredConventions = useMemo(() => {
    if (!conventions) return [];
    return conventions.filter((convention) =>
      Object.values(convention).some(
        (value) =>
          typeof value === "string" &&
          value.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [conventions, searchTerm]);

  const totalPages = Math.ceil(filteredConventions.length / itemsPerPage);

  const currentConventions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredConventions.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredConventions, currentPage, itemsPerPage]);

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

    setCurrentPage(1);
  }, [id, searchTerm]);

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
    <div className="w-full mx-auto p-4 md:p-6 lg:p-8">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-100">
        <div className="p-6 bg-gradient-to-r from-[#223268] to-[#1a254f] text-white flex items-center justify-between flex-wrap gap-4 rounded-t-xl">
          <h1 className="text-2xl md:text-3xl font-extrabold flex items-center gap-4">
            <Book className="w-8 h-8 text-blue-300" />
            Liste de vos conventions
          </h1>
          <div className="relative w-full sm:w-auto">
            {" "}
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5" />
            <Input
              type="text"
              placeholder="Rechercher une convention..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-lg bg-white bg-opacity-20 text-white placeholder-gray-300 border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-300 ease-in-out w-full md:w-64"
            />
          </div>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto relative min-h-[300px]">
          {" "}
          <Table className="w-full divide-y divide-gray-200">
            <TableHeader className="bg-[#223268] text-white">
              <TableRow>
                {tableHeaders.map((header) => (
                  <TableColumn
                    key={header.key}
                    className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-white"
                  >
                    {header.label}
                  </TableColumn>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100">
              <AnimatePresence mode="sync">
                {" "}
                {/* Use sync mode for consistent rendering */}
                {loaderConvention.isLoading ? (
                  Array.from({ length: itemsPerPage }).map((_, index) => (
                    <TableRowSkeleton
                      key={index}
                      columns={tableHeaders.length}
                    />
                  ))
                ) : loaderConvention.error ? (
                  <TableRow>
                    <TableCell
                      colSpan={tableHeaders.length}
                      className="text-center py-8 text-red-600 font-medium text-lg"
                    >
                      <FileWarning className="inline-block w-6 h-6 mr-2 text-red-500" />
                      Erreur lors du chargement des conventions. Veuillez
                      réessayer.
                    </TableCell>
                  </TableRow>
                ) : filteredConventions.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={tableHeaders.length}
                      className="text-center py-8 text-gray-500 font-medium text-lg"
                    >
                      <ClipboardList className="inline-block w-6 h-6 mr-2 text-gray-400" />
                      {searchTerm
                        ? "Aucune convention ne correspond à votre recherche."
                        : "Aucune convention trouvée."}
                    </TableCell>
                  </TableRow>
                ) : (
                  currentConventions.map((adhesion: Convention, index) => (
                    <motion.tr
                      key={index}
                      variants={rowVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      custom={index}
                      className="hover:bg-blue-50 border-b last:border-b-0 cursor-pointer transition-colors duration-200 ease-in-out"
                      onClick={() => gotoDetails(adhesion.NUMERO_DE_CONVENTION)}
                    >
                      {tableHeaders.map((header) => (
                        <TableCell
                          key={header.key}
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-medium"
                        >
                          {(adhesion[
                            header.key as keyof Convention
                          ] as React.ReactNode) || ""}
                        </TableCell>
                      ))}
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
              {/* Bouton Premier : Masqué sur les très petits écrans, visible à partir de 'sm' */}
              <MuiButton
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1 || loaderConvention.isLoading}
                className="hidden sm:inline-flex px-3 py-2 text-sm font-medium rounded-md text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 transition-colors duration-200 items-center justify-center"
              >
                <ChevronsLeft className="h-4 w-4 mr-1" /> Premier
              </MuiButton>

              {/* Bouton Précédent : Texte masqué sur les très petits écrans, icône seule */}
              <MuiButton
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || loaderConvention.isLoading}
                className="px-2 sm:px-3 py-2 text-sm font-medium rounded-md text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center"
              >
                <ChevronLeft className="h-4 w-4 mr-0 sm:mr-1" />{" "}
                <span className="hidden sm:inline">Précédent</span>
              </MuiButton>

              {/* Bouton Suivant : Texte masqué sur les très petits écrans, icône seule */}
              <MuiButton
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={
                  currentPage === totalPages || loaderConvention.isLoading
                }
                className="px-2 sm:px-3 py-2 text-sm font-medium rounded-md text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center"
              >
                <span className="hidden sm:inline">Suivant</span>{" "}
                <ChevronRight className="h-4 w-4 ml-0 sm:ml-1" />
              </MuiButton>

              {/* Bouton Dernier : Masqué sur les très petits écrans, visible à partir de 'sm' */}
              <MuiButton
                onClick={() => handlePageChange(totalPages)}
                disabled={
                  currentPage === totalPages || loaderConvention.isLoading
                }
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
