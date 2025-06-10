"use client";
import { motion } from "framer-motion";
import PageTabs from "../component/PageTab";
import ContractInfoCard from "../component/ContratInfoCard";
import { InsuredInfoCard } from "../component/InsuredInfoCard";
import { useContratContext } from "@/hooks/contexts/useContratContext";
import { useEffect } from "react";
import { useContratDetails } from "@/hooks/useContrat";
import { useParams } from "next/navigation";
import { Contrat } from "@/app/Types/type";
import { CircularProgress } from "@mui/material";
import LoaderData from "@/components/LoaderComponent";

export default function ContractDetailsPage() {
  const { contrat, setContrat } = useContratContext();

  const params = useParams();
  const id = params?.id;

  const contratDetails = useContratDetails(id as string);
  const fetchDetails = async () => {
    try {
      const result = await contratDetails.refetch();
      console.log("Fetched contract details:\n\n", result.data);
      if (result.data.sizes > 0) {
        setContrat(result.data.data[0] as Contrat);
      }
    } catch (error) {
      console.error("Error fetching contract details:", error);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, []);

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
      <div className="flex flex-row flex-wrap gap-4 items-stretch justify-start">
        {contratDetails.data && <ContractInfoCard />}
        {contratDetails.data && <InsuredInfoCard />}
      </div>
    </motion.div>
  );
}
