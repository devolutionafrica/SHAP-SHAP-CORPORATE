import { Contrat, Convention, User } from "@/app/Types/type";
import React, { createContext, useContext, useState } from "react";
import { useConvention } from "../useConvention";
interface ContratContextType {
  contrats: Contrat[] | null;
  contrat: Contrat | null;
  conventions: Convention[] | null;
  setConvention: any;
  setContrat: React.Dispatch<React.SetStateAction<Contrat | null>>;
  setContrats: React.Dispatch<React.SetStateAction<Contrat[] | null>>;
  handleLoadConvention: any;
}

const ContratContext = createContext<ContratContextType | undefined>(undefined);

export const useContratContext = () => {
  const context = useContext(ContratContext);

  if (!context) {
    throw new Error("useContratContext must be used within a UserProvider");
  }
  return context;
};

const ContratProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [contrats, setContrats] = useState<Contrat[] | null>(null);
  const [contrat, setContrat] = useState<Contrat | null>(null);
  const [conventions, setConvention] = useState<Convention[] | null>(null);

  const loaderConvention = useConvention();

  const handleLoadConvention = async () => {
    await loaderConvention
      .refetch()
      .then((result) => {
        if (result.data) {
          console.log(result.data);
          setConvention(result.data.data as Convention[]);
        }
      })
      .catch((error) => {
        console.error("Error loading convention:", error);
        alert("Erreur lors du chargement de la convention.");
      });
  };

  return (
    <ContratContext.Provider
      value={{
        contrats,
        setContrats,
        contrat,
        setContrat,
        setConvention,
        conventions,
        handleLoadConvention,
      }}
    >
      {children}
    </ContratContext.Provider>
  );
};

export default ContratProvider;
