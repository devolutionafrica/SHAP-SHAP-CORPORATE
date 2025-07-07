"use client";

import { useEffect, useRef, useState, useMemo } from "react"; // Added useMemo
import dayjs, { Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useReactToPrint } from "react-to-print";
import { motion } from "framer-motion"; // Import framer-motion

import {
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  CircularProgress,
  Skeleton,
  IconButton,
  TablePagination, // Import TablePagination
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useContratContext } from "@/hooks/contexts/useContratContext";
import { CotisationClientIndiv } from "@/app/Types/type";
import { useCotisation } from "@/hooks/useCotisation";
import { useParams } from "next/navigation";
import { useCotisationTotal } from "@/hooks/useSummaryCotisation";
import { useUser } from "@/hooks/contexts/userContext";
import ContractPrintView from "./ContratPrintView";
import { Search, Printer, FileText } from "lucide-react"; // More relevant icons
import DialogPrestation from "../sinistre/Component/DialogDemandePrestation";
import ReglementPrimeModal from "./Component/ReglerPrimeModal";
import AnimatedImageLoader from "@/components/LoaderImage";

dayjs.extend(customParseFormat);

export const formatNumberToFCFA = (num: number | null | undefined): string => {
  if (num === null || num === undefined) return "0";
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "XOF", // Assuming XOF (West African CFA franc) or GNF based on your snippet
    minimumFractionDigits: 0, // No decimal places for FCFA/GNF usually
    maximumFractionDigits: 0,
  }).format(num);
};

// Animation variants for Framer Motion
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, delay: 0.1 } },
};

export default function CotisationPage() {
  const { contrat, souscripteur } = useContratContext();
  const [startDate, setStartDate] = useState<Dayjs>(
    dayjs(contrat?.DateDebutPolice || Date.now()) // Default to current date if contrat.DateDebutPolice is null
  );
  const [endDate, setEndDate] = useState<Dayjs>(dayjs(Date.now()));

  const { getTypeUser } = useUser();

  const param = useParams();
  const contratId = param.id as string;

  const [cotisations, setCotisations] = useState<CotisationClientIndiv[]>([]);
  const [summaryCotisations, setSummaryCotisation] = useState<any>(null);

  // Pagination states
  const [page, setPage] = useState(0); // Current page (0-indexed)
  const [rowsPerPage, setRowsPerPage] = useState(10); // Items per page
  // Search state
  const [searchQuery, setSearchQuery] = useState("");

  // État pour le filtre "Tous" / "Impayées"
  const [filterCotisation, setFiltreCotisation] = useState("Tous");

  const fetchCotisation = useCotisation(
    startDate.format("YYYY-MM-DD"),
    endDate.format("YYYY-MM-DD"),
    contratId
  );

  const summary = useCotisationTotal(
    startDate.format("DD/MM/YYYY"),
    endDate.format("DD/MM/YYYY"),
    contratId
  );

  const fetchCotisationData = async () => {
    try {
      const cotisationResponse = await fetchCotisation.refetch();
      setCotisations(
        (cotisationResponse.data && cotisationResponse.data.data) || []
      );
    } catch (error) {
      console.error("Erreur lors de la récupération des cotisations :", error);
      setCotisations([]);
      // Consider a more user-friendly error display, e.g., a toast notification
      // alert("Erreur lors de la récupération des cotisations.");
    }

    try {
      const summaryResponse = await summary.refetch();
      setSummaryCotisation(
        (summaryResponse.data && summaryResponse.data.data) || null
      );
    } catch (error) {
      console.error("Erreur lors de la récupération du summary : ", error);
      // alert("Erreur lors de la récupération du summary.");
    }
  };

  const [printData, setPrintdata] = useState<any>(null);

  const preparedPrintData = () => {
    // This function should use the *full* cotisations and summary data for printing
    if (
      !summaryCotisations ||
      cotisations === null ||
      cotisations === undefined
    ) {
      console.log("Données non prêtes pour la préparation de printData.");
      return null;
    }

    try {
      return {
        nom: souscripteur?.NOM_CLIENT || "",
        prenoms: souscripteur?.PRENOMS_CLIENT || "",
        adresse: souscripteur?.ADRESSE_POSTALE || "",
        numero: souscripteur?.TELEPHONE || "",
        numeroPolice: contrat?.NumeroContrat || "",
        libelleProduit: contrat?.DESC_PRODUIT || "",
        dateEffetPolice: contrat?.DateDebutPolice
          ? dayjs(contrat.DateDebutPolice).format("DD/MM/YYYY")
          : "",
        finEffetPolice: contrat?.DateFinPolice
          ? dayjs(contrat.DateFinPolice).format("DD/MM/YYYY")
          : "",
        souscripteurNomComplet: `${souscripteur?.NOM_CLIENT || ""} ${
          souscripteur?.PRENOMS_CLIENT || ""
        }`.trim(),
        modeDePaiement: "N/A", // This seems to be static, consider making it dynamic if possible

        // Use the full cotisations array for printing
        quittances: cotisations.map((cotisation) => ({
          NUMERO_QUITTANCE: String(cotisation.NumeroQuittance),
          DATE_QUITTANCE: dayjs(cotisation.Echeance).format("DD/MM/YYYY"),
          DEBUT_PERIODE: dayjs(cotisation.DebutPeriode).format("DD/MM/YYYY"),
          FIN_PERIODE: dayjs(cotisation.FinPeriode).format("DD/MM/YYYY"),
          MONTANT_EMIS: formatNumberToFCFA(cotisation.MontantEmis),
          PRIME_PERIODIQUE: formatNumberToFCFA(cotisation.PrimePeriodique),
          ECHEANCE_D_AVANCE: formatNumberToFCFA(cotisation.EcheanceAvance),
          FRAIS_REJET: formatNumberToFCFA(cotisation.FraisRejet),
          MONTANT_COTISE: formatNumberToFCFA(cotisation.MontantEncaisse),
          MONTANT_REGULARISE: formatNumberToFCFA(cotisation.MontantRegularise),
          ETAT_DE_LA_QUITTANCE: cotisation.EtatQuittance,
        })),

        nombreTotalEmission: cotisations.length,
        montantTotalEmis: summaryCotisations?.MontantEmis || 0,
        nombreTotalEncaissement: cotisations.filter(
          (q) => q.EtatQuittance === "Soldée" || q.MontantEncaisse > 0
        ).length,
        montantTotalEncaisse: summaryCotisations?.MontantEncaisse || 0,
        nombreTotalImpayes: cotisations.filter(
          (q) => q.EtatQuittance !== "Soldée" && q.MontantEncaisse === 0
        ).length,
        montantTotalImpayes: summaryCotisations?.MontantImpaye || 0,
        echeanceAvanceNonReglee: summaryCotisations?.EncoursAvanceImpayes || 0,
        nombreDeQuittancesEncaissees: cotisations.filter(
          (q) => q.EtatQuittance === "Soldée" || q.MontantEncaisse > 0
        ).length,
        montantTotalDesQuittancesEncaissees:
          summaryCotisations?.MontantEncaisse || 0,
      };
    } catch (e) {
      console.error("Erreur de chargement des données du pdf", e);
      // alert("Erreur de chargement des données du pdf");
      return null;
    }
  };

  useEffect(() => {
    fetchCotisationData();
  }, [startDate, endDate, contratId]); // Refetch when dates or contratId change

  useEffect(() => {
    if (
      cotisations !== null &&
      cotisations !== undefined &&
      summaryCotisations !== null
    ) {
      setPrintdata(preparedPrintData());
    }
  }, [cotisations, summaryCotisations]);

  const componentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    pageStyle: `@page { size: A4 portrait; margin: 4mm; }`,
    documentTitle: "ContratCotisations",
    contentRef: componentRef,
  });

  const filteredAndSortedCotisations = useMemo(() => {
    if (!cotisations) return [];

    let filtered = cotisations;

    const lowerCaseQuery = searchQuery.toLowerCase();
    if (lowerCaseQuery) {
      filtered = filtered.filter((cotisation) =>
        String(cotisation.NumeroQuittance)
          .toLowerCase()
          .includes(lowerCaseQuery)
      );
    }

    if (filterCotisation == "Impayée") {
      filtered = filtered.filter(
        (cotisation) => cotisation.EtatQuittance === "Impayée"
      );
    }

    return filtered.sort((a, b) => {
      const dateA = dayjs(a.Echeance);
      const dateB = dayjs(b.Echeance);
      return dateB.diff(dateA); // Plus récent en premier
    });
  }, [cotisations, searchQuery, filterCotisation]);

  const handlePageChange = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page when rows per page changes
  };

  const handleChangeFiltre = (val: string) => {
    setFiltreCotisation(val);
    setPage(0); // Reset to first page when filter changes
  };

  // Calculate items for the current page
  const paginatedCotisations = useMemo(() => {
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return filteredAndSortedCotisations.slice(startIndex, endIndex);
  }, [page, rowsPerPage, filteredAndSortedCotisations]);

  // Correction de la logique de classe pour le filtre
  const filteredStyle = (val: string) => {
    // Si l'élément actuel (val) est le filtre sélectionné (filterCotisation)
    if (val === filterCotisation) {
      return "text-black !bg-[#ca9a2c]"; // Classes pour le bouton sélectionné
    } else {
      return "text-white !bg-[#223268]"; // Classes pour les boutons non sélectionnés
    }
  };

  const filtres = ["Tous", "Impayée"]; // Note: "Impayées" doit correspondre exactement à l'état de la quittance

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={cardVariants}
        className="min-h-screen "
      >
        {/* Filters and Search */}
        <motion.div
          className="bg-white rounded-lg p-6 shadow-md mb-6"
          variants={itemVariants}
        >
          <Grid container spacing={3} alignItems="flex-end">
            <Grid>
              {" "}
              {/* Ajusté pour la responsivité */}
              <DatePicker
                label="Date début"
                value={startDate}
                format="DD/MM/YYYY"
                onChange={(date) => {
                  if (date) setStartDate(date);
                }}
                className="w-full"
              />
            </Grid>
            <Grid>
              <DatePicker
                label="Date fin"
                value={endDate}
                format="DD/MM/YYYY"
                onChange={(date) => {
                  if (date) setEndDate(date);
                }}
                className="w-full"
              />
            </Grid>
            <Grid>
              {" "}
              {/* Ajusté pour la responsivité */}
              <TextField
                label="Rechercher par N° Quittance"
                variant="outlined"
                fullWidth
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(0); // Reset page on search
                }}
                InputProps={{
                  startAdornment: (
                    <Search className="mr-2 text-gray-400" size={20} />
                  ),
                }}
              />
            </Grid>
          </Grid>
        </motion.div>

        {/* Introduction Message */}
        <motion.div variants={itemVariants} className="mb-6">
          <Typography variant="body1" className="text-gray-700 leading-relaxed">
            Nous vous remercions de la confiance placée en notre compagnie en
            nous confiant la gestion de votre contrat d'assurance cité en
            référence. La situation des cotisations de votre contrat sur la base
            des encaissements tels que reçus de nos services au{" "}
            <span className="font-semibold text-blue-700">
              {endDate.format("DD/MM/YYYY")}
            </span>{" "}
            fait apparaître les règlements suivants, sauf erreur de notre part.
          </Typography>
        </motion.div>

        {/* Cotisations Table */}
        <motion.div
          className="bg-white rounded-lg shadow-md overflow-hidden mb-6"
          variants={cardVariants}
        >
          <CardContent className="p-0">
            <Typography
              component="div" // Utiliser div pour un meilleur contrôle du flex
              variant="h6"
              className="pt-6 pb-2 text-gray-800 font-semibold "
            >
              <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-4">
                {" "}
                {/* Flexbox pour alignement */}
                <div className="text-center sm:text-left">
                  Situation du {startDate.format("DD/MM/YYYY")} au{" "}
                  {endDate.format("DD/MM/YYYY")}
                </div>
                <div className="bg-[#223268] rounded-[36px] flex flex-row items-center border border-black p-1">
                  {" "}
                  {filtres.map((item: string, index: number) => (
                    <div
                      key={index}
                      className={`p-2 px-4 text-[11px] rounded-[30px] cursor-pointer ${filteredStyle(
                        item
                      )} `}
                      onClick={() => handleChangeFiltre(item)}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </Typography>
            <TableContainer component={Paper} className="shadow-none">
              <Table aria-label="cotisations table">
                <TableHead className="bg-[#223268]">
                  <TableRow>
                    {[
                      "NUMÉRO QUITTANCE",
                      "DATE",
                      "DÉBUT PÉRIODE",
                      "FIN PÉRIODE",
                      "PRIME PÉRIODIQUE",
                      "MONTANT ENCAISSÉ",
                      "ÉTAT QUITTANCE",
                      "ACTION", // Added for the "Régler" button
                    ].map((header) => (
                      <TableCell
                        key={header}
                        className="!text-white !font-medium !text-xs !py-3 !px-4 uppercase tracking-wider"
                      >
                        {header}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {fetchCotisation.isLoading ? (
                    <div className="flex justify-center items-center py-8 mx-auto !w-full">
                      <AnimatedImageLoader
                        alt="Loader"
                        src="/nsiavie.png"
                        label="Chargement des cotisations"
                      />
                      {/* <p>Chargement des cotisations</p> */}
                    </div>
                  ) : paginatedCotisations.length > 0 ? (
                    paginatedCotisations.map((cotisation) => (
                      <motion.tr
                        key={cotisation.NumeroQuittance}
                        initial="hidden"
                        animate="visible"
                        variants={itemVariants}
                        className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200"
                      >
                        <TableCell className="text-center text-sm px-4 py-3">
                          {cotisation.NumeroQuittance}
                        </TableCell>
                        <TableCell className="text-center text-sm px-4 py-3">
                          {cotisation.Echeance &&
                            dayjs(cotisation.Echeance).format("DD/MM/YYYY")}
                        </TableCell>
                        <TableCell className="text-center text-sm px-4 py-3">
                          {cotisation.DebutPeriode &&
                            dayjs(cotisation.DebutPeriode).format("DD/MM/YYYY")}
                        </TableCell>
                        <TableCell className="text-center text-sm px-4 py-3">
                          {cotisation.FinPeriode &&
                            dayjs(cotisation.FinPeriode).format("DD/MM/YYYY")}
                        </TableCell>
                        <TableCell className="text-center text-sm px-4 py-3 font-medium">
                          {formatNumberToFCFA(cotisation.PrimePeriodique)}
                        </TableCell>
                        <TableCell className="text-center text-sm px-4 py-3 font-medium">
                          {formatNumberToFCFA(cotisation.MontantEncaisse)}
                        </TableCell>
                        <TableCell className="text-center px-2 py-3">
                          <span
                            className={`px-3 py-1 rounded-full text-[11px] ${
                              cotisation.EtatQuittance === "Soldée"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {cotisation.EtatQuittance}
                          </span>
                        </TableCell>
                        <TableCell className="text-center text-sm px-4 py-3">
                          {cotisation.EtatQuittance === "Impayée" ||
                            (true && (
                              <div>
                                <ReglementPrimeModal data={cotisation} />
                              </div>
                            ))}
                        </TableCell>
                      </motion.tr>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="text-center py-4 text-gray-500"
                      >
                        <FileText
                          className="inline-block mr-2 text-gray-400"
                          size={20}
                        />
                        Aucune cotisation trouvée pour cette période ou ce
                        numéro de quittance.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination controls */}
            {filteredAndSortedCotisations.length > 0 && (
              <TablePagination
                component="div"
                count={filteredAndSortedCotisations.length}
                page={page}
                onPageChange={handlePageChange}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleRowsPerPageChange}
                rowsPerPageOptions={[5, 10, 25, 50]}
                labelRowsPerPage="Lignes par page :"
                labelDisplayedRows={({ from, to, count }) =>
                  `${from}-${to} sur ${count !== -1 ? count : `plus de ${to}`}`
                }
                className="mt-4" // Tailwind margin top
              />
            )}

            {/* Action Buttons */}
            <Box className="flex justify-end gap-4 p-6 pt-4">
              {getTypeUser() === 1 && (
                <Button
                  variant="contained"
                  color="error"
                  className="!bg-red-600 hover:!bg-red-700 !text-white !font-semibold"
                >
                  Régler Prime
                </Button>
              )}
              <Button
                variant="outlined"
                onClick={() => handlePrint()}
                startIcon={<Printer size={20} />}
                className="!border-[#223268] !text-[#223268] hover:!bg-[#223268] hover:!text-white !font-semibold"
              >
                Imprimer
              </Button>
            </Box>
          </CardContent>
        </motion.div>

        {/* Summary Table */}
        <motion.div
          className="bg-white rounded-lg shadow-md p-6"
          variants={cardVariants}
        >
          <Typography variant="h6" className="text-gray-800 font-semibold mb-4">
            Tableau Récapitulatif
          </Typography>
          <Grid container spacing={{ xs: 2, md: 4 }}>
            {[
              {
                label: "MONTANT TOTAL ÉMIS",
                value: summaryCotisations?.MontantEmis || 0,
              },
              {
                label: "MONTANT TOTAL ENCAISSÉ",
                value: summaryCotisations?.MontantEncaisse || 0,
              },
              {
                label: "MONTANT TOTAL DES IMPAYÉS",
                value: summaryCotisations?.MontantImpaye || 0,
              },
              {
                label: "ENCOURS D’AVANCES NON RÉGLÉS",
                value: summaryCotisations?.EncoursAvanceImpayes || 0,
              },
            ].map((item, index) => (
              <Grid>
                {" "}
                {/* Ajouté Grid item pour la responsivité */}
                <motion.div variants={itemVariants}>
                  <Typography
                    variant="subtitle2"
                    className="text-gray-500 uppercase tracking-wide text-xs"
                  >
                    {item.label}
                  </Typography>
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    className="text-gray-900 mt-1"
                  >
                    {formatNumberToFCFA(item.value)}
                  </Typography>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </motion.div>

      {/* Le composant ContractPrintView pour l'impression, masqué à l'écran */}
      <div style={{ display: "none" }}>
        {printData && (
          <ContractPrintView ref={componentRef} data={printData!} />
        )}
      </div>
    </LocalizationProvider>
  );
}
