"use client";

import { useContext, useEffect, useState, useRef } from "react"; // Importez useRef
import dayjs, { Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useReactToPrint } from "react-to-print"; // Importez useReactToPrint

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
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useContratContext } from "@/hooks/contexts/useContratContext";
import { CotisationClientIndiv } from "@/app/Types/type";
import { useCotisation } from "@/hooks/useCotisation";
import { useParams } from "next/navigation";
import { useCotisationTotal } from "@/hooks/useSummaryCotisation";
import { useUserInfo } from "@/hooks/useUserInfo";
import { useUser } from "@/hooks/contexts/userContext";

import ContractPrintView from "./ContratPrintView";

dayjs.extend(customParseFormat);

export default function CotisationPage() {
  const { contrat } = useContratContext();
  const [startDate, setStartDate] = useState<Dayjs>(
    dayjs(contrat?.DateDebutPolice)
  );
  const [endDate, setEndDate] = useState<Dayjs>(dayjs(Date.now()));

  const { user, getTypeUser } = useUser(); // Accédez aux informations de l'utilisateur connecté

  const param = useParams();
  const contratId = param.id as string;

  const [cotisations, setCotisations] = useState<CotisationClientIndiv[]>([]);
  const [summaryCotisations, setSummaryCotisation] = useState<any>();

  const fetchCotisation = useCotisation(
    startDate.format("YYYY-MM-DD"),
    endDate.format("YYYY-MM-DD"),
    contratId
  );

  const summary = useCotisationTotal(
    startDate.format("DD/MM/YYYY"), // Format correct pour l'API
    endDate.format("DD/MM/YYYY"), // Format correct pour l'API
    contratId
  );

  const fetchCotisationData = async () => {
    await fetchCotisation
      .refetch()
      .then((response) => {
        console.log("Cotisations fetched:", response.data.data);
        setCotisations(response.data.data as CotisationClientIndiv[]);
      })
      .catch((error) => {
        console.error(
          "Erreur lors de la récupération des cotisations :",
          error
        );
        alert("Erreur lors de la récupération des cotisations.");
      });

    await summary
      .refetch()
      .then((response) => {
        console.log("Summary fetched:", response.data.data);
        setSummaryCotisation(response.data.data);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération du summary : ", error);
        alert("Erreur lors de la récupération du summary.");
      });
  };

  useEffect(() => {
    fetchCotisationData();
  }, [startDate, endDate, contratId]);

  // Référence pour le composant à imprimer
  const componentRef = useRef<HTMLDivElement>(null);

  // Fonction pour formater les nombres en FCFA
  const formatNumberToFCFA = (num: number | null | undefined): string => {
    if (num === null || num === undefined) return "0";
    return new Intl.NumberFormat("fr-FR").format(num);
  };

  // Préparation des données pour le composant d'impression
  const printData = {
    // Informations Preneur d'assurance
    nom: contrat?.NomClient || user?.NOM_CLIENT || "N/A", // Priorité au contrat, sinon user, sinon N/A
    prenoms: contrat?.PrenomsClient || user?.PRENOMS_CLIENT || "N/A",
    adresse: contrat?.AdresseClient || user?.ADRESSE || "N/A",
    numero: contrat?.NumeroClient || user?.CODE_CLIENT || "N/A", // Numéro d'adhérent/client
    numeroPolice: contrat?.NumeroContrat || "N/A",
    libelleProduit: contrat?.DESC_PRODUIT || "N/A",
    dateEffetPolice: contrat?.DateDebutPolice
      ? dayjs(contrat.DateDebutPolice).format("DD/MM/YYYY")
      : "N/A",
    finEffetPolice: contrat?.DateFinPolice
      ? dayjs(contrat.DateFinPolice).format("DD/MM/YYYY")
      : "N/A",

    // Informations Souscripteur (adapté à votre structure de données)
    // Ici, nous supposons que le souscripteur est l'utilisateur connecté s'il n'est pas dans le contrat
    souscripteurNomComplet: `${
      contrat?.SouscripteurNom || user?.NOM_CLIENT || "N/A"
    } ${contrat?.SouscripteurPrenoms || user?.PRENOMS_CLIENT || ""}`.trim(),
    modeDePaiement: contrat?.ModePaiement || "N/A", // Adapter si cette info est ailleurs

    // Tableau des quittances formatées
    quittances: cotisations.map((cotisation) => ({
      NUMERO_QUITTANCE: String(cotisation.NumeroQuittance),
      DATE_QUITTANCE: dayjs(cotisation.Echeance).format("DD/MM/YYYY"),
      DEBUT_PERIODE: dayjs(cotisation.DebutPeriode).format("DD/MM/YYYY"),
      FIN_PERIODE: dayjs(cotisation.FinPeriode).format("DD/MM/YYYY"),
      MONTANT_EMIS: formatNumberToFCFA(cotisation.MontantEmis),
      PRIME_PERIODIQUE: formatNumberToFCFA(cotisation.PrimePeriodique),
      ECHEANCE_D_AVANCE: formatNumberToFCFA(cotisation.EcheanceAvance),
      FRAIS_REJET: formatNumberToFCFA(cotisation.FraisRejet),
      MONTANT_COTISE: formatNumberToFCFA(cotisation.MontantEncaisse), // Correspond à MontantEncaisse
      MONTANT_REGULARISE: formatNumberToFCFA(cotisation.MontantRegularise),
      ETAT_DE_LA_QUITTANCE: cotisation.EtatQuittance,
    })),

    // Totaux du récapitulatif
    // Ces valeurs proviennent de summaryCotisations
    nombreTotalEmission: cotisations.length, // Un simple compte des quittances affichées
    montantTotalEmis: summaryCotisations?.MontantEmis || 0,
    nombreTotalEncaissement: cotisations.filter(
      (q) => q.EtatQuittance === "Soldée" || q.MontantEncaisse > 0
    ).length, // Nombre de quittances encaissées
    montantTotalEncaisse: summaryCotisations?.MontantEncaisse || 0,
    nombreTotalImpayes: cotisations.filter(
      (q) => q.EtatQuittance !== "Soldée" && q.MontantEncaisse === 0
    ).length, // Nombre de quittances impayées
    montantTotalImpayes: summaryCotisations?.MontantImpaye || 0,
    echeanceAvanceNonReglee: summaryCotisations?.EncoursAvanceImpayes || 0,
    // Les deux lignes suivantes sont souvent dérivées, les réutiliser ici
    nombreDeQuittancesEncaissees: cotisations.filter(
      (q) => q.EtatQuittance === "Soldée" || q.MontantEncaisse > 0
    ).length,
    montantTotalDesQuittancesEncaissees:
      summaryCotisations?.MontantEncaisse || 0,
  };

  // Hook pour la fonctionnalité d'impression
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Situation des Quittances",
    pageStyle: `@page { size: A4 portrait; margin: 20mm; }`, // Optionnel: pour forcer le format d'impression
  });

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box p={3}>
        {/* Le contenu affiché normalement sur la page */}
        <div>
          {/* Header infos */}
          {contrat && (
            <div className="p-2 bg-[#223268] text-white rounded px-6">
              <Grid container spacing={12}>
                <Grid item>
                  {" "}
                  {/* Use item prop */}
                  <Typography variant="subtitle2" className="text-white">
                    Libellé Produit
                  </Typography>
                  <Typography fontWeight="bold">
                    {contrat.DESC_PRODUIT}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="subtitle2">Numéro Police</Typography>
                  <Typography fontWeight="bold">
                    {contrat.NumeroContrat}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="subtitle2">Date début effet</Typography>
                  <Typography fontWeight="bold">
                    {contrat.DateDebutPolice &&
                      dayjs(contrat.DateDebutPolice).format("DD/MM/YYYY")}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="subtitle2">Date fin effet</Typography>
                  <Typography fontWeight="bold">
                    {contrat.DateFinPolice &&
                      dayjs(contrat.DateFinPolice).format("DD/MM/YYYY")}
                  </Typography>
                </Grid>
              </Grid>
            </div>
          )}

          {/* Date filter */}
          <div className="mt-4 mb-2">
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                <Grid item>
                  <DatePicker
                    label="Date début"
                    value={startDate}
                    format="DD/MM/YYYY"
                    onChange={(date) => {
                      if (date) setStartDate(date);
                    }}
                  />
                </Grid>
                <Grid item>
                  <DatePicker
                    label="Date fin"
                    value={endDate}
                    format="DD/MM/YYYY"
                    onChange={(date) => {
                      if (date) setEndDate(date);
                    }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </div>

          {/* Message */}
          <Typography variant="body2" sx={{ mb: 2 }}>
            Nous vous remercions de la confiance placée en notre compagnie en
            nous confiant la gestion de votre contrat d'assurance cité en
            référence. La situation des cotisations de votre contrat sur la base
            des encaissements tels que reçus de nos services au{" "}
            <span className="font-bold">{endDate.format("DD/MM/YYYY")}</span>{" "}
            fait apparaître les règlements suivants, sauf erreur de notre part.
          </Typography>

          {/* Situation */}
          <Card className="mb-4">
            <CardContent>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
                Situation du {startDate.format("DD/MM/YYYY")} au{" "}
                {endDate.format("DD/MM/YYYY")} |{" "}
              </Typography>
              {/* Table */}
              <TableContainer component={Paper}>
                <Table>
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
                      ].map((header) => (
                        <TableCell
                          key={header}
                          sx={{ fontWeight: "500", fontSize: "12px" }}
                          className="text-center text-[11px] text-white" // Correction: text-black to text-white for header
                        >
                          {header}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {fetchCotisation.isLoading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center">
                          <CircularProgress size={24} /> Chargement des données
                          en cours...
                        </TableCell>
                      </TableRow>
                    ) : cotisations.length > 0 ? (
                      cotisations.map((cotisation) => (
                        <TableRow
                          key={cotisation.NumeroQuittance}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell className="text-center">
                            {cotisation.NumeroQuittance}
                          </TableCell>
                          <TableCell className="text-center">
                            {cotisation.Echeance &&
                              dayjs(cotisation.Echeance).format("DD/MM/YYYY")}
                          </TableCell>
                          <TableCell className="text-center">
                            {cotisation.DebutPeriode &&
                              dayjs(cotisation.DebutPeriode).format(
                                "DD/MM/YYYY"
                              )}
                          </TableCell>
                          <TableCell className="text-center">
                            {cotisation.FinPeriode &&
                              dayjs(cotisation.FinPeriode).format("DD/MM/YYYY")}
                          </TableCell>
                          <TableCell className="text-center">
                            {formatNumberToFCFA(cotisation.PrimePeriodique)}{" "}
                            FCFA
                          </TableCell>
                          <TableCell className="text-center">
                            {formatNumberToFCFA(cotisation.MontantEncaisse)}{" "}
                            FCFA
                          </TableCell>
                          <TableCell className="text-center">
                            {cotisation.EtatQuittance}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-4">
                          Aucune cotisation trouvée pour cette période.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              {/* Boutons */}
              <Box mt={2} display="flex" justifyContent="flex-end" gap={2}>
                {getTypeUser() == 1 && (
                  <Button variant="contained" color="error">
                    Régler Prime
                  </Button>
                )}
                {/* Bouton Imprimer */}
                <Button variant="outlined" onClick={handlePrint}>
                  Imprimer
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* Tableau récapitulatif */}
          <Card>
            <CardContent>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                Tableau Récapitulatif
              </Typography>
              <Grid container spacing={2}>
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
                ].map((item) => (
                  <Grid item key={item.label}>
                    {" "}
                    {/* Use item prop */}
                    <Typography variant="subtitle2" color="text.secondary">
                      {item.label}
                    </Typography>
                    <Typography fontWeight="bold">
                      {formatNumberToFCFA(item.value)} FCFA
                    </Typography>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </div>

        {/* Le composant ContractPrintView pour l'impression, masqué à l'écran */}
        <div style={{ display: "none" }}>
          <ContractPrintView ref={componentRef} data={printData} />
        </div>
      </Box>
    </LocalizationProvider>
  );
}
