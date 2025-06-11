"use client";

import { useContext, useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

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
  const [summaryCotisations, setSummaryCotisation] = useState<any>();

  const fetchCotisation = useCotisation(
    startDate.format("YYYY-MM-DD"),
    endDate.format("YYYY-MM-DD"),
    contratId
  );

  const summary = useCotisationTotal(
    startDate.format("DD/MM/YYYY"), // Format YYYY-MM-DD pour l'API SQL
    endDate.format("DD/MM/YYYY"), // Format YYYY-MM-DD pour l'API SQL
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
  }, [startDate, endDate, contratId]); // IdleDeadline n'est pas une dépendance valide pour useEffect

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
                  // C'est ici que vous définissez le format d'affichage pour l'utilisateur
                  format="DD/MM/YYYY" // <-- Ajoutez cette ligne pour le format d'affichage
                  onChange={(date) => {
                    if (date) setStartDate(date); // Mettez à jour avec l'objet Dayjs directement
                  }}
                  // Vous pouvez également ajouter `views={['day', 'month', 'year']}` si vous voulez restreindre la sélection à ces vues
                />
              </Grid>
              <Grid>
                <DatePicker
                  label="Date fin"
                  value={endDate}
                  // C'est ici que vous définissez le format d'affichage pour l'utilisateur
                  format="DD/MM/YYYY" // <-- Ajoutez cette ligne pour le format d'affichage
                  onChange={(date) => {
                    if (date) setEndDate(date); // Mettez à jour avec l'objet Dayjs directement
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
                      "NUMÉRO POLICE",
                      "DATE", // J'ai renommé pour correspondre à votre type CotisationClientIndiv.Echeance
                      "DÉBUT PÉRIODE",
                      "FIN PÉRIODE",

                      "PRIME PÉRIODIQUE",
                      "MONTANT ENCAISSÉ",
                      "ÉTAT QUITTANCE",
                    ].map((header) => (
                      <TableCell
                        key={header}
                        sx={{ fontWeight: "500", fontSize: "12px" }}
                        className="text-center text-[11px] text-black"
                      >
                        {header}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {fetchCotisation.isLoading && (
                    <div className="p-8 flex justify-center items-center">
                      Chargement des données en cours...
                    </div>
                  )}
                  {cotisations.length > 0 ? (
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
                        {/* <TableCell className="text-center">
                          {cotisation.MontantEmis} FCFA
                        </TableCell> */}
                        <TableCell className="text-center">
                          {cotisation.PrimePeriodique} FCFA
                        </TableCell>
                        {/* <TableCell className="text-center">
                          {cotisation.EcheanceAvance} FCFA{" "}
                          
                        </TableCell> */}
                        <TableCell className="text-center">
                          {cotisation.MontantEncaisse} FCFA
                        </TableCell>
                        {/* <TableCell className="text-center">
                          {cotisation.MontantRegularise} FCFA
                        </TableCell> */}
                        <TableCell className="text-center">
                          {cotisation.EtatQuittance}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center py-4">
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

              <Button variant="outlined">Imprimer</Button>
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
                  {" "}
                  {/* Ajout de 'item' pour chaque Grid */}
                  <Typography variant="subtitle2" color="text.secondary">
                    {item.label}
                  </Typography>
                  <Typography fontWeight="bold">{item.value} FCFA</Typography>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </LocalizationProvider>
  );
}
