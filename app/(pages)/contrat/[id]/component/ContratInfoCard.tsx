"use client"; // Assurez-vous que c'est un Client Component

import React from "react";
import { useContratContext } from "@/hooks/contexts/useContratContext";
import dayjs from "dayjs"; // Importer dayjs
import { motion } from "framer-motion"; // Importer motion pour les animations

// Importer les icônes pertinentes de lucide-react
import {
  FileText,
  Tag,
  Clock,
  Repeat,
  CalendarDays,
  CalendarCheck,
  Package,
  ShieldCheck, // Pour "Police Information"
} from "lucide-react";

// --- Composant Field modifié ---
// Ce composant affichera l'icône, le label et la valeur avec une animation
const Field = ({
  label,
  value,
  Icon,
}: {
  label: string;
  value: string;
  Icon: React.ElementType; // Type pour le composant icône
}) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }} // Animation d'entrée
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay: 0.1 }}
    className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 shadow-sm"
  >
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }} // Animation de l'icône
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="text-primary-600 flex-shrink-0" // Couleur primaire pour l'icône
    >
      <Icon size={20} /> {/* Rendre l'icône */}
    </motion.div>
    <div>
      <div className="text-gray-500 text-xs font-medium uppercase leading-none">
        {label}
      </div>
      <div className="font-semibold text-gray-900 text-sm break-words">
        {value || "-"} {/* Afficher "-" si la valeur est vide */}
      </div>
    </div>
  </motion.div>
);

// --- Composant ContractInfoCard ---
const ContractInfoCard = () => {
  const { contrat } = useContratContext();

  // Fonction utilitaire pour formater les dates
  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) {
      return "";
    }
    return dayjs(dateString).format("DD/MM/YYYY");
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }} // Animation pour la carte entière
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-2xl p-6 md:p-8 space-y-6 border-2 border-primary-500" // Bordure colorée
    >
      <div className="flex items-center space-x-3 pb-4 border-b border-gray-200">
        <motion.div
          initial={{ rotate: -90, opacity: 0 }} // Animation du titre de la carte
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 150 }}
          className="text-primary-700"
        >
          <ShieldCheck size={28} />
        </motion.div>
        <h2 className="text-2xl font-bold text-primary-800">
          Informations de la Police
        </h2>
      </div>

      {contrat ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field
            label="Numéro de Police"
            value={contrat.NumeroContrat}
            Icon={Tag}
          />
          <Field
            label="Type de Police"
            value={contrat.TypePolice}
            Icon={FileText}
          />
          <Field
            label="Durée de la Police"
            value={contrat.DureePolice}
            Icon={Clock}
          />
          <Field
            label="Périodicité"
            value={contrat.PeriodicieCotisation}
            Icon={Repeat}
          />
          <Field
            label="Date début Effet"
            value={formatDate(contrat.DateDebutPolice)}
            Icon={CalendarDays}
          />
          <Field
            label="Date Fin Effet"
            value={formatDate(contrat.DateFinPolice)}
            Icon={CalendarDays} // Ou CalendarX si vous préférez une icône différente
          />
          <Field
            label="Date signature contrat"
            value={formatDate(contrat.DateSignatureConventionPolice)}
            Icon={CalendarCheck}
          />
          <Field
            label="Libellé Produit"
            value={contrat.DESC_PRODUIT}
            Icon={Package}
          />
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-center text-gray-500 py-8"
        >
          <p>Aucune information de police disponible.</p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ContractInfoCard;
