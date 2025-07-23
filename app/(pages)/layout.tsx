import HeaderComponent from "@/components/HeaderComponent";
import { headers, cookies } from "next/headers"; // <-- Import 'cookies' to read cookies on the server
import AnimatedFooter from "@/components/FooterContainer";
import { useOnlineStatus } from "@/hooks/useIsOnlineCheck";
import SessionsExpireComponent from "@/components/SessionExpireComponent";

// export const metadata: Metadata = {
//   title: "Shap Shap Corporate",
//   description: "Created with v0",
//   generator: "v0.dev",
// };

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const useOnLine = useOnlineStatus();

  return (
    <div>
      <div className="p-2 relative">
        {<HeaderComponent />}

        {/* Main Content */}
        <div className="md:p-4">{children}</div>
      </div>
      <AnimatedFooter />
    </div>
  );
}
