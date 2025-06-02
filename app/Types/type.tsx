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
};

export type Agence = {
  IdAgence: number;
  DistrictAgence: string;
  LocalisationAgence: string;
  TelephoneAgence: string;
  Longitude: number;
  Latitude: number;
};
