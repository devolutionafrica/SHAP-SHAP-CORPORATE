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
  // L'état initial doit être false pour que la modale ne s'affiche pas par défaut
  const [isVisible, setIsVisible] = useState(false);

  const showModal = useCallback(() => {
    setIsVisible(true);
  }, []);

  const hideModal = useCallback(() => {
    setIsVisible(false);
  }, []);

  React.useEffect(() => {
    showModalFunction = showModal;
    return () => {
      showModalFunction = null; // Nettoyer à la démonstration
    };
  }, [showModal]);

  return (
    <SessionModalContext.Provider
      value={{
        showSessionExpiredModal: showModal,
        hideSessionExpiredModal: hideModal,
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
