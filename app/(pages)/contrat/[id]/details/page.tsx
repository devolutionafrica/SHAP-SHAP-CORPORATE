"use client";
import { motion } from "framer-motion";
import PageTabs from "../component/PageTab";
import ContractInfoCard from "../component/ContratInfoCard";
import { InsuredInfoCard } from "../component/InsuredInfoCard";
import { useContratContext } from "@/hooks/contexts/useContratContext";
import { useEffect, useState } from "react";
import { useContratDetails } from "@/hooks/useContrat";
import { useParams } from "next/navigation";
import { Contrat } from "@/app/Types/type";
import { CircularProgress } from "@mui/material";
import LoaderData from "@/components/LoaderComponent";
import { useUserInfoById } from "@/hooks/useUserInfo";
import SituationFinanciereCard from "../component/SituationFinanciereCard";

export default function ContractDetailsPage() {
  const {
    contrat,
    setContrat,
    setSouscripteur,
    souscripteur,
    situationFinanciere,
    setSituationFinanciere,
  } = useContratContext();

  const params = useParams();
  const id = params?.id;
  const [userId, setUserId] = useState();

  // const userDetails = useUserInfoById(contrat?.NumeroSouscripteur!);
  const contratDetails = useContratDetails(id as string);
  const fetchDetails = async () => {
    try {
      const result = await contratDetails.refetch();

      if (result.data.sizes > 0) {
        setContrat(result.data.data[0] as Contrat);
      }

      setSouscripteur(result.data.suscripber);
      setSituationFinanciere(result.data.situationFinanciere);
    } catch (error) {
      console.error("Error fetching contract details:", error);
    }
  };

  useEffect(() => {
    fetchDetails();
    // fetchUser();
  }, [contrat, souscripteur]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4 md:p-8 w-full"
    >
      {contratDetails.isLoading && (
        <LoaderData label="Chargement des données du contrat" />
      )}
      <div className="flex flex-row flex-wrap gap-2 justify-start">
        {contratDetails.data && <ContractInfoCard />}

        {souscripteur && <InsuredInfoCard user={souscripteur!} />}
        {situationFinanciere && (
          <SituationFinanciereCard situation={situationFinanciere} />
        )}
      </div>
    </motion.div>
  );
}
