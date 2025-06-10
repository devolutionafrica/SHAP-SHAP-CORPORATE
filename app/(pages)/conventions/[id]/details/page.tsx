// components/AdhesionTable.tsx
"use client";

import React, { useState, useMemo, useEffect, ChangeEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input"; // Assurez-vous que c'est le bon chemin
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableColumn,
} from "@/components/ui/table2"; // Utilisez le chemin correct pour votre composant Table de Shadcn/ui
import { Button } from "@/components/ui/button"; // Utilisez le bouton de Shadcn/ui
import { Skeleton } from "@mui/material"; // Conservez Skeleton de MUI si vous le souhaitez, sinon utilisez un équivalent Shadcn/ui
import "./style.scss"; // Pour les styles spécifiques, si vous en avez
import {
  Search, // Icône de recherche
  XCircle, // Icône d'annulation
} from "lucide-react";
import { useContratByConvention } from "@/hooks/useContratByConvention";
import { useParams, useRouter } from "next/navigation";
import { InfoPolice } from "@/app/Types/type";
import { useContratContext } from "@/hooks/contexts/useContratContext";

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
  // Suppression des états et fonctions de pagination
  // const [currentPage, setCurrentPage] = useState(1);
  // const itemsPerPage = 5;

  const param = useParams();
  const id = param.id as string;
  const loaderContrat = useContratByConvention(id);
  const { handleLoadConvention } = useContratContext();
  const router = useRouter();

  // États pour la recherche
  const [searchTermPolice, setSearchTermPolice] = useState("");
  const [searchTermName, setSearchTermName] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [initialContrats, setInitialContrats] = useState<InfoPolice[] | null>(
    null
  ); // Stocke la liste initiale
  const [displayedContrats, setDisplayedContrats] = useState<
    InfoPolice[] | null
  >(null); // Les contrats actuellement affichés (filtrés ou non)

  // Chargement initial des contrats
  useEffect(() => {
    const getContrat = async () => {
      await loaderContrat
        .refetch()
        .then((response) => {
          const fetchedContrats = response.data.data as InfoPolice[];
          //   setInitialContrats(fetchedContrats); // Stocke l'original
          setDisplayedContrats(fetchedContrats); // Affiche l'original par défaut
        })
        .catch((e) => {
          console.error("Erreur lors du chargement des contrats:", e);
        });
    };
    getContrat();
    handleLoadConvention();
  }, [id, loaderContrat]);

  // Fonction pour la recherche
  const handleSearch = () => {
    if (!initialContrats) return;

    let filtered = initialContrats.filter((contrat) => {
      const policeMatch = searchTermPolice
        ? String(contrat.NUMERO_POLICE) == searchTermPolice
        : true;

      const nameMatch = searchTermName
        ? String(contrat.NomAssure || "")
            .toLowerCase()
            .includes(searchTermName.toLowerCase()) ||
          String(contrat.PrenomsAssure || "")
            .toLowerCase()
            .includes(searchTermName.toLowerCase())
        : true;

      const hasSearchTerm = searchTermPolice || searchTermName;

      if (!hasSearchTerm) {
        return true; // Si aucun terme de recherche, afficher tout
      }

      return policeMatch || nameMatch;
    });

    setDisplayedContrats(filtered);
    setIsSearching(true);
  };

  // Fonction pour annuler la recherche
  const handleCancelSearch = () => {
    setSearchTermPolice("");
    setSearchTermName("");
    setDisplayedContrats(initialContrats); // Rétablit la liste initiale
    setIsSearching(false);
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

          {/* Boutons Recherche/Annuler */}
          <div className="flex justify-end w-full sm:w-auto">
            <AnimatePresence mode="wait">
              {isSearching ? (
                <motion.div
                  key="cancel-button"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <Button
                    onClick={handleCancelSearch}
                    variant="outline"
                    className="w-full sm:w-auto text-red-600 border-red-300 hover:bg-red-50 hover:text-red-700 transition-colors duration-200 ease-in-out flex items-center gap-2"
                  >
                    <XCircle className="h-4 w-4" /> Annuler la recherche
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="search-button"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                >
                  <Button
                    onClick={handleSearch}
                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200 ease-in-out flex items-center gap-2"
                  >
                    <Search className="h-4 w-4" /> Rechercher
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
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
            {!loaderContrat.isLoading && displayedContrats && (
              <TableBody>
                {displayedContrats.length > 0 ? (
                  displayedContrats.map((adhesion, index) => (
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
                      Aucun contrat trouvé pour votre recherche.
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

      {/* La section de pagination a été supprimée ici */}
    </div>
  );
}
