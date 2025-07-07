// components/providers/SessionModalProvider.tsx
"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import SessionsExpireComponent from "@/components/SessionExpireComponent"; // Assurez-vous que ce chemin est correct

// Définir le type du contexte
interface SessionModalContextType {
  showSessionExpiredModal: () => void;
  hideSessionExpiredModal: () => void;
  retry: boolean;
  setRetry: any;
}

// Créer le contexte
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

  const [retry, setRetry] = useState(false);

  React.useEffect(() => {
    showModalFunction = showModal;
    return () => {
      showModalFunction = null;
    };
  }, [isVisible]);

  return (
    <SessionModalContext.Provider
      value={{
        showSessionExpiredModal: showModal,
        hideSessionExpiredModal: hideModal,
        retry,
        setRetry,
      }}
    >
      {children}
      {isVisible && (
        <SessionsExpireComponent open={isVisible} onClose={hideModal} />
      )}
    </SessionModalContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte dans les composants React
export const useSessionModal = () => {
  const context = useContext(SessionModalContext);
  if (context === undefined) {
    throw new Error(
      "useSessionModal doit être utilisé à l'intérieur d'un SessionModalProvider"
    );
  }
  return context;
};
