"use client";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";

import PageTabs from "./component/PageTab";
import { useContratContext } from "@/hooks/contexts/useContratContext";
import { useState } from "react";

export default function ModernDashboard({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentTab, setCurrentTab] = useState("Détails du contrat");

  const params = useParams();
  const id = params?.id;

  const { contrat } = useContratContext();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-1/2 md:p-8 font-sans text-gray-800">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-6xl mx-auto  overflow-hidden p-1 md:p-10"
      >
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
          className="text-3xl md:text-4xl font-heading font-extrabold text-primary mb-8 leading-tight"
        >
          Détails du Contrat
        </motion.h1>

        {/* Composant de tabs */}
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
            {
              label: "Prestation effectuées",
              url: `/contrat/${id}/sinistre`,
            },
          ]}
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
        />

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
          className="mt-8 text-lg leading-relaxed text-gray-700"
        >
          {children}
        </motion.div>
      </motion.div>
    </div>
  );
}
