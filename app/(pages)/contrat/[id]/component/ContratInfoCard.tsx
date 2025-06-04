import { useContratContext } from "@/hooks/contexts/useContratContext";

const ContractInfoCard = () => {
  const { contrat } = useContratContext();

  return (
    <div className="bg-white rounded shadow-lg p-6 space-y-4">
      <h2 className="text-lg font-semibold text-gray-700">
        Information Police
      </h2>
      {contrat && (
        <div className="grid grid-cols-2 gap-4 text-sm">
          <Field label="Numéro de Police" value={contrat.NumeroContrat} />
          <Field label="Type de Police" value={contrat.TypePolice} />
          <Field label="Durée de la Police" value={contrat.DureePolice} />
          <Field label="Périodicité" value={contrat.PeriodicieCotisation} />
          <Field label="Date début Effet" value={contrat.DateDebutPolice} />
          <Field label="Date Fin Effet" value={contrat.DateFinPolice} />
          <Field
            label="Date signature contrat"
            value={contrat.DateSignatureConventionPolice}
          />
          <Field label="Libellé Produit" value={contrat.DESC_PRODUIT} />
        </div>
      )}
    </div>
  );
};

const Field = ({ label, value }: { label: string; value: string }) => (
  <div>
    <div className="text-gray-500">{label}</div>
    <div className="font-medium text-gray-900">{value}</div>
  </div>
);

export default ContractInfoCard;
