import { format } from "date-fns";
import { fr } from "date-fns/locale"; // <-- Correction ici : Importation de la locale

/**
 * @interface ReportData
 * @description Interface pour les données du rapport de situation.
 */
export interface ReportData {
  policeNumber: string;
  effectiveDate: string; // Format DD/MM/YYYY HH:mm:ss
  insuredNumber: string;
  contractType: string;
  cityDate: string; // e.g., "Conakry, le mercredi 28 mai 2025" - à générer dynamiquement ou fournir
  subscriberName: string;
  subscriberAddress: string;
  accountStatementDate: string; // Format DD/MM/YYYY
  evolution2024: {
    capitalAcquiredJan1: string;
    grossContributions2024: string;
    netContributions2024: string;
    exceptionalPayment2024: string;
    netInterestAcquired2024: string;
    profitSharing2023: string;
    partialRedemptions2024: string;
    assetManagementFees2024: string;
    capitalAcquiredDec31: string;
  };
}

/**
 * @interface SourceData
 * @description Interface pour les données brutes que vous avez fournies.
 */
export interface SourceData {
  CODE_PRODUIT: string;
  DESC_PRODUIT: string;
  CODE_FILIALE: string | null;
  DESC_FILIALE: string | null;
  CAPITAL: number | null;
  NUMERO_POLICE: string;
  DATE_DEBUT_EFFET_POLICE: string; // ISO 8601 string
  DATE_FIN_EFFET_POLICE: string | null;
  NUMERO_POLICE_EXTERNE: string;
  NUMERO_ASSURE: string;
  NOM_ASSURE: string;
  NUMERO_CLIENT: string;
  NOM_CLIENT: string;
  PRENOMS_CLIENT: string;
  ADRESSE_POSTALE: string;
  DESC_CIVILITE: string;
  COMPTE: string;
  LIBELLE_COMPTE: string;
  TAUX: string; // Assuming it's a string like "3.50000"
  COTISATION_BRUTE: number | null;
  MAIL_FILIALE: string;
  CALLCENTER_FILIALE: string;
  EPARGNE_ACQUISE_DEBUT: number;
  COTISATION_NETTE: number;
  VERSEMENT_LIBRE: number;
  INTERET: number;
  PARTICIPATION_BENEFICE: number;
  RACHATS_PARTIELS: number;
  FRAIS_GESTION: number;
  EPARGNE_ACQUISE_FIN: number;
}

/**
 * @function formatCurrency
 * @description Formate un nombre en chaîne de caractères avec des séparateurs de milliers.
 * @param {number} amount Le montant à formater.
 * @returns {string} Le montant formaté.
 */
const formatCurrency = (amount: number): string => {
  // Gérer le signe négatif si le nombre est négatif
  const isNegative = amount < 0;
  const absoluteAmount = Math.abs(amount);

  // Utiliser Intl.NumberFormat pour un formatage localisé
  const formatted = new Intl.NumberFormat("fr-FR").format(absoluteAmount);

  return isNegative ? `- ${formatted}` : formatted;
};

export function transformToReportData(
  sourceData: SourceData,
  // La date d'arrêt des comptes devrait idéalement venir de la sourceData ou être un paramètre clair
  // Date.now().toLocaleString() n'est pas le format DD/MM/YYYY attendu pour accountStatementDate
  // Je laisse la valeur par défaut à titre d'exemple, mais ajustez-la
  statementDate: string = "31/12/2024" // Utilisation d'une date fixe pour l'exemple
): ReportData {
  const cityDate = `Cameroun, le ${format(
    new Date("2025-06-12"),
    "EEEE dd MMMM yyyy",
    {
      // <-- Correction ici
      locale: fr, // <-- Correction ici
    }
  )}`;

  const effectiveDateObj = new Date(sourceData.DATE_DEBUT_EFFET_POLICE);
  const effectiveDateFormatted = format(
    effectiveDateObj,
    "dd/MM/yyyy HH:mm:ss"
  );

  // Assurez-vous que le nom de l'abonné est formaté comme vous le souhaitez.
  // Par exemple, si NOM_CLIENT et PRENOMS_CLIENT sont les bons champs pour le souscripteur.
  const subscriberFullName = `${sourceData.NOM_CLIENT} ${
    sourceData.PRENOMS_CLIENT || ""
  }`; // Ou sourceData.NOM_ASSURE / DESC_CIVILITE

  return {
    policeNumber: sourceData.NUMERO_POLICE,
    effectiveDate: effectiveDateFormatted,
    insuredNumber: sourceData.NUMERO_ASSURE,
    contractType: sourceData.DESC_PRODUIT,
    cityDate: cityDate,
    subscriberName: subscriberFullName.trim(), // Supprimer les espaces blancs superflus
    subscriberAddress: sourceData.ADRESSE_POSTALE,
    accountStatementDate: statementDate,
    evolution2024: {
      capitalAcquiredJan1: formatCurrency(sourceData.EPARGNE_ACQUISE_DEBUT),
      grossContributions2024: formatCurrency(sourceData.COTISATION_BRUTE || 0), // Utiliser 0 si null
      netContributions2024: formatCurrency(sourceData.COTISATION_NETTE),
      exceptionalPayment2024: formatCurrency(sourceData.VERSEMENT_LIBRE),
      netInterestAcquired2024: formatCurrency(sourceData.INTERET),
      profitSharing2023: formatCurrency(sourceData.PARTICIPATION_BENEFICE),
      partialRedemptions2024: formatCurrency(sourceData.RACHATS_PARTIELS),
      assetManagementFees2024: formatCurrency(sourceData.FRAIS_GESTION),
      capitalAcquiredDec31: formatCurrency(sourceData.EPARGNE_ACQUISE_FIN),
    },
  };
}
