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

  useEffect(() => {
    const activeTab = tabRefs.current.find(
      (ref) => ref && ref.dataset.label === currentTab
    );
    if (activeTab) {
      setIndicatorWidth(activeTab.offsetWidth);
      setIndicatorLeft(activeTab.offsetLeft);
    } else {
    }
  }, [currentTab, tabs]); // Dépendances: currentTab et tabs (si les onglets changent dynamiquement)

  const handleChangeTab = (tabUrl: string, label: string) => {
    setCurrentTab(label);
    router.push(tabUrl);
  };

  return (
    <div className="relative w-full overflow-hidden  rounded p-2">
      <div className="flex flex-nowrap overflow-x-auto no-scrollbar">
        {tabs.map((tab, index) => (
          <motion.button
            key={tab.label}
            data-label={tab.label}
            whileHover={{ scale: 1.05, color: "#1a2b5b" }}
            onClick={() => handleChangeTab(tab.url, tab.label)}
            whileTap={{ scale: 0.95 }}
            className={`
              relative z-10 flex items-center justify-center
              py-3 px-6 mx-1
               text-sm font-medium
              transition-colors duration-300 ease-in-out
              ${
                currentTab === tab.label
                  ? "text-[#223268] border-b-2 border-[#223268] "
                  : "text-gray-600 hover:text-[#223268]"
              }
              focus:outline-none focus:border-b-2 focus:ring-[#223268] focus:ring-opacity-50
            `}
            aria-selected={currentTab === tab.label}
            role="tab"
          >
            {tab.icon && <span className="mr-2 text-lg">{tab.icon}</span>}
            {tab.label}
          </motion.button>
        ))}

        <motion.div
          className="absolute bottom-0 h-1 bg-gradient-to-r from-[#223268] to-[#3a5099] "
          animate={{ width: indicatorWidth, x: indicatorLeft }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </div>
    </div>
  );
};

export default PageTabs;
