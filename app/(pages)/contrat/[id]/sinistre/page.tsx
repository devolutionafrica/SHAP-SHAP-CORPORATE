// app/(main)/sinistres/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
// import ClaimTable from "../lib/data"; // Votre composant de tableau
import { Card } from "@/components/ui/card"; // Composant Card de shadcn/ui ou votre implémentation
import { Info } from "lucide-react";
import ClaimTable from "@/components/ClaimsTable";
import { sinistre } from "../lib/data";
import { useParams } from "next/navigation";
import { useSinistre } from "@/hooks/useSinistre";
import { Sinistre } from "@/app/Types/type";

export default function SinistresPage() {
  const params = useParams();
  const id = params?.id;

  const [sinistres, setSinistre] = useState<Sinistre[] | null>(null);
  const loaderSinistre = useSinistre(id as string);

  const fetchSinistres = async () => {
    try {
      const result = await loaderSinistre.refetch();

      console.log("Fetched sinistres:", result.data);
      setSinistre(result.data.data as Sinistre[]);
    } catch (error) {
      console.error("Error fetching sinistres:", error);
      alert("Erreur lors du chargement des sinistres.");
      setSinistre(null);
    }
  };

  useEffect(() => {
    fetchSinistres();
  }, [id]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="container mx-auto p-4 sm:p-6 lg:p-8 space-y-8"
    >
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="text-3xl sm:text-4xl font-extrabold text-gray-900 text-center mb-6"
      >
        Liste des Sinistres
      </motion.h1>

      {/* Tableau des Sinistres */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        {loaderSinistre.isLoading ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">Chargement des sinistres...</p>
          </div>
        ) : sinistres && sinistres.length > 0 ? (
          <ClaimTable claims={sinistres} />
        ) : (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">Aucun sinistre trouvé.</p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
