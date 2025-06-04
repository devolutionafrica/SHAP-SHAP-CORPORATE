import { Contrat, Convention, User } from "@/app/Types/type";
import React, { createContext, useContext, useState } from "react";
interface ContratContextType {
  contrats: Contrat[] | null;
  contrat: Contrat | null;
  coventions: Convention[] | null;
  setConvention: any;
  setContrat: React.Dispatch<React.SetStateAction<Contrat | null>>;
  setContrats: React.Dispatch<React.SetStateAction<Contrat[] | null>>;
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

  return (
    <ContratContext.Provider
      value={{ contrats, setContrats, contrat, setContrat }}
    >
      {children}
    </ContratContext.Provider>
  );
};

export default ContratProvider;
