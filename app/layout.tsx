import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import HeaderComponent from "@/components/HeaderComponent";
import { headers, cookies } from "next/headers"; // <-- Import 'cookies' to read cookies on the server
import { Poppins } from "next/font/google";
import { useOnlineStatus } from "@/hooks/useIsOnlineCheck";
import { toast } from "@/components/ui/use-toast";
export const metadata: Metadata = {
  title: "Shap Shap Corporate",
  description: "Created with v0",
  generator: "v0.dev",
};

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // Choisissez les graisses que vous souhaitez utiliser
  display: "swap", // Optimisation du chargement de la police
  variable: "--font-poppins", // Nom de la variable CSS pour la police
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const isOnline = useOnlineStatus();

  return (
    <html lang="en" className={`${poppins.variable}`}>
      <body>
        <Providers>
          <div className="bg-gradient-to-br from-slate-50">
            <div className="">{children}</div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
