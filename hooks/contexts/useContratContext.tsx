import { Contrat, User } from "@/app/Types/type";
import React, { createContext, useContext, useState } from "react";
interface ContratContextType {
  contrat: Contrat[] | null;
  setContrat: React.Dispatch<React.SetStateAction<Contrat[] | null>>;
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
  const [contrat, setContrat] = useState<Contrat[] | null>(null);

  return (
    <ContratContext.Provider value={{ contrat, setContrat }}>
      {children}
    </ContratContext.Provider>
  );
};

export default ContratProvider;
