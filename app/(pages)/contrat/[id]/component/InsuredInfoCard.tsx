import { useUser } from "@/hooks/contexts/userContext";
import { Field } from "./Field";
import { User } from "@/app/Types/type";

export const InsuredInfoCard = ({ user }: { user: User }) => {
  //   const { user } = useUser();

  return (
    <div className="bg-white rounded shadow-lg p-6">
      <h2 className="text-lg font-semibold text-gray-700">Assuré</h2>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <Field label="Nom" value={user?.NOM_CLIENT ?? "N/A"} />
        <Field label="Prénoms" value={user?.PRENOMS_CLIENT ?? "N/A"} />
        <Field
          label="Date de Naissance"
          value={user?.DATE_NAISSANCE ?? "N/A"}
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
