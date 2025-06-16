import type { Metadata } from "next";

import HeaderComponent from "@/components/HeaderComponent";
import { headers, cookies } from "next/headers"; // <-- Import 'cookies' to read cookies on the server

export const metadata: Metadata = {
  title: "Shap Shap Corporate",
  description: "Created with v0",
  generator: "v0.dev",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="p-2 relative">
      {<HeaderComponent />}

      {/* Main Content */}
      <div className="md:p-4">{children}</div>
    </div>
  );
}
