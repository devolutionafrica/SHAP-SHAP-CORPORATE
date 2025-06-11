import React from "react";
import dayjs from "dayjs";

// Définir les types (comme précédemment)
interface QuittancePrintData {
  NUMERO_QUITTANCE: string;
  DATE_QUITTANCE: string;
  DEBUT_PERIODE: string;
  FIN_PERIODE: string;
  MONTANT_EMIS: string;
  PRIME_PERIODIQUE: string;
  ECHEANCE_D_AVANCE: string;
  FRAIS_REJET: string;
  MONTANT_COTISE: string;
  MONTANT_REGULARISE: string;
  ETAT_DE_LA_QUITTANCE: string;
}

interface ContractPrintViewProps {
  data: {
    nom: string;
    prenoms: string;
    adresse: string;
    numero: string;
    numeroPolice: string;
    libelleProduit: string;
    dateEffetPolice: string;
    finEffetPolice: string;
    souscripteurNomComplet: string;
    modeDePaiement: string;
    quittances: QuittancePrintData[];
    nombreTotalEmission: number;
    montantTotalEmis: number;
    nombreTotalEncaissement: number;
    montantTotalEncaisse: number;
    nombreTotalImpayes: number;
    montantTotalImpayes: number;
    echeanceAvanceNonReglee: number;
    nombreDeQuittancesEncaissees: number;
    montantTotalDesQuittancesEncaissees: number;
  };
}

// Le composant utilisant React.forwardRef
const ContractPrintView = React.forwardRef<
  HTMLDivElement,
  ContractPrintViewProps
>(({ data }, ref) => {
  const printDate = dayjs().format("DD/MM/YYYY");
  const printTime = dayjs().format("HH:mm:ss");

  const formatNumberToFCFA = (num: number | null | undefined): string => {
    if (num === null || num === undefined) return "0";
    return new Intl.NumberFormat("fr-FR").format(num);
  };

  return (
    <div ref={ref} className="p-6 bg-white shadow-lg print-page">
      <h1 className="text-2xl font-bold mb-4 text-center">
        QUITTANCES RÉGLÉES ET IMPAYÉES
      </h1>
      <p className="text-sm text-right mb-6">
        Date Heure Edition: {printDate} {printTime}
      </p>

      <div className="mb-6 border p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-3">
          Informations sur le Preneur d'assurance
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm">
          <p>
            <strong>Nom:</strong> {data.nom}
          </p>
          <p>
            <strong>Prénoms:</strong> {data.prenoms}
          </p>
          <p>
            <strong>Adresse:</strong> {data.adresse}
          </p>
          <p>
            <strong>Numéro:</strong> {data.numero}
          </p>
          <p>
            <strong>Numéro de Police:</strong> {data.numeroPolice}
          </p>
          <p>
            <strong>Libellé Produit:</strong> {data.libelleProduit}
          </p>
          <p>
            <strong>Date Effet de Police:</strong> {data.dateEffetPolice}
          </p>
        </div>
      </div>

      <div className="mb-6 border p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-3">
          Informations sur le Souscripteur
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm">
          <p>
            <strong>Souscripteur:</strong> {data.souscripteurNomComplet}
          </p>
          <p>
            <strong>Mode De Paiement:</strong> {data.modeDePaiement}
          </p>
          <p>
            <strong>Fin Effet de Police:</strong> {data.finEffetPolice}
          </p>
        </div>
      </div>

      <p className="mb-6 text-sm">
        MONSIEUR, Nous vous remercions de la confiance placée en notre compagnie
        en nous confiant la gestion de votre contrat d'assurance cité en
        référence. La situation des cotisations de votre contrat sur la base des
        encaissements tels que reçus de nos services au fait apparaître, les
        règlements suivants, sauf erreur de notre part.
      </p>

      <h2 className="text-lg font-semibold mb-3">Situation des Cotisations</h2>
      <div className="overflow-x-auto mb-6">
        <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r">
                NUMERO QUITTANCE
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r">
                DATE QUITTANCE
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r">
                DEBUT PERIODE
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r">
                FIN PERIODE
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r">
                MONTANT EMIS
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r">
                PRIME PERIODIQUE
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r">
                ECHEANCE D'AVANCE
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r">
                FRAIS REJET
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r">
                MONTANT COTISE
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r">
                MONTANT REGULARISE
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                ETAT DE LA QUITTANCE
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.quittances.length > 0 ? (
              data.quittances.map((quittance, index) => (
                <tr key={index}>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 border-r">
                    {quittance.NUMERO_QUITTANCE}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 border-r">
                    {quittance.DATE_QUITTANCE}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 border-r">
                    {quittance.DEBUT_PERIODE}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 border-r">
                    {quittance.FIN_PERIODE}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 border-r text-right">
                    {quittance.MONTANT_EMIS}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 border-r text-right">
                    {quittance.PRIME_PERIODIQUE}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 border-r text-right">
                    {quittance.ECHEANCE_D_AVANCE}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 border-r text-right">
                    {quittance.FRAIS_REJET}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 border-r text-right">
                    {quittance.MONTANT_COTISE}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 border-r text-right">
                    {quittance.MONTANT_REGULARISE}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                    {quittance.ETAT_DE_LA_QUITTANCE}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={11}
                  className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 text-center"
                >
                  Aucune quittance disponible pour l'impression.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <h2 className="text-lg font-semibold mb-3">
        Récapitulatif des Encaissements
      </h2>
      <div className="mb-6 border p-4 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm">
          <p>
            <strong>NOMBRE TOTAL EMISSION:</strong> {data.nombreTotalEmission}
          </p>
          <p>
            <strong>MONTANT TOTAL EMIS:</strong>{" "}
            {formatNumberToFCFA(data.montantTotalEmis)} FCFA
          </p>
          <p>
            <strong>NOMBRE TOTAL ENCAISSEMENT:</strong>{" "}
            {data.nombreTotalEncaissement}
          </p>
          <p>
            <strong>MONTANT TOTAL ENCAISSE:</strong>{" "}
            {formatNumberToFCFA(data.montantTotalEncaisse)} FCFA
          </p>
          <p>
            <strong>NOMBRE TOTAL DES IMPAYES:</strong> {data.nombreTotalImpayes}
          </p>
          <p>
            <strong>MONTANT TOTAL DES IMPAYES:</strong>{" "}
            {formatNumberToFCFA(data.montantTotalImpayes)} FCFA
          </p>
          <p>
            <strong>ECHEANCE D'AVANCE NON REGLEE:</strong>{" "}
            {formatNumberToFCFA(data.echeanceAvanceNonReglee)} FCFA
          </p>
          <p>
            <strong>NOMBRE DE QUITTANCES ENCAISSEES:</strong>{" "}
            {data.nombreDeQuittancesEncaissees}
          </p>
          <p>
            <strong>MONTANT TOTAL DES QUITTANCES ENCAISSEES:</strong>{" "}
            {formatNumberToFCFA(data.montantTotalDesQuittancesEncaissees)} FCFA
          </p>
        </div>
      </div>

      <p className="text-sm italic mb-4">
        N.B.: les quittances régularisées d'un montant total de 0 FCFA sont des
        quittances impayées qui ont fait l'objet d'une régularisation par
        prélèvement des frais de gestion, de décès et des éventuelles échéances
        d'avance sur le capital acquis. Ces quittances ne sont donc pas dues.
      </p>

      <style jsx>{`
        @media print {
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .print-page {
            box-shadow: none;
            margin: 0;
            padding: 0;
            table {
              width: 100%;
              border-collapse: collapse;
            }
            th,
            td {
              border: 1px solid #ccc;
              padding: 8px;
              text-align: left;
            }
            thead {
              background-color: #f2f2f2;
            }
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
});

export default ContractPrintView;
