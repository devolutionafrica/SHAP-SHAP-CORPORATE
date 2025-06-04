interface UserContextType {
  user: User | null;
  typeUtilisateur: Number | undefined;
  setTypeUtilisateur: (number: Number) => void;
  setUser: (user: User) => void;
  percentProfile?: number | null;
  setPercentProfile?: (percent: number) => void;
  getTypeUser: any;
  labelType: any;
}

import { User } from "@/app/Types/type";
import React, { createContext, useContext, useState } from "react";
const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [percentProfile, setPercentProfile] = useState<number>(0);
  const [typeUtilisateur, setTypeUtilisateur] = useState<Number>();

  const getTypeUser = (): number | undefined => {
    if (typeUtilisateur === undefined) {
      return typeUtilisateur;
    }
    const typeUser = localStorage.getItem("type_user");
    return typeUser ? Number(typeUser) : undefined;
  };

  const labelType = () => {
    if (getTypeUser() == 1) {
      return "Mes Contrats";
    } else {
      if (getTypeUser() == 2) {
        return "Mes Convention";
      } else {
        return "Chargement ...";
      }
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        percentProfile,
        setPercentProfile,
        typeUtilisateur,
        setTypeUtilisateur,
        getTypeUser,
        labelType,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
