import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

// Définition des types pour les props du composant
interface Tab {
  url: string;
  label: string;
  icon?: React.ReactNode; // Optionnel: pour ajouter des icônes à côté du label
}

interface PageTabsProps {
  tabs: Tab[];
  currentTab: string;
  setCurrentTab: (tabLabel: string) => void;
}

const PageTabs: React.FC<PageTabsProps> = ({
  tabs,
  currentTab,
  setCurrentTab,
}) => {
  const router = useRouter();
  const [indicatorWidth, setIndicatorWidth] = useState(0);
  const [indicatorLeft, setIndicatorLeft] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Effet pour positionner et dimensionner l'indicateur de sélection
  useEffect(() => {
    const activeTab = tabRefs.current.find(
      (ref) => ref && ref.dataset.label === currentTab
    );
    if (activeTab) {
      setIndicatorWidth(activeTab.offsetWidth);
      setIndicatorLeft(activeTab.offsetLeft);
    }
  }, [currentTab, tabs]); // Dépendances: currentTab et tabs (si les onglets changent dynamiquement)

  const handleChangeTab = (tabUrl: string, label: string) => {
    setCurrentTab(label);
    router.push(tabUrl);
  };

  return (
    <div className="relative w-full overflow-hidden bg-white shadow-lg rounded-xl p-2">
      <div className="flex flex-nowrap overflow-x-auto no-scrollbar scroll-smooth">
        {tabs.map((tab, index) => (
          <motion.button
            key={tab.label} // Utiliser le label comme clé si unique, sinon un ID unique
            // ref={(el) => (tabRefs.current[index] = el)}
            data-label={tab.label} // Utiliser un data-attribut pour retrouver l'onglet actif
            onClick={() => handleChangeTab(tab.url, tab.label)}
            // Animations au survol et au clic pour chaque onglet
            whileHover={{ scale: 1.05, color: "#1a2b5b" }}
            whileTap={{ scale: 0.95 }}
            className={`
              relative z-10 flex items-center justify-center
              py-3 px-6 mx-1 rounded-lg
              whitespace-nowrap text-sm font-medium
              transition-colors duration-300 ease-in-out
              ${
                currentTab === tab.label
                  ? "text-[#223268] " // La couleur du texte est gérée par l'indicateur
                  : "text-gray-600 hover:text-[#223268]"
              }
              focus:outline-none focus:ring-2 focus:ring-[#223268] focus:ring-opacity-50
            `}
            aria-selected={currentTab === tab.label} // Pour l'accessibilité
            role="tab"
          >
            {tab.icon && <span className="mr-2 text-lg">{tab.icon}</span>}
            {tab.label}
          </motion.button>
        ))}
        {/* Indicateur de sélection animé */}
        <motion.div
          className="absolute bottom-0 h-1 bg-gradient-to-r from-[#223268] to-[#3a5099] rounded-full"
          animate={{ width: indicatorWidth, x: indicatorLeft }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </div>
    </div>
  );
};

export default PageTabs;
