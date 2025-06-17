"use client";
import React from "react";
import dayjs from "dayjs";

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
      {/* En-tête du document */}
      {/* Supprimez le bg-[#223268] du h1, car le div parent le gère déjà */}
      <div className="bg-[#223268] text-white p-4 mb-4 rounded-t-lg">
        <h1 className="text-2xl font-bold text-center p-4">
          QUITTANCES RÉGLÉES ET IMPAYÉES
        </h1>
      </div>
      <p className="text-sm text-right mb-6">
        Date Heure Edition: {printDate} {printTime}
      </p>

      {/* Informations sur le Preneur d'assurance */}
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

      {/* Informations sur le Souscripteur */}
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
      <div className="mb-6">
        <table className="w-full divide-y divide-gray-200 border border-gray-300">
          {/* En-tête du tableau */}
          {/* Les classes !bg-[#223268] sur thead et tr sont une bonne pratique Tailwind.
              La règle dans le style jsx est là pour garantir l'impression. */}
          <thead className="!bg-[#223268]">
            <tr className="font-[300] text-[10px] !bg-[#223268] text-white">
              <th className="px-2 py-2 text-left text-[0.6rem] text-white uppercase border-r print-col-quittance-no">
                NUMERO QUITTANCE
              </th>
              <th className="px-2 py-2 text-left text-[0.6rem] text-white uppercase tracking-wider border-r print-col-date">
                DATE QUITTANCE
              </th>
              <th className="px-2 py-2 text-left text-[0.6rem] text-white uppercase tracking-wider border-r print-col-date">
                DEBUT PERIODE
              </th>
              <th className="px-2 py-2 text-left text-[0.6rem] text-white uppercase tracking-wider border-r print-col-date">
                FIN PERIODE
              </th>
              <th className="px-2 py-2 text-left text-[0.6rem] text-white uppercase tracking-wider border-r print-col-amount">
                MONTANT EMIS
              </th>
              <th className="px-2 py-2 text-left text-[0.6rem] text-white uppercase tracking-wider border-r print-col-amount">
                PRIME PERIODIQUE
              </th>
              <th className="px-2 py-2 text-left text-[0.6rem] text-white uppercase tracking-wider border-r print-col-amount">
                ECHEANCE D'AVANCE
              </th>
              <th className="px-2 py-2 text-left text-[0.6rem] text-white uppercase tracking-wider border-r print-col-amount">
                FRAIS REJET
              </th>
              <th className="px-2 py-2 text-left text-[0.6rem] text-white uppercase tracking-wider border-r print-col-amount">
                MONTANT COTISE
              </th>
              <th className="px-2 py-2 text-left text-[0.6rem] text-white uppercase tracking-wider border-r print-col-amount">
                MONTANT REGULARISE
              </th>
              <th className="px-2 py-2 text-left text-[0.6rem] text-white uppercase tracking-wider print-col-status">
                ETAT DE LA QUITTANCE
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.quittances.length > 0 ? (
              data.quittances.map((quittance, index) => (
                <tr key={index}>
                  <td className="px-2 py-1 whitespace-nowrap text-xs text-gray-900 border-r">
                    {quittance.NUMERO_QUITTANCE}
                  </td>
                  <td className="px-2 py-1 whitespace-nowrap text-xs text-gray-900 border-r">
                    {quittance.DATE_QUITTANCE}
                  </td>
                  <td className="px-2 py-1 whitespace-nowrap text-xs text-gray-900 border-r">
                    {quittance.DEBUT_PERIODE}
                  </td>
                  <td className="px-2 py-1 whitespace-nowrap text-xs text-gray-900 border-r">
                    {quittance.FIN_PERIODE}
                  </td>
                  <td className="px-2 py-1 whitespace-nowrap text-xs text-gray-900 border-r text-right">
                    {quittance.MONTANT_EMIS}
                  </td>
                  <td className="px-2 py-1 whitespace-nowrap text-xs text-gray-900 border-r text-right">
                    {quittance.PRIME_PERIODIQUE}
                  </td>
                  <td className="px-2 py-1 whitespace-nowrap text-xs text-gray-900 border-r text-right">
                    {quittance.ECHEANCE_D_AVANCE}
                  </td>
                  <td className="px-2 py-1 whitespace-nowrap text-xs text-gray-900 border-r text-right">
                    {quittance.FRAIS_REJET}
                  </td>
                  <td className="px-2 py-1 whitespace-nowrap text-xs text-gray-900 border-r text-right">
                    {quittance.MONTANT_COTISE}
                  </td>
                  <td className="px-2 py-1 whitespace-nowrap text-xs text-gray-900 border-r text-right">
                    {quittance.MONTANT_REGULARISE}
                  </td>
                  <td className="px-2 py-1 text-xs text-gray-900 word-break-all">
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
            <strong>NOMBRE TOTAL EMISSION:</strong>{" "}
            <span className="text-[#223268]">{data.nombreTotalEmission}</span>
          </p>
          <p>
            <strong>MONTANT TOTAL EMIS:</strong>{" "}
            <span className="text-[#223268]">
              {formatNumberToFCFA(data.montantTotalEmis)} XOF
            </span>
          </p>
          <p>
            <strong>NOMBRE TOTAL ENCAISSEMENT:</strong>{" "}
            <span className="text-[#223268]">
              {data.nombreTotalEncaissement}
            </span>
          </p>
          <p>
            <strong>MONTANT TOTAL ENCAISSE:</strong>{" "}
            <span className="text-[#223268]">
              {formatNumberToFCFA(data.montantTotalEncaisse)} XOF
            </span>
          </p>
          <p>
            <strong>NOMBRE TOTAL DES IMPAYES:</strong>{" "}
            <span className="text-[#223268]">{data.nombreTotalImpayes}</span>
          </p>
          <p>
            <strong>MONTANT TOTAL DES IMPAYES:</strong>{" "}
            <span className="text-[#223268]">
              {formatNumberToFCFA(data.montantTotalImpayes)} XOF
            </span>
          </p>
          <p>
            <strong>ECHEANCE D'AVANCE NON REGLEE:</strong>{" "}
            <span className="text-[#223268]">
              {formatNumberToFCFA(data.echeanceAvanceNonReglee)} XOF
            </span>
          </p>
          <p>
            <strong>NOMBRE DE QUITTANCES ENCAISSEES:</strong>{" "}
            <span className="text-[#223268]">
              {data.nombreDeQuittancesEncaissees}
            </span>
          </p>
          <p>
            <strong>MONTANT TOTAL DES QUITTANCES ENCAISSEES:</strong>{" "}
            <span className="text-[#223268]">
              {formatNumberToFCFA(data.montantTotalDesQuittancesEncaissees)} XOF
            </span>
          </p>
        </div>
      </div>

      <p className="text-sm italic mb-4">
        N.B.: les quittances régularisées d'un montant total de 0 XOF sont des
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
          strong {
            color: #223268;
          }
          .print-page {
            box-shadow: none;
            margin: 0;
            padding: 0.1cm;
            font-family: Arial, sans-serif;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            table-layout: fixed;
          }
          th,
          td {
            border: 1px solid #ccc;
            padding: 4px 2px;
            text-align: left;
            font-size: 8pt;
          }

          thead {
            background-color: #223268 !important;
            text-align: start;
          }

          th {
            color: white !important;
          }
          .print-col-quittance-no {
            width: 10%;
          }
          .print-col-date {
            width: 8%;
          }
          .print-col-amount {
            width: 9%;
            text-align: right;
          }
          .print-col-status {
            width: 12%;
          }
          .no-print {
            display: none !important;
          }
          td:nth-child(1),
          td:nth-child(2),
          td:nth-child(3),
          td:nth-child(4) {
            width: 8%;
          }
          td:nth-child(11) {
            white-space: normal;
            width: 12%;
          }
        }
      `}</style>
    </div>
  );
});

export default ContractPrintView;
