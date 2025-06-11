"use client";

import { useEffect, useState } from "react";

import "@/lib/api/setup";

import PageTabs from "./component/PageTab";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { Contrat } from "@/app/Types/type";
import { useContratDetails } from "@/hooks/useContrat";
import { useContratContext } from "@/hooks/contexts/useContratContext";
import "./styles.scss";
export default function ModernDashboard({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentTab, setCurrentTab] = useState("Détails du contrat");

  const params = useParams();
  const id = params?.id;

  const { setContrat, contrat } = useContratContext();
  //   const contratDetails = useContratDetails(id as string);

  useEffect(() => {}, [id, contrat]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-2 contrat">
      {/* Main Content */}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-4 md:p-8 mx-auto"
      >
        <h1 className="text-2xl font-bold mb-6 text-primary">
          Détails du contrat
        </h1>

        <PageTabs
          tabs={[
            {
              label: "Détails du contrat",
              url: `/contrat/${id}/details`,
            },
            {
              label: "Relevé des cotisations",
              url: `/contrat/${id}/cotisations`,
            },
            {
              label: "Avis de situation",
              url: `/contrat/${id}/avis-situation`,
            },

            // {
            //   label: "Demande prestation",
            //   url: `/contrat/${id}/cotisations`,
            // },
            {
              label: "Prestation effectuées",
              url: `/contrat/${id}/sinistre`,
            },
          ]}
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
        />

        <div className="">{children}</div>
      </motion.div>
    </div>
  );
}
