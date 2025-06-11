"use client";

import { useContext, useEffect, useRef, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useReactToPrint } from "react-to-print";

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

  const { getTypeUser } = useUser();

  const param = useParams();
  const contratId = param.id as string;

  const [cotisations, setCotisations] = useState<CotisationClientIndiv[]>([]);
  const [summaryCotisations, setSummaryCotisation] = useState<any>(null); // Initialisé à null pour indiquer que les données ne sont pas encore chargées

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
    await fetchCotisation
      .refetch()
      .then((response) => {
        // ** Défensivement, s'assurer que response.data.data est un tableau valide
        setCotisations((response.data && response.data.data) || []);
      })
      .catch((error) => {
        console.error(
          "Erreur lors de la récupération des cotisations :",
          error
        );
        setCotisations([]); // En cas d'erreur, s'assurer que c'est un tableau vide
        alert("Erreur lors de la récupération des cotisations.");
      });

    await summary
      .refetch()
      .then((response) => {
        // ** Défensivement, s'assurer que response.data.data est un objet valide
        setSummaryCotisation((response.data && response.data.data) || null); // Utilisez null si aucun résumé, ou {} si toujours un objet vide
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération du summary : ", error);
        setSummaryCotisation(null); // En cas d'erreur, s'assurer que c'est null
        alert("Erreur lors de la récupération du summary.");
      });
  };

  const preparedPrintData = () => {
    return {
      nom: contrat?.NomAssure || "N/A",
      prenoms: contrat?.PrenomsAssure || "N/A",
      adresse: contrat?.AdressePostaleAssure || "N/A",
      numero: contrat?.NumeroAssure || "N/A",
      numeroPolice: contrat?.NumeroContrat || "N/A",
      libelleProduit: contrat?.DESC_PRODUIT || "N/A",
      dateEffetPolice: contrat?.DateDebutPolice
        ? dayjs(contrat.DateDebutPolice).format("DD/MM/YYYY")
        : "N/A",
      finEffetPolice: contrat?.DateFinPolice
        ? dayjs(contrat.DateFinPolice).format("DD/MM/YYYY")
        : "N/A",
      souscripteurNomComplet: `${contrat?.NomAssure || "N/A"} ${
        contrat?.PrenomsAssure || ""
      }`.trim(),
      modeDePaiement: "N/A",

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
  };

  useEffect(() => {
    fetchCotisationData();
    if (cotisations) {
      setPrintdata(preparedPrintData());
    }
  }, [startDate, endDate, contratId]);

  const componentRef = useRef<HTMLDivElement>(null);

  const formatNumberToFCFA = (num: number | null | undefined): string => {
    if (num === null || num === undefined) return "0";
    return new Intl.NumberFormat("fr-FR").format(num);
  };

  const [printData, setPrintdata] = useState<any>(null);

  const handlePrint = useReactToPrint({
    pageStyle: `@page { size: A4 portrait; margin: 5mm; }`,
    documentTitle: "ContratCotisations",
    contentRef: componentRef,
  });

  const printContent = () => {
    window.print();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box p={3}>
        {/* Header infos */}
        {contrat && (
          <div>
            <div className="p-2 bg-[#223268] text-white rounded px-6">
              <Grid container spacing={12}>
                <Grid>
                  <Typography variant="subtitle2" className="text-white">
                    Libellé Produit
                  </Typography>
                  <Typography fontWeight="bold">
                    {contrat.DESC_PRODUIT}
                  </Typography>
                </Grid>
                <Grid>
                  <Typography variant="subtitle2">Numéro Police</Typography>
                  <Typography fontWeight="bold">
                    {contrat.NumeroContrat}
                  </Typography>
                </Grid>
                <Grid>
                  <Typography variant="subtitle2">Date début effet</Typography>
                  <Typography fontWeight="bold">
                    {contrat.DateDebutPolice &&
                      dayjs(contrat.DateDebutPolice).format("DD/MM/YYYY")}
                  </Typography>
                </Grid>
                <Grid>
                  <Typography variant="subtitle2">Date fin effet</Typography>
                  <Typography fontWeight="bold">
                    {contrat.DateFinPolice &&
                      dayjs(contrat.DateFinPolice).format("DD/MM/YYYY")}
                  </Typography>
                </Grid>
              </Grid>
            </div>
          </div>
        )}

        {/* Date filter */}
        <div className="mt-4 mb-2">
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid>
                <DatePicker
                  label="Date début"
                  value={startDate}
                  format="DD/MM/YYYY"
                  onChange={(date) => {
                    if (date) setStartDate(date);
                  }}
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
                />
              </Grid>
            </Grid>
          </CardContent>
        </div>

        {/* Message */}
        <Typography variant="body2" sx={{ mb: 2 }}>
          Nous vous remercions de la confiance placée en notre compagnie en nous
          confiant la gestion de votre contrat d'assurance cité en référence. La
          situation des cotisations de votre contrat sur la base des
          encaissements tels que reçus de nos services au{" "}
          <span className="font-bold">{endDate.format("DD/MM/YYYY")}</span> fait
          apparaître les règlements suivants, sauf erreur de notre part.
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
                        className="text-center text-[11px] text-white"
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
                        <CircularProgress size={24} /> Chargement des données en
                        cours...
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
                            dayjs(cotisation.DebutPeriode).format("DD/MM/YYYY")}
                        </TableCell>
                        <TableCell className="text-center">
                          {cotisation.FinPeriode &&
                            dayjs(cotisation.FinPeriode).format("DD/MM/YYYY")}
                        </TableCell>
                        <TableCell className="text-center">
                          {formatNumberToFCFA(cotisation.PrimePeriodique)} FCFA
                        </TableCell>
                        <TableCell className="text-center">
                          {formatNumberToFCFA(cotisation.MontantEncaisse)} FCFA
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
              {getTypeUser() === 1 && (
                <Button variant="contained" color="error">
                  Régler Prime
                </Button>
              )}

              <Button variant="outlined" onClick={() => handlePrint()}>
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
                <Grid key={item.label}>
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
      </Box>
      {/* Le composant ContractPrintView pour l'impression, masqué à l'écran */}
      <div style={{ display: "none" }}>
        {printData && (
          <ContractPrintView ref={componentRef} data={printData!} />
        )}
      </div>
    </LocalizationProvider>
  );
}
