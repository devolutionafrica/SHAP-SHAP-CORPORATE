import { useRouter } from "next/navigation";

const PageTabs = ({
  tabs,
  currentTab,
  setCurrentTab,
}: {
  tabs: any[];
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}) => {
  const router = useRouter();

  const handleChangeTab = (tab: string, label: string) => {
    router.push(`${tab}`);
    setCurrentTab(label);
  };

  console.log("Current Tab:", currentTab);

  return (
    <div className="flex space-x-4 border-b border-gray-200 overflow-auto">
      {tabs.map((tab, index) => (
        <button
          key={index}
          onClick={() => handleChangeTab(tab.url, tab.label)}
          className={`py-2 px-4 whitespace-nowrap border-b-2 ${
            currentTab === tab.label
              ? "border-primary text-primary font-semibold"
              : "border-transparent text-gray-600"
          } hover:text-primary transition`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default PageTabs;
