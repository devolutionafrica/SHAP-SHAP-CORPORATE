// lib/data.ts
// Conservez ce fichier si vous utilisez les données simulées.
// Sinon, vous remplacerez ces fonctions par vos appels API réels.

export interface Policy {
  libelleProduit: string;
  numeroPolice: string;
  dateDebutEffet: string;
  dateFinEffet: string;
}

// lib/data.ts (ou types/index.ts)

export interface Claim {
  NumeroBeneficiaire: string;
  NumeroSinistre: string;
  LibelleSinistre: string;
  DateReglement: string;
  NumeroReglement: number;
  ModeReglement: string;
  CauseSinistre: string;
  DateReceptionDeclaration: string;
  MontantRegleTTC: number;
}

// Nouvelle fonction pour obtenir tous les sinistres (ou une liste générale)
export const sinistre = [
  {
    numeroBeneficiaire: "BENF001",
    numeroSinistre: "SIN001",
    libelleSinistre: "Accident de la route",
    dateReglement: "01/03/2025",
    numeroReglement: "REG001",
    modeReglement: "Virement",
    causeSinistre: "Collision",
    dateReceptionDeclaration: "15/02/2025",
    montantRegleTTC: 1500000,
  },
  {
    numeroBeneficiaire: "BENF002",
    numeroSinistre: "SIN002",
    libelleSinistre: "Incendie habitation",
    dateReglement: "10/04/2025",
    numeroReglement: "REG002",
    modeReglement: "Chèque",
    causeSinistre: "Court-circuit",
    dateReceptionDeclaration: "20/03/2025",
    montantRegleTTC: 5000000,
  },
  {
    numeroBeneficiaire: "BENF003",
    numeroSinistre: "SIN003",
    libelleSinistre: "Dégât des eaux",
    dateReglement: "22/05/2025",
    numeroReglement: "REG003",
    modeReglement: "Prélèvement",
    causeSinistre: "Fuite de toiture",
    dateReceptionDeclaration: "05/05/2025",
    montantRegleTTC: 800000,
  },
  {
    numeroBeneficiaire: "BENF004",
    numeroSinistre: "SIN004",
    libelleSinistre: "Vol de véhicule",
    dateReglement: "01/06/2025",
    numeroReglement: "REG004",
    modeReglement: "Virement",
    causeSinistre: "Effraction",
    dateReceptionDeclaration: "10/05/2025",
    montantRegleTTC: 3000000,
  },
  {
    numeroBeneficiaire: "BENF005",
    numeroSinistre: "SIN005",
    libelleSinistre: "Assistance médicale",
    dateReglement: "28/05/2025",
    numeroReglement: "REG005",
    modeReglement: "Remboursement",
    causeSinistre: "Maladie subite",
    dateReceptionDeclaration: "20/05/2025",
    montantRegleTTC: 250000,
  },
  // Ajoutez plus de données si vous voulez tester la pagination
  {
    numeroBeneficiaire: "BENF006",
    numeroSinistre: "SIN006",
    libelleSinistre: "Bris de glace",
    dateReglement: "05/06/2025",
    numeroReglement: "REG006",
    modeReglement: "Virement",
    causeSinistre: "Choc",
    dateReceptionDeclaration: "01/06/2025",
    montantRegleTTC: 120000,
  },
  {
    numeroBeneficiaire: "BENF007",
    numeroSinistre: "SIN007",
    libelleSinistre: "Dégâts électriques",
    dateReglement: "12/06/2025",
    numeroReglement: "REG007",
    modeReglement: "Chèque",
    causeSinistre: "Surtension",
    dateReceptionDeclaration: "08/06/2025",
    montantRegleTTC: 400000,
  },
  {
    numeroBeneficiaire: "BENF008",
    numeroSinistre: "SIN008",
    libelleSinistre: "Perte de bagages",
    dateReglement: "15/06/2025",
    numeroReglement: "REG008",
    modeReglement: "Remboursement",
    causeSinistre: "Oubli aéroport",
    dateReceptionDeclaration: "10/06/2025",
    montantRegleTTC: 100000,
  },
];

export const getClaimsForPolicy = (policeId: string): Claim[] => {
  // Cette fonction est pour la page spécifique d'une police.
  // Pour cette page de sinistres générale, nous allons utiliser getAllClaims.
  // Vous pouvez adapter ici si cette page doit filtrer les sinistres d'une police spécifique
  // en fonction d'un critère (par ex: dans l'URL '/sinistres?police=123').
  // Pour l'exemple, nous allons la laisser telle quelle ou retourner un sous-ensemble de getAllClaims.
  return []; // Ou retourner toutes les claims si cette page est censée être un "hub" de sinistres
};

// lib/data.ts (ajouter cette interface)

export interface Adhesion {
  NOM: string;
  PRENOM: string;
  NUMERO_CONTRAT: string;
  DATE_DEBUT_POLICE: string;
  PERIODICITE_COTISATION: string;
  ETAT_POLICE: string;
}

export const allAdhesions: Adhesion[] = [
  {
    NOM: "DUBOIS",
    PRENOM: "JEAN",
    NUMERO_CONTRAT: "53500428",
    DATE_DEBUT_POLICE: "01/09/2021",
    PERIODICITE_COTISATION: "MENSUELLE",
    ETAT_POLICE: "ACTIF",
  },
  {
    NOM: "MARTIN",
    PRENOM: "MARIE",
    NUMERO_CONTRAT: "53500429",
    DATE_DEBUT_POLICE: "15/10/2022",
    PERIODICITE_COTISATION: "TRIMESTRIELLE",
    ETAT_POLICE: "INCONNU",
  },
  {
    NOM: "LEGRAND",
    PRENOM: "PIERRE",
    NUMERO_CONTRAT: "53500430",
    DATE_DEBUT_POLICE: "01/03/2023",
    PERIODICITE_COTISATION: "ANNUELLE",
    ETAT_POLICE: "SUSPENDU",
  },
  {
    NOM: "BERNARD",
    PRENOM: "SOPHIE",
    NUMERO_CONTRAT: "53500431",
    DATE_DEBUT_POLICE: "20/07/2020",
    PERIODICITE_COTISATION: "MENSUELLE",
    ETAT_POLICE: "ACTIF",
  },
  {
    NOM: "ROBERT",
    PRENOM: "LUC",
    NUMERO_CONTRAT: "53500432",
    DATE_DEBUT_POLICE: "05/01/2024",
    PERIODICITE_COTISATION: "TRIMESTRIELLE",
    ETAT_POLICE: "ACTIF",
  },
  // ... plus d'adhésions si nécessaire
];

export function getAdhesions(
  nomPrenom?: string,
  numeroPolice?: string
): Adhesion[] {
  // Ceci est une donnée simulée. Remplacez par votre logique de récupération API.
  const allAdhesions: Adhesion[] = [
    {
      NOM: "DUBOIS",
      PRENOM: "JEAN",
      NUMERO_CONTRAT: "53500428",
      DATE_DEBUT_POLICE: "01/09/2021",
      PERIODICITE_COTISATION: "MENSUELLE",
      ETAT_POLICE: "ACTIF",
    },
    {
      NOM: "MARTIN",
      PRENOM: "MARIE",
      NUMERO_CONTRAT: "53500429",
      DATE_DEBUT_POLICE: "15/10/2022",
      PERIODICITE_COTISATION: "TRIMESTRIELLE",
      ETAT_POLICE: "INCONNU",
    },
    {
      NOM: "LEGRAND",
      PRENOM: "PIERRE",
      NUMERO_CONTRAT: "53500430",
      DATE_DEBUT_POLICE: "01/03/2023",
      PERIODICITE_COTISATION: "ANNUELLE",
      ETAT_POLICE: "SUSPENDU",
    },
    {
      NOM: "BERNARD",
      PRENOM: "SOPHIE",
      NUMERO_CONTRAT: "53500431",
      DATE_DEBUT_POLICE: "20/07/2020",
      PERIODICITE_COTISATION: "MENSUELLE",
      ETAT_POLICE: "ACTIF",
    },
    {
      NOM: "ROBERT",
      PRENOM: "LUC",
      NUMERO_CONTRAT: "53500432",
      DATE_DEBUT_POLICE: "05/01/2024",
      PERIODICITE_COTISATION: "TRIMESTRIELLE",
      ETAT_POLICE: "ACTIF",
    },
    // ... plus d'adhésions si nécessaire
  ];

  let filteredAdhesions = allAdhesions;

  if (nomPrenom) {
    const searchName = nomPrenom.toLowerCase();
    filteredAdhesions = filteredAdhesions.filter(
      (adhesion) =>
        adhesion.NOM.toLowerCase().includes(searchName) ||
        adhesion.PRENOM.toLowerCase().includes(searchName)
    );
  }

  if (numeroPolice) {
    filteredAdhesions = filteredAdhesions.filter((adhesion) =>
      adhesion.NUMERO_CONTRAT.includes(numeroPolice)
    );
  }

  return filteredAdhesions;
}
