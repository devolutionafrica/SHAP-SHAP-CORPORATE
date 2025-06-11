import React from "react";
import { Field } from "./Field";
import { User } from "@/app/Types/type";
import dayjs from "dayjs"; // Importer dayjs

// Si votre format de date source n'est PAS toujours YYYYMMDD ou un format ISO standard (YYYY-MM-DD),
// et si vous avez des dates comme "19590120", vous pourriez avoir besoin d'un plugin Day.js
// ou de parser manuellement avant de formater.
// Par exemple, si vous savez que c'est TOUJOURS YYYYMMDD:
// import customParseFormat from 'dayjs/plugin/customParseFormat';
// dayjs.extend(customParseFormat);

export const InsuredInfoCard = ({ user }: { user: User }) => {
  // Fonction utilitaire pour formater les dates
  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) {
      return "N/A"; // Retourne "N/A" si la date est undefined ou null
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
      console.error("Error formatting date:", dateString, error);
    }
    return dateString; // Retourne la chaîne originale si le formatage échoue
  };

  return (
    <div className="bg-white rounded shadow-lg p-6">
      <h2 className="text-lg font-semibold text-gray-700">Assuré</h2>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <Field label="Nom" value={user?.NOM_CLIENT ?? "N/A"} />
        <Field label="Prénoms" value={user?.PRENOMS_CLIENT ?? "N/A"} />
        <Field
          label="Date de Naissance"
          value={formatDate(user?.DATE_NAISSANCE)} // Appliquer le formatage ici
        />
        <Field
          label="Lieu de Naissance"
          value={user?.LIEU_NAISSANCE ?? "N/A"}
        />
        <Field label="Adresse Postale" value={user?.ADRESSE_POSTALE ?? "N/A"} />
        <Field label="Téléphone" value={user?.TELEPHONE ?? "N/A"} />
      </div>
    </div>
  );
};
