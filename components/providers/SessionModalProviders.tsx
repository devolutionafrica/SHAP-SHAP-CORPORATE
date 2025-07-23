"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useEffect,
} from "react";
import SessionsExpireComponent from "@/components/SessionExpireComponent";

interface SessionModalContextType {
  showSessionExpiredModal: () => void;
  hideSessionExpiredModal: () => void;
}

const SessionModalContext = createContext<SessionModalContextType | undefined>(
  undefined
);

let showModalFunction: (() => void) | null = null;

export const triggerSessionExpiredModal = () => {
  if (showModalFunction) {
    showModalFunction();
  } else {
    console.warn(
      "SessionModalProvider n'est pas encore monté ou showModalFunction n'est pas initialisée."
    );
  }
};

interface SessionModalProviderProps {
  children: ReactNode;
}

export const SessionModalProvider: React.FC<SessionModalProviderProps> = ({
  children,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const showModal = useCallback(() => {
    setIsVisible(true);
  }, []);

  const hideModal = useCallback(() => {
    setIsVisible(false);
  }, []);

  useEffect(() => {
    showModalFunction = showModal;
    return () => {
      showModalFunction;
    };
  }, [isVisible]);

  return (
    <SessionModalContext.Provider
      value={{
        showSessionExpiredModal: showModal,
        hideSessionExpiredModal: hideModal,
      }}
    >
      {children}
      {isVisible && (
        <SessionsExpireComponent
          open={isVisible}
          onClose={() => setIsVisible(false)}
        />
      )}
    </SessionModalContext.Provider>
  );
};

export const useSessionModal = () => {
  const context = useContext(SessionModalContext);
  if (context === undefined) {
    throw new Error(
      "useSessionModal doit être utilisé à l'intérieur d'un SessionModalProvider"
    );
  }
  return context;
};
