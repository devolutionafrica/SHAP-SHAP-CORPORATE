// components/AdhesionTable.tsx
"use client";

import React, { useState, useMemo, useEffect, ChangeEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableColumn,
} from "../../../../../components/ui/table2";
import { Button, Button as MuiButton } from "@mui/material";
import { Skeleton as MuiSkeleton } from "@mui/material";
import "./style.scss";
import {
  Search,
  XCircle,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Book,
  FileWarning,
  ClipboardList,
} from "lucide-react";
import { useContratByConvention } from "@/hooks/useContratByConvention";
import { useParams, useRouter } from "next/navigation";
import { InfoPolice } from "@/app/Types/type";
import { useContratContext } from "@/hooks/contexts/useContratContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDate } from "@/app/(pages)/contrat/[id]/component/ContratInfoCard";
import dayjs from "dayjs";

const tableHeaders = [
  { key: "NomAssure", label: "Nom" },
  { key: "PrenomsAssure", label: "Prénom" },
  { key: "NUMERO_POLICE", label: "N° Contrat" },
  { key: "DateDebutPolice", label: "Date Début Police" },
  { key: "PERIODICITE_COTISATION", label: "Périodicité Cotisation" },
  { key: "EtatPolice", label: "État Police" },
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
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const param = useParams();
  const id = param.id as string;
  const loaderContrat = useContratByConvention(id);
  const { handleLoadConvention } = useContratContext();

  const router = useRouter();

  const [searchTermPolice, setSearchTermPolice] = useState("");
  const [searchTermName, setSearchTermName] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [initialContrats, setInitialContrats] = useState<InfoPolice[] | null>(
    null
  );
  const [filteredContrats, setFilteredContrats] = useState<InfoPolice[] | null>(
    null
  );

  useEffect(() => {
    const getContrat = async () => {
      await loaderContrat
        .refetch()
        .then((response) => {
          const fetchedContrats = response.data.data as InfoPolice[];
          console.log("Mes données :\n\n", response.data.data);
          setInitialContrats(fetchedContrats);
          setFilteredContrats(fetchedContrats);
          setCurrentPage(1);
        })
        .catch((e) => {
          console.error("Erreur lors du chargement des contrats:", e);
          setInitialContrats([]);
          setFilteredContrats([]);
        });
    };
    getContrat();
    handleLoadConvention();
  }, [id]);

  useEffect(() => {
    if (!initialContrats) return;

    let tempFiltered = initialContrats.filter((contrat) => {
      const hasSearchTerm = searchTermPolice !== "" || searchTermName !== "";

      if (!hasSearchTerm) {
        return true;
      }

      const policeMatch = searchTermPolice
        ? String(contrat.NUMERO_POLICE).includes(searchTermPolice)
        : false;

      const nameMatch = searchTermName
        ? String(contrat.NomAssure || "")
            .toLowerCase()
            .includes(searchTermName.toLowerCase()) ||
          String(contrat.PrenomsAssure || "")
            .toLowerCase()
            .includes(searchTermName.toLowerCase())
        : false;

      return policeMatch || nameMatch;
    });

    setFilteredContrats(tempFiltered);
    setCurrentPage(1);
    setIsSearching(searchTermPolice !== "" || searchTermName !== "");
  }, [searchTermPolice, searchTermName, initialContrats]);

  const totalPages = useMemo(() => {
    if (!filteredContrats) return 0;
    return Math.ceil(filteredContrats.length / itemsPerPage);
  }, [filteredContrats, itemsPerPage]);

  const paginatedContrats = useMemo(() => {
    if (!filteredContrats) return [];
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredContrats.slice(startIndex, endIndex);
  }, [filteredContrats, currentPage, itemsPerPage]);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  };

  const gotoDetails = (policeNumber: string) => {
    router.push(`/contrat/${policeNumber}/details`);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

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
            Liste des adhésions
          </h1>
          <span className="text-md sm:text-lg text-gray-200 text-center sm:text-right">
            Nombre total de contrats sur la convention{" "}
            <span className="font-semibold text-blue-100">{id}</span> :{" "}
            <span className="font-bold">{initialContrats?.length || 0}</span>
          </span>
        </div>

        <div className="p-4 bg-white border-b border-gray-200">
          <h3 className="font-semibold text-lg text-gray-800 mb-3">
            Rechercher un contrat
          </h3>
          <div className="flex flex-col sm:flex-row items-end gap-4 flex-wrap">
            <div className="flex flex-col gap-2 flex-1 min-w-[200px] max-w-sm">
              <label
                htmlFor="name-search"
                className="text-sm font-medium text-gray-700"
              >
                Nom / Prénom Assuré
              </label>
              <div className="relative">
                <Input
                  id="name-search"
                  placeholder="Ex: Dupont Jean"
                  value={searchTermName}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setSearchTermName(e.target.value)
                  }
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-50 text-gray-800 placeholder-gray-400 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ease-in-out"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
            </div>

            <div className="flex items-center justify-center text-gray-500 font-medium sm:self-center pb-2 px-2">
              <span>OU</span>
            </div>

            <div className="flex flex-col gap-2 flex-1 min-w-[200px] max-w-sm">
              <label
                htmlFor="police-search"
                className="text-sm font-medium text-gray-700"
              >
                Numéro Police
              </label>
              <div className="relative">
                <Input
                  id="police-search"
                  placeholder="Ex: 123456"
                  value={searchTermPolice}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setSearchTermPolice(e.target.value)
                  }
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-50 text-gray-800 placeholder-gray-400 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ease-in-out"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
            </div>

            {isSearching && (
              <motion.div
                key="cancel-button"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="flex justify-end w-full sm:w-auto mt-4 sm:mt-0"
              >
                <MuiButton
                  onClick={() => {
                    setSearchTermPolice("");
                    setSearchTermName("");
                  }}
                  className="w-full sm:w-auto text-red-600 bg-red-50 border border-red-300 hover:bg-red-100 hover:text-red-700 transition-colors duration-200 ease-in-out flex items-center gap-2"
                >
                  <XCircle className="h-4 w-4" /> Annuler la recherche
                </MuiButton>
              </motion.div>
            )}
          </div>
        </div>

        <div className="md:m-6">
          <div>
            <p>Avis de situation de la convention</p>
            <Button
              onClick={() => router.push(`/conventions/${id}/avis-situation`)}
            >
              Avis de situation
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto relative min-h-[300px]">
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
                {loaderContrat.isLoading ? (
                  Array.from({ length: itemsPerPage }).map((_, index) => (
                    <TableRowSkeleton
                      key={index}
                      columns={tableHeaders.length}
                    />
                  ))
                ) : loaderContrat.error ? (
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
                ) : filteredContrats && filteredContrats.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={tableHeaders.length}
                      className="text-center py-8 text-gray-500 font-medium text-lg"
                    >
                      <ClipboardList className="inline-block w-6 h-6 mr-2 text-gray-400" />
                      {searchTermPolice !== "" || searchTermName !== ""
                        ? "Aucun contrat ne correspond à votre recherche."
                        : "Aucun contrat trouvé."}
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedContrats.map((adhesion, index) => (
                    <motion.tr
                      key={adhesion.NUMERO_POLICE || index}
                      variants={rowVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      custom={index}
                      className="hover:bg-blue-50 border-b last:border-b-0 cursor-pointer transition-colors duration-200 ease-in-out"
                      onClick={() => gotoDetails(adhesion.NUMERO_POLICE)}
                    >
                      {tableHeaders.map((header) => (
                        <TableCell
                          key={header.key}
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-medium"
                        >
                          {header.key === "EtatPolice" ? (
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                adhesion.EtatPolice === "ACTIF"
                                  ? "bg-green-100 text-green-800"
                                  : adhesion.EtatPolice === "SUSPENDU"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {adhesion.EtatPolice}
                            </span>
                          ) : header.key == "DateDebutPolice" ? (
                            dayjs(adhesion.DateDebutPolice).format("DD/MM/YYYY")
                          ) : (
                            (adhesion[
                              header.key as keyof InfoPolice
                            ] as React.ReactNode) || ""
                          )}
                        </TableCell>
                      ))}
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </TableBody>
          </Table>
        </div>

        {filteredContrats && filteredContrats.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-center p-4 bg-gray-50 border-t border-gray-200 flex-wrap gap-4 rounded-b-xl">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <span>Afficher</span>
              <Select
                value={String(itemsPerPage)}
                onValueChange={handleItemsPerPageChange}
              >
                <SelectTrigger className="w-[80px]">
                  <SelectValue placeholder={itemsPerPage} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
              <span>lignes par page</span>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 font-semibold">
                Page {currentPage} sur {totalPages}
              </span>
              <div className="flex space-x-2">
                <MuiButton
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1 || loaderContrat.isLoading}
                  className="hidden sm:flex px-3 py-2 text-sm font-medium rounded-md text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 transition-colors duration-200"
                >
                  <ChevronsLeft className="h-4 w-4 mr-1" /> Premier
                </MuiButton>
                <MuiButton
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1 || loaderContrat.isLoading}
                  className="px-3 py-2 text-sm font-medium rounded-md text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 transition-colors duration-200"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" /> Précédent
                </MuiButton>
                <MuiButton
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={
                    currentPage === totalPages || loaderContrat.isLoading
                  }
                  className="px-3 py-2 text-sm font-medium rounded-md text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 transition-colors duration-200"
                >
                  Suivant <ChevronRight className="h-4 w-4 ml-1" />
                </MuiButton>
                <MuiButton
                  onClick={() => handlePageChange(totalPages)}
                  disabled={
                    currentPage === totalPages || loaderContrat.isLoading
                  }
                  className="hidden sm:flex px-3 py-2 text-sm font-medium rounded-md text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 transition-colors duration-200"
                >
                  Dernier <ChevronsRight className="h-4 w-4 ml-1" />
                </MuiButton>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
