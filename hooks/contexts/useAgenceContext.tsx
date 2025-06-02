import { Agence, Contrat, User } from "@/app/Types/type";
import React, { createContext, useContext, useState } from "react";
interface AgenceContextType {
  agences: Agence[] | null;
  setAgence: React.Dispatch<React.SetStateAction<Agence[] | null>>;
}

const AgenceContext = createContext<AgenceContextType | undefined>(undefined);

export const useAgenceContext = () => {
  const context = useContext(AgenceContext);

  if (!context) {
    throw new Error("useContratContext must be used within a UserProvider");
  }
  return context;
};

const AgenceProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [agences, setAgence] = useState<Agence[] | null>(null);

  return (
    <AgenceContext.Provider value={{ agences, setAgence }}>
      {children}
    </AgenceContext.Provider>
  );
};

export default AgenceProvider;
