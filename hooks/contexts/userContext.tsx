interface UserContextType {
  user: User | null;
  setUser: (user: User) => void;
  percentProfile?: number | null;
  setPercentProfile?: (percent: number) => void;
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

  return (
    <UserContext.Provider
      value={{ user, setUser, percentProfile, setPercentProfile }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
