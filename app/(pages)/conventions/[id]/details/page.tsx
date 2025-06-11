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
} from "@/components/ui/table2";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@mui/material"; // Conservez Skeleton de MUI si vous le souhaitez
import "./style.scss"; // Pour les styles spécifiques
import {
  Search, // Icône de recherche
  XCircle, // Icône d'annulation
  ChevronLeft, // Icône pour la page précédente
  ChevronRight, // Icône pour la page suivante
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
} from "@/components/ui/select"; // Importez les composants Select de Shadcn/ui

// Headers du tableau
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
  ); // Stocke la liste initiale complète
  const [filteredContrats, setFilteredContrats] = useState<InfoPolice[] | null>(
    null
  ); // Les contrats après filtrage (avant pagination)

  // Chargement initial des contrats
  useEffect(() => {
    const getContrat = async () => {
      await loaderContrat
        .refetch()
        .then((response) => {
          const fetchedContrats = response.data.data as InfoPolice[];
          setInitialContrats(fetchedContrats); // Stocke l'original complet
          setFilteredContrats(fetchedContrats); // Initialise les contrats filtrés avec l'original
          setCurrentPage(1); // Réinitialise la page à 1 après un nouveau chargement
        })
        .catch((e) => {
          console.error("Erreur lors du chargement des contrats:", e);
          setInitialContrats([]); // En cas d'erreur, initialiser à un tableau vide
          setFilteredContrats([]);
        });
    };
    getContrat();
    handleLoadConvention();
  }, [id]);

  // --- Logique de Filtrage (mise à jour) ---
  // Utilisation de useEffect pour mettre à jour les filteredContrats lorsque les termes de recherche changent
  useEffect(() => {
    if (!initialContrats) return;

    let tempFiltered = initialContrats.filter((contrat) => {
      const hasSearchTerm = searchTermPolice !== "" || searchTermName !== "";

      // Si aucun terme de recherche, afficher tous les contrats
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
    setCurrentPage(1); // Réinitialiser la page à 1 à chaque nouveau filtrage
    setIsSearching(searchTermPolice !== "" || searchTermName !== ""); // Mettre à jour l'état de recherche
  }, [searchTermPolice, searchTermName, initialContrats]); // Dépend des termes de recherche et des contrats initiaux

  // --- Logique de Pagination ---
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
    setCurrentPage(1); // Revenir à la première page lors du changement de taille
  };

  const gotoDetails = (policeNumber: string) => {
    router.push(`/contrat/${policeNumber}/details`);
  };

  return (
    <div className="w-full shadow-lg border border-gray-200 rounded overflow-hidden bg-white">
      <div className="p-4 sm:p-6 bg-gray-50 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h3 className="text-lg sm:text-xl font-bold text-gray-800 text-center sm:text-left">
          Liste des adhésions
        </h3>
        <span className="text-md sm:text-lg text-gray-700 text-center sm:text-right">
          Nombre total de contrats sur la convention{" "}
          <span className="font-semibold text-blue-600">{id}</span> :{" "}
          <span className="font-bold">{initialContrats?.length || 0}</span>
        </span>
      </div>

      {/* --- Section Recherche --- */}
      <div className="p-4 bg-white border-b border-gray-200">
        <h3 className="font-semibold text-lg text-gray-800 mb-3">
          Rechercher un contrat
        </h3>
        <div className="flex flex-col sm:flex-row items-end gap-4 flex-wrap">
          {/* Champ Nom Scripteur */}
          <div className="flex flex-col gap-2 flex-1 min-w-[200px] max-w-sm">
            <label
              htmlFor="name-search"
              className="text-sm font-medium text-gray-700"
            >
              Nom / Prénom Assuré
            </label>
            <Input
              id="name-search"
              placeholder="Ex: Dupont Jean"
              value={searchTermName}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setSearchTermName(e.target.value)
              }
              className="w-full"
            />
          </div>

          {/* Séparateur "ou" positionné correctement */}
          <div className="flex items-center justify-center text-gray-500 font-medium sm:self-center pb-2 px-2">
            <span>OU</span>
          </div>

          {/* Champ Numéro Police */}
          <div className="flex flex-col gap-2 flex-1 min-w-[200px] max-w-sm">
            <label
              htmlFor="police-search"
              className="text-sm font-medium text-gray-700"
            >
              Numéro Police
            </label>
            <Input
              id="police-search"
              placeholder="Ex: 123456"
              value={searchTermPolice}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setSearchTermPolice(e.target.value)
              }
              className="w-full"
            />
          </div>

          {/* Boutons Annuler la recherche */}
          {isSearching && (
            <motion.div
              key="cancel-button"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="flex justify-end w-full sm:w-auto"
            >
              <Button
                onClick={() => {
                  setSearchTermPolice("");
                  setSearchTermName("");
                  // useEffect ci-dessus gérera la mise à jour de filteredContrats et la réinitialisation de la page
                }}
                variant="outline"
                className="w-full sm:w-auto text-red-600 border-red-300 hover:bg-red-50 hover:text-red-700 transition-colors duration-200 ease-in-out flex items-center gap-2"
              >
                <XCircle className="h-4 w-4" /> Annuler la recherche
              </Button>
            </motion.div>
          )}
        </div>
      </div>
      {/* --- Fin Section Recherche --- */}

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
            {loaderContrat.isLoading && (
              <TableBody>
                <TableRow>
                  <TableCell colSpan={tableHeaders.length} className="py-8">
                    <Skeleton height={40} className="w-full" />
                    <Skeleton height={40} className="w-full mt-2" />
                    <Skeleton height={40} className="w-full mt-2" />
                  </TableCell>
                </TableRow>
              </TableBody>
            )}
            {!loaderContrat.isLoading && paginatedContrats && (
              <TableBody>
                {paginatedContrats.length > 0 ? (
                  paginatedContrats.map((adhesion, index) => (
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
                          className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 cursor-pointer"
                          onClick={() => gotoDetails(adhesion.NUMERO_POLICE)}
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
                          ) : (
                            (adhesion[
                              header.key as keyof InfoPolice
                            ] as React.ReactNode) || "N/A"
                          )}
                        </TableCell>
                      ))}
                    </motion.tr>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={tableHeaders.length}
                      className="text-center py-6 text-gray-500"
                    >
                      Aucun contrat trouvé.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            )}

            {!loaderContrat.isLoading && loaderContrat.error && (
              <TableBody>
                <TableRow>
                  <TableCell
                    colSpan={tableHeaders.length}
                    className="text-center py-6 text-red-500"
                  >
                    Erreur de chargement des contrats. Veuillez réessayer.
                  </TableCell>
                </TableRow>
              </TableBody>
            )}
          </AnimatePresence>
        </Table>
      </div>

      {/* --- Section Pagination --- */}
      {!loaderContrat.isLoading &&
        filteredContrats &&
        filteredContrats.length > 0 && (
          <div className="p-4 sm:p-6 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
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
              <span className="text-sm text-gray-700">
                Page {currentPage} sur {totalPages}
              </span>
              <div className="flex gap-2">
                <Button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      {/* --- Fin Section Pagination --- */}
    </div>
  );
}
