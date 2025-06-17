"use client";
import { Contrat, Convention, User } from "@/app/Types/type";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useConvention } from "../useConvention";
import { useContrat } from "../useContrat";
import { useAuthContext } from "./authContext";
import { useUser } from "./userContext";
interface ContratContextType {
  contrats: Contrat[] | null;
  contrat: Contrat | null;
  conventions: Convention[] | null;
  setConvention: any;
  setContrat: React.Dispatch<React.SetStateAction<Contrat | null>>;
  setContrats: React.Dispatch<React.SetStateAction<Contrat[] | null>>;
  handleLoadConvention: any;
  handleLoadContrat: any;
  totalContratConvention: number;
  initializeData: any;
  souscripteur: User | null;
  setSouscripteur: React.Dispatch<React.SetStateAction<User | null>>;
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
  const [totalContratConvention, setTotalContratConvention] = useState(0);
  const loaderConvention = useConvention();
  const loadContrat = useContrat();
  const [souscripteur, setSouscripteur] = useState<User | null>(null);
  const { getTypeUser, labelType, setTypeUtilisateur, setUser } = useUser();
  const handleLoadConvention = async () => {
    await loaderConvention
      .refetch()
      .then((result) => {
        if (result.data) {
          console.log(result.data);
          setConvention(result.data.data as Convention[]);
          setTotalContratConvention(result.data.totalConvention);
        }
      })
      .catch((error) => {
        console.error("Error loading convention:", error);
        alert("Erreur lors du chargement de la convention.");
      });
  };

  const handleLoadContrat = async () => {
    await loadContrat
      .refetch()
      .then((result) => {
        if (result.data) {
          console.log("Contrat chargé", result.data);
          setContrats(result.data.data as Contrat[]);
        }
      })
      .catch((error) => {
        console.error("Error loading convention:", error);
        alert("Erreur lors du chargement de la convention.");
      });
  };

  const initializeData = () => {
    setContrats([]);
    setConvention([]);
    setTypeUtilisateur(0);
    setUser(null);
  };

  useEffect(() => {}, [contrats, contrat]);

  return (
    <ContratContext.Provider
      value={{
        souscripteur,
        setSouscripteur,
        initializeData,
        totalContratConvention,
        handleLoadContrat,
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
