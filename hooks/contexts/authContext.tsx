"use client";
export type AuthData = {
  username: string;
  name: string;
};

interface UserContextType {
  username: string | null;
  isAuth: boolean;
  getUsername: any;
  setIsAuth: React.Dispatch<React.SetStateAction<boolean>>;
  setUserName: React.Dispatch<React.SetStateAction<string | null>>;
}

import React, { createContext, useContext, useEffect, useState } from "react";
const AuthContext = createContext<UserContextType | undefined>(undefined);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [username, setUserName] = useState<string | null>(null);
  const [isAuth, setIsAuth] = useState<boolean>(false);

  useEffect(() => {
    console.log("Username from localStorage:", username);
  }, [isAuth, username]);

  const getUsername = () => {
    if (typeof window !== "undefined") {
      const storedUsername = localStorage.getItem("username");

      return storedUsername;
    }
    return null;
  };

  return (
    <AuthContext.Provider
      value={{ username, setUserName, isAuth, setIsAuth, getUsername }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
