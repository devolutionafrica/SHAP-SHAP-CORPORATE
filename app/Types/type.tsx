export type User = {
  IDE_UTILISATEUR: string;
  IDE_TYPE_UTILISATEUR: string;
  LOGIN: string;
  MOT_DE_PASSE: string;
  ISWINDOWSACCOUNT: number;
  EMAIL: string;
  MOBILE: string;
  ISFIRSTCONNEXION: number;
  IDE_CLIENT_UNIQUE: string[]; // Tableau de chaînes
  PHOTO_UTILISATEUR: string | null;
  Date_Creation: string; // ou Date si parsé
  KEY_CLIENT: string;
  CODE_FILIALE: string;
  NUMERO_CLIENT: string;
  NOM_CLIENT: string;
  PRENOMS_CLIENT: string;
  DATE_NAISSANCE: string;
  LIEU_NAISSANCE: string;
  SEXE: "M" | "F" | string;
  ADRESSE_POSTALE: string;
  TELEPHONE: string;
  TELEPHONE_1: string;
  PROFESSION: string;
  CIVILITE: string;
  NATIONALITE: string;
  SITUATION_MATRIMONIALE: string | null;
  LIEU_HABITATION: string | null;
  TYPE_CLIENT: string;
  CODE_BANQUE: string | null;
  CODE_AGENCE: string | null;
  NUMERO_DE_COMPTE: string;
  CLE_RIB: string | null;
  DATE_DEBUT: string; // ou Date si parsé
  DATE_FIN: string | null;
  IDE_REVENU_ANNUEL: string | null;
};

export type Contrat = {
  NumeroContrat: string;
  CodeProduit: string;
  Produit: string;
  DateDebutPolice: string; // ISO string
  DateFinPolice: string;
  DateSignatureConventionPolice: string;
  DureePolice: string;
  TypePolice: string;
  PeriodicieCotisation: string;
  Capital: number;
  DUREE_RENTE: string | null;
  PrimePeriodique: number;
  PeriodiciteRente: string | null;
  NumeroSouscripteur: string;
  NomSouscripteur: string;
  PrenomsSouscripteur: string | null;
  DateNaissanceSouscripteur: string | null;
  LieuNaissanceSouscripteur: string;
  TelephoneSouscripteur: string;
  AdressePostaleSouscripteur: string;
  NumeroAssure: string;
  NomAssure: string;
  PrenomsAssure: string;
  DateNaissanceAssure: string;
  LieuNaissanceAssure: string;
  TelephoneAssure: string;
  AdressePostaleAssure: string;
  ProfessionAssure: string | null;
  SituationMatrimonialeAssure: string | null;
  eMailAssure: string | null;
  SexeAssure: "M" | "F" | string;
  EtatPolice: string;
  MontantDeLaRente: number;
  DESC_PRODUIT: string;
};

export type Agence = {
  IdAgence: number;
  DistrictAgence: string;
  LocalisationAgence: string;
  TelephoneAgence: string;
  Longitude: number;
  Latitude: number;
};

export interface CotisationClientIndiv {
  NomPayeur: string;
  PrenomsPayeur: string;
  NumeroPayeur: string;
  AdressePostalePayeur: string;
  NumeroPolice: number;
  Souscripteur: string;
  LibelleProduit: string | null; // Peut être une chaîne ou null
  LibelleModePaiement: string;
  DateEffetPolice: string; // Les dates sont des chaînes (format ISO 8601 comme "YYYY-MM-DD")
  DateFinEffetPolice: string;
  CiviliteSouscripteur: string;
  NumeroQuittance: number;
  Echeance: string;
  DebutPeriode: string;
  FinPeriode: string;
  MontantEmis: number;
  FraisRejet: number;
  PrimePeriodique: number;
  EcheanceAvance: number;
  NombreQuittance: number;
  NombreQuittanceImpayees: number;
  MONTANT_KUBERA: number | null; // Peut être un nombre ou null
  NOMBRE_LIGNE_KUBERA: number | null; // Peut être un nombre ou null
  MontantEncaisse: number;
  MontantRegularise: number;
  EtatQuittance: string;
  CodeFiliale: string | null;
}

export interface Sinistre {
  NumeroPolice: string;
  NumeroSinistre: string;
  NumeroBeneficiaire: string;
  Beneficiaire: string;
  DateNaissanceBeneficiaire: string;
  AdressePostaleBeneficiaire: string;
  TelephoneBeneficiaire: string;
  CauseSinistre: string;
  EtatSinistre: string;
  TypeSinistre: string;
  LibelleSinistre: string;
  DateSurvenance: string; // Utiliser string pour "AAAA-MM-JJ"
  DateDeclaration: string; // Utiliser string pour "AAAA-MM-JJ"
  DateOuverture: string; // Utiliser string pour "AAAA-MM-JJ"
  DateCloture: string | null; // Peut être null, donc string | null
  DateSituation: string; // Utiliser string pour "AAAA-MM-JJ"
  MontantEstime: number | null; // Peut être null, donc number | null
  MontantRegle: number;
  CodeFiliale: string | null; // Peut être null, donc string | null
  DateReglement: string; // Utiliser string pour "AAAA-MM-JJ"
  NumeroReglement: number;
  ModeReglement: string;
}

// Placez ceci dans votre fichier de types, par exemple lib/data.ts ou types/index.ts

export interface Claim {
  NumeroPolice: string;
  NumeroSinistre: string;
  NumeroBeneficiaire: string; // <-- Conservé tel quel, car c'est la clé JSON fournie
  Beneficiaire: string;
  DateNaissanceBeneficiaire: string;
  AdressePostaleBeneficiaire: string;
  TelephoneBeneficiaire: string;
  CauseSinistre: string;
  EtatSinistre: string;
  TypeSinistre: string;
  LibelleSinistre: string;
  DateSurvenance: string;
  DateDeclaration: string;
  DateOuverture: string;
  DateCloture: string | null;
  DateSituation: string;
  MontantEstime: number | null;
  MontantRegle: number;
  CodeFiliale: string | null;
  DateReglement: string;
  NumeroReglement: number;
  ModeReglement: string;
}

export interface InfoPolice {
  NUMERO_POLICE: string;
  Produit: string;
  EtatPolice: string;
  NomAssure: string;
  PrenomsAssure: string;
  DateDebutPolice: string;
}

export interface Convention {
  IDE_CONVENTION: number;
  IDE_CLIENT_UNIQUE: string;
  NUMERO_DE_CONVENTION: string;
  LIBELLE_CONVENTION: string;
}

export interface SituationFinanciere {
  NumeroPolice: number;
  ValeurDeRachat: number;
  MontantMaximumValeurRachatPartiel: number;
  MontantRentePeriodiqueTheorique: number;
  CapitalAuTerme: number;
}

export interface Integrageur {
  IDE_OPERATEUR: number;
  LIBELLE: string;
  IS_ACTIF: boolean;
  URL_API?: string | null;
  URL_API_RETOUR?: string | null;
  LOGO: string;
  DESCRIPTION?: string | null;
}

export interface PayData {
  montant: string;
  devise: string;
  refTransaction: string;
  numero: string;
  OTPcode: string;
  quittances: CotisationClientIndiv[];
  numecorClient: string;
  codeFiliale: string;
  codeOperateur: string;
  operateur: string;
  referenceId: string;
  codeStatutTransaction: string;
  descriptionPayement: string;
}

export interface SuiviPaiementQuittanceLog {
  suiviPaiementQuittanceLog?: string | null;
  numeroQuittance: number;
  numeroPolice: number;
  montantQuittance: number;
  dateEnregistrement: string;
  telephone: string;
}
