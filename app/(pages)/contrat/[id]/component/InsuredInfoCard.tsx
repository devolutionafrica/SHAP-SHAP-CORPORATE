"use client"; // Indique que c'est un Client Component

import React from "react";
import { motion } from "framer-motion"; // Importer motion pour les animations
import {
  User as UserIcon, // Renommer pour éviter le conflit avec le type User
  Cake,
  MapPin,
  Mail, // Ou Home, si l'adresse est postale
  Phone,
  ScanText, // Ou un autre pour le nom/prénom
} from "lucide-react"; // Importer les icônes pertinentes de lucide-react
import dayjs from "dayjs"; // Importer dayjs

// Assume Field.tsx est dans le même répertoire ou un chemin accessible
// Et que Field.tsx a été modifié pour accepter la prop Icon
import { Field } from "./Field";

// Si votre format de date source n'est PAS toujours YYYYMMDD ou un format ISO standard (YYYY-MM-DD),
// et si vous avez des dates comme "19590120", vous pourriez avoir besoin d'un plugin Day.js
// ou de parser manuellement avant de formater.
// Par exemple, si vous savez que c'est TOUJOURS YYYYMMDD:
// import customParseFormat from 'dayjs/plugin/customParseFormat';
// dayjs.extend(customParseFormat);

// Définition du type User (Assurez-vous que ce chemin est correct : "@/app/Types/type")
import { User } from "@/app/Types/type";

export const formatDate = (dateString: string | undefined): string => {
  if (!dateString) {
    return ""; // Retourne "" si la date est undefined ou null
  }

  // Tente de parser la date. Si dateString est "YYYYMMDD", dayjs devrait le gérer.
  // Si vous rencontrez des problèmes, et que le format est strict "YYYYMMDD",
  // vous pouvez utiliser : dayjs(dateString, "YYYYMMDD").format("DD/MM/YYYY");
  // (nécessite le plugin customParseFormat si ce n'est pas un format reconnu par défaut)
  try {
    const date = dayjs(dateString);
    if (date.isValid()) {
      return date.format("DD/MM/YYYY");
    }
  } catch (error) {
    console.error("Erreur lors du formatage de la date:", dateString, error);
  }
  return dateString; // Retourne la chaîne originale si le formatage échoue
};

export const InsuredInfoCard = ({ user }: { user: User }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }} // Animation pour la carte entière
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-2xl p-6 md:p-8 space-y-6 border-2 border-primary-500"
    >
      <div className="flex items-center space-x-3 pb-4 border-b border-gray-200">
        <motion.div
          initial={{ rotate: -90, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 150 }}
          className="text-primary-700"
        >
          <UserIcon size={28} /> {/* Icône principale pour "Assuré" */}
        </motion.div>
        <h2 className="text-2xl font-bold text-primary-800">
          Informations de l'Assuré
        </h2>
      </div>

      {user ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Nom" value={user.NOM_CLIENT ?? ""} Icon={ScanText} />
          <Field
            label="Prénoms"
            value={user.PRENOMS_CLIENT ?? ""}
            Icon={ScanText}
          />
          <Field
            label="Date de Naissance"
            value={formatDate(user.DATE_NAISSANCE)}
            Icon={Cake}
          />
          <Field
            label="Lieu de Naissance"
            value={user.LIEU_NAISSANCE ?? ""}
            Icon={MapPin}
          />
          <Field
            label="Adresse Postale"
            value={user.ADRESSE_POSTALE ?? ""}
            Icon={Mail}
          />{" "}
          {/* Ou Home */}
          <Field label="Téléphone" value={user.TELEPHONE ?? ""} Icon={Phone} />
          {/* Ajoutez d'autres champs si nécessaire avec des icônes appropriées */}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-center text-gray-500 py-8"
        >
          <p>Aucune information sur l'assuré disponible.</p>
        </motion.div>
      )}
    </motion.div>
  );
};
