import { useRouter } from "next/navigation";

const PageTabs = ({
  tabs,
  currentTab,
  setCurrentTab,
}: {
  tabs: { url: string; label: string }[]; // Ajout d'une typographie plus stricte pour 'tabs'
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}) => {
  const router = useRouter();

  const handleChangeTab = (tabUrl: string, label: string) => {
    router.push(`${tabUrl}`);
    setCurrentTab(label);
  };

  console.log("Current Tab:", currentTab);

  return (
    // Conteneur principal pour le défilement horizontal
    // `flex-nowrap` assure que les éléments restent sur une seule ligne
    // `overflow-x-auto` active le défilement horizontal si nécessaire
    // `px-4 sm:px-6 lg:px-8` pour un padding réactif du contenu des onglets
    // `-mx-4 sm:-mx-6 lg:-mx-8` sont des marges négatives pour que le défilement
    // puisse "déborder" le padding horizontal du conteneur parent, si ce composant
    // est placé directement dans un `div` avec un padding fixe.
    // Si votre composant parent n'a pas de padding, vous pouvez enlever les `-mx`
    // et juste utiliser `px-4` sur ce div.
    <div className="flex flex-nowrap overflow-x-auto border-b border-gray-200 no-scrollbar">
      <div className="flex space-x-4 pb-2 px-4 sm:px-6 lg:px-8">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => handleChangeTab(tab.url, tab.label)}
            className={`
              flex-shrink-0              
              py-2 px-4                   
              whitespace-nowrap           
              border-b-4                  
              text-sm                    
              ${
                currentTab === tab.label
                  ? "border-[#223268] text-[#223268] font-semibold"
                  : "border-transparent text-gray-600 "
              }
              hover:text-[#223268]       
              transition-colors duration-200 
              focus:outline-none focus:ring-2 
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PageTabs;
