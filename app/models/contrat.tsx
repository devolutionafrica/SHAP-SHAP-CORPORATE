export type Contrat = {
  IDE_CONTRAT: number;
  NUMERO_CONTRAT: string;
  CODE_FILIALE: string;
  NUMERO_CLIENT: string;
  DATE_EFFET: Date;
  DATE_ECHEANCE: Date;
  MONTANT_PRIME: number;
  MONTANT_GARANTIE: number;
};
export type DetailContrat = {
  IDE_CONTRAT: number;
  NUMERO_CONTRAT: string;
  CODE_FILIALE: string;
  NUMERO_CLIENT: string;
  DATE_EFFET: Date;
  DATE_ECHEANCE: Date;
  MONTANT_PRIME: number;
  MONTANT_GARANTIE: number;
  LIBELLE_GARANTIE: string;
  LIBELLE_CONTRAT: string;
  LIBELLE_TYPE_CONTRAT: string;
  LIBELLE_SOUS_TYPE_CONTRAT: string;
};
